import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTimes, FaPlus } from 'react-icons/fa'; // Ícones

const ProjectDetailsPage = () => {
  const { projectId } = useParams(); // Pega o ID do projeto da URL
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]); // Estado para tarefas
  const [newTask, setNewTask] = useState({
    titulo: '',
    description: '',
    prazo: '',
    prioridade: 'media',
  });
  const [loading, setLoading] = useState(true);
  const [createTaskModal, setCreateTaskModal] = useState(false); // Controle do modal
  const navigate = useNavigate(); // Para navegação

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Você precisa estar autenticado para acessar os detalhes do projeto.");
          return;
        }
  
        const response = await axios.get(
          `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/projetos/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setProject(response.data); // Armazena os dados do projeto
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar detalhes do projeto:", error);
        alert("Erro ao buscar detalhes do projeto.");
        setLoading(false);
      }
    };
  
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Você precisa estar autenticado para acessar as tarefas.");
          return;
        }
  
        const response = await axios.get(
          `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/tarefas/?projeto=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Apenas tarefas do projeto corrente serão exibidas
        const filteredTasks = response.data.filter(task => task.projeto === projectId);
        setTasks(filteredTasks); // Armazena as tarefas filtradas
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        alert("Erro ao buscar tarefas.");
      }
    };
  
    fetchProjectDetails();
    fetchTasks();
  }, [projectId]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!project) {
    return <div>Projeto não encontrado.</div>;
  }

  const handleGoBack = () => {
    navigate("/projetos");
  };

  const handleCreateTask = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado para criar tarefas.");
      return;
    }

    try {
      const response = await axios.post(
        'https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/tarefas/',
        {
          projeto: projectId,
          titulo: newTask.titulo,
          description: newTask.description,
          prazo: newTask.prazo,
          prioridade: newTask.prioridade,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks([response.data, ...tasks]); // Adiciona a nova tarefa
      setNewTask({ titulo: '', description: '', prazo: '', prioridade: 'media' }); // Reseta o formulário
      alert("Tarefa criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("Erro ao criar tarefa.");
    }
  };

  return (
    <div className="project-details-container">
      {/* Botão de Voltar (X) */}
      <button className="close-button" onClick={handleGoBack}>
        <FaTimes />
      </button>

      {/* Botão para Criar Nova Tarefa */}
      <button className="create-task-button" onClick={() => setCreateTaskModal(true)}>
        <FaPlus />
      </button>

      {/* Detalhes do projeto */}
      <div className="project-details">
        <h1 className="project-title">{project.titulo}</h1>
        <p className="project-description">{project.description}</p>
        <p className="project-status"><strong>Status:</strong> {project.status}</p>
      </div>

      {/* Lista de tarefas */}
      <div className="tasks-list-container">
        {tasks.length === 0 ? (
          <p>Não há tarefas para este projeto.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.prioridade}`}>
              <h3>{task.titulo}</h3>
              <p>{task.description}</p>
              <p><strong>Prazo:</strong> {task.prazo}</p>
              <p><strong>Prioridade:</strong> {task.prioridade}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal para criar tarefa */}
      {createTaskModal && (
        <div className="create-task-modal">
          <h2>Criar Nova Tarefa</h2>
          <input
            type="text"
            placeholder="Título da tarefa"
            value={newTask.titulo}
            onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
          />
          <textarea
            placeholder="Descrição"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <input
            type="date"
            value={newTask.prazo}
            onChange={(e) => setNewTask({ ...newTask, prazo: e.target.value })}
          />
          <select
            value={newTask.prioridade}
            onChange={(e) => setNewTask({ ...newTask, prioridade: e.target.value })}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
          <button onClick={handleCreateTask}>Criar Tarefa</button>
          <button onClick={() => setCreateTaskModal(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
