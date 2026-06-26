import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

function ListagemFuncionarios() {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);

  const buscarFuncionarios = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/funcionarios`);
      setFuncionarios(response.data);
    } catch (error) {
      mensagemErro('Erro ao buscar a lista de funcionários.');
    }
  };

  useEffect(() => {
    buscarFuncionarios();
  }, []);

  const excluirFuncionario = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await axios.delete(`${BASE_URL}/funcionarios/${id}`);
        mensagemSucesso('Funcionário excluído com sucesso!');
        buscarFuncionarios(); 
      } catch (error) {
        mensagemErro('Erro ao excluir. O funcionário pode estar vinculado a outros registros.');
      }
    }
  };

  return (
    <div className='container'>
      <Card title='Lista de Funcionários'>
        
        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-success" onClick={() => navigate('/cadastro-funcionarios')}>
            Cadastrar Funcionário
          </button>
        </div>

        <table className="table-custom" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum funcionário cadastrado.
                </td>
              </tr>
            ) : (
              funcionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.nome}</td>
                  <td>{funcionario.cpf}</td>
                  <td>{funcionario.telefone}</td>
                  <td>{funcionario.cargo}</td>
                  <td>
                    <button 
                      className="btn btn-primary" 
                      style={{ marginRight: '10px', backgroundColor: '#3498db' }}
                      onClick={() => navigate(`/cadastro-funcionarios/${funcionario.id}`)}>
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ backgroundColor: '#e74c3c' }}
                      onClick={() => excluirFuncionario(funcionario.id)}>
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

export default ListagemFuncionarios;