import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

function ListagemCardapio() {
  const navigate = useNavigate();
  
  // Dois estados diferentes: um para Itens e outro para Serviços
  const [itens, setItens] = useState([]);
  const [servicos, setServicos] = useState([]);

  const buscarDados = async () => {
    try {
      // Busca as duas listas ao mesmo tempo
      const resItens = await axios.get(`${BASE_URL}/itens`);
      setItens(resItens.data);
      
      const resServicos = await axios.get(`${BASE_URL}/servicos`);
      setServicos(resServicos.data);
    } catch (error) {
      mensagemErro('Erro ao buscar os dados do cardápio e serviços.');
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const excluirItem = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await axios.delete(`${BASE_URL}/itens/${id}`);
        mensagemSucesso('Item excluído com sucesso!');
        buscarDados();
      } catch (error) {
        mensagemErro('Erro ao excluir o item.');
      }
    }
  };

  const excluirServico = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await axios.delete(`${BASE_URL}/servicos/${id}`);
        mensagemSucesso('Serviço excluído com sucesso!');
        buscarDados();
      } catch (error) {
        mensagemErro('Erro ao excluir o serviço.');
      }
    }
  };

  // Estilo padronizado para os botões para não sumirem no seu tema
  const estiloBtnEditar = {
    backgroundColor: '#3498db', color: '#ffffff', border: 'none', marginRight: '10px', opacity: 1, fontWeight: 'bold'
  };
  const estiloBtnExcluir = {
    backgroundColor: '#e74c3c', color: '#ffffff', border: 'none', opacity: 1, fontWeight: 'bold'
  };

  return (
    <div className='container'>
      <Card title='Gerenciamento de Itens e Serviços'>
        
        {/* BARRA SUPERIOR APENAS COM O BOTÃO DE ADICIONAR */}
        <div style={{ marginBottom: '30px' }}>
          <button className="btn btn-success" onClick={() => navigate('/cadastro-cardapio')}>
            + Adicionar Novo
          </button>
        </div>

        {/* ========================================================== */}
        {/* TABELA 1: ITENS (FRIGOBAR / RESTAURANTE)                     */}
        {/* ========================================================== */}
        <h5 style={{ color: '#2c3e50', marginBottom: '15px', borderBottom: '2px solid #3498db', paddingBottom: '5px' }}>
          🍔 Itens (Frigobar/Restaurante)
        </h5>

        <table className="table-custom" style={{ marginBottom: '40px' }}>
          <thead>
            <tr>
              <th>Nome do Item</th>
              <th>Valor (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Nenhum item encontrado.</td>
              </tr>
            ) : (
              itens.map((item) => (
                <tr key={`item-${item.id}`}>
                  <td>{item.nome}</td>
                  <td style={{ color: '#27ae60', fontWeight: 'bold' }}>R$ {item.valor ? item.valor.toFixed(2) : '0.00'}</td>
                  <td>
                    <button className="btn btn-primary" style={estiloBtnEditar} onClick={() => navigate(`/cadastro-cardapio/item/${item.id}`)}>
                      Editar
                    </button>
                    <button className="btn btn-danger" style={estiloBtnExcluir} onClick={() => excluirItem(item.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      
        <h5 style={{ color: '#2c3e50', marginBottom: '15px', borderBottom: '2px solid #9b59b6', paddingBottom: '5px' }}>
          🛎️ Serviços do Hotel
        </h5>

        <table className="table-custom">
          <thead>
            <tr>
              <th>Descrição do Serviço</th>
              <th>Valor (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Nenhum serviço encontrado.</td>
              </tr>
            ) : (
              servicos.map((serv) => (
                <tr key={`serv-${serv.id}`}>
                  <td>{serv.nome || serv.descricao}</td>
                  <td style={{ color: '#27ae60', fontWeight: 'bold' }}>R$ {serv.valor ? serv.valor.toFixed(2) : '0.00'}</td>
                  <td>
                    <button className="btn btn-primary" style={estiloBtnEditar} onClick={() => navigate(`/cadastro-cardapio/servico/${serv.id}`)}>
                      Editar
                    </button>
                    <button className="btn btn-danger" style={estiloBtnExcluir} onClick={() => excluirServico(serv.id)}>
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

export default ListagemCardapio;