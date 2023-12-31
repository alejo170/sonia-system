import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-3">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-primary p-4 md:h-40">
        {/* Adicionar Logo */}
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Bienvenido a SONIA.</strong> Somos mas que una plataforma, 
            somos una aliado para gestionar tus notas.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg border-2 border-secondary px-6 py-3 text-sm font-medium shadow-[inset_0px_-2px_0px_1px_secondary] hover:bg-secondary transition duration-300 ease-in-out hover:text-white"
          >
            <span>Iniciar sesión</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Hero Images */}
        <Image
          src="/desktop.jpg"
          width={1280}
          height={720}
          className="hidden md:block"
          alt="Screenshots of the dashboard project showing desktop version"
        />
        <Image
          src="/mobile.jpg"
          width={560}
          height={620}
          className="block md:hidden"
          alt="Screenshot of the dashboard project showing mobile version"
        />


        </div>
      </div>
    </main>
  );
}
