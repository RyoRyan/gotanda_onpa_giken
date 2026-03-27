type Props = {
  children: React.ReactNode;
};

export default function Sheet({ children }: Props) {
  return (
    <div className="relative bg-white w-[840px] mx-auto mt-[20px] p-[80px] rounded-[8px]">
      {children}
    </div>
  );
}
