import { UpdateSubjects, DeleteSubjects } from '@/app/ui/subjects/buttons';
import { fetchFilteredSubjects } from '@/app/lib/data';

export default async function SubjectsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const subjects = await fetchFilteredSubjects(query, currentPage);
  
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-50 p-2 md:pt-0">
          <div className="md:hidden">
            {subjects?.map((subject) => (
              <div
                key={subject.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{subject.name}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateSubjects id={subject.id} />
                    <DeleteSubjects id={subject.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nombre
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Editar</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {subjects?.map((subject) => (
                <tr
                  key={subject.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{subject.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateSubjects id={subject.id} />
                      <DeleteSubjects id={subject.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
