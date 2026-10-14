import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../shared/components/Breadcrumb';
import { Card } from '../../shared/components/Card';
import { Input } from '../../shared/components/Input';
import { Select } from '../../shared/components/Select';
import { Button } from '../../shared/components/Button';
import { Banner } from '../../shared/components/Banner';
import { useDomain } from '../../shared/data/domain.store';
import { iniciais as gerarIniciais } from '../../shared/format';
import './NovoProfessor.css';

const TITULACOES = ['Graduado', 'Especialista', 'Mestre', 'Doutor'];
const ESCOLARIDADES = ['Ensino superior completo', 'Pós-graduação', 'Mestrado', 'Doutorado'];

export function NovoProfessor() {
  const nav = useNavigate();
  const usuarios = useDomain(s => s.usuarios);
  const addProfessor = useDomain(s => s.addProfessor);

  const [userId, setUserId] = useState('');
  const [siape, setSiape] = useState('');
  const [emailSiape, setEmailSiape] = useState('');
  const [titulacao, setTitulacao] = useState('');
  const [escolaridade, setEscolaridade] = useState('');
  const [pgd, setPgd] = useState(false);

  const valido = userId.trim() && siape.trim();

  function cadastrar() {
    if (!valido) return;
    const usuario = usuarios.find(u => u.id === userId.trim());
    const nome = usuario?.nome ?? 'Professor vinculado';
    addProfessor({
      nome,
      siape: siape.trim(),
      email: emailSiape || usuario?.email || '',
      iniciais: usuario?.iniciais ?? gerarIniciais(nome),
      titulacao: titulacao || undefined,
      participaPGD: pgd,
    });
    nav('/professores');
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Professores', to: '/professores' }, { label: 'Novo professor' }]} />
      <div style={{ marginBottom: 20 }}>
        <h1>Novo professor</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Vincule um usuário existente e informe os dados funcionais.</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Banner>P4 · Ainda não dá para criar o usuário do professor por aqui. Informe o ID de um usuário já cadastrado.</Banner>
      </div>

      <div className="novo-prof">
        <Card title="Vínculo">
          <Input
            label="ID do usuário"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            hint="UUID do usuário. O administrador encontra em Usuários."
            placeholder="00000000-0000-0000-0000-000000000000"
            mono
          />
        </Card>

        <Card title="Dados funcionais">
          <div className="form-stack">
            <Input label="SIAPE" value={siape} onChange={e => setSiape(e.target.value)} mono placeholder="0000000" />
            <Input label="E-mail SIAPE (opcional)" value={emailSiape} onChange={e => setEmailSiape(e.target.value)} placeholder="nome@ifce.edu.br" />
            <Select label="Titulação (opcional)" value={titulacao} onChange={e => setTitulacao(e.target.value)}>
              <option value="">Selecione</option>
              {TITULACOES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Select label="Escolaridade (opcional)" value={escolaridade} onChange={e => setEscolaridade(e.target.value)}>
              <option value="">Selecione</option>
              {ESCOLARIDADES.map(e => <option key={e} value={e}>{e}</option>)}
            </Select>
            <button type="button" className="pgd-toggle" onClick={() => setPgd(v => !v)}>
              <span className={`toggle ${pgd ? 'is-on' : ''}`}><span className="toggle__dot" /></span>
              <span>
                <span className="pgd-toggle__title">Participa do PGD</span>
                <span className="pgd-toggle__desc">Programa de Gestão e Desempenho</span>
              </span>
            </button>
          </div>
        </Card>
      </div>

      <div className="novo-prof__actions">
        <Button variant="secondary" onClick={() => nav('/professores')}>Cancelar</Button>
        <Button leftIcon="add" disabled={!valido} onClick={cadastrar}>Cadastrar professor</Button>
      </div>
    </div>
  );
}
