import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

function ListagemQuartos() {
  const navigate = useNavigate();
  const [quartos, setQuartos] = useState([]);

  const buscarQuartos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/quartos`);
      setQuartos(response.data);
    } catch (error) {
      mensagemErro('Erro ao buscar a lista de quartos.');
    }
  };

  useEffect(() => {
    buscarQuartos();
  }, []);

  const excluir = async (id, numero) => {
    if (window.confirm(`Tem certeza que deseja excluir o quarto ${numero}?`)) {
      try {
        await axios.delete(`${BASE_URL}/quartos/${id}`);
        mensagemSucesso('Quarto excluído com sucesso!');
        buscarQuartos();
      } catch (error) {
        mensagemErro('Erro ao excluir o quarto.');
      }
    }
  }

  return (
    <div className='container'>
      <Card title='Lista de Quartos'>
        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-success" onClick={() => navigate('/cadastro-quartos')}>
            + Novo Quarto
          </button>
        </div>

        <table className="table-custom">
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Tipo</th>
              <th>Diária</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {quartos.map((quarto) => (
              <tr key={quarto.id}>
                <td>{quarto.id}</td>
                <td>{quarto.numero}</td>
                <td>{quarto.tipo}</td>
                <td>R$ {quarto.valorDiaria}</td>
                <td>
                  <button 
                    className="btn btn-primary" 
                    style={{ marginRight: '10px', backgroundColor: '#3498db' }}
                    onClick={() => navigate(`/cadastro-quartos/${quarto.id}`)}>
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => excluir(quarto.id, quarto.numero)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default ListagemQuartos;