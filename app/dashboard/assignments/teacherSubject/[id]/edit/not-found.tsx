import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">Error 404 No encontrado</h2>
      <p>No se pudo encontrar la asignación docente - asignatura solicitada.</p>
      <Link
        href="/dashboard/assignments"
        className="mt-4 rounded-md bg-500 px-4 py-2 text-sm text-white transition-colors hover:bg-100 hover:text-500"
      >
        Regresar
      </Link>
    </main>
  );
}
