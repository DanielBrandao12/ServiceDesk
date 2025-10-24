// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Biblioteca mais comum para cookies
import { chamadaLogin } from "../../services/endpoints/login";



export const Login: React.FC = () => {
  const [nome_usuario, setNomeUsuario] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      if (!nome_usuario || !senha) {
        setError("Preencha todos os campos!");
        return;
      }
      const dadosLogin: any = {
        nome_usuario,
        senha
      }

      // Faz a requisição ao backend
      const response = await chamadaLogin.handleLogin(dadosLogin);
  
      const token: string = response.token;
 
      // Armazena o token em cookie
      Cookies.set("authToken", token, { expires: 1 });

      // Redireciona após login
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Credenciais inválidas");
      setSenha("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Entrar
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Digite seu usuário e senha para acessar
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Usuário</label>
            <input
              type="text"
              value={nome_usuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Seu usuário"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          {
            /*
                <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-primary" />
              Lembrar-me
            </label>
            <a href="#" className="text-primary hover:underline">
              Esqueci a senha
            </a>
          </div>
            
            */
          }
      

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
