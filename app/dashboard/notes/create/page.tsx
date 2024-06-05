import Form from '@/app/ui/notes/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchGradesStudents } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Notas',
};

export default async function Page() {
  
  const gradesStudents = await fetchGradesStudents();
  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Notas', href: '/dashboard/notes' },
          {
            label: 'Asignar Notas',
            href: '/dashboard/notes/create',
            active: true,
          },
        ]}
      />
      <Form gradesStudents={gradesStudents} />
    </main>
  );
}
