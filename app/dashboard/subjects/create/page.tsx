import Form from '@/app/ui/subjects/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Asignaturas',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Asignaturas', href: '/dashboard/subjects' },
          {
            label: 'Crear Asignaturas',
            href: '/dashboard/subjects/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
