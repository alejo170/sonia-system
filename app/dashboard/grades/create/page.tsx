import Form from '@/app/ui/grades/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Grados',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Grados', href: '/dashboard/grades' },
          {
            label: 'Crear Grados',
            href: '/dashboard/grades/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
