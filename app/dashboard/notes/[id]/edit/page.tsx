import Form from '@/app/ui/notes/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchNoteById,
  fetchStudents,
  fetchGrades,
  fetchGradesStudents,
  fetchGradesSubjects,
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Notas',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [notes, students, grades] = await Promise.all([
    fetchNoteById(id),
    fetchStudents(),
    fetchGrades(),
    fetchGradesStudents(),
    fetchGradesSubjects(),
  ]);
  if (!notes) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Notas', href: '/dashboard/notes' },
          {
            label: 'Editar Nota',
            href: `/dashboard/notes/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form notes={notes} students={students} grades={grades} />
    </main>
  );
}
