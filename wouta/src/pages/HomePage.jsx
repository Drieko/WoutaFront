import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../api/Api"; // Supondo que getMe() seja a função que retorna os dados do usuário
import axios from "axios"; // Para fazer requisições HTTP
import { FaTimes } from "react-icons/fa"; // Importação correta do ícone de fechar
import "./HomePage.css";

// Função para gerar uma cor aleatória baseada no ID do usuário
const generateRandomColor = (id) => {
  const hash = id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `#${((hash * 123456) % 16777215).toString(16).padStart(6, '0')}`;
};

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [invitations, setInvitations] = useState([]); // Estado para armazenar os convites pendentes
  const [showNotifications, setShowNotifications] = useState(false); // Controle de exibição das notificações
  const navigate = useNavigate(); // Usando o hook para navegação

  // Função para buscar os dados do usuário
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

  // Função para buscar convites pendentes
  const fetchUserInvitations = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/convites/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Filtrar convites para o usuário específico
      const pendingInvitations = response.data.filter(
        (invitation) => invitation.recebido_por === userId && invitation.status === "pendente"
      );
      setInvitations(pendingInvitations); // Atualiza o estado com os convites pendentes
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  };

  // Carregar convites assim que os dados do usuário forem carregados
  useEffect(() => {
    if (user) {
      fetchUserInvitations(user.id); // Carrega os convites após o carregamento do usuário
    }
  }, [user]);

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar autenticado para realizar essa ação.");
    return;
  }

  // Aceitar convite
  const handleAcceptInvitation = async (invitationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado.");
      return;
    }

    const statusToUpdate = "aceito";  // Certifique-se de que "aceito" é um status válido

    const url = `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/convites/update/${invitationId}/`;

    try {
      const response = await axios.put(
        url,
        { status: statusToUpdate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Convite aceito com sucesso!");
      const updatedInvitation = response.data;
      setInvitations((prevInvitations) =>
        prevInvitations.filter((invitation) => invitation.id !== invitationId)
      );
    } catch (error) {
      console.error("Erro ao aceitar convite:", error);
      alert(`Erro ao aceitar convite: ${error.response?.data?.detail || error.message}`);
    }
  };

  // Negar convite
  const handleRejectInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/convites/${invitationId}/`,
        { status: "negado" }, // Atualiza o status do convite para negado
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Convite negado!");
      setInvitations(invitations.filter((invitation) => invitation.id !== invitationId));
    } catch (error) {
      console.error("Erro ao negar convite:", error);
      alert("Erro ao negar o convite.");
    }
  };

  if (loading) {
    return <div>Carregando...</div>; // Exibe um texto ou spinner enquanto carrega os dados
  }

  return (
    <div className="projects-container">
      {/* Botão "X" no canto superior esquerdo */}
      <button className="close-button" onClick={() => navigate("/Login")}>
        <FaTimes />
      </button>
      <div className="home-container">
        <div className="home-header">
          <h1>Bem-vindo ao Wouta!</h1>
          <p>Aqui você pode gerenciar seus projetos e tarefas de forma eficiente.</p>
        </div>
        {user && (
          <div className="user-info">
            {/* Imagem do usuário */}
            <div
              className="user-photo"
              style={{ backgroundColor: generateRandomColor(user.id) }}
            >
              {/* Exibir a inicial do nome do usuário */}
              <span className="user-initial">{user.username[0]}</span>
            </div>
            <div className="user-details">
              <p className="username">{user.username}</p>
              <p className="user-id">(ID: {user.id})</p>
            </div>
            {/* Botão de notificação */}
            <button
              className="notification-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
            </button>
          </div>
        )}
        {/* Exibição das notificações */}
        {showNotifications && (
          <div className="notifications">
            <h3>Convites Pendentes</h3>
            {invitations.length > 0 ? (
              <ul>
                {invitations.map((invitation) => (
                  <li key={invitation.id}>
                    <span>{`Convite para o projeto: ${invitation.projeto || 'Nome não disponível'}`}</span>
                    <div>
                      <button onClick={() => handleAcceptInvitation(invitation.id)}>
                        Aceitar
                      </button>
                      <button
                        className="reject"
                        onClick={() => handleRejectInvitation(invitation.id)}
                      >
                        Negar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Você não tem convites pendentes.</p>
            )}
          </div>
        )}
        <div className="home-actions">
          <Link to="/projetos" className="button">Projetos</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
