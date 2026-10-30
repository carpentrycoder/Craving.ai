'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  login,
  register,
  warmBackend,
} from '../lib/api';


export default function AuthForm({
  mode,
}) {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [backendReady, setBackendReady] =
    useState(false);

  const router = useRouter();


  useEffect(() => {
    let active = true;

    warmBackend().finally(() => {
      if (active) {
        setBackendReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);


  async function submit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError('');

    const start =
      performance.now();

    try {
      if (mode === 'login') {
        await login(
          email.trim().toLowerCase(),
          password
        );
      } else {
        await register(
          email.trim().toLowerCase(),
          password
        );
      }

      console.info(
        'Authentication completed in',
        `${Math.round(
          performance.now() - start
        )}ms`
      );

      /*
       * Replace avoids returning to login
       * page through browser Back button.
       */
      router.replace('/');
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Authentication failed.'
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="grid min-h-screen place-items-center p-5">

      <form
        onSubmit={submit}
        className="brutal w-full max-w-md bg-white p-7"
      >

        <div className="mb-4 inline-block bg-black px-2 py-1 text-xs font-bold text-[#00ff41]">
          ACCESS_NODE
        </div>


        <h1 className="display mb-6 text-5xl uppercase">
          {mode}
        </h1>


        {!backendReady && (
          <div
            role="status"
            className="mb-4 border-2 border-black bg-[#ffe600] p-2 text-xs font-bold"
          >
            WAKING SECURE SERVICE...
          </div>
        )}


        <label
          htmlFor={`${mode}-email`}
          className="font-bold"
        >
          EMAIL
        </label>


        <input
          id={`${mode}-email`}
          name="email"
          className="field mb-4 mt-1"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="email"
          required
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />


        <label
          htmlFor={`${mode}-password`}
          className="font-bold"
        >
          PASSWORD
        </label>


        <input
          id={`${mode}-password`}
          name="password"
          className="field mb-4 mt-1"
          type="password"
          autoComplete={
            mode === 'login'
              ? 'current-password'
              : 'new-password'
          }
          minLength={8}
          required
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
        />


        {error && (
          <p
            role="alert"
            className="mb-3 border-2 border-black bg-[#ff2a00] p-2 text-white"
          >
            {error}
          </p>
        )}


        <button
          type="submit"
          className="btn w-full bg-[#00ff41]"
          disabled={loading}
          aria-busy={loading}
        >
          {loading
            ? 'AUTHENTICATING...'
            : mode === 'login'
              ? 'LOGIN'
              : 'CREATE ACCOUNT'}
        </button>


        <p className="mt-5 text-sm">
          {mode === 'login' ? (
            <>
              New here?{' '}

              <Link
                className="font-bold underline"
                href="/register"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              Already registered?{' '}

              <Link
                className="font-bold underline"
                href="/login"
              >
                Login
              </Link>
            </>
          )}
        </p>

      </form>
    </main>
  );
}