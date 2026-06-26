import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const cardStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: '0.3s'
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '50px' }}>Bem-vindo ao Sistema de Gestão Hoteleira</h1>

      {/* Atalhos Rápidos */}
      <div className="row justify-content-center">
        <div className="col-md-3" onClick={() => navigate('/checkin')}>
          <div style={{ ...cardStyle, borderTop: '5px solid #27ae60' }}>
            <h3>➕ Check-in</h3>
            <p>Realizar nova entrada</p>
          </div>
        </div>
        <div className="col-md-3" onClick={() => navigate('/painel')}>
          <div style={{ ...cardStyle, borderTop: '5px solid #e67e22' }}>
            <h3>🛎️ Check-out</h3>
            <p>Encerrar estadias</p>
          </div>
        </div>
        <div className="col-md-3" onClick={() => navigate('/pedidos')}>
          <div style={{ ...cardStyle, borderTop: '5px solid #3498db' }}>
            <h3>🍽️ Serviço de Quarto</h3>
            <p>Gerenciar cardápio</p>
          </div>
        </div>
      </div>

      
      <div className="row justify-content-center mt-5">
        <div className="col-md-9" style={{ backgroundColor: '#2f4146', color: 'white', padding: '30px', borderRadius: '15px' }}>
          <h2>Status do Hotel</h2>
          <p>Selecione uma das opções acima para começar a gerenciar as operações do hotel.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;