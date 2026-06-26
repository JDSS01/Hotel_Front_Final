import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

function ListagemReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  
 
  const [busca, setBusca] = useState('');

  const buscarReservas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/reservas`);
      setReservas(response.data);
    } catch (error) {
      mensagemErro('Erro ao buscar a lista de reservas.');
    }
  };

  useEffect(() => {
    buscarReservas();
  }, []);

  const excluir = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar e excluir esta reserva?')) {
      try {
        await axios.delete(`${BASE_URL}/reservas/${id}`);
        mensagemSucesso('Reserva excluída com sucesso!');
        buscarReservas();
      } catch (error) {
        mensagemErro('Erro ao excluir a reserva.');
      }
    }
  };

  
  const reservasFiltradas = reservas.filter((reserva) => {
    const nomeHospede = reserva.hospede?.nome 
      ? reserva.hospede.nome.toLowerCase() 
      : (typeof reserva.hospede === 'string' ? reserva.hospede.toLowerCase() : '');
      
    const termo = busca.toLowerCase();
    return nomeHospede.includes(termo);
  });

  return (
    <div className='container'>
      <Card title='Lista de Reservas'>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
          <button className="btn btn-success" onClick={() => navigate('/cadastro-reservas')}>
            + Nova Reserva
          </button>

          <input
            type="text"
            placeholder=" Buscar pelo nome do hóspede..."
            className="form-control"
            style={{ width: '300px', borderRadius: '8px' }}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

    
        <table className="table-custom">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hóspede</th>
              <th>Quarto</th>
              <th>Data Entrada</th>
              <th>Data Saída</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma reserva encontrada para este hóspede.
                </td>
              </tr>
            ) : (
              reservasFiltradas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.id}</td>
                  <td style={{ fontWeight: 'bold' }}>{reserva.hospede?.nome || reserva.hospede || 'N/A'}</td>
                  <td>{reserva.quarto?.numero || reserva.quarto || 'N/A'}</td>
                  <td>{reserva.dataEntrada}</td>
                  <td>{reserva.dataSaida}</td>
                  <td>
                    {/* BOTÕES RESTAURADOS PARA O SEU PADRÃO */}
                    <button 
                      className="btn btn-primary" 
                      style={{ marginRight: '10px', backgroundColor: '#3498db', color: 'white', border: 'none' }}
                      onClick={() => navigate(`/cadastro-reservas/${reserva.id}`)}>
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none' }}
                      onClick={() => excluir(reserva.id)}>
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default ListagemReservas;