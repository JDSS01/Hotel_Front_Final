import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import Stack from '@mui/material/Stack';

function ConsumoPedido() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  
  const [pedido, setPedido] = useState(null);
  
  
  const [listaItens, setListaItens] = useState([]);
  const [listaServicos, setListaServicos] = useState([]);

 
  const [itemSelecionado, setItemSelecionado] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState('');

  useEffect(() => {
    buscarDados();
   
  }, [idParam]);

  const buscarDados = async () => {
    try {
      
      const resPedido = await axios.get(`${BASE_URL}/pedidos/${idParam}`);
      setPedido(resPedido.data);

     
      const resItens = await axios.get(`${BASE_URL}/itens`);
      const resServicos = await axios.get(`${BASE_URL}/servicos`);
      
      setListaItens(resItens.data);
      setListaServicos(resServicos.data);
    } catch (error) {
      mensagemErro("Erro ao carregar dados. Verifique se os Controllers de Item e Servico existem no backend.");
    }
  };

  const adicionarItem = async () => {
    if (!itemSelecionado) return mensagemErro("Selecione um item primeiro!");

    
    const payload = {
      ...pedido,
      itens: [...(pedido.itens || []), { id: Number(itemSelecionado) }]
    };

    try {
      await axios.put(`${BASE_URL}/pedidos/${idParam}`, payload);
      mensagemSucesso("Item adicionado à conta do quarto!");
      setItemSelecionado(''); 
      buscarDados(); 
    } catch (error) {
      mensagemErro("Erro ao adicionar item.");
    }
  };

  const adicionarServico = async () => {
    if (!servicoSelecionado) return mensagemErro("Selecione um serviço primeiro!");

    const payload = {
      ...pedido,
      servicos: [...(pedido.servicos || []), { id: Number(servicoSelecionado) }]
    };

    try {
      await axios.put(`${BASE_URL}/pedidos/${idParam}`, payload);
      mensagemSucesso("Serviço adicionado à conta do quarto!");
      setServicoSelecionado('');
      buscarDados();
    } catch (error) {
      mensagemErro("Erro ao adicionar serviço.");
    }
  };

  if (!pedido) return <div className="container" style={{ padding: '20px', textAlign: 'center' }}>Carregando dados da estadia...</div>;

  return (
    <div className='container'>
      <Card title={`Lançar Consumo - Quarto ${pedido.quarto?.numero} (${pedido.hospede?.nome})`}>
        
        <div className="row">
        
          <div className="col-md-6" style={{ borderRight: '1px solid #eee', paddingRight: '20px' }}>
            <h4 style={{ color: '#2980b9', marginBottom: '20px' }}>Adicionar à Conta</h4>
            
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <FormGroup label='Adicionar Item (Frigobar/Restaurante):' htmlFor='selectItem'>
                <Stack direction="row" spacing={1}>
                  <select 
                    className='form-control' 
                    id='selectItem' 
                    value={itemSelecionado} 
                    onChange={(e) => setItemSelecionado(e.target.value)}
                  >
                    <option value=''>-- Selecione o Item --</option>
                    {listaItens.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.nome} - R$ {item.valor?.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-success" onClick={adicionarItem}>+</button>
                </Stack>
              </FormGroup>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <FormGroup label='Adicionar Serviço (Lavanderia/Massagem):' htmlFor='selectServico'>
                <Stack direction="row" spacing={1}>
                  <select 
                    className='form-control' 
                    id='selectServico' 
                    value={servicoSelecionado} 
                    onChange={(e) => setServicoSelecionado(e.target.value)}
                  >
                    <option value=''>-- Selecione o Serviço --</option>
                    {listaServicos.map(serv => (
                      <option key={serv.id} value={serv.id}>
                        {serv.nome || serv.descricao} - R$ {serv.valor?.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-success" onClick={adicionarServico}>+</button>
                </Stack>
              </FormGroup>
            </div>
          </div>

          <div className="col-md-6" style={{ paddingLeft: '20px' }}>
            <h4 style={{ color: '#27ae60', borderBottom: '2px solid #27ae60', paddingBottom: '10px', marginBottom: '20px' }}>
              Extrato Atual do Quarto
            </h4>
            
            <div style={{ marginTop: '20px' }}>
              <h5 style={{ color: '#2c3e50', marginBottom: '15px' }}>📦 Itens Consumidos</h5>
              <table className="table-custom" style={{ width: '100%', marginBottom: '30px' }}>
                <thead>
                  <tr>
                    <th>Descrição do Item</th>
                    <th>Valor (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {(!pedido.itens || pedido.itens.length === 0) ? (
                    <tr>
                      <td colSpan="2" style={{ textAlign: 'center', padding: '15px', color: '#95a5a6' }}>
                        Nenhum item consumido ainda.
                      </td>
                    </tr>
                  ) : (
                    pedido.itens.map((item, index) => (
                      <tr key={`item-${index}`}>
                        <td>{item.nome}</td>
                        <td style={{ fontWeight: 'bold', color: '#27ae60' }}>
                          R$ {item.valor?.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h5 style={{ color: '#2c3e50', marginBottom: '15px' }}>🛎️ Serviços Utilizados</h5>
              <table className="table-custom" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Descrição do Serviço</th>
                    <th>Valor (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {(!pedido.servicos || pedido.servicos.length === 0) ? (
                    <tr>
                      <td colSpan="2" style={{ textAlign: 'center', padding: '15px', color: '#95a5a6' }}>
                        Nenhum serviço solicitado ainda.
                      </td>
                    </tr>
                  ) : (
                    pedido.servicos.map((serv, index) => (
                      <tr key={`serv-${index}`}>
                        <td>{serv.nome || serv.descricao}</td>
                        <td style={{ fontWeight: 'bold', color: '#27ae60' }}>
                          R$ {serv.valor?.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Stack spacing={1} padding={2} direction='row' justifyContent="center" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button 
            onClick={() => navigate('/painel')} 
            type='button' 
            className='btn' 
            style={{ 
              backgroundColor: '#7f8c8d', 
              color: '#ffffff',           
              fontWeight: 'bold',
              border: 'none',
              opacity: 1,
              padding: '10px 20px',
              borderRadius: '5px'
            }}>
            ⬅ Voltar para o Painel
          </button>
        </Stack>

      </Card>
    </div>
  );
}

export default ConsumoPedido;