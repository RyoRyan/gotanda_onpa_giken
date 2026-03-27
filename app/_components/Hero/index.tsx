import Image from "next/image";

type Props = {
  title: string;
  sub: string;
};

export default function Hero({ title, sub }: Props) {
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-[30px]">
      <div>
        <h1 className="text-5xl font-bold text-center my-4">{title}</h1>
        <p
          className="
        flex 
        items-center 
        gap-5  
        justify-center 
        before:content-[''] before:block 
        before:h-px 
        before:w-5 
        before:bg-black
        after:content-['']
        after:block 
        after:h-px 
        after:w-5 
        after:bg-black"
        >
          {sub}
        </p>
      </div>
    </section>
  );
}
