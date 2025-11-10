import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Block, Blockchain } from './blockchain.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const MONGODB_URI = 'mongodb://localhost:27017/asureDB';

const asureChain = new Blockchain();
console.log('Asure Blockchain initialized with Genesis Block.');



const artifactSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  barCode: { type: String, required: true, unique: true },
  batchNo: { type: String, required: true },
  blockchainHash: { type: String, required: true, unique: true }, 
  status: { type: String, default: 'Valid' }, 
  dateIssued: { type: Date, default: Date.now },
});

const Artifact = mongoose.model('Artifact', artifactSchema);


app.use(cors()); 
app.use(express.json()); 


mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    seedDatabase(); 
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

async function seedDatabase() {
  const mockArtifactsData = [
    {
      companyName: 'North South University',
      barCode: 'BC-100-2024-TUT',
      batchNo: 'S2024-TUT',
      status: 'Valid',
      dateIssued: new Date('2024-05-15'),
    },
    {
      companyName: 'Apollo Pharma',
      barCode: 'MED-77A-101',
      batchNo: 'P01X-23',
      status: 'Revoked',
      dateIssued: new Date('2023-11-01'),
    },
    {
      companyName: 'TechCorp Solutions',
      barCode: 'PROD-TCS-005',
      batchNo: 'Q3-2024',
      status: 'Valid',
      dateIssued: new Date('2024-09-01'),
    }
  ];

  try {
    const existingCount = await Artifact.countDocuments();
    if (existingCount === 0) {
      console.log('Seeding Database and Blockchain...');

      for (const data of mockArtifactsData) {
        const newBlock = new Block(Date.now(), data, asureChain.getLatestBlock().hash);
        
        asureChain.addBlock(newBlock);
        await Artifact.create({
            ...data,
            blockchainHash: newBlock.hash,
        });
      }
      console.log('Database seeded and 3 blocks added to AsureChain.');
    } else {
      console.log('Database already contains artifacts, skipping seed.');
    }
  } catch (error) {
    console.error('Database seeding failed:', error.message);
  }
}


app.post('/api/verify', async (req, res) => {
  const { companyName, barCode, batchNo } = req.body;

  const query = {};
  if (companyName) query.companyName = companyName;
  if (barCode) query.barCode = barCode;
  if (batchNo) query.batchNo = batchNo;

  if (Object.keys(query).length === 0) {
    return res.status(400).json({ success: false, message: 'No search criteria provided.' });
  }

  try {
    const artifact = await Artifact.findOne(query).exec();

    if (artifact) {
      let blockFound = false;

      for (const block of asureChain.chain) {
        if (block.hash === artifact.blockchainHash) {
            blockFound = true;
            break;
        }
      }

      if (!blockFound) {
         return res.json({
            success: false,
            message: 'Artifact metadata found, but the corresponding BLOCKCHAIN RECORD is missing or compromised. Counterfeit suspected.',
            artifact: artifact,
          });
      }


      if (artifact.status === 'Valid') {
        res.json({
          success: true,
          message: 'Artifact verification successful. The document is authentic and valid (Blockchain Verified).',
          artifact: artifact,
        });
      } else if (artifact.status === 'Revoked') {
        res.json({
          success: false,
          message: 'Artifact found and Blockchain verified, but status is REVOKED. This document is no longer valid.',
          artifact: artifact,
        });
      } else {
        res.json({
          success: true,
          message: `Artifact found, status: ${artifact.status}. Requires further check.`,
          artifact: artifact,
        });
      }
    } else {
      res.json({
        success: false,
        message: 'No matching artifact found in the system. Possible counterfeit.',
      });
    }
  } catch (error) {
    console.error('Database verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during verification.' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});