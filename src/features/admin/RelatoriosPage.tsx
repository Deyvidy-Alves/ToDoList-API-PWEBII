import { PageHeader } from '../../shared/components/PageHeader';
import { StatCard } from '../../shared/components/StatCard';
import { Table } from '../../shared/components/Table';
import type { Column } from '../../shared/components/Table';
import { StatusChip } from '../../shared/components/StatusChip';
import { InscricoesPorSituacao, CursosPorSituacao } from './DashboardCharts';
import { TOTAIS, CURSOS_RELATORIO } from '../../shared/data/mocks';
import type { CursoRelatorio } from '../../shared/data/mocks';
import { dataPorExtenso, horaAtual } from '../../shared/format';
import './dashboard.css';

export function RelatoriosPage() {
  const colunas: Column<CursoRelatorio>[] = [
    { header: 'Nome', cell: c => c.nome },
    { header: 'Status', cell: c => <StatusChip status={c.status} size="sm" /> },
    { header: 'Inscrições', align: 'right', cell: c => <span className="mono">{c.inscricoes}</span> },
  ];

  return (
    <div>
      <PageHeader title="Relatórios" subtitle={`Gerado em ${dataPorExtenso()} · ${horaAtual()}`} />

      <div className="stat-grid">
        {TOTAIS.map(t => (
          <StatCard key={t.label} label={t.label} value={t.value} valueColor={t.accent ? 'var(--accent)' : undefined} />
        ))}
      </div>

      <div className="dash-grid" style={{ marginBottom: 16 }}>
        <InscricoesPorSituacao />
        <CursosPorSituacao />
      </div>

      <h3 style={{ marginBottom: 12 }}>Cursos</h3>
      <Table columns={colunas} rows={CURSOS_RELATORIO} rowKey={c => c.nome} />
    </div>
  );
}
