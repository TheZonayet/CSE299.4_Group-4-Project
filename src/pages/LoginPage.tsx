import React from "react";
import LoginCard from "../components/LoginCard";
import medicineIcon from "../assets/medicine.png"; 
import educationIcon from "../assets/education.png";
import tutorialsIcon from "../assets/tutorials.png";
import personalIcon from "../assets/personal.png";

interface LoginPageProps {
  onLogin: () => void; // 👈 receive login handler from App.tsx
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {

  const options = [
    { title: "MEDICINE", subtitle: "COMPANY", icon: medicineIcon },
    { title: "EDUCATION", subtitle: "EDUCATIONAL INSTITUTE", icon: educationIcon },
    { title: "TUTORIALS", subtitle: "INSTITUTE", icon: tutorialsIcon },
    { title: "PERSONAL", subtitle: "PROFILE", icon: personalIcon },
  ];

  const handleSelect = (title: string) => {
    alert(`Selected: ${title}`);
    onLogin(); // 👈 trigger login when user selects an option
  };

  return <LoginCard options={options} onSelect={handleSelect} />;
};

export default LoginPage;
