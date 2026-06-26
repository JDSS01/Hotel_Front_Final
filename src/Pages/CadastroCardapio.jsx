import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

function CadastroCardapio() {
  const { tipo, idParam } = useParams(); // Pega os parâmetros da URL
  const navigate = useNavigate();
  
  const [tipoCadastro, setTipoCadastro] = useState('item');
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  // Se tiver um ID na URL, ele carrega os dados para editar
  useEffect(() => {
    if (idParam && tipo) {
      setTipoCadastro(tipo);
      buscarDados(tipo, idParam);
    }
  }, [idParam, tipo]);

  const buscarDados = async (tipoAtual, id) => {
    try {
      const endpoint = tipoAtual === 'item' ? 'itens' : 'servicos';
      const response = await axios.get(`${BASE_URL}/${endpoint}/${id}`);
      setNome(response.data.nome || '');
      setValor(response.data.valor || '');
    } catch (error) {
      mensagemErro('Erro ao buscar os dados.');
    }
  };

  const salvar = async () => {
    if (!nome || !valor) return mensagemErro('Por favor, preencha o nome e o valor!');
    
    const data = { nome: nome, valor: Number(valor) };
    const endpoint = tipoCadastro === 'item' ? 'itens' : 'servicos';
    
    try {
      if (idParam == null) {
        await axios.post(`${BASE_URL}/${endpoint}`, data);
        mensagemSucesso('Cadastrado com sucesso!');
      } else {
        await axios.put(`${BASE_URL}/${endpoint}/${idParam}`, data);
        mensagemSucesso('Alterado com sucesso!');
      }
      navigate('/pedidos');
    } catch (error) {
      mensagemErro('Erro ao salvar no cardápio.');
    }
  };

  return (
    <div style={{ backgroundColor: '#2f4146', minHeight: '100vh', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ backgroundColor: '#f8f9fa', width: '100%', maxWidth: '700px', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', borderBottom: '10px solid white' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', fontWeight: 'bold' }}>{idParam ? 'Editar Registro' : 'Novo Registro'}</h2>
        </div>
        <hr style={{ borderColor: '#ccc', marginBottom: '40px' }} />
        
        <div className="row justify-content-center">
          <div className="col-md-8" style={{ marginBottom: '25px' }}>
            <label style={{ fontWeight: '500', marginBottom: '5px' }}>Categoria:</label>
            <select 
              className="form-control" 
              value={tipoCadastro} 
              onChange={(e) => setTipoCadastro(e.target.value)}
              disabled={idParam != null} /* Bloqueia trocar de item pra serviço na edição */
            >
              <option value="item"> Item Físico</option>
              <option value="servico"> Serviço</option>
            </select>
          </div>
          <div className="col-md-8" style={{ marginBottom: '25px' }}>
            <label style={{ fontWeight: '500', marginBottom: '5px' }}>Nome (Descrição):</label>
            <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="col-md-8" style={{ marginBottom: '25px' }}>
            <label style={{ fontWeight: '500', marginBottom: '5px' }}>Valor Unitário (R$):</label>
            <input type="number" className="form-control" value={valor} onChange={(e) => setValor(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' }}>
          <button type="button" className="btn btn-secondary" style={{ padding: '10px 40px', borderRadius: '25px', fontWeight: 'bold' }} onClick={() => navigate('/pedidos')}>Voltar</button>
          <button type="button" className="btn btn-primary" style={{ padding: '10px 40px', borderRadius: '25px', fontWeight: 'bold', backgroundColor: '#1877f2' }} onClick={salvar}>Salvar</button>
        </div>

      </div>
    </div>
  );
}
export default CadastroCardapio;