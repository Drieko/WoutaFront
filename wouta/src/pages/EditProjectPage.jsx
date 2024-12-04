import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjectPage.css"; // Suponha que você já tenha esse estilo

const EditProjectPage = () => {
  const { projectId } = useParams(); // Pega o ID do projeto da URL
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPrazo, setProjectPrazo] = useState("");
  const [projectStatus, setProjectStatus] = useState("andamento");
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento
  const [error, setError] = useState("");

  // Quando o componente for montado, buscar os dados do projeto
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
      } catch (err) {
        setError("Erro ao buscar dados do projeto.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]); // A dependência aqui é o projectId, então a requisição será feita novamente se o ID mudar

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Verificação dos campos obrigatórios
    if (!projectName || !projectDescription || !projectStatus) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const updatedProject = {
      titulo: projectName,  // Certifique-se de que projectName não está vazio
      description: projectDescription,  // Certifique-se de que projectDescription não está vazio
      prazo: projectPrazo ? projectPrazo : null,  // Se não houver prazo, envia como null
      status: projectStatus,  // Certifique-se de que projectStatus seja um dos valores esperados
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/projetos/${projectId}/`,
        updatedProject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      alert("Projeto atualizado com sucesso!");
      navigate("/projetos"); // Redireciona de volta para a página de projetos
    } catch (err) {
      setError(`Erro ao atualizar o projeto: ${err.response?.data?.detail || err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Carregando...</p>; // Mensagem enquanto os dados estão sendo carregados
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
