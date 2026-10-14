import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../shared/components/PageHeader';
import { Banner } from '../../shared/components/Banner';
import { Table } from '../../shared/components/Table';
import type { Column } from '../../shared/components/Table';
import { StatusChip } from '../../shared/components/StatusChip';
import { EmptyState } from '../../shared/components/EmptyState';
import { useDomain } from '../../shared/data/domain.store';
import { useSession } from '../auth/session.store';
import type { Inscricao } from '../../shared/data/domain.store';
import { dataCurta } from '../../shared/format';

export function MinhasInscricoes() {
  const nav = useNavigate();
  const user = useSession(s => s.user)!;
  const inscricoes = useDomain(s => s.inscricoes);
  const cursos = useDomain(s => s.cursos);

  const minhas = inscricoes.filter(i => i.alunoId === user.id);

  const instituicaoDoCurso = (cursoId: string) => cursos.find(c => c.id === cursoId)?.instituicao ?? '—';

  const colunas: Column<Inscricao>[] = [
    { header: 'Curso', cell: i => i.cursoNome },
    { header: 'Instituição', cell: i => instituicaoDoCurso(i.cursoId) },
    { header: 'Inscrita em', cell: i => <span className="mono">{dataCurta(i.data)}</span> },
    { header: 'Situação', align: 'right', cell: i => <StatusChip status={i.status} size="sm" /> },
  ];

  return (
    <div>
      <PageHeader title="Minhas inscrições" subtitle="Acompanhe suas inscrições e envie os documentos pendentes." />

      <div style={{ marginBottom: 16 }}>
        <Banner>P2 · Enquanto a API não expõe suas inscrições, só aparecem as feitas neste navegador e a situação fica indefinida.</Banner>
      </div>

      {minhas.length === 0
        ? <EmptyState icon="assignment" title="Nenhuma inscrição ainda" description="Explore o catálogo e inscreva-se em um curso." />
        : <Table columns={colunas} rows={minhas} rowKey={i => i.id} onRowClick={i => nav(`/minhas-inscricoes/${i.id}`)} />}
    </div>
  );
}
