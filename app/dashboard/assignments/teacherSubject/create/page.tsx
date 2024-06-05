import Form from '@/app/ui/assignments/teacherSubject/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchTeachers, fetchSubjects, fetchGrades } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Asignacion Docente - Asignatura',
};

export default async function Page() {
  const teachers = await fetchTeachers();
  const subjects = await fetchSubjects();
  const grades = await fetchGrades();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Asignaciones', href: '/dashboard/assignments' },
          {
            label: 'Crear Asignación',
            href: '/dashboard/assignments/teacherSubject/create',
            active: true,
          },
        ]}
      />
      <Form teachers={teachers} subjects={subjects} grades={grades} />
    </main>
  );
}
