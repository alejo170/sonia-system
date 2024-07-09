'use client';
import {
  UserGroupIcon,
  HomeIcon,
  PencilSquareIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

// Enlaces para mostrar en la navegación lateral
const links = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  { name: 'Usuarios', href: '/dashboard/users', icon: UserGroupIcon },
  { name: 'Asignaturas', href: '/dashboard/subjects', icon: BookOpenIcon },
  { name: 'Grados', href: '/dashboard/grades', icon: AcademicCapIcon },
  {
    name: 'Asignaciones',
    href: '/dashboard/assignments',
    icon: ArrowsRightLeftIcon,
  },
];

const linksTeachersAnsStudents = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  { name: 'Notas', href: '/dashboard/notes', icon: PencilSquareIcon },
];

export default function NavLinks({ session }: { session: string | undefined }) {
  const pathname = usePathname();

  // Determinar qué conjunto de enlaces mostrar según el rol del usuario
  const linksToDisplay =
    session === 'Administrador' ? links : linksTeachersAnsStudents;

  return (
    <>
      {linksToDisplay.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-50 p-3 text-sm font-medium hover:bg-500 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-500 text-white': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
