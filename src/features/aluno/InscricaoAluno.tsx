import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../shared/components/Breadcrumb';
import { Card } from '../../shared/components/Card';
import { Input } from '../../shared/components/Input';
import { Select } from '../../shared/components/Select';
import { Button } from '../../shared/components/Button';
import { Banner } from '../../shared/components/Banner';
import { Icon } from '../../shared/components/Icon';
import { StatusChip } from '../../shared/components/StatusChip';
import { EmptyState } from '../../shared/components/EmptyState';
import { useDomain } from '../../shared/data/domain.store';
import { CHECKLIST_DOCS, DOCS_ALUNO } from '../../shared/data/mocks';
import { moeda, dataCurta } from '../../shared/format';
import './InscricaoAluno.css';

const CATEGORIAS = ['RG', 'CPF', 'Comprovante de residência', 'Comprovante de renda', 'Histórico escolar', 'Outro'];

export function InscricaoAluno() {
  const { id } = useParams();
  const nav = useNavigate();
  const inscricao = useDomain(s => s.inscricoes.find(i => i.id === id));

  const [renda, setRenda] = useState('');
  const [pessoas, setPessoas] = useState(1);

  if (!inscricao) {
    return <EmptyState icon="search_off" title="Inscrição não encontrada" action={<Button onClick={() => nav('/minhas-inscricoes')}>Voltar</Button>} />;
  }

  const rendaNum = Number(renda.replace(/\D/g, '')) / 100;
  const perCapita = pessoas > 0 ? rendaNum / pessoas : 0;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Minhas inscrições', to: '/minhas-inscricoes' }, { label: inscricao.cursoNome }]} />
      <p className="insc-aluno__id mono">Inscrição #{inscricao.id.slice(0, 8)}</p>
      <h1 style={{ margin: '4px 0 16px' }}>{inscricao.cursoNome}</h1>

      <div style={{ marginBottom: 20 }}>
        <Banner>P2 · Enquanto a API não expõe suas inscrições, a situação abaixo pode não aparecer. Documentos e renda ficam neste navegador.</Banner>
      </div>

      <div className="insc-aluno">
        <div className="insc-aluno__col">
          <Card title="Situação">
            <div style={{ marginBottom: 16 }}><StatusChip status={inscricao.status} /></div>
            <div className="timeline">
              <div className="timeline__step">
                <span className="timeline__dot is-done" />
                <div>
                  <p className="timeline__title">Inscrição realizada</p>
                  <p className="timeline__sub">{dataCurta(inscricao.data)}</p>
                </div>
              </div>
              <div className="timeline__step">
                <span className="timeline__dot" />
                <div>
                  <p className="timeline__title">Análise do DEPPI</p>
                  <p className="timeline__sub">Aguardando documentos e renda</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Renda familiar">
            <div className="form-stack">
              <Input
                label="Renda mensal da família"
                value={renda ? moeda(rendaNum) : ''}
                onChange={e => setRenda(e.target.value)}
                placeholder="R$ 0,00"
              />
              <div>
                <span className="field__label">Pessoas na casa</span>
                <div className="stepper">
                  <button onClick={() => setPessoas(p => Math.max(1, p - 1))} aria-label="Menos"><Icon name="remove" size={18} /></button>
                  <span className="mono">{pessoas}</span>
                  <button onClick={() => setPessoas(p => p + 1)} aria-label="Mais"><Icon name="add" size={18} /></button>
                </div>
              </div>
              <div className="per-capita">
                <span>Renda per capita</span>
                <strong className="mono">{moeda(perCapita)}</strong>
              </div>
              <Button>Salvar renda</Button>
            </div>
          </Card>
        </div>

        <div className="insc-aluno__col">
          <Card title="Documentos">
            <div className="checklist">
              {CHECKLIST_DOCS.map(c => (
                <div key={c.label} className={`check ${c.ok ? 'is-ok' : ''}`}>
                  <Icon name={c.ok ? 'check_circle' : 'radio_button_unchecked'} size={18} color={c.ok ? 'var(--status-deferred)' : 'var(--text-muted)'} />
                  {c.label}{c.opcional ? ' (opcional)' : ''}
                </div>
              ))}
            </div>

            <div className="upload">
              <Icon name="cloud_upload" size={44} color="var(--text-muted)" />
              <p className="upload__title">Arraste o arquivo aqui ou clique</p>
              <p className="upload__hint">PDF, JPG ou PNG · até 5 MB</p>
            </div>

            <div style={{ marginTop: 14 }}>
              <Select label="Categoria (opcional)">
                <option value="">Selecione</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>

            <div className="docs" style={{ marginTop: 16 }}>
              {DOCS_ALUNO.map(doc => (
                <div key={doc.nome} className="docs__row">
                  <Icon name={doc.icon} size={22} color="var(--text-muted)" />
                  <div className="docs__main">
                    <span className="docs__nome mono">{doc.nome}</span>
                    <span className="docs__cat">{doc.categoria}</span>
                  </div>
                  <span className="docs__tam mono">{doc.data}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
