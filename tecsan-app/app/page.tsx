"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginLayout from "./components/login/loginLayout";
import LoginForm from "./components/login/loginForm";

const LoginPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLoginSuccess = (data: any) => {
    router.push("/pages/home");
  };

  const handleLoginError = (message: string) => {
    console.error(message);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <LoginLayout>
      <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
    </LoginLayout>
  );
};

export default LoginPage;
