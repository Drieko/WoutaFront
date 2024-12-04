import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe } from "../api/Api"; // Supondo que getMe() seja a função que retorna os dados do usuário
import "./HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe(); // Usa a função getMe para buscar os dados do usuário
        setUser(userData.data); // Atualiza o estado com os dados do usuário
        setLoading(false); // Finaliza o carregamento
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>; // Exibe um texto ou spinner enquanto carrega os dados
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Bem-vindo ao Wouta!</h1>
        <p>Aqui você pode gerenciar seus projetos e tarefas de forma eficiente.</p>
      </div>
      {user && (
        <div className="user-info">
          {/* Imagem do usuário */}
          <div className="user-photo"></div>
          <div className="user-details">
            <p className="username">{user.username}</p>
            <p className="user-id">(ID: {user.id})</p>
          </div>
        </div>
      )}
      <div className="home-actions">
        <Link to="/projetos" className="button">Projetos</Link>
      </div>
    </div>
  );
};

export default HomePage;
