'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, register } from '../lib/api';

export default function AuthForm({ mode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await (
        mode === 'login'
          ? login(email, password)
          : register(email, password)
      );

      router.push('/');
    } catch (e) {
      setError(e.message);
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

        <label
          htmlFor="email"
          className="font-bold"
        >
          EMAIL
        </label>

        <input
          id="email"
          name="email"
          className="field mb-4 mt-1"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label
          htmlFor="password"
          className="font-bold"
        >
          PASSWORD
        </label>

        <input
          id="password"
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
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="mb-3 border-2 border-black bg-[#ff2a00] p-2 text-white">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn w-full bg-[#00ff41]"
          disabled={loading}
        >
          {loading
            ? 'PROCESSING...'
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