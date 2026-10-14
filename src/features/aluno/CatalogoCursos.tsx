import { useState } from 'react';
import { PageHeader } from '../../shared/components/PageHeader';
import { SearchInput } from '../../shared/components/SearchInput';
import { Banner } from '../../shared/components/Banner';
import { CourseCard } from '../../shared/components/CourseCard';
import { EmptyState } from '../../shared/components/EmptyState';
import { useDomain } from '../../shared/data/domain.store';
import '../deppi/cursos-grid.css';

export function CatalogoCursos() {
  const cursos = useDomain(s => s.cursos);
  const [busca, setBusca] = useState('');

  const filtrados = cursos.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <PageHeader title="Cursos" subtitle="Cursos com inscrições abertas" />

      <div style={{ marginBottom: 16 }}>
        <Banner>P1 · Até a correção da API, esta lista pode aparecer vazia.</Banner>
      </div>

      <div style={{ marginBottom: 16, maxWidth: 420 }}>
        <SearchInput placeholder="Buscar por nome" value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {filtrados.length === 0
        ? <EmptyState icon="school" title="Nenhum curso disponível" />
        : <div className="cursos-grid">{filtrados.map(c => <CourseCard key={c.id} curso={c} />)}</div>}
    </div>
  );
}
