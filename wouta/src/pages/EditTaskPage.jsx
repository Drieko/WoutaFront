import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditTaskPage = () => {
  const { taskId } = useParams();  // Obtém o taskId da URL
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        console.log("taskId:", taskId);  // Depuração: verifique o taskId

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Token não encontrado.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/tarefas/${taskId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const task = response.data;
          setTaskName(task.titulo);
          setTaskDescription(task.description);
          setTaskPriority(task.prioridade);
          setTaskDeadline(task.prazo);
        } else {
          setError("Erro ao buscar dados da tarefa.");
        }
      } catch (err) {
        console.error("Erro ao buscar tarefa:", err);
        setError("Erro ao buscar dados da tarefa.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [taskId]);

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!taskName || !taskDescription || !taskPriority) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    // Valida a data do prazo
    if (taskDeadline && isNaN(new Date(taskDeadline).getTime())) {
      setError("Data de prazo inválida.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const updatedTask = {
        titulo: taskName,
        description: taskDescription,
        prazo: taskDeadline ? taskDeadline : null,
        prioridade: taskPriority,
      };

      const response = await axios.put(
        `https://sistemadegerenciamentodeprojetosback.onrender.com/restrito/tarefa/edit/${taskId}/`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Tarefa atualizada com sucesso!");
        navigate(`/projetos`);
      } else {
        setError("Erro ao atualizar a tarefa.");
      }
    } catch (err) {
      // Exibe o erro detalhado no console para facilitar a depuração
      console.error("Erro ao salvar tarefa:", err.response?.data || err.message);
      setError(`Erro ao atualizar a tarefa: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="edit-task-container">
      <h1>Editar Tarefa</h1>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSaveTask}>
        <input
          type="text"
          placeholder="Nome da Tarefa"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição da Tarefa"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
        />
        <input
          type="date"
          value={taskDeadline}
          onChange={(e) => setTaskDeadline(e.target.value)}
        />
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option value="baixa">Baixa</option>
          <option value="média">Média</option>
          <option value="alta">Alta</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Atualizando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
};

export default EditTaskPage;
