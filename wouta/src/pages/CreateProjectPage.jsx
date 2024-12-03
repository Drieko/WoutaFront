import React, { useState } from "react";
import axios from "axios";
import { getMe } from "../api/Api"; // Importe a função getMe da sua API
import "./CreateProjectPage.css";

const CreateProjectPage = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPrazo, setProjectPrazo] = useState("");
  const [projectStatus] = useState("andamento");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Função para obter o ID do usuário autenticado
  const getUserIdFromAPI = async () => {
    try {
      const response = await getMe(); // Chama a função getMe que retorna os dados do usuário
      return response.data.id; // Supondo que o ID do usuário está na propriedade "id"
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      return null;
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Limpa qualquer erro anterior

    if (!projectName || !projectDescription) {
      setError("Nome e descrição são obrigatórios.");
      setLoading(false);
      return;
    }

    // Obtenha o ID do usuário autenticado
    const userId = await getUserIdFromAPI();
    if (!userId) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    // Criando o novo projeto com o ID do usuário autenticado
    const newProject = {
      titulo: projectName,
      description: projectDescription,
      usuarios: [userId],  // Adiciona o ID do usuário autenticado
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

      const response = await axios.post(
        "https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/projetos/",
        newProject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Após a criação, redireciona ou limpa os campos
      alert("Projeto criado com sucesso!");
      // Resetar os campos após sucesso
      setProjectName("");
      setProjectDescription("");
      setProjectPrazo("");
    } catch (err) {
      setError("Erro ao criar projeto. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        
        {/* Texto explicativo para o prazo */}
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
  );
};

export default CreateProjectPage;
