import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../shared/components/PageHeader';
import { SearchInput } from '../../shared/components/SearchInput';
import { Table } from '../../shared/components/Table';
import type { Column } from '../../shared/components/Table';
import { Button } from '../../shared/components/Button';
import { Avatar } from '../../shared/components/Avatar';
import { useDomain } from '../../shared/data/domain.store';
import type { Professor } from '../../shared/data/domain.store';

export function ProfessoresPage() {
  const nav = useNavigate();
  const professores = useDomain(s => s.professores);
  const [busca, setBusca] = useState('');

  const filtrados = professores.filter(p =>
    `${p.nome} ${p.siape}`.toLowerCase().includes(busca.toLowerCase()));

  const colunas: Column<Professor>[] = [
    {
      header: 'Nome',
      cell: p => (
        <div className="cell-user">
          <Avatar initials={p.iniciais} size={32} />
          {p.nome}
        </div>
      ),
    },
    { header: 'SIAPE', cell: p => <span className="mono">{p.siape}</span> },
    { header: 'E-mail institucional', cell: p => p.email },
  ];

  return (
    <div>
      <PageHeader
        title="Professores"
        subtitle={`${professores.length} professores`}
        action={<Button leftIcon="add" onClick={() => nav('/professores/novo')}>Novo professor</Button>}
      />

      <div style={{ marginBottom: 16, maxWidth: 420 }}>
        <SearchInput placeholder="Buscar por nome ou SIAPE" value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      <Table columns={colunas} rows={filtrados} rowKey={p => p.id} onRowClick={p => nav(`/professores/${p.id}`)} />
    </div>
  );
}
