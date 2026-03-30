type Props = {
  children: React.ReactNode;
};

export default function Sheet({ children }: Props) {
  return (
    <div className="relative mx-auto mt-5 w-full max-w-[840px] rounded-lg bg-white px-5 py-8 sm:px-8 md:px-12 lg:px-16">
      {children}
    </div>
  );
}
