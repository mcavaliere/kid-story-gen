import Link from 'next/link';
import { EBLogo } from '../svgs/EBLogo';

export function Footer() {
  return (
    <footer className="flex flex-row items-center justify-end w-full p-4">
      <span>Made by</span>
      <Link
        href="https://mikecavaliere.com"
        className="ml-1 font-bold"
        target="_blank"
      >
        Mike Cavaliere
      </Link>
      <span className="mx-2">|</span>
      <Link
        className="flex w-20 h-10"
        href="https://echobind.com"
        target="_blank"
      >
        <EBLogo />
      </Link>
    </footer>
  );
}
