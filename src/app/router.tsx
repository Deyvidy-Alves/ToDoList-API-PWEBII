import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppShell } from '../shared/layout/AppShell';
import { RequireAuth } from '../shared/guards/RequireAuth';
import { RequireRole } from '../shared/guards/RequireRole';
import { LoginPage } from '../features/auth/LoginPage';
import { CadastroPage } from '../features/auth/CadastroPage';
import { ForbiddenPage } from '../pages/ForbiddenPage';

import { InicioAdmin } from '../features/admin/InicioAdmin';
import { InstituicoesPage } from '../features/admin/InstituicoesPage';
import { UsuariosPage } from '../features/admin/UsuariosPage';
import { RelatoriosPage } from '../features/admin/RelatoriosPage';

import { InicioDeppi } from '../features/deppi/InicioDeppi';
import { CursosDeppi } from '../features/deppi/CursosDeppi';
import { CursoDetalhe } from '../features/deppi/CursoDetalhe';
import { NovoCurso } from '../features/deppi/NovoCurso';
import { InscricoesPage } from '../features/deppi/InscricoesPage';
import { InscricaoDetalhe } from '../features/deppi/InscricaoDetalhe';
import { ProfessoresPage } from '../features/deppi/ProfessoresPage';
import { ProfessorDetalhe } from '../features/deppi/ProfessorDetalhe';
import { NovoProfessor } from '../features/deppi/NovoProfessor';

import { InicioProfessor } from '../features/professor/InicioProfessor';
import { CursosProfessor } from '../features/professor/CursosProfessor';
import { EditarCurso } from '../features/professor/EditarCurso';

import { InicioAluno } from '../features/aluno/InicioAluno';
import { CatalogoCursos } from '../features/aluno/CatalogoCursos';
import { CursoAluno } from '../features/aluno/CursoAluno';
import { MinhasInscricoes } from '../features/aluno/MinhasInscricoes';
import { InscricaoAluno } from '../features/aluno/InscricaoAluno';

import { PerfilPage } from '../features/perfil/PerfilPage';
import { useSession } from '../features/auth/session.store';

function InicioRouter() {
  const user = useSession(s => s.user)!;
  if (user.role === 'ADMIN') return <InicioAdmin />;
  if (user.role === 'DEPPI') return <InicioDeppi />;
  if (user.role === 'PROFESSOR') return <InicioProfessor />;
  return <InicioAluno />;
}

function CursosRouter() {
  const user = useSession(s => s.user)!;
  if (user.role === 'DEPPI' || user.role === 'ADMIN') return <CursosDeppi />;
  if (user.role === 'PROFESSOR') return <CursosProfessor />;
  return <CatalogoCursos />;
}

function CursoDetalheRouter() {
  const user = useSession(s => s.user)!;
  if (user.role === 'ALUNO') return <CursoAluno />;
  return <CursoDetalhe />;
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/cadastro', element: <CadastroPage /> },
  { path: '/403', element: <ForbiddenPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <Navigate to="/inicio" replace /> },
          { path: '/inicio', element: <InicioRouter /> },
          { path: '/cursos', element: <CursosRouter /> },
          { path: '/cursos/novo', element: <RequireRole roles={['DEPPI', 'ADMIN']} />, children: [{ index: true, element: <NovoCurso /> }] },
          { path: '/cursos/:id', element: <CursoDetalheRouter /> },
          { path: '/cursos/:id/editar', element: <RequireRole roles={['PROFESSOR', 'DEPPI', 'ADMIN']} />, children: [{ index: true, element: <EditarCurso /> }] },

          { path: '/instituicoes', element: <RequireRole roles={['ADMIN']} />, children: [{ index: true, element: <InstituicoesPage /> }] },
          { path: '/usuarios', element: <RequireRole roles={['ADMIN']} />, children: [{ index: true, element: <UsuariosPage /> }] },
          { path: '/relatorios', element: <RequireRole roles={['ADMIN']} />, children: [{ index: true, element: <RelatoriosPage /> }] },

          { path: '/inscricoes', element: <RequireRole roles={['DEPPI']} />, children: [{ index: true, element: <InscricoesPage /> }] },
          { path: '/inscricoes/:id', element: <RequireRole roles={['DEPPI']} />, children: [{ index: true, element: <InscricaoDetalhe /> }] },
          { path: '/professores', element: <RequireRole roles={['DEPPI']} />, children: [{ index: true, element: <ProfessoresPage /> }] },
          { path: '/professores/novo', element: <RequireRole roles={['DEPPI']} />, children: [{ index: true, element: <NovoProfessor /> }] },
          { path: '/professores/:id', element: <RequireRole roles={['DEPPI']} />, children: [{ index: true, element: <ProfessorDetalhe /> }] },

          { path: '/minhas-inscricoes', element: <RequireRole roles={['ALUNO']} />, children: [{ index: true, element: <MinhasInscricoes /> }] },
          { path: '/minhas-inscricoes/:id', element: <RequireRole roles={['ALUNO']} />, children: [{ index: true, element: <InscricaoAluno /> }] },

          { path: '/perfil', element: <PerfilPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/403" replace /> },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
