import { UserCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { LatestTeacher } from '@/app/lib/definitions';
export default async function LatestTeachers({
  latestTeachers,
}: {
  latestTeachers: LatestTeacher[];
}) {
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className="mb-4 text-xl md:text-2xl">Últimos Docentes</h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-50 p-4">
        <div className="bg-white px-6">
          {latestTeachers.map((teacher, i) => {
            return (
              <div
                key={teacher.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <UserCircleIcon className="mr-4 h-5 w-5 text-gray-500" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {teacher.name} {teacher.lastname}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6"></div>
      </div>
    </div>
  );
}
