import Form from '@/app/ui/assignments/teacherSubject/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchTeacherSubjectById,
  fetchTeachers,
  fetchSubjects,
  fetchGrades,
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Asignacion Docente - Asignatura',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [teacherSubject, teachers, subjects, grades] = await Promise.all([
    fetchTeacherSubjectById(id),
    fetchTeachers(),
    fetchSubjects(),
    fetchGrades(),
  ]);
  if (!teacherSubject) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Asignaciones', href: '/dashboard/assignments' },
          {
            label: 'Editar Asignación',
            href: `/dashboard/assignments/teacherSubject/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        teacherSubject={teacherSubject}
        teachers={teachers}
        subjects={subjects}
        grades={grades}
      />
    </main>
  );
}
