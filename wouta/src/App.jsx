// src/App.js
// não tera nova versão 
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import EditProjectPage from "./pages/EditProjectPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import EditTaskPage from "./pages/EditTaskPage";
import Convites from "./Component/Convites";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/Projetos" element={<ProjectPage />} />
        <Route path="/Create" element={<CreateProjectPage />} />
        <Route path="/Edit/:projectId" element={<EditProjectPage />} />
        <Route path="/projeto/:projectId" element={<ProjectDetailPage />}  />
        <Route path="/tarefa/:taskId" element={<TaskDetailPage />} />
        <Route path="/tarefa/edit/:taskId" element={<EditTaskPage />} />
        <Route path="/convites" element={<Convites />} /> {/* Adicionado o componente Convites */}
      </Routes>
    </Router>
  );
};

export default App;
