import axios from "axios";

// Criação da instância do axios com a URL base
const axiosInstance = axios.create({
  baseURL: "https://sistemadegerenciamentodeprojetosback.onrender.com/",
});

// Interceptor para adicionar o token no cabeçalho das requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função para buscar projetos
export const getProjetos = async () => {
  try {
    const response = await axiosInstance.get("/restrito/projetos/");
    return response;
  } catch (error) {
    throw error;  // Lançar erro para ser tratado no frontend
  }
};

// Função para criar um novo projeto
export const createProjeto = async (newProject) => {
  try {
    const response = await axiosInstance.post("/restrito/projetos/", newProject);
    return response;
  } catch (error) {
    throw error;  // Lançar erro para ser tratado no frontend
  }
};

// Função para excluir um projeto
export const deleteProjeto = async (projectId) => {
  try {
    const response = await axiosInstance.delete(`/restrito/projetos/${projectId}/`);
    return response;
  } catch (error) {
    throw error;  // Lançar erro para ser tratado no frontend
  }
};

export const getMe = async () => {
    try {
      const response = await axiosInstance.get("auth/me/");
      return response;
    } catch (error) {
      throw error;  // Lançar erro para ser tratado no frontend
    }
  };