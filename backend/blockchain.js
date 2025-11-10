import { createHash } from 'crypto';


export class Block { 
  constructor(timestamp, data, previousHash = '') {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  // Generates unique hash for the block.
   
  calculateHash() {
    return createHash('sha256')
      // The hash will be created depending on the previous hash, the timestamp, and the data (the contents)
      .update(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce)
      .digest('hex');
  }

  
  mineBlock(difficulty) {
  
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        this.nonce++;
        this.hash = this.calculateHash();
    }
  }
}


export class Blockchain {
  constructor() {
    
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 1; 
  }

  createGenesisBlock() {
    return new Block(Date.now(), { university: "North South University", purpose: "Certificate Verification System" }, "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    
    newBlock.previousHash = this.getLatestBlock().hash;
    
    newBlock.mineBlock(this.difficulty); 
    
    
    this.chain.push(newBlock);
  }
}