import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';


import Home from './pages/Home';
import CadastroHospede from './pages/CadastroHospede';
import CadastroQuarto from './pages/CadastroQuarto';
import ListagemHospedes from './pages/ListagemHospedes';
import ListagemQuartos from './pages/ListagemQuartos';
import CadastroPedido from './pages/CadastroPedido';
import ListagemPedidos from './pages/ListagemPedidos';
import ConsumoPedido from './pages/ConsumoPedido';
import ListagemReservas from './pages/ListagemReservas';
import CadastroReserva from './pages/CadastroReserva';
import ListagemFuncionarios from './pages/ListagemFuncionarios';
import CadastroFuncionario from './pages/CadastroFuncionario';
import ListagemCardapio from './pages/ListagemCardapio';
import CadastroCardapio from './pages/CadastroCardapio';
import Login from './pages/Login';

function MenuSuperior() {
  const location = useLocation();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const loginUsuario = localStorage.getItem('loginUsuario');

  const deslogar = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('loginUsuario');
    window.location.href = '/login';
  };

  if (location.pathname === '/login') return null;

  return (
    <nav style={{ backgroundColor: '#2c3e50', padding: '15px', textAlign: 'center', marginBottom: '30px' }}>

      {}
      {loginUsuario && (
        <div style={{ color: '#bdc3c7', marginBottom: '15px', fontSize: '14px', borderBottom: '1px dashed #34495e', paddingBottom: '10px' }}>
          👤 Usuário conectado: <strong style={{ color: '#1abc9c', textTransform: 'uppercase' }}>{loginUsuario}</strong> — 
          Perfil: <strong style={{ color: isAdmin ? '#e74c3c' : '#3498db' }}>{isAdmin ? '{admin}' : '{recepcionista}'}</strong>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
        {isAdmin && (
          <>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Início</Link>
            <Link to="/listagem-hospedes" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>📋 Hóspedes</Link>
          </>
        )}

        <Link to="/listagem-quartos" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🛏️ Quartos</Link>
        <Link to="/reservas" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>📅 Reservas</Link>
        <Link to="/checkin" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>➕ Check-in</Link>
        <Link to="/painel" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🛎️ Check-out</Link>

        {isAdmin && (
          <>
            <Link to="/pedidos" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🍽️ Cardápio</Link>
            <Link to="/funcionarios" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>👷 Funcionários</Link>
          </>
        )}

        <button onClick={deslogar} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '15px' }}>
          Sair
        </button>
      </div>
    </nav>
  );
}

function App() {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return (
    <Router>
      <MenuSuperior />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={isAdmin ? <Home /> : <ListagemQuartos />} />
        <Route path="/home" element={isAdmin ? <Home /> : <ListagemQuartos />} />

        <Route path="/listagem-quartos" element={<ListagemQuartos />} />
        <Route path="/cadastro-quartos" element={<CadastroQuarto />} />
        <Route path="/cadastro-quartos/:idParam" element={<CadastroQuarto />} />

        <Route path="/reservas" element={<ListagemReservas />} />
        <Route path="/cadastro-reservas" element={<CadastroReserva />} />
        <Route path="/cadastro-reservas/:idParam" element={<CadastroReserva />} />

        <Route path="/checkin" element={<CadastroPedido />} />
        <Route path="/checkin/:idParam" element={<CadastroPedido />} />
        <Route path="/consumo/:idParam" element={<ConsumoPedido />} />

        <Route path="/painel" element={<ListagemPedidos />} />

        {isAdmin && (
          <>
            <Route path="/listagem-hospedes" element={<ListagemHospedes />} />
            <Route path="/cadastro-hospedes" element={<CadastroHospede />} />
            <Route path="/cadastro-hospedes/:idParam" element={<CadastroHospede />} />

            <Route path="/pedidos" element={<ListagemCardapio />} />
            <Route path="/cadastro-cardapio" element={<CadastroCardapio />} />
            <Route path="/cadastro-cardapio/:tipo/:idParam" element={<CadastroCardapio />} />

            <Route path="/funcionarios" element={<ListagemFuncionarios />} />
            <Route path="/cadastro-funcionarios" element={<CadastroFuncionario />} />
            <Route path="/cadastro-funcionarios/:idParam" element={<CadastroFuncionario />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;