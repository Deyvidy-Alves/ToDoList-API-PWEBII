import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../shared/components/Breadcrumb';
import { Button } from '../../shared/components/Button';
import { EmptyState } from '../../shared/components/EmptyState';
import { CursoForm } from '../deppi/CursoForm';
import type { CursoFormData } from '../deppi/CursoForm';
import { useDomain } from '../../shared/data/domain.store';

export function EditarCurso() {
  const { id } = useParams();
  const nav = useNavigate();
  const curso = useDomain(s => s.cursos.find(c => c.id === id));
  const updateCurso = useDomain(s => s.updateCurso);

  if (!curso) {
    return <EmptyState icon="search_off" title="Curso não encontrado" action={<Button onClick={() => nav('/cursos')}>Voltar aos cursos</Button>} />;
  }

  function salvar(data: CursoFormData) {
    if (!curso) return;
    updateCurso(curso.id, data);
    nav(`/cursos/${curso.id}`);
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Cursos', to: '/cursos' }, { label: curso.nome, to: `/cursos/${curso.id}` }, { label: 'Editar' }]} />
      <div style={{ marginBottom: 20 }}>
        <h1>Editar curso</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{curso.nome}</p>
      </div>

      <CursoForm
        inicial={curso}
        submitLabel="Salvar alterações"
        submitIcon="check"
        onCancel={() => nav(`/cursos/${curso.id}`)}
        onSubmit={salvar}
      />
    </div>
  );
}
