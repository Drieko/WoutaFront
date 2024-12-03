import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../image/WoutaLogo.png";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Mensagem de erro
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Limpar qualquer erro anterior

    const data = { username, email, password };

    try {
      const response = await axios.post(
        "https://sistemadegerenciamentodeprojetosback.onrender.com/auth/novo/", // Atualize para sua rota de registro
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Sucesso: Redirecionar diretamente para a página home após o cadastro
      navigate("/home"); // Redireciona para a página de Home

    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Erro ao realizar o cadastro.");
      } else {
        setError("Erro ao conectar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={logo} alt="Wouta" className="logo" />
        <h1 className="project-name">Wouta</h1>
      </div>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {loading ? "Carregando..." : "Cadastrar"}
        </button>
      </form>

      <div className="register-link">
        <p>
          Já tem uma conta? <Link to="/login">Faça login aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
