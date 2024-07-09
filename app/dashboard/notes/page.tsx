import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/notes/table';
import { CreateNotes } from '@/app/ui/notes/buttons';
import { NotesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchNotesPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Notas',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchNotesPages(query);
  const session = await auth();
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Notas</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar..." />
        {session?.user.role === 'Administrador' ||
        session?.user.role === 'Docente' ? (
          <CreateNotes />
        ) : null}
      </div>
      <Suspense key={query + currentPage} fallback={<NotesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
