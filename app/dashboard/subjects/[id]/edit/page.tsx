import Form from '@/app/ui/subjects/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchSubjectById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Asignaturas',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [subject] = await Promise.all([fetchSubjectById(id)]);
  if (!subject) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Asignaturas', href: '/dashboard/subjects' },
          {
            label: 'Editar Asignatura',
            href: `/dashboard/subjects/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form subject={subject} />
    </main>
  );
}
