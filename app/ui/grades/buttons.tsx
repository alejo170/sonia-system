'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteGrade } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export function CreateGrades() {
  return (
    <Link
      href="/dashboard/grades/create"
      className="flex h-10 items-center rounded-lg bg-500 px-4 text-sm font-medium text-white transition-colors hover:bg-100 hover:text-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear Grados</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateGrades({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/grades/${id}/edit`}
      className="rounded-md border p-2 hover:bg-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteGrades({ id }: { id: string }) {
  const initialState = { message: '', errors: {} };
  const deleteGradeWithId = deleteGrade.bind(null, id);
  const [state, dispatch] = useFormState(deleteGradeWithId, initialState);

  if (state.message) {
    return (
      <span className="rounded-md border p-2 text-red-500">{state.message}</span>
    );
  }

  return (
    <form action={dispatch}>
      <button className="rounded-md border p-2 hover:bg-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
