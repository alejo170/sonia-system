import {
  UserGroupIcon,
  BookOpenIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  teachers: UserGroupIcon,
  students: UserGroupIcon,
  subjects: BookOpenIcon,
  grades: AcademicCapIcon,
};

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'teachers' | 'students' | 'subjects' | 'grades';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl">
        {value}
      </p>
    </div>
  );
}
