import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/*
 * Vercel request Mumbai region mein execute karne ki preference.
 * Agar deployment plan/region configuration support karega,
 * Vercel is preference ko use karega.
 */
export const preferredRegion = 'bom1';

const BACKEND_URL = process.env.NEXT_API_BASE_URL;

const ACCESS_COOKIE = 'cs_access_token';
const REFRESH_COOKIE = 'cs_refresh_token';

const ACCESS_MAX_AGE = 30 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;


function getBackendUrl(path, search = '') {
  const base = BACKEND_URL.replace(/\/$/, '');

  return `${base}/${path.join('/')}${search}`;
}


function setAuthCookies(response, tokens) {
  const secure =
    process.env.NODE_ENV === 'production';

  response.cookies.set(
    ACCESS_COOKIE,
    tokens.accessToken,
    {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_MAX_AGE,
    }
  );

  response.cookies.set(
    REFRESH_COOKIE,
    tokens.refreshToken,
    {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_MAX_AGE,
    }
  );
}


function clearAuthCookies(response) {
  const secure =
    process.env.NODE_ENV === 'production';

  response.cookies.set(
    ACCESS_COOKIE,
    '',
    {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    }
  );

  response.cookies.set(
    REFRESH_COOKIE,
    '',
    {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    }
  );
}


function createBackendHeaders(
  request,
  accessToken
) {
  const headers = new Headers();

  const contentType =
    request.headers.get('content-type');

  const accept =
    request.headers.get('accept');

  const requestId =
    request.headers.get('x-request-id');

  if (contentType) {
    headers.set(
      'content-type',
      contentType
    );
  }

  if (accept) {
    headers.set('accept', accept);
  }

  if (requestId) {
    headers.set(
      'x-request-id',
      requestId
    );
  }

  if (accessToken) {
    headers.set(
      'authorization',
      `Bearer ${accessToken}`
    );
  }

  return headers;
}


function validateSameOrigin(request) {
  if (
    ['GET', 'HEAD', 'OPTIONS'].includes(
      request.method
    )
  ) {
    return true;
  }

  const origin =
    request.headers.get('origin');

  if (!origin) {
    return true;
  }

  const requestOrigin =
    new URL(request.url).origin;

  return origin === requestOrigin;
}


async function refreshTokens(
  refreshToken
) {
  if (!refreshToken) {
    return null;
  }

  const refreshUrl =
    `${BACKEND_URL.replace(/\/$/, '')}` +
    '/api/v1/auth/refresh';

  const response = await fetch(
    refreshUrl,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        refreshToken,
      }),

      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}


async function proxyRequest(
  request,
  context
) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      {
        error: {
          code:
            'BACKEND_NOT_CONFIGURED',

          message:
            'Backend service is not configured.',
        },
      },
      { status: 500 }
    );
  }

  if (!validateSameOrigin(request)) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_ORIGIN',
          message:
            'Request origin is not allowed.',
        },
      },
      { status: 403 }
    );
  }

  const { path } = await context.params;

  if (!path?.length) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_BACKEND_PATH',
          message:
            'A backend path is required.',
        },
      },
      { status: 400 }
    );
  }

  const incomingUrl =
    new URL(request.url);

  const backendPath =
    path.join('/');

  const targetUrl =
    getBackendUrl(
      path,
      incomingUrl.search
    );

  const isLogin =
    backendPath ===
    'api/v1/auth/login';

  const isRegister =
    backendPath ===
    'api/v1/auth/register';

  const isLogout =
    backendPath ===
    'api/v1/auth/logout';

  const accessToken =
    request.cookies.get(
      ACCESS_COOKIE
    )?.value;

  const refreshToken =
    request.cookies.get(
      REFRESH_COOKIE
    )?.value;

  const headers =
    createBackendHeaders(
      request,
      accessToken
    );

  let body;

  if (
    !['GET', 'HEAD'].includes(
      request.method
    )
  ) {
    if (isLogout) {
      body = JSON.stringify({
        refreshToken:
          refreshToken || '',
      });

      headers.set(
        'content-type',
        'application/json'
      );
    } else {
      body =
        await request.arrayBuffer();
    }
  }

  try {
    let backendResponse =
      await fetch(targetUrl, {
        method: request.method,
        headers,
        body,
        cache: 'no-store',
        redirect: 'manual',
      });

    let refreshedTokens = null;

    /*
     * Protected request par access token
     * expire hone par refresh and retry.
     */
    if (
      backendResponse.status === 401 &&
      !isLogin &&
      !isRegister &&
      !isLogout &&
      refreshToken
    ) {
      refreshedTokens =
        await refreshTokens(
          refreshToken
        );

      if (refreshedTokens) {
        headers.set(
          'authorization',
          `Bearer ${refreshedTokens.accessToken}`
        );

        backendResponse =
          await fetch(targetUrl, {
            method: request.method,
            headers,
            body,
            cache: 'no-store',
            redirect: 'manual',
          });
      }
    }

    /*
     * Login/register token response ko
     * browser JavaScript ko return nahi karna.
     */
    if (
      backendResponse.ok &&
      (isLogin || isRegister)
    ) {
      const tokens =
        await backendResponse.json();

      const response =
        NextResponse.json({
          authenticated: true,
        });

      setAuthCookies(
        response,
        tokens
      );

      return response;
    }

    /*
     * Backend ko refresh token bhejkar
     * current refresh token revoke karna.
     */
    if (
      backendResponse.ok &&
      isLogout
    ) {
      const response =
        new NextResponse(null, {
          status: 204,
        });

      clearAuthCookies(response);

      return response;
    }

    const responseBody =
      await backendResponse.arrayBuffer();

    const responseHeaders =
      new Headers();

    const backendContentType =
      backendResponse.headers.get(
        'content-type'
      );

    const requestId =
      backendResponse.headers.get(
        'x-request-id'
      );

    if (backendContentType) {
      responseHeaders.set(
        'content-type',
        backendContentType
      );
    }

    if (requestId) {
      responseHeaders.set(
        'x-request-id',
        requestId
      );
    }

    const response =
      new NextResponse(
        responseBody,
        {
          status:
            backendResponse.status,

          headers:
            responseHeaders,
        }
      );

    if (refreshedTokens) {
      setAuthCookies(
        response,
        refreshedTokens
      );
    }

    if (
      backendResponse.status === 401
    ) {
      clearAuthCookies(response);
    }

    return response;
  } catch (error) {
    /*
     * Password, token, body, URL credentials
     * log nahi karne hain.
     */
    console.error(
      'Backend proxy request failed:',
      error instanceof Error
        ? error.message
        : 'Unknown backend error'
    );

    return NextResponse.json(
      {
        error: {
          code:
            'BACKEND_UNAVAILABLE',

          message:
            'The backend service is currently unavailable.',
        },
      },
      { status: 502 }
    );
  }
}


export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;