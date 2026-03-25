type Props = {
  href: string;
  children: React.ReactNode;
};

export default function ButtonLink({ href, children }: Props) {
  return (
    <a href={href} className="button">
      {children}
    </a>
  );
}
