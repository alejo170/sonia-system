'use client';

import { Note, Student, Grade } from '@/app/lib/definitions';
import {
  UserCircleIcon,
  BookOpenIcon,
  PencilSquareIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateNote } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function EditNoteForm({
  notes,
}: {
  notes: Note;
  students: Student[];
  grades: Grade[];
}) {
  const initialState = { message: null, errors: {} };
  const updateNoteWithId = updateNote.bind(null, notes.id);
  const [state, dispatch] = useFormState(updateNoteWithId, initialState);
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-50 p-4 md:p-6">
        
        {/* Year */}
        <div className="mb-4">
          <label htmlFor="year" className="mb-2 block text-sm font-medium">
            Año
          </label>
          <div className="relative">
          <span className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
              {notes.year}
            </span>
            <input
              id="year"
              name="year"
              type='hidden'
              defaultValue={notes.year}
            />
                     
            <AcademicCapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Grade Name */}
        <div className="mb-4">
          <label htmlFor="grade" className="mb-2 block text-sm font-medium">
            Grado
          </label>
          <div className="relative">
          <span className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
              {notes.grade_id}
            </span>
            <input
              id="grade"
              name="gradeId"
              type='hidden'
              defaultValue={notes.grade_id}
            />
                     
            <AcademicCapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Subject Name */}
        <div className="mb-4">
          <label htmlFor="subject" className="mb-2 block text-sm font-medium">
            Asignatura
          </label>
          <div className="relative">
            <span className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
              {notes.subject_id}
            </span>
            <input
              id="subject"
              name="subjectId"
              type='hidden'
              defaultValue={notes.subject_id}
            />
            <BookOpenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Student Name */}
        <div className="mb-4">
          <label htmlFor="student" className="mb-2 block text-sm font-medium">
            Estudiante
          </label>
          <div className="relative">
            <span className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
              {notes.user_id}
            </span>
            <input
              id="student"
              name="studentId"
              type="hidden"
              defaultValue={notes.user_id}
              
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          
        </div>

        {/* Nota del primer corte */}
        <div className="mb-4">
          <label htmlFor="period_1" className="mb-2 block text-sm font-medium">
            Corte 1
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="period_1"
                name="period_1"
                type="number"
                step={0.1}
                placeholder="Ingrese la nota del primer corte"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={notes.period_1}
                aria-describedby="period_1-error"
              />
              <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="period_1-error" aria-live="polite" aria-atomic="true">
            {state.errors?.period_1 &&
              state.errors.period_1.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Nota del segundo corte */}
        <div className="mb-4">
          <label htmlFor="period_2" className="mb-2 block text-sm font-medium">
            Corte 2
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="period_2"
                name="period_2"
                type="number"
                step={0.1}
                placeholder="Ingrese la nota del segundo corte"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={notes.period_2}
                aria-describedby="period_2-error"
              />
              <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="period_2-error" aria-live="polite" aria-atomic="true">
            {state.errors?.period_2 &&
              state.errors.period_2.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Id asignacion estudiante */}
        <div className="mb-4">
          
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                name="assignmentStudentId"
                type="hidden"
                defaultValue={notes.id}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              
            </div>
          </div>
        </div>

        {state.message ? (
          <div aria-live="polite" className="my-2 text-sm text-red-500">
            <p>{state.message}</p>
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/notes"
          className="flex h-10 items-center rounded-lg bg-50 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Editar Nota</Button>
      </div>
    </form>
  );
}
