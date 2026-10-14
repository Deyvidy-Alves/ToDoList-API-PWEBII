import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../shared/components/PageHeader';
import { Icon } from '../../shared/components/Icon';
import { CourseCard } from '../../shared/components/CourseCard';
import { useDomain } from '../../shared/data/domain.store';
import { useSession } from '../auth/session.store';
import { dataPorExtenso, primeiroNome } from '../../shared/format';
import '../deppi/cursos-grid.css';
import './InicioAluno.css';

export function InicioAluno() {
  const nav = useNavigate();
  const user = useSession(s => s.user)!;
  const cursos = useDomain(s => s.cursos);
  const inscricoes = useDomain(s => s.inscricoes);

  const abertos = cursos.filter(c => c.status === 'ANDAMENTO' || c.status === 'ANALISE');
  const andamento = cursos.filter(c => c.status === 'ANDAMENTO');
  const minhas = inscricoes.filter(i => i.alunoId === user.id);

  return (
    <div>
      <PageHeader title={`Olá, ${primeiroNome(user.name)}`} subtitle={dataPorExtenso()} />

      <div className="aluno-cards">
        <button className="aluno-card" onClick={() => nav('/cursos')}>
          <Icon name="school" size={32} color="var(--accent)" />
          <div className="aluno-card__body">
            <span className="aluno-card__title">Ver cursos</span>
            <span className="aluno-card__sub">{abertos.length} cursos com inscrições abertas</span>
          </div>
          <Icon name="arrow_forward" size={22} color="var(--text-muted)" />
        </button>

        <button className="aluno-card" onClick={() => nav('/minhas-inscricoes')}>
          <Icon name="assignment" size={32} color="var(--accent)" />
          <div className="aluno-card__body">
            <span className="aluno-card__title">Minhas inscrições</span>
            <span className="aluno-card__sub">{minhas.length} inscrição · faltam 2 documentos</span>
          </div>
          <Icon name="arrow_forward" size={22} color="var(--text-muted)" />
        </button>
      </div>

      <h2 style={{ margin: '28px 0 16px' }}>Cursos em andamento</h2>
      <div className="cursos-grid">
        {andamento.map(c => <CourseCard key={c.id} curso={c} />)}
      </div>
    </div>
  );
}
