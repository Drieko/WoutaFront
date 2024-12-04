import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjectPage.css";

const EditProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPrazo, setProjectPrazo] = useState("");
  const [projectStatus, setProjectStatus] = useState("andamento");
  const [projectUsers, setProjectUsers] = useState([]); // Para armazenar os usuários
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/projetos/${projectId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const project = response.data;
        setProjectName(project.titulo);
        setProjectDescription(project.description);
        setProjectPrazo(project.prazo);
        setProjectStatus(project.status);
        setProjectUsers(project.usuarios || []); // Captura os usuários associados
      } catch (err) {
        setError("Erro ao buscar dados do projeto.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!projectName || !projectDescription || !projectStatus) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Recupera o ID do usuário do localStorage

      if (!userId) {
        setError("Erro: ID do usuário não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      const updatedProject = {
        titulo: projectName,
        description: projectDescription,
        prazo: projectPrazo ? projectPrazo : null,
        status: projectStatus,
        usuarios: [...new Set([...projectUsers.map((user) => user.id), userId])], 
        // Garante que o usuário atual será incluído e evita duplicatas
      };

      await axios.put(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/projetos/${projectId}/`,
        updatedProject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Projeto atualizado com sucesso!");
      navigate("/projetos");
    } catch (err) {
      setError(`Erro ao atualizar o projeto: ${err.response?.data?.detail || err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="edit-project-container">
      <h1>Editar Projeto</h1>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSaveProject}>
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
        <input
          type="date"
          value={projectPrazo}
          onChange={(e) => setProjectPrazo(e.target.value)}
        />
        <select
          value={projectStatus}
          onChange={(e) => setProjectStatus(e.target.value)}
        >
          <option value="andamento">Em andamento</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Atualizando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
};

export default EditProjectPage;
