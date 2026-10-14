import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../shared/components/PageHeader';
import { Table } from '../../shared/components/Table';
import type { Column } from '../../shared/components/Table';
import { Avatar } from '../../shared/components/Avatar';
import { StatusChip } from '../../shared/components/StatusChip';
import { useDomain } from '../../shared/data/domain.store';
import type { Inscricao, EnrollmentStatus } from '../../shared/data/domain.store';
import { ABAS_INSCRICOES } from '../../shared/data/mocks';
import { iniciais, dataCurta } from '../../shared/format';
import './InscricoesPage.css';

type AbaKey = EnrollmentStatus | 'TODAS';

export function InscricoesPage() {
  const nav = useNavigate();
  const inscricoes = useDomain(s => s.inscricoes);
  const [aba, setAba] = useState<AbaKey>('PENDENTE');

  const filtradas = aba === 'TODAS' ? inscricoes : inscricoes.filter(i => i.status === aba);
  const abaAtual = ABAS_INSCRICOES.find(a => a.key === aba);

  const colunas: Column<Inscricao>[] = [
    {
      header: 'Nome',
      cell: i => (
        <div className="cell-user">
          <Avatar initials={iniciais(i.alunoNome)} size={32} />
          {i.alunoNome}
        </div>
      ),
    },
    { header: 'E-mail', cell: i => i.alunoEmail },
    { header: 'Matrícula', cell: i => <span className="mono">{i.matricula}</span> },
    { header: 'Curso', cell: i => i.cursoNome },
    { header: 'Data', cell: i => <span className="mono">{dataCurta(i.data)}</span> },
    { header: 'Situação', align: 'right', cell: i => <StatusChip status={i.status} size="sm" /> },
  ];

  return (
    <div>
      <PageHeader title="Inscrições" subtitle="Analise, defira ou indefira as inscrições dos alunos." />

      <div className="abas">
        {ABAS_INSCRICOES.map(a => (
          <button
            key={a.key}
            className={`aba ${aba === a.key ? 'is-active' : ''}`}
            onClick={() => setAba(a.key)}
          >
            {a.label}
            <span className="aba__count">{a.total}</span>
          </button>
        ))}
      </div>

      <Table columns={colunas} rows={filtradas} rowKey={i => i.id} onRowClick={i => nav(`/inscricoes/${i.id}`)} />

      <p className="inscricoes__footer">
        Mostrando {filtradas.length} de {abaAtual?.total ?? filtradas.length} {abaAtual?.label.toLowerCase()}
      </p>
    </div>
  );
}
