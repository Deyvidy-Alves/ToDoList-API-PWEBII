import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../shared/components/PageHeader';
import { SearchInput } from '../../shared/components/SearchInput';
import { Button } from '../../shared/components/Button';
import { Banner } from '../../shared/components/Banner';
import { CourseCard } from '../../shared/components/CourseCard';
import { EmptyState } from '../../shared/components/EmptyState';
import { useDomain } from '../../shared/data/domain.store';
import { useSession } from '../auth/session.store';
import './cursos-grid.css';

export function CursosDeppi() {
  const nav = useNavigate();
  const cursos = useDomain(s => s.cursos);
  const role = useSession(s => s.user!.role);
  const [busca, setBusca] = useState('');

  const filtrados = cursos.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));
  const instituicoes = new Set(cursos.map(c => c.instituicao)).size;

  return (
    <div>
      <PageHeader
        title="Cursos"
        subtitle={`${cursos.length} cursos em ${instituicoes} instituições`}
        action={role === 'DEPPI' && <Button leftIcon="add" onClick={() => nav('/cursos/novo')}>Novo curso</Button>}
      />

      <div style={{ marginBottom: 16 }}>
        <Banner>P1 · A alteração de status está desativada até a correção da API. Novos cursos ficam "Em análise".</Banner>
      </div>

      <div style={{ marginBottom: 16, maxWidth: 420 }}>
        <SearchInput placeholder="Buscar por nome" value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {filtrados.length === 0
        ? <EmptyState icon="school" title="Nenhum curso encontrado" description="Ajuste a busca ou cadastre um novo curso." />
        : <div className="cursos-grid">{filtrados.map(c => <CourseCard key={c.id} curso={c} />)}</div>}
    </div>
  );
}
