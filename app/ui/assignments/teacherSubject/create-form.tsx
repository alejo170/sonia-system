'use client';

import { Teacher, Subject, Grade } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  UserCircleIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createAssignmentsTeacherSubject } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function Form({
  teachers,
  subjects,
  grades,
}: {
  teachers: Teacher[];
  subjects: Subject[];
  grades: Grade[];
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(
    createAssignmentsTeacherSubject,
    initialState,
  );

  // Generar opciones para los años
  const current_year = new Date().getFullYear();
  const start_year = current_year - 19;
  const years = Array.from(
    { length: current_year - start_year },
    (_, index) => current_year - index,
  );

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-50 p-4 md:p-6">
        {/* Docente */}
        <div className="mb-4">
          <label htmlFor="teacher" className="mb-2 block text-sm font-medium">
            Docente
          </label>
          <div className="relative">
            <select
              id="teacher"
              name="teacherId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="teacher-error"
            >
              <option value="" disabled>
                Seleccione un docente
              </option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} {teacher.lastname}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="teacher-error" aria-live="polite" aria-atomic="true">
            {state.errors?.user_id &&
              state.errors.user_id.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Asignatura */}
        <div className="mb-4">
          <label htmlFor="subject" className="mb-2 block text-sm font-medium">
            Asignatura
          </label>
          <div className="relative">
            <select
              id="subject"
              name="subjectId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="subject-error"
            >
              <option value="" disabled>
                Seleccione una asignatura
              </option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <BookOpenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="subject-error" aria-live="polite" aria-atomic="true">
            {state.errors?.subject_id &&
              state.errors.subject_id.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Grado */}
        <div className="mb-4">
          <label htmlFor="grade" className="mb-2 block text-sm font-medium">
            Grado
          </label>
          <div className="relative">
            <select
              id="grade"
              name="gradeId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="grade-error"
            >
              <option value="" disabled>
                Seleccione un grado
              </option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
            <AcademicCapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="grade-error" aria-live="polite" aria-atomic="true">
            {state.errors?.grade_id &&
              state.errors.grade_id.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Año */}
        <div className="mb-4">
          <label htmlFor="year" className="mb-2 block text-sm font-medium">
            Año
          </label>
          <div className="relative">
            <select
              id="year"
              name="year"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="year-error"
            >
              <option value="" disabled>
                Seleccione el año
              </option>

              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="grade-error" aria-live="polite" aria-atomic="true">
            {state.errors?.year &&
              state.errors.year.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
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
          href="/dashboard/assignments"
          className="flex h-10 items-center rounded-lg bg-50 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Crear Asignación</Button>
      </div>
    </form>
  );
}
