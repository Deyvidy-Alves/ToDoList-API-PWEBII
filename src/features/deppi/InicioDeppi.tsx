import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../shared/components/PageHeader';
import { Card } from '../../shared/components/Card';
import { Icon } from '../../shared/components/Icon';
import { Avatar } from '../../shared/components/Avatar';
import { useSession } from '../auth/session.store';
import { ATALHOS_DEPPI, PENDENTES_ANTIGAS, CURSOS_ANALISE } from '../../shared/data/mocks';
import { dataPorExtenso, primeiroNome } from '../../shared/format';
import './InicioDeppi.css';

export function InicioDeppi() {
  const nav = useNavigate();
  const user = useSession(s => s.user)!;

  return (
    <div>
      <PageHeader title={`Bom dia, ${primeiroNome(user.name)}`} subtitle={dataPorExtenso()} />

      <div className="atalhos">
        {ATALHOS_DEPPI.map(a => (
          <button key={a.label} className="atalho" onClick={() => nav(a.to)}>
            <Icon name={a.icon} size={24} color="var(--accent)" />
            <span className="atalho__title">{a.label}</span>
            <span className="atalho__sub">{a.sub}</span>
          </button>
        ))}
      </div>

      <div className="deppi-grid">
        <Card title="Pendentes mais antigas" rightAction={<a onClick={() => nav('/inscricoes')} style={{ cursor: 'pointer' }}>Ver todas</a>}>
          <div className="lista">
            {PENDENTES_ANTIGAS.map(p => (
              <div key={p.nome} className="lista__row">
                <Avatar initials={p.iniciais} size={32} />
                <div className="lista__main">
                  <span className="lista__name">{p.nome}</span>
                  <span className="lista__meta">{p.curso}</span>
                </div>
                <span className="lista__aside">{p.dias}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Cursos em análise" rightAction={<a onClick={() => nav('/cursos')} style={{ cursor: 'pointer' }}>Ver todos</a>}>
          <div className="lista">
            {CURSOS_ANALISE.map(c => (
              <div key={c.nome} className="lista__row">
                <div className="lista__main">
                  <span className="lista__name">{c.nome}</span>
                  <span className="lista__meta">{c.campus}</span>
                </div>
                <span className="pill">{c.carga}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
