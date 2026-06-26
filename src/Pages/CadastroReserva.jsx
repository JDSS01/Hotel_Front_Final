import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

function CadastroReserva() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [hospedeId, setHospedeId] = useState('');
  const [quartoId, setQuartoId] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');
  const [dataSaida, setDataSaida] = useState('');
  const [status, setStatus] = useState('PENDENTE');

  const [listaHospedes, setListaHospedes] = useState([]);
  const [listaQuartos, setListaQuartos] = useState([]);

  
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

  useEffect(() => {
    if (idParam) {
      buscarReserva();
    }
 
  }, [idParam]);

  const buscarReserva = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/reservas/${idParam}`);
      const r = response.data;
      setHospedeId(r.hospede?.id || '');
      setQuartoId(r.quarto?.id || '');
      
      setDataEntrada(r.dataEntrada ? r.dataEntrada.split('T')[0] : '');
      setDataSaida(r.dataSaida ? r.dataSaida.split('T')[0] : '');
      setStatus(r.status || 'PENDENTE');
    } catch (error) {
      mensagemErro('Erro ao buscar dados da reserva.');
    }
  };

  const salvar = async () => {
    if (!hospedeId || !quartoId || !dataEntrada || !dataSaida) {
      return mensagemErro('Por favor, preencha todos os campos!');
    }

    const data = {
      hospede: { id: hospedeId },
      quarto: { id: quartoId },
      dataEntrada: dataEntrada,
      dataSaida: dataSaida,
      status: status
    };

    try {
      if (idParam == null) {
        await axios.post(`${BASE_URL}/reservas`, data);
        mensagemSucesso('Reserva criada com sucesso!');
      } else {
        await axios.put(`${BASE_URL}/reservas/${idParam}`, data);
        mensagemSucesso('Reserva atualizada com sucesso!');
      }
      navigate('/reservas');
    } catch (error) {
      mensagemErro('Erro ao salvar a reserva.');
    }
  };

  return (
    <div style={{ backgroundColor: '#2f4146', minHeight: '100vh', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      
      <div style={{ backgroundColor: '#f8f9fa', width: '100%', maxWidth: '800px', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', borderBottom: '10px solid white' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', fontWeight: 'bold' }}>Cadastro de Reserva</h2>
          <p style={{ color: '#555', fontSize: '15px' }}>Preencha os dados para reservar um quarto.</p>
        </div>
        
        <hr style={{ borderColor: '#ccc', marginBottom: '30px' }} />

        <div className="row">
          <div className="col-md-6" style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '500', marginBottom: '5px' }}>Hóspede:</label>
            <select className="form-control" style={{ backgroundColor: '#eaeaea', borderRadius: '8px' }} value={hospedeId} onChange={(e) => setHospedeId(e.target.value)}>
              <option value="">-- Selecione o Hóspede --</option>
              {listaHospedes.map(h => (
                <option key={h.id} value={h.id}>{h.nome} (CPF: {h.cpf})</option>
              ))}
            </select>
          </div>

          <div className="col-md-6" style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '500', marginBottom: '5px' }}>Quarto:</label>
            <select className="form-control" style={{ backgroundColor: '#eaeaea', borderRadius: '8px' }} value={quartoId} onChange={(e) => setQuartoId(e.target.value)}>
              <option value="">-- Selecione o Quarto --</option>
              {listaQuartos.map(q => (
                <option key={q.id} value={q.id}>Nº {q.numero} - {q.tipo} (R$ {q.valorDiaria?.toFixed(2)})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4" style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '500', marginBottom: '5px' }}>Data de Entrada:</label>
            <input type="date" className="form-control" style={{ backgroundColor: '#eaeaea', borderRadius: '8px' }} value={dataEntrada} onChange={(e) => setDataEntrada(e.target.value)} />
          </div>

          <div className="col-md-4" style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '500', marginBottom: '5px' }}>Data de Saída:</label>
            <input type="date" className="form-control" style={{ backgroundColor: '#eaeaea', borderRadius: '8px' }} value={dataSaida} onChange={(e) => setDataSaida(e.target.value)} />
          </div>

          <div className="col-md-4" style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '500', marginBottom: '5px' }}>Status:</label>
            <select className="form-control" style={{ backgroundColor: '#eaeaea', borderRadius: '8px' }} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PENDENTE">Pendente</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '40px' }}>
          <button type="button" style={{ backgroundColor: '#1877f2', color: 'white', border: 'none', padding: '10px 40px', borderRadius: '25px', fontWeight: 'bold' }} onClick={() => navigate('/reservas')}>
            Voltar
          </button>
          <button type="button" style={{ backgroundColor: '#1877f2', color: 'white', border: 'none', padding: '10px 40px', borderRadius: '25px', fontWeight: 'bold' }} onClick={salvar}>
            {idParam ? 'Alterar Reserva' : 'Confirmar Reserva'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default CadastroReserva;