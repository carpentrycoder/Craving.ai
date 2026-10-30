const BASE = '/api/backend';

let warmupPromise = null;


function setSessionMarker() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    'cs_authenticated',
    'true'
  );
}


export function loggedIn() {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    localStorage.getItem(
      'cs_authenticated'
    ) === 'true'
  );
}


export function clearTokens() {
  if (typeof window === 'undefined') {
    return;
  }

  /*
   * Ye sirf non-sensitive UI marker hai.
   * JWT cookies HttpOnly hain.
   */
  localStorage.removeItem(
    'cs_authenticated'
  );

  /*
   * Old architecture ke tokens delete.
   */
  localStorage.removeItem(
    'cs_tokens'
  );
}


async function request(
  path,
  options = {}
) {
  const response = await fetch(
    `${BASE}${path}`,
    {
      ...options,

      headers: {
        'Content-Type':
          'application/json',

        ...(options.headers || {}),
      },

      credentials: 'same-origin',
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    let error = {};

    try {
      error =
        await response.json();
    } catch {
      error = {};
    }

    if (response.status === 401) {
      clearTokens();
    }

    throw new Error(
      error.detail ||
      error?.error?.message ||
      `Request failed (${response.status})`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}


/*
 * Login/register page open hote hi
 * health call backend ko wake karega.
 *
 * Same browser session mein duplicate
 * parallel warm-ups avoid hote hain.
 */
export function warmBackend() {
  if (!warmupPromise) {
    warmupPromise = request(
      '/api/v1/health'
    ).catch(() => null);
  }

  return warmupPromise;
}


export async function register(
  email,
  password
) {
  /*
   * Page load warm-up ongoing ho toh
   * pehle usko complete hone do.
   */
  await warmBackend();

  const result = await request(
    '/api/v1/auth/register',
    {
      method: 'POST',

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  setSessionMarker();

  return result;
}


export async function login(
  email,
  password
) {
  await warmBackend();

  const result = await request(
    '/api/v1/auth/login',
    {
      method: 'POST',

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  setSessionMarker();

  return result;
}


export async function logout() {
  try {
    await request(
      '/api/v1/auth/logout',
      {
        method: 'POST',
        body: JSON.stringify({}),
      }
    );
  } finally {
    clearTokens();
  }
}


export const me = () =>
  request('/api/v1/auth/me');


export const analyze = (body) =>
  request(
    '/api/v1/cravings/analyze',
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );


export const history = (
  page = 1
) =>
  request(
    `/api/v1/cravings?page=${page}&page_size=20`
  );


export const overview = () =>
  request(
    '/api/v1/analytics/overview'
  );


export const patterns = () =>
  request(
    '/api/v1/analytics/craving-patterns'
  );


export const record = (
  id,
  body
) =>
  request(
    `/api/v1/outcomes/sessions/${id}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );


export const getProfile = () =>
  request(
    '/api/v1/users/profile'
  );


export const updateProfile = (
  body
) =>
  request(
    '/api/v1/users/profile',
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    }
  );