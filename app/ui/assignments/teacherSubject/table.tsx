import {
  UpdateAssignmentsTeacherSubject,
  DeleteAssignmentsTeacherSubject,
} from '@/app/ui/assignments/teacherSubject/buttons';
import { fetchFilteredAssignmentsTeacherSubject } from '@/app/lib/data';

export default async function AssignmentsTeacherSubjectTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const assignments = await fetchFilteredAssignmentsTeacherSubject(
    query,
    currentPage,
  );

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-50 p-2 md:pt-0">
          <div className="md:hidden">
            {assignments?.map((assignment) => (
              <div
                key={assignment.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{assignment.user_id}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {assignment.subject_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {assignment.grade_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {assignment.year}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateAssignmentsTeacherSubject id={assignment.id} />
                    <DeleteAssignmentsTeacherSubject id={assignment.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Docente
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
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Editar</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {assignments?.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{assignment.user_id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {assignment.subject_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {assignment.grade_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {assignment.year}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateAssignmentsTeacherSubject id={assignment.id} />
                      <DeleteAssignmentsTeacherSubject id={assignment.id} />
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
