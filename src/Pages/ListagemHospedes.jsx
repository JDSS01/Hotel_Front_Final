import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

function ListagemHospedes() {
  const navigate = useNavigate();
  const [hospedes, setHospedes] = useState([]);
  
  // 1. Estado para guardar o texto da busca
  const [busca, setBusca] = useState(''); 

  const buscarHospedes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hospedes`);
      setHospedes(response.data);
    } catch (error) {
      mensagemErro('Erro ao buscar a lista de hóspedes.');
    }
  };

  useEffect(() => {
    buscarHospedes();
  }, []);

  const excluirHospede = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este hóspede?')) {
      try {
        await axios.delete(`${BASE_URL}/hospedes/${id}`);
        mensagemSucesso('Hóspede excluído com sucesso!');
        buscarHospedes();
      } catch (error) {
        mensagemErro('Erro ao excluir. Este hóspede pode ter uma reserva ou pedido ativo no sistema.');
      }
    }
  };

  // 2. Lógica do Filtro: Analisa o Nome ou o CPF
  const hospedesFiltrados = hospedes.filter((hospede) => {
    const nome = hospede.nome ? hospede.nome.toLowerCase() : '';
    const cpf = hospede.cpf ? hospede.cpf : '';
    const termo = busca.toLowerCase();

    return nome.includes(termo) || cpf.includes(termo);
  });

  return (
    <div className='container'>
      <Card title='Lista de Hóspedes'>
        
        {/* 3. Nova barra com o Botão e o Campo de Busca alinhados */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button className="btn btn-success" onClick={() => navigate('/cadastro-hospedes')}>
            Cadastrar Hospede
          </button>

          <input
            type="text"
            placeholder=" Buscar por nome ou CPF..."
            className="form-control"
            style={{ width: '300px', borderRadius: '8px' }}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <table className="table-custom" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* 4. Usando a lista filtrada em vez da original */}
            {hospedesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum hóspede encontrado.
                </td>
              </tr>
            ) : (
              hospedesFiltrados.map((hospede) => (
                <tr key={hospede.id}>
                  <td>{hospede.nome}</td>
                  <td>{hospede.cpf}</td>
                  <td>{hospede.telefone}</td>
                  <td>{hospede.endereco}</td>
                  <td>
                    <button 
                      className="btn btn-primary" 
                      style={{ marginRight: '10px', backgroundColor: '#3498db' }}
                      onClick={() => navigate(`/cadastro-hospedes/${hospede.id}`)}>
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ backgroundColor: '#e74c3c' }}
                      onClick={() => excluirHospede(hospede.id)}>
                      Excluir
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

export default ListagemHospedes;