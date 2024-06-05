import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteAssignmentsTeacherSubject } from '@/app/lib/actions';

export function CreateAssignmentsTeacherSubject() {
  return (
    <Link
      href="/dashboard/assignments/teacherSubject/create"
      className="flex h-10 items-center rounded-lg bg-500 px-4 text-sm font-medium text-white transition-colors hover:bg-100 hover:text-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear Asignación</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateAssignmentsTeacherSubject({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/assignments/teacherSubject/${id}/edit`}
      className="rounded-md border p-2 hover:bg-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteAssignmentsTeacherSubject({ id }: { id: string }) {
  const deleteAssignmentsTeacherSubjectWithId =
    deleteAssignmentsTeacherSubject.bind(null, id);
  return (
    <form action={deleteAssignmentsTeacherSubjectWithId}>
      <button className="rounded-md border p-2 hover:bg-100">
        <span className="sr-only">Eliminar</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
