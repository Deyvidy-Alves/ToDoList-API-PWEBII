# DEPPI-WEB

Portal de cursos de extensão do IFCE. Frontend em React + TypeScript, com dados mockados em memória (sem backend). Entrega 1 da disciplina de Programação Web II.

## Rodar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

## Login de teste

Sessão e login são fake. Os usuários ficam em `src/features/auth/mock-users.ts`.

| Cargo     | E-mail                        | Senha    |
|-----------|-------------------------------|----------|
| ADMIN     | admin@deppi.local             | admin123 |
| DEPPI     | marcia.holanda@ifce.edu.br    | deppi123 |
| PROFESSOR | paulo.viana@ifce.edu.br       | prof123  |
| ALUNO     | ana.rocha@aluno.ifce.edu.br   | aluno123 |

A sessão é guardada em localStorage. Os dados de domínio vivem num store Zustand em memória e são resetados ao recarregar a página.

## Organização

- `src/app` — router.
- `src/features` — telas por cargo (auth, admin, deppi, professor, aluno, perfil).
- `src/shared` — componentes, layout, guards, store de domínio e mocks.
- `docs/PROMPT.md` — especificação usada na construção.

A tabela de capacidades em `src/shared/routes.ts` é a fonte única para sidebar, guards e redirects.
