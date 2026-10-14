import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../shared/components/Input';
import { Select } from '../../shared/components/Select';
import { Button } from '../../shared/components/Button';
import { PASSOS_CADASTRO } from '../../shared/data/mocks';
import { mascaraCpf, cpfValido } from '../../shared/format';
import './CadastroPage.css';

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

export function CadastroPage() {
  const nav = useNavigate();
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [orgao, setOrgao] = useState('');
  const [uf, setUf] = useState('');
  const [emissao, setEmissao] = useState('');

  const cpfErro = cpf.length > 0 && !cpfValido(cpf)
    ? 'CPF inválido — confira os dígitos verificadores.'
    : undefined;

  return (
    <div className="cadastro">
      <div className="cadastro__steps">
        {PASSOS_CADASTRO.map(p => (
          <div key={p.numero} className={`cadastro__step cadastro__step--${p.estado}`}>
            <span className="cadastro__step-num">{p.estado === 'done' ? '✓' : p.numero}</span>
            <span className="cadastro__step-label">{p.label}</span>
          </div>
        ))}
      </div>

      <h2>Documento</h2>
      <p className="cadastro__sub">Informe os dados do seu documento de identidade.</p>

      <div className="cadastro__form">
        <Input label="RG" value={rg} onChange={e => setRg(e.target.value)} placeholder="0000000" />
        <Input
          label="CPF"
          value={cpf}
          onChange={e => setCpf(mascaraCpf(e.target.value))}
          error={cpfErro}
          placeholder="000.000.000-00"
          mono
        />
        <Input label="Órgão emissor" value={orgao} onChange={e => setOrgao(e.target.value)} placeholder="SSP" />
        <Select label="Estado emissor" value={uf} onChange={e => setUf(e.target.value)}>
          <option value="">Selecione</option>
          {UFS.map(u => <option key={u} value={u}>{u}</option>)}
        </Select>
        <Input label="Data de emissão" type="date" value={emissao} onChange={e => setEmissao(e.target.value)} />
      </div>

      <div className="cadastro__actions">
        <Button variant="secondary" onClick={() => nav('/login')}>Voltar</Button>
        <Button onClick={() => alert('Cadastro mockado — próxima entrega')}>Continuar</Button>
      </div>
    </div>
  );
}
