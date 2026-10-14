import { useState } from 'react';
import { PageHeader } from '../../shared/components/PageHeader';
import { SearchInput } from '../../shared/components/SearchInput';
import { Select } from '../../shared/components/Select';
import { Table } from '../../shared/components/Table';
import type { Column } from '../../shared/components/Table';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { Avatar } from '../../shared/components/Avatar';
import { Banner } from '../../shared/components/Banner';
import { useDomain } from '../../shared/data/domain.store';
import type { Usuario } from '../../shared/data/domain.store';
import { dataCurta } from '../../shared/format';
import './UsuariosPage.css';

const CARGOS = [
  { valor: 'DEPPI', desc: 'Analisa inscrições e gerencia cursos e professores.' },
  { valor: 'ADMIN', desc: 'Gerencia instituições, usuários e relatórios.' },
];

export function UsuariosPage() {
  const usuarios = useDomain(s => s.usuarios);
  const concederCargo = useDomain(s => s.concederCargo);

  const [busca, setBusca] = useState('');
  const [filtroCargo, setFiltroCargo] = useState('TODOS');
  const [alvo, setAlvo] = useState<Usuario | null>(null);
  const [cargoSel, setCargoSel] = useState('DEPPI');

  const filtrados = usuarios.filter(u => {
    const texto = `${u.nome} ${u.email}`.toLowerCase().includes(busca.toLowerCase());
    const cargo = filtroCargo === 'TODOS' || u.cargos.includes(filtroCargo);
    return texto && cargo;
  });

  function abrir(u: Usuario) {
    setAlvo(u);
    setCargoSel('DEPPI');
  }

  function conceder() {
    if (!alvo) return;
    concederCargo(alvo.id, cargoSel);
    setAlvo(null);
  }

  const colunas: Column<Usuario>[] = [
    {
      header: 'Nome',
      cell: u => (
        <div className="cell-user">
          <Avatar initials={u.iniciais} size={32} />
          {u.nome}
        </div>
      ),
    },
    { header: 'E-mail', cell: u => u.email },
    {
      header: 'Cargos',
      cell: u => (
        <div className="cargo-chips">
          {u.cargos.map(c => <span key={c} className="cargo-chip mono">{c}</span>)}
        </div>
      ),
    },
    { header: 'Criado em', cell: u => <span className="mono">{dataCurta(u.criadoEm)}</span> },
    {
      header: '',
      align: 'right',
      cell: u => <Button variant="secondary" size="sm" leftIcon="add_moderator" onClick={() => abrir(u)}>Conceder cargo</Button>,
    },
  ];

  return (
    <div>
      <PageHeader title="Usuários" subtitle={`${usuarios.length} usuários`} />

      <div className="usuarios__filtros">
        <SearchInput placeholder="Buscar por nome ou e-mail" value={busca} onChange={e => setBusca(e.target.value)} />
        <Select value={filtroCargo} onChange={e => setFiltroCargo(e.target.value)}>
          <option value="TODOS">Cargo: Todos</option>
          <option value="ADMIN">ADMIN</option>
          <option value="DEPPI">DEPPI</option>
          <option value="PROFESSOR">PROFESSOR</option>
          <option value="ALUNO">ALUNO</option>
        </Select>
      </div>

      <Table columns={colunas} rows={filtrados} rowKey={u => u.id} />

      {alvo && (
        <Modal
          title="Conceder cargo"
          onClose={() => setAlvo(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setAlvo(null)}>Cancelar</Button>
              <Button leftIcon="add_moderator" onClick={conceder}>Conceder {cargoSel}</Button>
            </>
          }
        >
          <p className="modal-text">Escolha o cargo para <strong>{alvo.nome}</strong>. Os cargos atuais são mantidos.</p>
          <div className="radio-cards">
            {CARGOS.map(c => (
              <button
                key={c.valor}
                className={`radio-card ${cargoSel === c.valor ? 'is-selected' : ''}`}
                onClick={() => setCargoSel(c.valor)}
              >
                <span className="radio-card__dot" />
                <span>
                  <span className="radio-card__title mono">{c.valor}</span>
                  <span className="radio-card__desc">{c.desc}</span>
                </span>
              </button>
            ))}
          </div>
          <Banner variant="info" icon="warning">Esta ação não pode ser desfeita pela interface.</Banner>
        </Modal>
      )}
    </div>
  );
}
