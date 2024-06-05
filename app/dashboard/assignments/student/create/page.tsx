import Form from '@/app/ui/assignments/student/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchStudents, fetchSubjects, fetchGrades } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Asignacion Estudiante',
};

export default async function Page() {
  const students = await fetchStudents();
  const subjects = await fetchSubjects();
  const grades = await fetchGrades();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Asignaciones', href: '/dashboard/assignments' },
          {
            label: 'Crear Asignación',
            href: '/dashboard/assignments/student/create',
            active: true,
          },
        ]}
      />
      <Form students={students} grades={grades} subjects={subjects}/>
    </main>
  );
}
