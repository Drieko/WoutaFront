import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; 

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Bem-vindo ao Wouta!</h1>
        <p>Aqui você pode gerenciar seus projetos e tarefas de forma eficiente.</p>
      </div>
      <div className="home-actions">
        <Link to="/projetos" className="button">Projetos</Link>
      </div>
    </div>
  );
};

export default HomePage;