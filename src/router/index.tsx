import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Lazy-loaded pages
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const ClassListPage = lazy(() => import('@/pages/ClassListPage'))
const ClassDetailPage = lazy(() => import('@/pages/ClassDetailPage'))
const ClassSettingsPage = lazy(() => import('@/pages/ClassSettingsPage'))
const MembersPage = lazy(() => import('@/pages/MembersPage'))
const MemberProfilePage = lazy(() => import('@/pages/MemberProfilePage'))
const AssignmentDetailPage = lazy(() => import('@/pages/AssignmentDetailPage'))
const SubmissionDetailPage = lazy(() => import('@/pages/SubmissionDetailPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const JoinPage = lazy(() => import('@/pages/JoinPage'))

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/classes" replace />,
  },

  // Public-only routes (redirect to /classes if authenticated)
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: (
              <LazyPage>
                <LoginPage />
              </LazyPage>
            ),
          },
          {
            path: '/register',
            element: (
              <LazyPage>
                <RegisterPage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },

  // Protected routes (redirect to /login if not authenticated)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/classes',
            element: (
              <LazyPage>
                <ClassListPage />
              </LazyPage>
            ),
          },
          {
            path: '/classes/:classId',
            element: (
              <LazyPage>
                <ClassDetailPage />
              </LazyPage>
            ),
          },
          {
            path: '/classes/:classId/settings',
            element: (
              <LazyPage>
                <ClassSettingsPage />
              </LazyPage>
            ),
          },
          {
            path: '/classes/:classId/members',
            element: (
              <LazyPage>
                <MembersPage />
              </LazyPage>
            ),
          },
          {
            path: '/classes/:classId/members/:memberId',
            element: (
              <LazyPage>
                <MemberProfilePage />
              </LazyPage>
            ),
          },
          {
            path: '/classes/:classId/assignments/:assignmentId',
            element: (
              <LazyPage>
                <AssignmentDetailPage />
              </LazyPage>
            ),
          },
          {
            path: '/submissions/:submissionId',
            element: (
              <LazyPage>
                <SubmissionDetailPage />
              </LazyPage>
            ),
          },
          {
            path: '/profile',
            element: (
              <LazyPage>
                <ProfilePage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },

  // Join page (works both authenticated and not)
  {
    path: '/join',
    element: (
      <LazyPage>
        <JoinPage />
      </LazyPage>
    ),
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
