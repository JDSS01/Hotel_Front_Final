import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

function CadastroHospede() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  // Estados para os dados principais
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  // Estados para os campos detalhados de endereço (conforme a imagem)
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numeroEndereco, setNumeroEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  useEffect(() => {
    if (idParam) {
      buscarHospede();
    }
    
  }, [idParam]);

  const buscarHospede = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hospedes/${idParam}`);
      const h = response.data;
      setId(h.id);
      setNome(h.nome);
      setDataNascimento(h.dataNascimento);
      setCpf(h.cpf);
      setEmail(h.email);
      setTelefone(h.telefone);
    } catch (error) {
      mensagemErro('Erro ao buscar dados do hóspede.');
    }
  };

  const salvar = async () => {
    
    const enderecoCompleto = `${logradouro}, ${numeroEndereco} - ${bairro}, ${cidade}/${uf} (CEP: ${cep}) ${complemento}`;

    const data = {
      nome,
      dataNascimento,
      cpf,
      email,
      telefone,
      endereco: enderecoCompleto
    };

    try {
      if (idParam == null) {
        await axios.post(`${BASE_URL}/hospedes`, data);
        mensagemSucesso('Hóspede cadastrado com sucesso!');
      } else {
        await axios.put(`${BASE_URL}/hospedes/${idParam}`, data);
        mensagemSucesso('Hóspede alterado com sucesso!');
      }
      navigate('/listagem-hospedes');
    } catch (error) {
      mensagemErro('Erro ao salvar o hóspede.');
    }
  };

  return (
    <div style={{ backgroundColor: '#2f4146', minHeight: '100vh', padding: '40px', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ backgroundColor: '#f8f9fa', width: '100%', maxWidth: '900px', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', borderBottom: '10px solid white' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#2c3e50', fontWeight: 'bold' }}>Cadastro de hóspede</h2>
          <p style={{ color: '#555', fontSize: '14px' }}>Preencha todos os campos para criar o cadastro do hóspede.</p>
        </div>
        
        <hr style={{ borderColor: '#ccc', marginBottom: '30px' }} />

        {/* Linha 1: Nome e Nascimento */}
        <div className="row">
          <div className="col-md-8 mb-3">
            <label className="form-label">Nome completo:</label>
            <input type="text" className="form-control" style={{backgroundColor: '#eaeaea'}} value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Data de nascimento:</label>
            <input type="date" className="form-control" style={{backgroundColor: '#eaeaea'}} value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
          </div>
        </div>

       
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">CPF/CNPJ:</label>
            <input type="text" className="form-control" style={{backgroundColor: '#eaeaea'}} value={cpf} onChange={(e) => setCpf(e.target.value)} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Telefone:</label>
            <input type="text" className="form-control" style={{backgroundColor: '#eaeaea'}} value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </div>
        </div>

     
        <div className="row">
          <div className="col-md-12 mb-3">
            <label className="form-label">E-mail:</label>
            <input type="email" className="form-control" style={{backgroundColor: '#eaeaea'}} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

  
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">CEP:</label>
            <input type="text" className="form-control" style={{backgroundColor: '#eaeaea'}} value={cep} onChange={(e) => setCep(e.target.value)} />
          </div>
          <div className="col-md-8 mb-3">
            <label className="form-label">Logradouro:</label>
            <input type="text" className="form-control" style={{backgroundColor: '#eaeaea'}} value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />
          </div>
        </div>

        
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Número:</label>
            <input type="text" className="form-control" style={{backgroundColor: '#eaeaea'}} value={numeroEndereco} onChange={(e) => setNumeroEndereco(e.target.value)} />
          </div>
          <div className="col-md-5 mb-3">
            <label className="form-label">Complemento:</label>
            <input type="text" className="form-control" style={{backgroundColor: '#eaeaea'}} value={complemento} onChange={(e) => setComplemento(e.target.value)} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Bairro:</label>
            <input type="text" className="form-control" style={{backgroundColor: '#eaeaea'}} value={bairro} onChange={(e) => setBairro(e.target.value)} />
          </div>
        </div>

       
        <div className="row">
          <div className="col-md-8 mb-3">
            <label className="form-label">Cidade:</label>
            <input type="text" className="form-control" style={{backgroundColor: '#eaeaea'}} value={cidade} onChange={(e) => setCidade(e.target.value)} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">UF:</label>
            <select className="form-control" style={{backgroundColor: '#eaeaea'}} value={uf} onChange={(e) => setUf(e.target.value)}>
              <option value="">Selecione</option>
              <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option>
              <option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option>
              <option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option>
              <option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>
              <option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option>
              <option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option>
              <option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option>
              <option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>
              <option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
            </select>
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' }}>
          <button 
            type="button" 
            style={{ backgroundColor: '#1877f2', color: 'white', border: 'none', padding: '10px 45px', borderRadius: '25px', fontWeight: 'bold' }}
            onClick={() => navigate('/listagem-hospedes')}
          >
            Voltar
          </button>
          <button 
            type="button" 
            style={{ backgroundColor: '#1877f2', color: 'white', border: 'none', padding: '10px 45px', borderRadius: '25px', fontWeight: 'bold' }}
            onClick={salvar}
          >
            {idParam ? 'Alterar' : 'Cadastrar'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default CadastroHospede;