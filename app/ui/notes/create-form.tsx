'use client';

import { AssignmentsStudentGrade } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  UserCircleIcon,
  AcademicCapIcon,
  BookOpenIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createNote } from '@/app/lib/actions';
import { SetStateAction, useState } from 'react';
import { useFormState } from 'react-dom';

export default function Form({
  gradesStudents,
}: {
  gradesStudents: AssignmentsStudentGrade[];
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createNote, initialState);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const handleYearChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedYear(e.target.value);
    setSelectedGrade('');
    setSelectedSubject('');
    setSelectedStudent('');
  };

  const handleGradeChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedGrade(e.target.value);
    setSelectedSubject('');
    setSelectedStudent('');
  };

  const handleSubjectChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedSubject(e.target.value);
    setSelectedStudent('');
  };

  const handleStudentChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedStudent(e.target.value);
  };

  const uniqueYears = Array.from(
    new Set(gradesStudents.map((student) => student.year)),
  );

  const filteredGrades = Array.from(
    new Set(
      gradesStudents
        .filter((student) => student.year === Number(selectedYear))
        .map((student) => student.grade_name),
    ),
  ).map((gradeName) => {
    return gradesStudents.find((student) => student.grade_name === gradeName);
  });

  const filteredSubjects = Array.from(
    new Set(
      gradesStudents
        .filter((student) => {
          return (
            student.year === Number(selectedYear) &&
            student.grade_id === selectedGrade
          );
        })
        .map((student) => student.subject_name),
    ),
  ).map((gradeName) => {
    return gradesStudents.find((student) => student.subject_name === gradeName);
  });

  const filteredStudents = gradesStudents.filter((student) => {
    return (
      student.year === Number(selectedYear) &&
      student.grade_id === selectedGrade &&
      student.subject_id === selectedSubject
    );
  });

  // Encontrar el assignmentStudentId para el estudiante seleccionado
  const selectedStudentData = filteredStudents.find(
    (student) => student.user_id === selectedStudent,
  );

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-50 p-4 md:p-6">
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
              value={selectedYear}
              onChange={handleYearChange}
              aria-describedby="year-error"
            >
              <option value="" disabled>
                Seleccione el año
              </option>

              {uniqueYears.map((year, index) => (
                <option key={index} value={year}>
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
              value={selectedGrade}
              onChange={handleGradeChange}
              disabled={!selectedYear} // Se deshabilita si no se ha seleccionado un año
            >
              <option value="" disabled>
                Seleccione un grado
              </option>
              {filteredGrades.map((grade, index) => (
                <option key={index} value={grade?.grade_id}>
                  {grade?.grade_name}
                </option>
              ))}
            </select>
            <AcademicCapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="subject-error" aria-live="polite" aria-atomic="true">
            {state.errors?.grade_id &&
              state.errors.grade_id.map((error: string) => (
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
              aria-describedby="subject-error"
              value={selectedSubject}
              onChange={handleSubjectChange}
              disabled={!selectedGrade}
            >
              <option value="" disabled>
                Seleccione una asignatura
              </option>
              {filteredSubjects.map((subject, index) => (
                <option key={index} value={subject?.subject_id}>
                  {subject?.subject_name}
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
              aria-describedby="student-error"
              value={selectedStudent}
              onChange={handleStudentChange}
              disabled={!selectedSubject}
            >
              <option value="" disabled>
                Seleccione un estudiante
              </option>
              {filteredStudents.map((student, index) => (
                <option key={index} value={student.user_id}>
                  {student.user_name}
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

        {/* Nota del corte 1 */}
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
                placeholder="Ingrese la nota del primer corte"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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

        {/* Nota del corte 2 */}
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
                value={selectedStudentData?.id}
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
        <Button type="submit">Asignar Notas</Button>
      </div>
    </form>
  );
}
