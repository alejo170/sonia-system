import Form from '@/app/ui/grades/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchGradeById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Grados',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [grade] = await Promise.all([fetchGradeById(id)]);
  if (!grade) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Grados', href: '/dashboard/grades' },
          {
            label: 'Editar Grado',
            href: `/dashboard/grades/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form grade={grade} />
    </main>
  );
}
