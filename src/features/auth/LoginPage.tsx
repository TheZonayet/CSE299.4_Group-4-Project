import React from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "./LoginCard";
import medicineIcon from "../../assets/medicine button.png";
import educationIcon from "../../assets/education button.png";
import tutorialsIcon from "../../assets/tutorials button.png";
import personalIcon from "../../assets/personal button.png";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [showAuthForm, setShowAuthForm] = React.useState(false);

  const options = [
    { title: "MEDICINE", subtitle: "COMPANY", icon: medicineIcon },
    {
      title: "EDUCATION",
      subtitle: "EDUCATIONAL INSTITUTE",
      icon: educationIcon,
    },
    { title: "TUTORIALS", subtitle: "INSTITUTE", icon: tutorialsIcon },
    { title: "PERSONAL", subtitle: "PROFILE", icon: personalIcon },
  ];

  const handleSelect = (title: string) => {
    setSelected(title);
    setShowAuthForm(true);
  };

  const handleSuccess = () => {
    navigate("/home");
  };

  if (showAuthForm && selected) {
    const AuthForm = React.lazy(() => import("./AuthForm"));
    return (
      <React.Suspense fallback={<div className="p-4">Loading...</div>}>
        <AuthForm
          role={selected}
          onSuccess={handleSuccess}
          onBack={() => {
            setShowAuthForm(false);
            setSelected(null);
          }}
        />
      </React.Suspense>
    );
  }

  return <LoginCard options={options} onSelect={handleSelect} />;
};

export default LoginPage;
