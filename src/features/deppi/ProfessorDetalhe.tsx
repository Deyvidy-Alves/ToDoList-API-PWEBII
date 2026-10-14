import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../shared/components/Breadcrumb';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { EmptyState } from '../../shared/components/EmptyState';
import { useDomain } from '../../shared/data/domain.store';
import './ProfessorDetalhe.css';

export function ProfessorDetalhe() {
  const { id } = useParams();
  const nav = useNavigate();
  const professor = useDomain(s => s.professores.find(p => p.id === id));
  const [aba, setAba] = useState<'funcional' | 'conta'>('funcional');

  if (!professor) {
    return <EmptyState icon="search_off" title="Professor não encontrado" action={<Button onClick={() => nav('/professores')}>Voltar</Button>} />;
  }

  const pgd = professor.participaPGD ? 'Sim' : 'Não';

  return (
    <div>
      <Breadcrumb items={[{ label: 'Professores', to: '/professores' }, { label: professor.nome }]} />

      <span className="prof-siape mono">SIAPE {professor.siape}</span>
      <h1 style={{ margin: '8px 0 20px' }}>{professor.nome}</h1>

      <div className="prof-grid">
        <div>
          <div className="prof-tabs">
            <button className={aba === 'funcional' ? 'is-active' : ''} onClick={() => setAba('funcional')}>Dados funcionais</button>
            <button className={aba === 'conta' ? 'is-active' : ''} onClick={() => setAba('conta')}>Dados de conta</button>
          </div>

          {aba === 'funcional' ? (
            <Card>
              <dl className="prof-dados">
                <div><dt>Titulação</dt><dd>{professor.titulacao ?? '—'}</dd></div>
                <div><dt>Escolaridade</dt><dd>Ensino superior completo</dd></div>
                <div>
                  <dt>Participa do PGD</dt>
                  <dd className="prof-toggle">
                    <span className={`toggle ${professor.participaPGD ? 'is-on' : ''}`}><span className="toggle__dot" /></span>
                    {pgd}
                  </dd>
                </div>
                <div><dt>E-mail SIAPE</dt><dd className="mono">{professor.email}</dd></div>
              </dl>
            </Card>
          ) : (
            <Card>
              <dl className="prof-dados">
                <div><dt>Nome usual</dt><dd>{professor.nome}</dd></div>
                <div><dt>E-mail institucional</dt><dd>{professor.email}</dd></div>
                <div><dt>E-mail secundário</dt><dd>—</dd></div>
                <div><dt>E-mail SIAPE</dt><dd className="mono">{professor.email}</dd></div>
                <div><dt>E-mail de notificações</dt><dd>{professor.email}</dd></div>
                <div><dt>E-mail do Classroom</dt><dd>—</dd></div>
              </dl>
            </Card>
          )}
        </div>

        <Card title="Telefones" rightAction={<Button variant="link" leftIcon="add">Adicionar</Button>}>
          <dl className="prof-dados">
            <div><dt>Institucional</dt><dd className="mono">(85) 3307-0000</dd></div>
            <div><dt>Pessoal</dt><dd className="mono">(85) 99999-0000</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
