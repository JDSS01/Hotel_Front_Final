import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const fazerLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/usuarios/auth`, { login, senha });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('loginUsuario', login); 

      const resUsuarios = await axios.get(`${BASE_URL}/usuarios`);
      const usuarioLogado = resUsuarios.data.find(u => u.login.toLowerCase() === login.toLowerCase());

      if (usuarioLogado && usuarioLogado.admin === true) {
        localStorage.setItem('isAdmin', 'true');
      } else {
        localStorage.setItem('isAdmin', 'false');
      }

      mensagemSucesso('Login realizado com sucesso!');
      window.location.href = '/'; 
    } catch (error) {
      mensagemErro('Login ou senha incorretos.');
    }
  };

  return (
    <div style={{ backgroundColor: '#2f4146', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '40px', borderRadius: '15px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px', fontWeight: 'bold' }}>Hotel Login</h2>

        <form onSubmit={fazerLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label>Usuário</label>
            <input
              type="text"
              className="form-control"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label>Senha</label>
            <input
              type="password"
              className="form-control"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', fontWeight: 'bold', backgroundColor: '#1877f2' }}>
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;