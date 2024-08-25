import { ArrowRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-3">
      <div className="md: flex h-20 items-center justify-center rounded-lg  bg-500 md:h-40 md:px-20">
        {/* Logo */}
        <Image src="/logo.png" width={200} height={75} alt="Logo" priority />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={'text-xl text-gray-800 md:text-3xl md:leading-normal'}>
            <strong>Bienvenido a SONIA.</strong> <br /> Más que una plataforma,{' '}
            <br /> es una aliada en gestionar las notas académicas.
          </p>
          <Link
            href="/login"
            className="border-primary flex items-center gap-5 self-start rounded-lg border-2 bg-500 px-6 py-3 text-sm font-medium text-white shadow-[inset_0px_-2px_0px_1px_secondary] transition duration-300 ease-in-out hover:bg-100 hover:text-500"
          >
            <span>Iniciar sesión</span>{' '}
            <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <Link
            href="https://sonia-system-docs.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="border-primary flex items-center gap-1 self-start rounded-lg border-2 bg-500 px-6 py-3 text-sm font-medium text-white shadow-[inset_0px_-2px_0px_1px_secondary] transition duration-300 ease-in-out hover:bg-100 hover:text-500"
          >
            <span>Guia de usuario</span>{' '}
            <BookOpenIcon className="w-5 md:w-6" />
          </Link>
        </div>

        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Imagenes */}
          <Image
            src="/desktop.jpg"
            width={1280}
            height={720}
            className="hidden md:block"
            alt="Sistema Sonia version escritorio"
            priority
          />
          <Image
            src="/mobile.jpg"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Sistema Sonia version movil"
            priority
          />
        </div>
      </div>
    </main>
  );
}
