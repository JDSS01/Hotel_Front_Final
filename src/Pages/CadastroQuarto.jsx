import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroQuarto() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [numero, setNumero] = useState('');
  const [tipo, setTipo] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [valorDiaria, setValorDiaria] = useState('');
  // 1. NOVO ESTADO AQUI
  const [status, setStatus] = useState('DISPONÍVEL'); 

  useEffect(() => {
    if (idParam) {
      buscarQuarto();
    }
  }, [idParam]);

  const buscarQuarto = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/quartos/${idParam}`);
      const dados = response.data;
      setId(dados.id);
      setNumero(dados.numero);
      setTipo(dados.tipo);
      setCapacidade(dados.capacidade);
      setValorDiaria(dados.valorDiaria);
      setStatus(dados.status || 'DISPONÍVEL'); // Carrega o status ou assume disponível
    } catch (error) {
      mensagemErro('Erro ao buscar dados do quarto.');
    }
  };

  const salvar = async () => {
    if (!numero || !tipo || !capacidade || !valorDiaria) {
      return mensagemErro('Preencha todos os campos obrigatórios!');
    }

    // 2. ENVIANDO O STATUS JUNTO COM OS OUTROS DADOS
    const dadosQuarto = { numero, tipo, capacidade, valorDiaria, status };

    try {
      if (idParam) {
        await axios.put(`${BASE_URL}/quartos/${idParam}`, dadosQuarto);
        mensagemSucesso('Quarto atualizado com sucesso!');
      } else {
        await axios.post(`${BASE_URL}/quartos`, dadosQuarto);
        mensagemSucesso('Quarto cadastrado com sucesso!');
      }
      navigate('/listagem-quartos');
    } catch (error) {
      mensagemErro('Erro ao salvar o quarto.');
    }
  };

  return (
    <div className='container'>
      <Card title='Cadastro de Quarto'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              
              <FormGroup label='Número do Quarto: *' htmlFor='inputNumero'>
                <input type='text' id='inputNumero' value={numero} className='form-control' onChange={(e) => setNumero(e.target.value)} />
              </FormGroup>

              <FormGroup label='Tipo do Quarto: *' htmlFor='inputTipo'>
                <select id='inputTipo' value={tipo} className='form-control' onChange={(e) => setTipo(e.target.value)}>
                  <option value=''>Selecione...</option>
                  <option value='Standard'>Standard</option>
                  <option value='Luxo'>Luxo</option>
                  <option value='Master'>Suite Master</option>
                </select>
              </FormGroup>

              <FormGroup label='Capacidade (Pessoas): *' htmlFor='inputCapacidade'>
                <input type='number' id='inputCapacidade' value={capacidade} className='form-control' onChange={(e) => setCapacidade(e.target.value)} />
              </FormGroup>

              <FormGroup label='Valor da Diária (R$): *' htmlFor='inputValorDiaria'>
                <input type='number' step='0.01' id='inputValorDiaria' value={valorDiaria} className='form-control' onChange={(e) => setValorDiaria(e.target.value)} />
              </FormGroup>

              {/* 3. CAIXA DE SELEÇÃO DO STATUS DO QUARTO */}
              <FormGroup label='Status do Quarto: *' htmlFor='inputStatus'>
                <select id='inputStatus' value={status} className='form-control' onChange={(e) => setStatus(e.target.value)}>
                  <option value='DISPONÍVEL'>🟢 Disponível</option>
                  <option value='OCUPADO'>🔴 Ocupado</option>
                  <option value='MANUTENÇÃO'>🟡 Em Manutenção</option>
                </select>
              </FormGroup>
              
              <Stack spacing={1} padding={1} direction='row' style={{ marginTop: '20px' }}>
                <button onClick={salvar} type='button' className='btn btn-success'>Salvar</button>
                <button onClick={() => navigate('/listagem-quartos')} type='button' className='btn btn-danger'>Cancelar</button>
              </Stack>

            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroQuarto;