import { useState } from 'react';
import { PageHeader } from '../../shared/components/PageHeader';
import { SearchInput } from '../../shared/components/SearchInput';
import { Table } from '../../shared/components/Table';
import type { Column } from '../../shared/components/Table';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { Input } from '../../shared/components/Input';
import { Icon } from '../../shared/components/Icon';
import { useDomain } from '../../shared/data/domain.store';
import type { Instituicao } from '../../shared/data/domain.store';
import { mascaraCnpj } from '../../shared/format';

type FormState = { nome: string; campus: string; cidade: string; cnpj: string };
const VAZIO: FormState = { nome: 'IFCE', campus: '', cidade: '', cnpj: '' };

export function InstituicoesPage() {
  const instituicoes = useDomain(s => s.instituicoes);
  const addInstituicao = useDomain(s => s.addInstituicao);
  const updateInstituicao = useDomain(s => s.updateInstituicao);
  const removeInstituicao = useDomain(s => s.removeInstituicao);

  const [busca, setBusca] = useState('');
  const [form, setForm] = useState<FormState | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [excluir, setExcluir] = useState<Instituicao | null>(null);
  const [tentouSalvar, setTentouSalvar] = useState(false);

  const filtradas = instituicoes.filter(i => {
    const alvo = `${i.nome} ${i.campus} ${i.cidade}`.toLowerCase();
    return alvo.includes(busca.toLowerCase());
  });

  const cnpjDigitos = form?.cnpj.replace(/\D/g, '') ?? '';
  const cnpjErro = tentouSalvar && cnpjDigitos.length !== 14
    ? 'CNPJ incompleto — informe os 14 dígitos.'
    : undefined;

  function abrirNova() {
    setForm({ ...VAZIO });
    setEditId(null);
    setTentouSalvar(false);
  }

  function abrirEdicao(i: Instituicao) {
    setForm({ nome: i.nome, campus: i.campus, cidade: i.cidade, cnpj: i.cnpj });
    setEditId(i.id);
    setTentouSalvar(false);
  }

  function salvar() {
    if (!form) return;
    setTentouSalvar(true);
    if (form.cnpj.replace(/\D/g, '').length !== 14) return;
    if (editId) updateInstituicao(editId, form);
    else addInstituicao(form);
    setForm(null);
  }

  const colunas: Column<Instituicao>[] = [
    { header: 'Nome', cell: i => i.nome },
    { header: 'Campus', cell: i => i.campus },
    { header: 'Cidade', cell: i => i.cidade },
    { header: 'CNPJ', cell: i => <span className="mono">{i.cnpj}</span> },
    {
      header: 'Ações',
      align: 'right',
      cell: i => (
        <div className="row-actions">
          <button onClick={() => abrirEdicao(i)} aria-label="Editar"><Icon name="edit" size={18} color="var(--accent)" /></button>
          <button onClick={() => setExcluir(i)} aria-label="Excluir"><Icon name="delete" size={18} color="var(--status-denied)" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Instituições"
        subtitle={`${instituicoes.length} instituições cadastradas`}
        action={<Button leftIcon="add" onClick={abrirNova}>Nova instituição</Button>}
      />

      <div style={{ marginBottom: 16, maxWidth: 420 }}>
        <SearchInput placeholder="Buscar por nome, campus ou cidade" value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      <Table columns={colunas} rows={filtradas} rowKey={i => i.id} />

      {form && (
        <Modal
          title={editId ? 'Editar instituição' : 'Nova instituição'}
          onClose={() => setForm(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setForm(null)}>Cancelar</Button>
              <Button leftIcon={editId ? 'check' : 'add'} onClick={salvar}>
                {editId ? 'Salvar alterações' : 'Cadastrar instituição'}
              </Button>
            </>
          }
        >
          <div className="form-stack">
            <Input label="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            <Input label="Campus" value={form.campus} onChange={e => setForm({ ...form, campus: e.target.value })} placeholder="Campus Fortaleza" />
            <Input label="Cidade" value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} placeholder="Fortaleza/CE" />
            <Input
              label="CNPJ"
              value={form.cnpj}
              onChange={e => setForm({ ...form, cnpj: mascaraCnpj(e.target.value) })}
              error={cnpjErro}
              placeholder="00.000.000/0000-00"
              mono
            />
          </div>
        </Modal>
      )}

      {excluir && (
        <Modal
          title="Excluir instituição"
          onClose={() => setExcluir(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setExcluir(null)}>Voltar</Button>
              <Button variant="danger" leftIcon="delete" onClick={() => { removeInstituicao(excluir.id); setExcluir(null); }}>
                Excluir instituição
              </Button>
            </>
          }
        >
          <p><strong>{excluir.nome} · {excluir.campus}</strong> será removida. Esta ação não pode ser desfeita.</p>
        </Modal>
      )}
    </div>
  );
}
