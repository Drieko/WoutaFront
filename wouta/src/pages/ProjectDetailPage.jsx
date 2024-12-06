import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./ProjectDetailPage.css";
import { FaTimes, FaPlus } from 'react-icons/fa'; // Ícones

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [comentarios, setComentarios] = useState([]);  // Estado para comentários
  const [newComment, setNewComment] = useState("");  // Estado para novo comentário
  const [newTask, setNewTask] = useState({ // Definindo o estado para a nova tarefa
    titulo: '',
    description: '',
    prazo: '',
    prioridade: 'baixa',
  });
  const [createTaskModal, setCreateTaskModal] = useState(false); // Controle do modal de tarefa
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar os comentários do projeto
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar autenticado para acessar os comentários.");
        return;
      }

      const response = await axios.get(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/comentariosProjeto/${projectId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComentarios(response.data);  // Atualiza o estado dos comentários
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
      alert("Erro ao buscar comentários.");
    }
  };

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

        setProject(response.data);
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

        const filteredTasks = response.data.filter(task => task.projeto === projectId);
        setTasks(filteredTasks);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        alert("Erro ao buscar tarefas.");
      }
    };

    fetchProjectDetails();
    fetchTasks();
    fetchComments();  // Carrega os comentários
  }, [projectId]);

  const handleCreateComment = async () => {
    const token = localStorage.getItem("token");  // Pega o token armazenado no localStorage
  
    if (!token) {
      alert("Você precisa estar autenticado para comentar.");
      return;
    }
  
    try {
      const response = await axios.post(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/comentariosProjeto/${projectId}/`,
        {
          texto: newComment,
          projeto: projectId,  // Envia o ID do projeto
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Envia o token no cabeçalho
          },
        }
      );
  
      setComentarios([response.data, ...comentarios]);
      setNewComment(""); // Limpa o campo de comentário
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      alert("Erro ao criar comentário.");
    }
  };

  const handleCreateTask = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado para criar uma tarefa.");
      return;
    }

    try {
      const response = await axios.post(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/tarefas/`,
        {
          titulo: newTask.titulo,
          description: newTask.description,
          prazo: newTask.prazo,
          prioridade: newTask.prioridade,
          projeto: projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks([response.data, ...tasks]);  // Adiciona a nova tarefa à lista
      setCreateTaskModal(false);  // Fecha o modal
      setNewTask({ // Limpa o estado de nova tarefa
        titulo: '',
        description: '',
        prazo: '',
        prioridade: 'baixa',
      });
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("Erro ao criar tarefa.");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!project) {
    return <div>Projeto não encontrado.</div>;
  }

  return (
    <div className="project-details-container">
      
      {/* Seção de Botões */}
      <div className="button-section">
        <button className="close-button" onClick={() => navigate("/projetos")}>
          <FaTimes />
        </button>

        <button className="create-task-button" onClick={() => setCreateTaskModal(true)}>
          <FaPlus />
        </button>
      </div>

      {/* Seção de Detalhes do Projeto */}
      <div className="project-details">
        <h1 className="project-title">{project.titulo}</h1>
        <p className="project-description">{project.description}</p>
        <p className="project-status"><strong>Status:</strong> {project.status}</p>
      </div>

      {/* Seção de Tarefas */}
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

      {/* Modal de Criar Tarefa */}
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

      {/* Seção de Comentários */}
      <div className="comments-section">
        <h2>Comentários</h2>

        {/* Seção para adicionar comentário */}
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Deixe seu comentário..."
          />
          <button onClick={handleCreateComment}>Comentar</button>
        </div>

        {/* Lista de Comentários */}
        <div className="comments-list">
          {comentarios.length === 0 ? (
            <p>Não há comentários para este projeto.</p>
          ) : (
            comentarios.map((comment) => (
              <div key={comment.id} className="comment">
                <p><strong>{comment.autor}</strong> - {comment.data_criacao}</p>
                <p>{comment.texto}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
