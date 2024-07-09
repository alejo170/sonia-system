'use client';

import {
  Student,
  Subject,
  Grade,
  AssignmentsStudentGrade,
} from '@/app/lib/definitions';
import {
  UserCircleIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateAssignmentsStudentGrade } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function EditStudentGradeForm({
  studentGrade,
  students,
  subjects,
  grades,
}: {
  studentGrade: AssignmentsStudentGrade;
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
}) {
  const initialState = { message: null, errors: {} };
  const updateStudentGradeWithId = updateAssignmentsStudentGrade.bind(
    null,
    studentGrade.id,
  );
  const [state, dispatch] = useFormState(
    updateStudentGradeWithId,
    initialState,
  );

  // Generar opciones para los años
  const current_year = new Date().getFullYear();
  const start_year = current_year - 60;
  const years = Array.from(
    { length: current_year - start_year },
    (_, index) => current_year - index,
  );

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-50 p-4 md:p-6">
        {/* Estudiante */}
        <div className="mb-4">
          <label htmlFor="student" className="mb-2 block text-sm font-medium">
            Estudiante
          </label>
          <div className="relative">
            <select
              id="student"
              name="studentId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={studentGrade.user_id}
              aria-describedby="student-error"
            >
              <option value="" disabled>
                Seleccione un estudiante
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.lastname}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="student-error" aria-live="polite" aria-atomic="true">
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
              defaultValue={studentGrade.subject_id}
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
              defaultValue={studentGrade.grade_id}
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
              defaultValue={studentGrade.year}
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
          href="/dashboard/assignments?tab=Estudiante"
          className="flex h-10 items-center rounded-lg bg-50 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Editar Asignación</Button>
      </div>
    </form>
  );
}
