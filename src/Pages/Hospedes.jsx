// src/pages/Hospedes.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import './Paginas.css';

function Hospedes() {
  const [hospedes, setHospedes] = useState([]);
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', telefone: '', endereco: ''
  });

  // GET: Busca os dados ao carregar a tela
  const buscarHospedes = () => {
    api.get('/hospedes')
      .then(response => setHospedes(response.data))
      .catch(error => console.error("Erro ao buscar:", error));
  };

  useEffect(() => {
    buscarHospedes();
  }, []);

  // Controla o que é digitado no formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // POST: Salva um novo hóspede
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que a página recarregue
    api.post('/hospedes', formData)
      .then(() => {
        alert('Hóspede salvo com sucesso!');
        setFormData({ nome: '', cpf: '', email: '', telefone: '', endereco: '' }); // Limpa o form
        buscarHospedes(); // Atualiza a lista na tela
      })
      .catch(error => alert('Erro ao salvar: ' + error.response?.data));
  };

  // DELETE: Exclui um hóspede
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      api.delete(`/hospedes/${id}`)
        .then(() => {
          buscarHospedes(); // Atualiza a lista
        })
        .catch(error => console.error("Erro ao excluir:", error));
    }
  };

  return (
    <div className="conteudo-pagina">
      <h1>Gerenciamento de Hóspedes</h1>

      {/* Formulário de Cadastro */}
      <div className="card-formulario">
        <h3>Novo Hóspede</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
          <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} required />
          <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
          <input type="text" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} required />
          <input type="text" name="endereco" placeholder="Endereço" value={formData.endereco} onChange={handleChange} />
          <button type="submit" className="btn-salvar">Salvar Hóspede</button>
        </form>
      </div>

      {/* Lista de Hóspedes */}
      <div className="lista-dados">
        <h3>Hóspedes Cadastrados</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {hospedes.map(hospede => (
              <tr key={hospede.id}>
                <td>{hospede.nome}</td>
                <td>{hospede.cpf}</td>
                <td>{hospede.telefone}</td>
                <td>
                  <button onClick={() => handleDelete(hospede.id)} className="btn-excluir">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Hospedes;