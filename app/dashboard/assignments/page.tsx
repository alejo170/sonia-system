import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import TableStudentGrade from '@/app/ui/assignments/student/table';
import TableTeacherSubject from '@/app/ui/assignments/teacherSubject/table';
import { CreateAssignmentsStudentGrade } from '@/app/ui/assignments/student/buttons';
import { CreateAssignmentsTeacherSubject } from '@/app/ui/assignments/teacherSubject/buttons';
import {
  AssignmentsStudentGradeTableSkeleton,
  AssignmentsTeacherSubjectTableSkeleton,
} from '@/app/ui/skeletons';
import { Suspense } from 'react';
import {
  fetchAssignmentsStudentGradePages,
  fetchAssignmentsTeacherSubjectPages,
} from '@/app/lib/data';
import { Tabs, Tab } from '@/app/ui/tabs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asignaciones',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPagesStudentGrade = await fetchAssignmentsStudentGradePages(query);
  const totalPagesTeacherSubject =
    await fetchAssignmentsTeacherSubjectPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Asignaciones</h1>
      </div>

      <Tabs>
        <Tab label="Docente">
          <div></div>
          <div className="py-4">
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
              <Search placeholder="Buscar asignaciones..." />
              <CreateAssignmentsTeacherSubject />
            </div>
            <Suspense
              key={query + currentPage}
              fallback={<AssignmentsTeacherSubjectTableSkeleton />}
            >
              <TableTeacherSubject query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPagesTeacherSubject} />
            </div>
          </div>
        </Tab>

        <Tab label="Estudiante">
          <div className="py-4">
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
              <Search placeholder="Buscar asignaciones..." />
              <CreateAssignmentsStudentGrade />
            </div>
            <Suspense
              key={query + currentPage}
              fallback={<AssignmentsStudentGradeTableSkeleton />}
            >
              <TableStudentGrade query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPagesStudentGrade} />
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
