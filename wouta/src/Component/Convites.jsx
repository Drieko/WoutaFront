import React, { useState, useEffect } from "react";
import axios from "axios";

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState(null);

  // Função para buscar os convites
  const fetchInvitations = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar autenticado.");
      return;
    }

    try {
      const response = await axios.get("https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/convites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvitations(response.data); // Armazena os convites no estado
    } catch (err) {
      setError("Erro ao buscar convites.");
      console.error("Erro ao buscar convites:", err);
    }
  };

  // Função para aceitar o convite
  const handleAcceptInvitation = async (invitationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado.");
      return;
    }

    const statusToUpdate = "aceito"; // Certifique-se de que este valor é válido no backend

    try {
      await axios.put(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/convites/update/${invitationId}/`,
        { status: statusToUpdate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Convite aceito com sucesso!");
      fetchInvitations(); // Recarrega os convites após a ação
    } catch (err) {
      console.error("Erro ao aceitar convite:", err);
      alert("Erro ao aceitar convite.");
    }
  };

  // Função para negar o convite
  const handleRejectInvitation = async (invitationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado.");
      return;
    }

    const statusToUpdate = "negado"; // Certifique-se de que este valor é válido no backend

    try {
      await axios.put(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/convites/update/${invitationId}/`,
        { status: statusToUpdate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Convite negado com sucesso!");
      fetchInvitations(); // Recarrega os convites após a ação
    } catch (err) {
      console.error("Erro ao negar convite:", err);
      alert("Erro ao negar convite.");
    }
  };

  // useEffect para carregar os convites quando o componente é montado
  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className="notifications">
      <h3>Convites Pendentes</h3>
      {error && <div className="error">{error}</div>}
      {invitations.length > 0 ? (
        <ul>
          {invitations.map((invitation) => (
            <li key={invitation.id}>
              <span>{`Convite para o projeto: ${invitation.projeto_nome || "Nome do Projeto"}`}</span>
              <div>
                <button onClick={() => handleAcceptInvitation(invitation.id)}>Aceitar</button>
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
        <p>Não há convites pendentes.</p>
      )}
    </div>
  );
};

export default Invitations;
