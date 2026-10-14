import { useState } from 'react';
import { PageHeader } from '../../shared/components/PageHeader';
import { Card } from '../../shared/components/Card';
import { Avatar } from '../../shared/components/Avatar';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { useSession } from '../auth/session.store';
import { dataCurta } from '../../shared/format';
import './PerfilPage.css';

export function PerfilPage() {
  const user = useSession(s => s.user)!;
  const login = useSession(s => s.login);
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [senha, setSenha] = useState('');

  const senhaCurta = senha.length > 0 && senha.length < 8;

  function salvar() {
    login({ ...user, name: nome, email });
    setEditando(false);
  }

  return (
    <div>
      <PageHeader title="Perfil" subtitle="Seus dados e sua senha de acesso." />

      <div className="perfil-grid">
        <Card>
          <div className="perfil-top">
            <Avatar initials={user.initials} size={56} />
            <div className="perfil-top__info">
              {editando ? (
                <div className="form-stack" style={{ maxWidth: 320 }}>
                  <Input label="Nome" value={nome} onChange={e => setNome(e.target.value)} />
                  <Input label="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              ) : (
                <>
                  <p className="perfil-nome">{user.name}</p>
                  <p className="perfil-email">{user.email}</p>
                </>
              )}
            </div>
          </div>

          <div className="perfil-meta">
            <span className="cargo-chip mono">{user.role}</span>
            {user.siape && <span className="mono">SIAPE {user.siape}</span>}
            {user.matricula && <span className="mono">Matrícula {user.matricula}</span>}
            {user.criadoEm && <span className="perfil-meta__muted">Conta criada em {dataCurta(user.criadoEm)}</span>}
          </div>

          <div className="perfil-actions">
            {editando
              ? <><Button variant="secondary" onClick={() => setEditando(false)}>Cancelar</Button><Button leftIcon="check" onClick={salvar}>Salvar</Button></>
              : <Button variant="secondary" leftIcon="edit" onClick={() => setEditando(true)}>Editar perfil</Button>}
          </div>
        </Card>

        <Card title="Trocar senha">
          <div className="form-stack">
            <Input
              label="Nova senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              hint={senhaCurta ? undefined : 'Mínimo de 8 caracteres.'}
              error={senhaCurta ? 'Mínimo de 8 caracteres.' : undefined}
              placeholder="••••••••"
            />
            <div>
              <Button disabled={senha.length < 8} onClick={() => { alert('Senha trocada (mock).'); setSenha(''); }}>Trocar senha</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
