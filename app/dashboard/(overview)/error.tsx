'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {}, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">¡Algo salio mal!</h2>
      <button
        className="mt-4 rounded-md bg-500 px-4 py-2 text-sm text-white transition-colors hover:bg-100 hover:text-500"
        onClick={() => reset()}
      >
        Intenta de nuevo
      </button>
    </main>
  );
}
