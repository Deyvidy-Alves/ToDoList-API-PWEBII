import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../shared/components/Breadcrumb';
import { StatCard } from '../../shared/components/StatCard';
import { StatusChip } from '../../shared/components/StatusChip';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { Banner } from '../../shared/components/Banner';
import { EmptyState } from '../../shared/components/EmptyState';
import { useDomain } from '../../shared/data/domain.store';
import { useSession } from '../auth/session.store';
import './CursoDetalhe.css';

export function CursoDetalhe() {
  const { id } = useParams();
  const nav = useNavigate();
  const curso = useDomain(s => s.cursos.find(c => c.id === id));
  const inscricoes = useDomain(s => s.inscricoes);
  const removeCurso = useDomain(s => s.removeCurso);
  const role = useSession(s => s.user!.role);
  const [excluir, setExcluir] = useState(false);

  if (!curso) {
    return <EmptyState icon="search_off" title="Curso não encontrado" action={<Button onClick={() => nav('/cursos')}>Voltar aos cursos</Button>} />;
  }

  const vinculadas = inscricoes.filter(i => i.cursoId === curso.id).length;
  const disponiveis = curso.vagas - curso.ocupadas;
  const ehDeppi = role === 'DEPPI';

  function confirmarExclusao() {
    if (!curso) return;
    const ok = removeCurso(curso.id);
    if (ok) nav('/cursos');
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
        {ehDeppi && (
          <div className="curso-head__actions">
            <Button variant="secondary" leftIcon="edit" onClick={() => nav(`/cursos/${curso.id}/editar`)}>Editar</Button>
            <Button variant="ghost" leftIcon="delete" onClick={() => setExcluir(true)}>Excluir</Button>
          </div>
        )}
      </div>

      <div className="curso-stats">
        <StatCard icon="date_range" label="Período" value={`${curso.periodoIni} – ${curso.periodoFim}`} />
        <StatCard icon="schedule" label="Horário" value={`${curso.horarioIni} às ${curso.horarioFim}`} />
        <StatCard icon="timer" label="Carga horária" value={`${curso.cargaHoraria} horas`} />
        <StatCard icon="apartment" label="Instituição" value={curso.instituicao} />
      </div>

      <div className="curso-stats curso-stats--2">
        <StatCard icon="group" label="Vagas" value={`${curso.vagas} no total`} hint={`${disponiveis} disponíveis`} />
        <StatCard icon="fact_check" label="Inscrições" value={`${vinculadas} recebidas`} />
      </div>

      {excluir && (
        <Modal
          title="Excluir curso"
          onClose={() => setExcluir(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setExcluir(false)}>Voltar</Button>
              <Button variant="danger" leftIcon="delete" disabled={vinculadas > 0} onClick={confirmarExclusao}>Excluir curso</Button>
            </>
          }
        >
          <p style={{ marginBottom: vinculadas > 0 ? 14 : 0 }}><strong>{curso.nome}</strong> será excluído permanentemente.</p>
          {vinculadas > 0 && (
            <Banner variant="danger">Não foi possível excluir: este curso tem inscrições vinculadas.</Banner>
          )}
        </Modal>
      )}
    </div>
  );
}
