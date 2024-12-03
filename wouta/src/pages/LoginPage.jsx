import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
import logo from "../image/WoutaLogo.png"; 

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Mensagem de erro
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Limpar qualquer erro anterior

    const data = { username, password };

    try {
      const response = await axios.post(
        "https://sistemadegerenciamentodeprojetosback.onrender.com/auth/login/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Sucesso: Armazenar o token JWT no localStorage e redirecionar
      localStorage.setItem("token", response.data.access);
      navigate("/home");
    } catch (err) {
      if (err.response) {
        if (err.response.data.detail === "No active account found with the given credentials") {
          setError("Nenhuma conta ativa encontrada com as credenciais fornecidas.");
        } else {
        // Erro da resposta do servidor
        setError(err.response.data.detail || "Erro ao fazer login.");
        }
      } else {
        // Erro na conexão ou outra falha
        setError("Erro ao conectar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {}
      <div className="logo-container">
        <img
          src={logo}  
          alt="Wouta"
          className="logo"
        />
        <h1 className="project-name">Wouta</h1>
      </div>

      <form onSubmit={handleLogin}>
        <input
          type="username"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Carregando..." : "Entrar"}
        </button>
      </form>

      <div className="register-link">
        <p>
          Ainda não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
