'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearTokens } from '../lib/api';

export default function Nav() {
  const r = useRouter();

  return (
    <>
      <div className="ticker">
        [ SYSTEM :: ONLINE ] /// CRAVING ENGINE :: READY /// SWAP → SAVE → TRACK ///
        GENERAL WELLNESS, NOT MEDICAL ADVICE ///
      </div>

      <header className="border-b-4 border-black bg-[#f0eee6] p-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">

          <Link
            className="display bg-black px-3 py-2 text-3xl !text-white"
            href="/"
          >
            CRAVINGSWAP
            <span className="!text-[#00ff41]">.AI</span>
          </Link>

          <nav className="flex flex-wrap gap-2 text-xs">
            <Link className="btn bg-white" href="/">
              SWAP
            </Link>

            <Link className="btn bg-white" href="/dashboard">
              DASHBOARD
            </Link>

            <Link className="btn bg-white" href="/history">
              HISTORY
            </Link>

            <Link className="btn bg-white" href="/profile">
              PROFILE
            </Link>

            <button
              className="btn bg-[#ff2a00] text-white"
              onClick={() => {
                clearTokens();
                r.push('/login');
              }}
            >
              LOGOUT
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}