import React, { useState } from "react";
import axios from "axios";
import { getMe } from "../api/Api"; // Importe a função getMe da sua API
import { Link, useNavigate } from "react-router-dom"; // Importando useNavigate do react-router-dom
import "./CreateProjectPage.css";

const CreateProjectPage = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPrazo, setProjectPrazo] = useState("");
  const [projectStatus] = useState("andamento");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // Hook para navegação

  const getUserIdFromAPI = async () => {
    try {
      const response = await getMe();
      return response.data.id;
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      return null;
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!projectName || !projectDescription) {
      setError("Nome e descrição são obrigatórios.");
      setLoading(false);
      return;
    }

    const userId = await getUserIdFromAPI();
    if (!userId) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    const newProject = {
      titulo: projectName,
      description: projectDescription,
      usuarios: [userId],
      prazo: projectPrazo,
      status: projectStatus,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar autenticado para criar um projeto.");
        setLoading(false);
        return;
      }

      await axios.post(
        "https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/projetos/",
        newProject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Projeto criado com sucesso!");
      setProjectName("");
      setProjectDescription("");
      setProjectPrazo("");

      // Redireciona para a página de projetos após a criação
      navigate("/projetos"); // Redirecionamento para a página de projetos

    } catch (err) {
      setError("Erro ao criar projeto. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão separado no canto superior esquerdo */}
      <Link to="/projetos" className="back-button">
        &lt; {/* Ícone de seta */}
      </Link>

      <div className="create-project-container">
        <h1>Criar Novo Projeto</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleCreateProject}>
          <input
            type="text"
            placeholder="Nome do Projeto"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição do Projeto"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            required
          />

          <label htmlFor="projectPrazo">Prazo de entrega</label>
          <input
            type="date"
            id="projectPrazo"
            value={projectPrazo}
            onChange={(e) => setProjectPrazo(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar Projeto"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProjectPage;
