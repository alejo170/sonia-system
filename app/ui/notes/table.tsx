import { UpdateNotes, DeleteNotes } from '@/app/ui/notes/buttons';
import { fetchFilteredNotes, fetchNotesByStudent } from '@/app/lib/data';
import { auth } from '@/auth';
import ButtonPDF from '@/app/ui/generatePDF';

export default async function NotesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const notes = await fetchFilteredNotes(query, currentPage);
  const session = await auth();
  const id = String(session?.user.id);
  const notesById = await fetchNotesByStudent(id);
  const notesToDisplay = session?.user.role === 'Estudiante' ? notesById : notes;
  
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        {session?.user.role === 'Estudiante' ?
          <ButtonPDF notes={notesById} />
        : null }
        
        <div className="rounded-lg bg-50 p-2 mt-5 md:pt-0">
          <div className="md:hidden">
            {notesToDisplay?.map((note) => (
              <div
                key={note.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{note.user_name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{note.subject_name}</p>
                    <p className="text-sm text-gray-500">{note.grade_name}</p>
                    <p className="text-sm text-gray-500">{note.year}</p>
                  </div>
                  
                  <p>
                    {note.final}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p></p>
                  </div>
                  {session?.user.role === 'Administrador' || session?.user.role === 'Docente' ?
                  <div className="flex justify-end gap-2">
                    <UpdateNotes id={note.id} />
                    <DeleteNotes id={note.id} />
                  </div>
                  : null }
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Estudiante
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Asignatura
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Grado
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Año
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Corte 1
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Corte 2
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Final
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Editar</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {notesToDisplay?.map((note) => (
                <tr
                  key={note.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{note.user_name}</p> 
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {note.subject_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{note.grade_name}</td>
                  <td className="whitespace-nowrap px-3 py-3">{note.year}</td>
                  <td className="whitespace-nowrap px-3 py-3">{note.period_1}</td>
                  <td className="whitespace-nowrap px-3 py-3">{note.period_2}</td>
                  <td className="whitespace-nowrap px-3 py-3">{note.final}</td>
                  
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  {session?.user.role === 'Administrador' || session?.user.role === 'Docente' ?
                    <div className="flex justify-end gap-3">
                      <UpdateNotes id={note.id} />
                      <DeleteNotes id={note.id} />
                    </div>
                  : null }
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
