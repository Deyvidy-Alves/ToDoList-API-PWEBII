import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../shared/components/Breadcrumb';
import { StatCard } from '../../shared/components/StatCard';
import { StatusChip } from '../../shared/components/StatusChip';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { Icon } from '../../shared/components/Icon';
import { EmptyState } from '../../shared/components/EmptyState';
import { useDomain } from '../../shared/data/domain.store';
import { useSession } from '../auth/session.store';
import '../deppi/CursoDetalhe.css';
import './CursoAluno.css';

export function CursoAluno() {
  const { id } = useParams();
  const nav = useNavigate();
  const user = useSession(s => s.user)!;
  const curso = useDomain(s => s.cursos.find(c => c.id === id));
  const inscricoes = useDomain(s => s.inscricoes);
  const criarInscricao = useDomain(s => s.criarInscricao);
  const [confirmar, setConfirmar] = useState(false);

  if (!curso) {
    return <EmptyState icon="search_off" title="Curso não encontrado" action={<Button onClick={() => nav('/cursos')}>Voltar aos cursos</Button>} />;
  }

  const inscrito = inscricoes.some(i => i.alunoId === user.id && i.cursoId === curso.id);
  const disponiveis = curso.vagas - curso.ocupadas;
  const lotado = disponiveis <= 0;

  function confirmarInscricao() {
    if (!curso) return;
    const insc = criarInscricao(
      user.id, user.name, user.email, user.matricula ?? '', curso.id, curso.nome,
    );
    setConfirmar(false);
    nav(`/minhas-inscricoes/${insc.id}`);
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Cursos', to: '/cursos' }, { label: curso.nome }]} />

      <div className="curso-cover">
        <span className="curso-cover__ini">{curso.iniciais}</span>
        <span className="curso-cover__chip"><StatusChip status={curso.status} /></span>
      </div>

      <div className="curso-head">
        <div>
          <h1>{curso.nome}</h1>
          <p className="curso-head__sub">{curso.instituicao}</p>
        </div>
        <div className="curso-head__actions">
          {inscrito
            ? <span className="aluno-inscrito"><Icon name="check_circle" size={18} color="var(--status-deferred)" />Inscrito</span>
            : <Button size="lg" disabled={lotado} onClick={() => setConfirmar(true)}>{lotado ? 'Sem vagas' : 'Inscrever-se'}</Button>}
        </div>
      </div>

      <div className="curso-stats">
        <StatCard icon="date_range" label="Período" value={`${curso.periodoIni} – ${curso.periodoFim}`} />
        <StatCard icon="schedule" label="Horário" value={`${curso.horarioIni} às ${curso.horarioFim}`} />
        <StatCard icon="timer" label="Carga horária" value={`${curso.cargaHoraria} horas`} />
        <StatCard icon="group" label="Vagas" value={`${disponiveis} disponíveis`} hint={`${curso.vagas} no total`} />
      </div>

      {confirmar && (
        <Modal
          title="Confirmar inscrição"
          onClose={() => setConfirmar(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmar(false)}>Voltar</Button>
              <Button onClick={confirmarInscricao}>Confirmar inscrição</Button>
            </>
          }
        >
          <p style={{ marginBottom: 16 }}>
            Você vai se inscrever em <strong>{curso.nome}</strong>. Depois, informe a renda familiar e envie seus documentos.
          </p>
          <div className="confirm-grid">
            <div><dt>Período</dt><dd>{curso.periodoIni} – {curso.periodoFim}</dd></div>
            <div><dt>Horário</dt><dd>{curso.horarioIni} às {curso.horarioFim}</dd></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
