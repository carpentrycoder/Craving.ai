import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_API_BASE_URL;

async function proxyRequest(request, context) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      {
        error: {
          code: "BACKEND_NOT_CONFIGURED",
          message: "Backend service is not configured.",
        },
      },
      { status: 500 }
    );
  }

  const { path } = await context.params;

  const incomingUrl = new URL(request.url);
  const backendPath = path.join("/");

  const targetUrl = new URL(
    `${BACKEND_URL.replace(/\/$/, "")}/${backendPath}`
  );

  targetUrl.search = incomingUrl.search;

  const headers = new Headers();

  const contentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");
  const accept = request.headers.get("accept");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (authorization) {
    headers.set("authorization", authorization);
  }

  if (accept) {
    headers.set("accept", accept);
  }

  let body;

  if (!["GET", "HEAD"].includes(request.method)) {
    body = await request.arrayBuffer();
  }

  try {
    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });

    const responseBody = await backendResponse.arrayBuffer();

    const responseHeaders = new Headers();

    const backendContentType =
      backendResponse.headers.get("content-type");

    if (backendContentType) {
      responseHeaders.set("content-type", backendContentType);
    }

    const requestId =
      backendResponse.headers.get("x-request-id");

    if (requestId) {
      responseHeaders.set("x-request-id", requestId);
    }

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "BACKEND_UNAVAILABLE",
          message: "The backend service is currently unavailable.",
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