import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../shared/components/Breadcrumb';
import { Banner } from '../../shared/components/Banner';
import { CursoForm } from './CursoForm';
import type { CursoFormData } from './CursoForm';
import { useDomain } from '../../shared/data/domain.store';

export function NovoCurso() {
  const nav = useNavigate();
  const addCurso = useDomain(s => s.addCurso);

  function criar(data: CursoFormData) {
    const curso = addCurso(data);
    nav(`/cursos/${curso.id}`);
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Cursos', to: '/cursos' }, { label: 'Novo curso' }]} />
      <div style={{ marginBottom: 20 }}>
        <h1>Novo curso</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>O curso é criado com status "Em análise".</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Banner>P6 · Se a lista de instituições não carregar, o campo vira texto para você informar o ID da instituição.</Banner>
      </div>

      <CursoForm submitLabel="Criar curso" submitIcon="add" onCancel={() => nav('/cursos')} onSubmit={criar} />
    </div>
  );
}
