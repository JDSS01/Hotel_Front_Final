import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

function CadastroPedido() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [hospedeId, setHospedeId] = useState('');
  const [quartoId, setQuartoId] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');

  const [listaHospedes, setListaHospedes] = useState([]);
  const [listaQuartos, setListaQuartos] = useState([]);

  // Carrega as listas para preencher as caixinhas de seleção
  useEffect(() => {
    const carregarListas = async () => {
      try {
        const resHospedes = await axios.get(`${BASE_URL}/hospedes`);
        const resQuartos = await axios.get(`${BASE_URL}/quartos`);
        setListaHospedes(resHospedes.data);
        setListaQuartos(resQuartos.data);
      } catch (error) {
        mensagemErro("Erro ao carregar as opções de hóspedes e quartos.");
      }
    };
    carregarListas();
  }, []);

  // Se estiver editando um Check-in já existente
  useEffect(() => {
    if (idParam) {
      buscarPedido();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam]);

  const buscarPedido = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/pedidos/${idParam}`);
      const p = response.data;
      setHospedeId(p.hospede?.id || '');
      setQuartoId(p.quarto?.id || '');
      setDataEntrada(p.dataEntrada ? p.dataEntrada.split('T')[0] : '');
    } catch (error) {
      mensagemErro('Erro ao buscar dados do check-in.');
    }
  };

  const salvar = async () => {
    if (!hospedeId || !quartoId || !dataEntrada) {
      return mensagemErro('Por favor, preencha o hóspede, o quarto e a data de entrada.');
    }

    // Veja que o campo de "valorTotal" foi removido daqui!
    const data = {
      hospede: { id: hospedeId },
      quarto: { id: quartoId },
      dataEntrada: dataEntrada
    };

    try {
      if (idParam == null) {
        await axios.post(`${BASE_URL}/pedidos`, data);
        mensagemSucesso('Check-in realizado com sucesso!');
      } else {
        await axios.put(`${BASE_URL}/pedidos/${idParam}`, data);
        mensagemSucesso('Check-in atualizado com sucesso!');
      }
      // Após o check-in, manda a recepcionista direto para o Painel principal
      navigate('/painel');
    } catch (error) {
      mensagemErro('Erro ao realizar o check-in.');
    }
  };

  return (
    <div style={{ backgroundColor: '#2f4146', minHeight: '100vh', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      
      <div style={{ backgroundColor: '#f8f9fa', width: '100%', maxWidth: '800px', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', borderBottom: '10px solid white' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', fontWeight: 'bold' }}>Fazer Check-in</h2>
          <p style={{ color: '#555', fontSize: '15px' }}>Vincule o hóspede ao quarto para iniciar a estadia.</p>
        </div>
        
        <hr style={{ borderColor: '#ccc', marginBottom: '40px' }} />

        {/* Linha 1: Hóspede e Quarto */}
        <div className="row">
          <div className="col-md-6" style={{ marginBottom: '30px' }}>
            <label style={{ fontWeight: '500', marginBottom: '5px' }}>Hóspede:</label>
            <select 
              className="form-control" 
              style={{ backgroundColor: '#eaeaea', border: '1px solid #ccc', borderRadius: '8px' }}
              value={hospedeId} 
              onChange={(e) => setHospedeId(e.target.value)}
            >
              <option value="">-- Selecione o Hóspede --</option>
              {listaHospedes.map(h => (
                <option key={h.id} value={h.id}>{h.nome} (CPF: {h.cpf})</option>
              ))}
            </select>
          </div>

          <div className="col-md-6" style={{ marginBottom: '30px' }}>
            <label style={{ fontWeight: '500', marginBottom: '5px' }}>Quarto:</label>
            <select 
              className="form-control" 
              style={{ backgroundColor: '#eaeaea', border: '1px solid #ccc', borderRadius: '8px' }}
              value={quartoId} 
              onChange={(e) => setQuartoId(e.target.value)}
            >
              <option value="">-- Selecione o Quarto --</option>
              {listaQuartos.map(q => (
                <option key={q.id} value={q.id}>Nº {q.numero} - {q.tipo}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Linha 2: Data de Entrada */}
        <div className="row justify-content-center">
          <div className="col-md-6" style={{ marginBottom: '30px' }}>
            <label style={{ fontWeight: '500', marginBottom: '5px' }}>Data de Entrada:</label>
            <input 
              type="date" 
              className="form-control" 
              style={{ backgroundColor: '#eaeaea', border: '1px solid #ccc', borderRadius: '8px' }}
              value={dataEntrada} 
              onChange={(e) => setDataEntrada(e.target.value)} 
            />
          </div>
        </div>

        {/* Botões Centralizados */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' }}>
          <button 
            type="button" 
            style={{ backgroundColor: '#1877f2', color: 'white', border: 'none', padding: '10px 40px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/painel')}
          >
            Voltar
          </button>
          <button 
            type="button" 
            style={{ backgroundColor: '#1877f2', color: 'white', border: 'none', padding: '10px 40px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={salvar}
          >
            {idParam ? 'Alterar Check-in' : 'Confirmar Check-in'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default CadastroPedido;