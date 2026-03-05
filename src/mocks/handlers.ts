import { http, HttpResponse } from 'msw'

const BASE_URL = 'http://localhost:3000/api'

export const handlers = [
  // Auth
  http.post(`${BASE_URL}/v1/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    if (body.email === 'user@test.com' && body.password === 'password123') {
      return HttpResponse.json(
        {
          token: 'test-jwt-token',
          user: {
            id: '1',
            firstName: 'Ivan',
            lastName: 'Ivanov',
            email: 'user@test.com',
            avatarUrl: null,
            dateOfBirth: null,
            createdAt: '2026-01-01T00:00:00Z',
          },
        },
        { status: 200 },
      )
    }
    return HttpResponse.json(
      { status: 401, message: 'Invalid credentials', error: 'Unauthorized' },
      { status: 401 },
    )
  }),

  http.post(`${BASE_URL}/v1/auth/register`, async () => {
    return HttpResponse.json(
      {
        token: 'test-jwt-token',
        user: {
          id: '2',
          firstName: 'New',
          lastName: 'User',
          email: 'new@test.com',
          avatarUrl: null,
          dateOfBirth: null,
          createdAt: '2026-03-04T00:00:00Z',
        },
      },
      { status: 201 },
    )
  }),

  // Classes
  http.get(`${BASE_URL}/v1/classes`, () => {
    return HttpResponse.json([
      {
        id: 'cls-1',
        name: 'Math 101',
        code: 'ABCD1234',
        myRole: 'STUDENT',
        memberCount: 20,
        createdAt: '2026-01-15T00:00:00Z',
      },
      {
        id: 'cls-2',
        name: 'Physics 201',
        code: 'EFGH5678',
        myRole: 'OWNER',
        memberCount: 15,
        createdAt: '2026-02-01T00:00:00Z',
      },
    ])
  }),

  http.get(`${BASE_URL}/v1/classes/:classId`, ({ params }) => {
    const { classId } = params
    return HttpResponse.json({
      id: classId,
      name: 'Math 101',
      code: 'ABCD1234',
      myRole: 'OWNER',
      memberCount: 20,
      createdAt: '2026-01-15T00:00:00Z',
    })
  }),

  http.get(`${BASE_URL}/v1/classes/:classId/members`, () => {
    return HttpResponse.json([
      {
        id: 'mem-1',
        userId: '1',
        firstName: 'Ivan',
        lastName: 'Ivanov',
        email: 'ivan@test.com',
        avatarUrl: null,
        role: 'OWNER',
        joinedAt: '2026-01-15T00:00:00Z',
      },
      {
        id: 'mem-2',
        userId: '2',
        firstName: 'Petr',
        lastName: 'Petrov',
        email: 'petr@test.com',
        avatarUrl: null,
        role: 'STUDENT',
        joinedAt: '2026-02-01T00:00:00Z',
      },
    ])
  }),

  http.put(`${BASE_URL}/v1/classes/:classId/members/:memberId/role`, async ({ params }) => {
    return HttpResponse.json({
      id: params.memberId,
      userId: '2',
      firstName: 'Petr',
      lastName: 'Petrov',
      email: 'petr@test.com',
      avatarUrl: null,
      role: 'TEACHER',
      joinedAt: '2026-02-01T00:00:00Z',
    })
  }),

  http.delete(`${BASE_URL}/v1/classes/:classId/members/:memberId`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${BASE_URL}/v1/classes`, async () => {
    return HttpResponse.json(
      {
        id: 'cls-3',
        name: 'New Class',
        code: 'NEWC0001',
        myRole: 'OWNER',
        memberCount: 1,
        createdAt: '2026-03-04T00:00:00Z',
      },
      { status: 201 },
    )
  }),

  http.post(`${BASE_URL}/v1/classes/join`, async () => {
    return HttpResponse.json({
      id: 'cls-1',
      name: 'Math 101',
      code: 'ABCD1234',
      myRole: 'STUDENT',
      memberCount: 21,
      createdAt: '2026-01-15T00:00:00Z',
    })
  }),

  // Assignments
  http.get(`${BASE_URL}/v1/classes/:classId/assignments`, () => {
    return HttpResponse.json([
      {
        id: 'asgn-1',
        title: 'Homework 1',
        description: 'First homework',
        createdBy: '1',
        createdAt: '2026-02-10T00:00:00Z',
        submissionStatus: 'NOT_SUBMITTED',
      },
    ])
  }),

  http.post(`${BASE_URL}/v1/classes/:classId/assignments`, async () => {
    return HttpResponse.json(
      {
        id: 'asgn-2',
        title: 'New Assignment',
        description: '',
        createdBy: '1',
        createdAt: '2026-03-04T00:00:00Z',
      },
      { status: 201 },
    )
  }),

  // Submissions
  http.get(`${BASE_URL}/v1/assignments/:assignmentId/submissions`, () => {
    return HttpResponse.json([
      {
        id: 'sub-1',
        studentId: '3',
        studentName: 'Student One',
        answerText: 'My answer',
        fileUrl: null,
        grade: null,
        submittedAt: '2026-03-01T00:00:00Z',
        gradedAt: null,
      },
    ])
  }),

  http.get(`${BASE_URL}/v1/assignments/:assignmentId/submissions/my`, () => {
    return HttpResponse.json({
      id: 'sub-2',
      studentId: '1',
      studentName: 'Ivan Ivanov',
      answerText: 'My submission',
      fileUrl: null,
      grade: 85,
      submittedAt: '2026-03-01T00:00:00Z',
      gradedAt: '2026-03-02T00:00:00Z',
    })
  }),

  // Comments
  http.get(`${BASE_URL}/v1/assignments/:assignmentId/comments`, () => {
    return HttpResponse.json([
      {
        id: 'cmt-1',
        authorId: '1',
        authorName: 'Ivan Ivanov',
        authorAvatarUrl: null,
        text: 'Test comment',
        createdAt: '2026-03-01T12:00:00Z',
      },
    ])
  }),

  http.post(`${BASE_URL}/v1/assignments/:assignmentId/comments`, async () => {
    return HttpResponse.json(
      {
        id: 'cmt-2',
        authorId: '1',
        authorName: 'Ivan Ivanov',
        authorAvatarUrl: null,
        text: 'New comment',
        createdAt: '2026-03-04T12:00:00Z',
      },
      { status: 201 },
    )
  }),

  // Users
  http.get(`${BASE_URL}/v1/users/me`, () => {
    return HttpResponse.json({
      id: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      email: 'user@test.com',
      avatarUrl: null,
      dateOfBirth: '2000-01-01',
      createdAt: '2026-01-01T00:00:00Z',
    })
  }),

  http.put(`${BASE_URL}/v1/users/me`, async () => {
    return HttpResponse.json({
      id: '1',
      firstName: 'Updated',
      lastName: 'User',
      email: 'user@test.com',
      avatarUrl: null,
      dateOfBirth: '2000-01-01',
      createdAt: '2026-01-01T00:00:00Z',
    })
  }),
]
