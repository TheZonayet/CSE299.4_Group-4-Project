import React from "react";
import LoginCard from "./LoginCard";
import medicineIcon from "../../assets/medicine.png";
import educationIcon from "../../assets/education.png";
import tutorialsIcon from "../../assets/tutorials.png";
import personalIcon from "../../assets/personal.png";
interface LoginPageProps {
  onLogin: (user: any) => void; // 👈 receive login handler from App.tsx
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
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

  if (showAuthForm && selected) {
    const AuthForm = React.lazy(() => import("./AuthForm"));
    return (
      <React.Suspense fallback={<div className="p-4">Loading...</div>}>
        <AuthForm
          role={selected}
          onSuccess={onLogin}
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
