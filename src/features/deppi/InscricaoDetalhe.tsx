import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../shared/components/Breadcrumb';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { StatusChip } from '../../shared/components/StatusChip';
import { Icon } from '../../shared/components/Icon';
import { Banner } from '../../shared/components/Banner';
import { EmptyState } from '../../shared/components/EmptyState';
import { useDomain } from '../../shared/data/domain.store';
import { DOCS_DEPPI } from '../../shared/data/mocks';
import { dataCurta } from '../../shared/format';
import './InscricaoDetalhe.css';

export function InscricaoDetalhe() {
  const { id } = useParams();
  const nav = useNavigate();
  const inscricao = useDomain(s => s.inscricoes.find(i => i.id === id));
  const curso = useDomain(s => s.cursos.find(c => c.id === inscricao?.cursoId));
  const deferir = useDomain(s => s.deferirInscricao);
  const indeferir = useDomain(s => s.indeferirInscricao);

  const [modal, setModal] = useState<'deferir' | 'indeferir' | null>(null);
  const [motivo, setMotivo] = useState('');
  const [erroDeferir, setErroDeferir] = useState('');

  if (!inscricao) {
    return <EmptyState icon="search_off" title="Inscrição não encontrada" action={<Button onClick={() => nav('/inscricoes')}>Voltar</Button>} />;
  }

  const disponiveis = curso ? curso.vagas - curso.ocupadas : 0;

  function confirmarDeferir() {
    if (!inscricao) return;
    const res = deferir(inscricao.id);
    if (!res.ok) { setErroDeferir(res.motivo ?? 'Não foi possível deferir.'); return; }
    setModal(null);
  }

  function confirmarIndeferir() {
    if (!inscricao) return;
    indeferir(inscricao.id, motivo);
    setModal(null);
    setMotivo('');
  }

  const dadosAluno = [
    { label: 'E-mail', valor: inscricao.alunoEmail, mono: false },
    { label: 'Matrícula', valor: inscricao.matricula, mono: true },
    { label: 'CPF', valor: '052.318.443-07', mono: true },
    { label: 'Nascimento', valor: '14/03/2004', mono: true },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inscrições', to: '/inscricoes' }, { label: inscricao.alunoNome }]} />

      <div className="insc-head">
        <h1>{inscricao.alunoNome}</h1>
        <StatusChip status={inscricao.status} />
      </div>
      <p className="insc-head__sub">{inscricao.cursoNome} · inscrita em {dataCurta(inscricao.data)}</p>

      <div className="insc-grid">
        <Card title="Aluno">
          <dl className="insc-dados">
            {dadosAluno.map(d => (
              <div key={d.label}><dt>{d.label}</dt><dd className={d.mono ? 'mono' : ''}>{d.valor}</dd></div>
            ))}
          </dl>
        </Card>

        <Card title="Curso">
          <dl className="insc-dados">
            <div><dt>Nome</dt><dd>{inscricao.cursoNome}</dd></div>
            <div><dt>Vagas disponíveis</dt><dd className="mono">{curso ? `${disponiveis} de ${curso.vagas}` : '—'}</dd></div>
          </dl>
        </Card>

        <Card title="Documentos">
          <div className="docs">
            {DOCS_DEPPI.map(doc => (
              <div key={doc.nome} className="docs__row">
                <Icon name={doc.icon} size={22} color="var(--text-muted)" />
                <div className="docs__main">
                  <span className="docs__cat">{doc.categoria}</span>
                  <span className="docs__nome mono">{doc.nome}</span>
                </div>
                <span className="docs__tam">{doc.tamanho}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {inscricao.status === 'PENDENTE' && (
        <div className="insc-actions">
          <Button leftIcon="check_circle" onClick={() => { setErroDeferir(''); setModal('deferir'); }}>Deferir inscrição</Button>
          <Button variant="danger" leftIcon="cancel" onClick={() => setModal('indeferir')}>Indeferir inscrição</Button>
        </div>
      )}

      {modal === 'deferir' && (
        <Modal
          title="Deferir inscrição"
          onClose={() => setModal(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModal(null)}>Voltar</Button>
              <Button leftIcon="check_circle" disabled={Boolean(erroDeferir)} onClick={confirmarDeferir}>Deferir</Button>
            </>
          }
        >
          <p style={{ marginBottom: erroDeferir ? 14 : 0 }}>
            A inscrição de <strong>{inscricao.alunoNome}</strong> em <strong>{inscricao.cursoNome}</strong> passará para "Deferida".
          </p>
          {erroDeferir && <Banner variant="danger">{erroDeferir}</Banner>}
        </Modal>
      )}

      {modal === 'indeferir' && (
        <Modal
          title="Indeferir inscrição"
          onClose={() => setModal(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModal(null)}>Voltar</Button>
              <Button variant="danger" leftIcon="cancel" onClick={confirmarIndeferir}>Indeferir inscrição</Button>
            </>
          }
        >
          <label className="field">
            <span className="field__label">Motivo (opcional)</span>
            <textarea
              className="insc-textarea"
              rows={4}
              maxLength={255}
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Comprovante de renda ilegível. Reenvie em PDF com boa resolução."
            />
            <span className="insc-textarea__foot">
              <span>Entre 3 e 255 caracteres</span>
              <span>{motivo.length} / 255</span>
            </span>
          </label>
        </Modal>
      )}
    </div>
  );
}
