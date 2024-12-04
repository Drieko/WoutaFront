import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa"; // Ícone dos três pontinhos
import { FaTimes } from "react-icons/fa"; // Ícone do "X"
import axios from "axios";
import "./ProjectPage.css";
import { getProjetos } from "../api/Api"; // Função para buscar projetos

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para armazenar a pesquisa
  const [activeDropdown, setActiveDropdown] = useState(null); // Controle do dropdown ativo
  const [userIdToInvite, setUserIdToInvite] = useState(""); // Estado para armazenar o ID do usuário a ser convidado
  const navigate = useNavigate();

  // Função para buscar os projetos do backend
  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado para acessar os projetos.");
      return;
    }

    try {
      const response = await getProjetos();
      setProjects(response.data); // Atualiza o estado com a lista de projetos
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      alert("Erro ao buscar projetos.");
    }
  };

  // Função para convidar um usuário para o projeto
  const handleInviteMember = async (projectId) => {
    const userId = prompt("Digite o ID do usuário que você deseja convidar:");

    if (!userId) {
      alert("ID do usuário é necessário!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado para convidar membros.");
      return;
    }

    try {
      const response = await axios.post(
        "https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/convites/",
        {
          projeto: projectId,
          recebido_por: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`Convite enviado com sucesso para o usuário ${userId}`);
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      alert("Erro ao enviar convite.");
    }
  };

  // UseEffect para buscar os projetos ao carregar a página
  useEffect(() => {
    fetchProjects();
  }, []);

  // Função para navegar até a página de criação de projeto
  const handleCreateProject = () => {
    navigate("/create");
  };

  // Função para redirecionar para /home
  const handleGoHome = () => {
    navigate("/home");
  };

  // Função para apagar um projeto
  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja apagar este projeto?");
    if (!confirmDelete) {
      return; // Se o usuário cancelar, a função para por aqui
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/projetos/${projectId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Projeto apagado com sucesso!");
      setProjects(projects.filter((project) => project.id !== projectId)); // Atualiza a lista local
    } catch (error) {
      console.error("Erro ao apagar projeto:", error);
      alert("Erro ao apagar projeto.");
    }
  };

  // Função para editar um projeto
  const handleEditProject = (projectId) => {
    navigate(`/edit/${projectId}`); // Redireciona para a página de edição
  };

  // Fechar o dropdown ao sair com o mouse
  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  // Filtrar projetos com base no texto da pesquisa
  const filteredProjects = projects.filter((project) =>
    project.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função para abrir o dropdown
  const handleOpenDropdown = (projectId) => {
    setActiveDropdown(activeDropdown === projectId ? null : projectId);
  };

  return (
    <div className="projects-container">
      {/* Botão "X" no canto superior esquerdo */}
      <button className="close-button" onClick={handleGoHome}>
        <FaTimes />
      </button>

      <h1>Projetos Recentes</h1>

      {/* Barra de pesquisa */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Pesquisar por nome de projeto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Atualiza o estado com o valor digitado
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum projeto encontrado.</p>
        </div>
      ) : (
        <div className="projects-list">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card" style={{ backgroundColor: project.color }}>
              <h3>{project.titulo}</h3> {/* Título do projeto */}
              <p>{project.description}</p> {/* Descrição */}
              <p>Status: {project.status}</p> {/* Status */}

              {/* Menu de opções (três pontinhos) */}
              <div
                className="project-options"
                onMouseLeave={handleMouseLeave} // Fecha ao sair com o mouse
              >
                <FaEllipsisV
                  className="options-icon"
                  onClick={() => handleOpenDropdown(project.id)} // Alterna entre abrir/fechar o dropdown
                />
                {activeDropdown === project.id && (
                  <div className="options-dropdown">
                    <ul>
                      {/* Exibe a opção para convidar membros */}
                      <li onClick={() => handleInviteMember(project.id)}>Convidar Membros</li>
                      <li onClick={() => handleEditProject(project.id)}>Editar Projeto</li>
                      <li onClick={() => handleDeleteProject(project.id)}>Apagar Projeto</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão para criar um novo projeto */}
      <button className="create-project-button" onClick={handleCreateProject}>
        Criar Novo Projeto
      </button>
    </div>
  );
};

export default ProjectPage;
