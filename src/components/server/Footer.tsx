import Link from 'next/link';

export function Footer() {
  return (
    <footer className="flex flex-row justify-end w-full p-4">
      <p>
        Made by
        <Link
          href="https://mikecavaliere.com"
          className="inline-block mx-1 font-bold"
          target="_blank"
        >
          Mike Cavaliere
        </Link>

        |

        
      </p>
    </footer>
  );
}
