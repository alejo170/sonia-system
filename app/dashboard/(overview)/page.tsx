import { Card } from '@/app/ui/dashboard/cards';
import LatestTeachers from '@/app/ui/dashboard/latest-teachers';
import LatestStudents from '@/app/ui/dashboard/latest-students';
import {
  fetchLatestStudents,
  fetchLatestTeachers,
  fetchCardData,
} from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Inicio',
};

export default async function Page() {

  const session = await auth();
  const latestTeachers = await fetchLatestTeachers();
  const latestStudents = await fetchLatestStudents();
  const {
    numberOfTeachers,
    numberOfStudents,
    numberOfSubjects,
    numberOfGrades,
  } = await fetchCardData();
  
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">{session?.user.role}: {session?.user.name} {session?.user.lastname}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Docentes" value={numberOfTeachers} type="teachers" />
        <Card title="Total Estudiantes" value={numberOfStudents} type="students" />
        <Card title="Total Asignaturas" value={numberOfSubjects} type="subjects" />
        <Card title="Total Grados" value={numberOfGrades} type="grades" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <LatestTeachers latestTeachers={latestTeachers} />
        <LatestStudents latestStudents={latestStudents} />
      </div>
    </main>
  );
}
