import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import Stack from '@mui/material/Stack';

function ListagemPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoEmCheckout, setPedidoEmCheckout] = useState(null);
  
  // 1. NOVO ESTADO PARA A BUSCA
  const [busca, setBusca] = useState('');

  const buscarPedidos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/pedidos`);
      setPedidos(response.data);
    } catch (error) {
      mensagemErro('Erro ao buscar os dados para o Check-out.');
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, []);

 
  
  const calcularDias = (dataEntradaStr) => {
    if (!dataEntradaStr) return 1;
    const entrada = new Date(dataEntradaStr);
    const saida = new Date(); 
    
    const diferencaTempo = Math.abs(saida - entrada);
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
    
    return diferencaDias > 0 ? diferencaDias : 1; 
  };


  const calcularTotalItens = (itens) => {
    if (!itens || itens.length === 0) return 0;
    return itens.reduce((acc, item) => acc + (item.valor || 0), 0);
  };

 
  const calcularTotalServicos = (servicos) => {
    if (!servicos || servicos.length === 0) return 0;
    return servicos.reduce((acc, servico) => acc + (servico.valor || 0), 0);
  };

  
  const calcularValorFinal = (pedido) => {
    const dias = calcularDias(pedido.dataHora);
    const valorDasDiarias = dias * (pedido.quarto?.valorDiaria || 0);
    
    const consumoItens = calcularTotalItens(pedido.itens);
    const consumoServicos = calcularTotalServicos(pedido.servicos);

    return valorDasDiarias + consumoItens + consumoServicos;
  };

  const formatarDataBR = (dataStr) => {
    if (!dataStr) return '';
    const data = new Date(dataStr);
    return data.toLocaleString('pt-BR');
  };

  

  const iniciarCheckout = (pedido) => {
    setPedidoEmCheckout(pedido); 
  };

  const cancelarCheckout = () => {
    setPedidoEmCheckout(null); 
  };

  const confirmarEFinalizarCheckout = async () => {
    try {
      await axios.delete(`${BASE_URL}/pedidos/${pedidoEmCheckout.id}`);
      mensagemSucesso('Pagamento recebido! Check-out concluído e quarto liberado.');
      setPedidoEmCheckout(null);
      buscarPedidos(); 
    } catch (error) {
      mensagemErro('Erro ao finalizar o check-out no banco de dados.');
    }
  };

  // 2. LÓGICA DO FILTRO (Busca pelo número do quarto)
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const numeroQuarto = pedido.quarto?.numero 
      ? String(pedido.quarto.numero) 
      : String(pedido.quarto || '');
      
    return numeroQuarto.includes(busca);
  });

  return (
    <div className='container'>
      <Card title='Painel de Recepção (Pedidos Ativos)'>
        
        {pedidoEmCheckout ? (
          <div className="resumo-checkout" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
              🧾 Extrato da Estadia (Pedido #{pedidoEmCheckout.id})
            </h3>
            
            <div className="row" style={{ marginTop: '20px' }}>
              <div className="col-md-6">
                <h4>👤 Dados do Hóspede</h4>
                <p><strong>Nome:</strong> {pedidoEmCheckout.hospede?.nome}</p>
                <p><strong>CPF:</strong> {pedidoEmCheckout.hospede?.cpf}</p>
              </div>
              
              <div className="col-md-6">
                <h4>🛌 Dados da Estadia</h4>
                <p><strong>Quarto:</strong> {pedidoEmCheckout.quarto?.numero} ({pedidoEmCheckout.quarto?.tipo})</p>
                <p><strong>Entrada:</strong> {formatarDataBR(pedidoEmCheckout.dataHora)}</p>
                <p><strong>Saída:</strong> {formatarDataBR(new Date())}</p>
              </div>
            </div>

      
            <div className="row" style={{ marginTop: '10px' }}>
              <div className="col-md-12">
                <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', border: '1px solid #ccc' }}>
                  <h4> Consumo e Serviços Extras</h4>
                  
                  {(!pedidoEmCheckout.itens || pedidoEmCheckout.itens.length === 0) && 
                   (!pedidoEmCheckout.servicos || pedidoEmCheckout.servicos.length === 0) ? (
                    <p style={{ color: '#7f8c8d' }}>Nenhum consumo extra registrado.</p>
                  ) : (
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                      {/* Lista de Itens */}
                      {pedidoEmCheckout.itens?.map((item, index) => (
                        <li key={`item-${index}`} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', padding: '5px 0' }}>
                          <span> {item.nome}</span>
                          <span>R$ {item.valor?.toFixed(2)}</span>
                        </li>
                      ))}
                      
                      {/* Lista de Serviços */}
                      {pedidoEmCheckout.servicos?.map((serv, index) => (
                        <li key={`serv-${index}`} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', padding: '5px 0' }}>
                          <span> {serv.nome || serv.descricao}</span>
                          <span>R$ {serv.valor?.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* FECHAMENTO DE CONTA */}
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f6f3', borderRadius: '8px', borderLeft: '5px solid #1abc9c' }}>
              <h4> Fechamento da Conta</h4>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Diárias ({calcularDias(pedidoEmCheckout.dataHora)}x R$ {pedidoEmCheckout.quarto?.valorDiaria?.toFixed(2)}):</span>
                <span>R$ {(calcularDias(pedidoEmCheckout.dataHora) * (pedidoEmCheckout.quarto?.valorDiaria || 0)).toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Subtotal Itens:</span>
                <span>R$ {calcularTotalItens(pedidoEmCheckout.itens).toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #bdc3c7', paddingBottom: '10px', marginBottom: '10px' }}>
                <span>Subtotal Serviços:</span>
                <span>R$ {calcularTotalServicos(pedidoEmCheckout.servicos).toFixed(2)}</span>
              </div>

              <h3 style={{ color: '#c0392b', textAlign: 'right', margin: 0 }}>
                Total a Pagar: R$ {calcularValorFinal(pedidoEmCheckout).toFixed(2)}
              </h3>
            </div>

            <Stack spacing={2} direction='row' style={{ marginTop: '30px' }}>
              <button className="btn btn-success" onClick={confirmarEFinalizarCheckout}>
                 Confirmar Pagamento e Liberar Quarto
              </button>
              <button className="btn btn-secondary" onClick={cancelarCheckout}>
                ❌ Cancelar e Voltar
              </button>
            </Stack>
          </div>
        ) : (
          <>
        
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <button className="btn btn-success" onClick={() => navigate('/checkin')}>
                + Novo Check-in
              </button>

              <input
                type="text"
                placeholder=" Buscar pelo número do quarto..."
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
                  <th>Data/Hora Entrada</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
               
                {pedidosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      Nenhum quarto ocupado encontrado.
                    </td>
                  </tr>
                ) : (
                  pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>{pedido.id}</td>
                      <td>{pedido.hospede?.nome || 'Hóspede não encontrado'}</td>
                      <td>{pedido.quarto?.numero || 'Quarto não encontrado'}</td>
                      <td>{formatarDataBR(pedido.dataHora)}</td>
                      <td>
                        <button 
                          className="btn btn-secondary" 
                          style={{ marginRight: '10px', backgroundColor: '#9b59b6', color: 'white' }}
                          onClick={() => navigate(`/consumo/${pedido.id}`)}>
                          + Consumo
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ backgroundColor: '#e67e22' }}
                          onClick={() => iniciarCheckout(pedido)}>
                          Fazer Check-out
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

      </Card>
    </div>
  );
}

export default ListagemPedidos;