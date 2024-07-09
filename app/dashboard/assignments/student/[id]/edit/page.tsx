import Form from '@/app/ui/assignments/student/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchstudentGradeById,
  fetchStudents,
  fetchSubjects,
  fetchGrades,
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Asignacion Estudiante',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [studentGrade, students, subjects, grades] = await Promise.all([
    fetchstudentGradeById(id),
    fetchStudents(),
    fetchSubjects(),
    fetchGrades(),
  ]);
  if (!studentGrade) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Asignaciones', href: '/dashboard/assignments' },
          {
            label: 'Editar Asignación',
            href: `/dashboard/assignments/student/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        studentGrade={studentGrade}
        students={students}
        subjects={subjects}
        grades={grades}
      />
    </main>
  );
}
