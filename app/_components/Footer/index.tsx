const socialLinks = [
  {
    href: "https://x.com/X",
    label: "X",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="currentColor"
      >
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-7.39L5.58 22H2.47l7.24-8.27L1.8 2h6.4l4.43 6.78L18.9 2Zm-1.1 18h1.72L7.27 3.9H5.43Z" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@YouTube",
    label: "YouTube",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="currentColor"
      >
        <path d="M23.5 6.2a3 3 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 60.7 60.7 0 0 0 0 12a60.7 60.7 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3 3 0 0 0 2.12-2.14c.5-1.87.5-5.8.5-5.8s0-3.93-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-white/60 px-6 py-5">
      <nav className="mx-auto max-w-4xl">
        <ul className="flex items-center justify-center gap-3 text-sm font-medium">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/80 px-4 py-2 text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950"
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-3 text-center text-sm text-neutral-600">
        © 五反田音響波動技術研究所. All Rights Reserved 2026
      </p>
    </footer>
  );
}
