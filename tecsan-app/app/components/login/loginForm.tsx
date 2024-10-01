"use client";
import React, { useState } from "react";
import { setTokens } from "@/utils/auth";

interface LoginFormProps {
  onSuccess: (data: any) => void;
  onError: (message: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [capsLock, setCapsLock] = useState(false);

  const routeUrl = process.env.NEXT_PUBLIC_ROUTE_URL;

  const handleCapsLock = (e: any) => {
    setCapsLock(e.getModifierState("CapsLock"));
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleCapsLock);
    return () => {
      document.removeEventListener("keydown", handleCapsLock);
    };
  }, []);

  const handleLogin = async () => {
    if (!cpf || !senha) {
      setError("CPF e senha são obrigatórios!");
      return;
    }

    try {
      const response = await fetch(`${routeUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, senha }),
      });

      if (!response.ok) {
        setError("Credenciais inválidas!");
        onError("Credenciais inválidas!");
        return;
      }

      const data = await response.json();

      setTokens(
        data.accessToken,
        data.refreshToken,
        data.nome,
        data.cpf,
        data.email,
        data.id
      );

      onSuccess(data);
    } catch (error) {
      setError("Erro ao tentar autenticar!");
      onError("Erro ao tentar autenticar!");
    }
  };

  return (
    <>
      <h3 className="text-center text-1xl font-bold mb-2 text-red-600">
        <div className="mt-2">{process.env.NEXT_PUBLIC_AMBIENT}</div>
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="cpf"
          >
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Digite seu CPF"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          {capsLock && (
            <p className="text-red-500 text-sm mb-4">Caps Lock está ativado!</p>
          )}
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Entrar
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
