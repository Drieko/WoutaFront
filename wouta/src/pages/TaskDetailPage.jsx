import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import './TaskDetailPage.css';

const TaskDetailPage = () => {
  const { taskId, projectId } = useParams(); // Obtém taskId e projectId da URL
  const navigate = useNavigate(); // Hook para navegação
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Você precisa estar autenticado para acessar os detalhes da tarefa.');
          return;
        }

        const response = await axios.get(
          `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/tarefas/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTask(response.data); // Atualiza os detalhes da tarefa
      } catch (error) {
        console.error('Erro ao buscar detalhes da tarefa:', error);
        alert('Erro ao buscar detalhes da tarefa.');
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleEditTask = () => {
    // Redireciona para uma página de edição da tarefa
    navigate(`/Tarefa/edit/${taskId}`);
  };

  const handleDeleteTask = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar autenticado para excluir a tarefa.');
      return;
    }

    try {
      const response = await axios.delete(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/tarefas/${taskId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) { // Status 204 - No Content, significa sucesso na exclusão
        alert('Tarefa excluída com sucesso!');
        // Redireciona para a página do projeto após a exclusão
        navigate(`/projetos`);
      } else {
        alert('Erro ao excluir a tarefa. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);

      if (error.response) {
        alert(`Erro ao excluir a tarefa: ${error.response.data.message || 'Erro desconhecido'}`);
      } else if (error.request) {
        alert('Erro ao tentar excluir a tarefa. O servidor não respondeu.');
      } else {
        alert(`Erro ao excluir a tarefa: ${error.message}`);
      }
    }
  };

  if (!task) {
    return <div>Carregando detalhes da tarefa...</div>;
  }

  return (
    <div className="task-detail-container">
      <div className="task-detail-header">
        {/* Botão de voltar */}
        <button className="back-button" onClick={() => navigate(`/projetos/${projectId}`)}>
          <FaArrowLeft /> Voltar
        </button>

        {/* Título da Tarefa, Descrição e Prioridade */}
        <div className="task-detail-title">
          <h2>{task.titulo}</h2>
          <p><strong>Descrição:</strong> {task.description}</p>
          <p><strong>Prioridade:</strong> {task.prioridade}</p>
        </div>

        {/* Botões de Editar e Deletar */}
        <div className="task-action-buttons">
          <button className="edit-button" onClick={handleEditTask}>
            <FaEdit /> Editar
          </button>
          <button className="delete-button" onClick={handleDeleteTask}>
            <FaTrash /> Excluir
          </button>
        </div>
      </div>

      {/* Exibição do Prazo da Tarefa */}
      <div className="task-detail-body">
        <p><strong>Prazo:</strong> {task.prazo}</p>
      </div>
    </div>
  );
};

export default TaskDetailPage;
