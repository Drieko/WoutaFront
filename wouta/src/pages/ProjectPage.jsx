import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from 'react-icons/fa';  // Ícone dos três pontinhos
import axios from "axios";
import "./ProjectPage.css";
import { getProjetos } from "../api/Api"; // Função para buscar projetos

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // Função para buscar os projetos do backend
  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Você precisa estar autenticado para acessar os projetos.");
      return;
    }

    try {
      const response = await getProjetos();
      setProjects(response.data);  // Atualiza o estado com a lista de projetos
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      alert("Erro ao buscar projetos.");
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

  return (
    <div className="projects-container">
      <h1>Projetos Recentes</h1>

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum projeto encontrado.</p>
        </div>
      ) : (
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project.id} className="project-card" style={{ backgroundColor: project.color }}>
              <h3>{project.titulo}</h3>  {/* Título do projeto */}
              <p>{project.description}</p>  {/* Descrição */}
              <p>Status: {project.status}</p>  {/* Status */}
              
              {/* Menu de opções (três pontinhos) */}
              <div className="project-options">
                <FaEllipsisV className="options-icon" />
                <div className="options-dropdown">
                  <ul>
                    <li>Convidar membro</li>
                    <li>Editar Projeto</li>
                    <li>Apagar Projeto</li>
                  </ul>
                </div>
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
