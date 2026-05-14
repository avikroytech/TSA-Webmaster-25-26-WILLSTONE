import Image from "next/image";

type SubpageHeroProps = {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
};

export default function SubpageHero({ title, eyebrow, description, image }: SubpageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#ded6c9] bg-[#173b3f] text-white">
      <Image src={image} alt="" fill priority={false} loading="lazy" className="object-cover opacity-45" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,59,63,0.94),rgba(23,59,63,0.72)_55%,rgba(23,59,63,0.35))]" />
      <div className="relative z-10 mx-auto flex min-h-[270px] max-w-7xl flex-col justify-end px-6 pb-10 pt-16 md:min-h-[330px] md:pb-12">
        <p className="city-kicker text-[#d5b08c]">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-[clamp(2.7rem,6vw,5.4rem)] font-black leading-[0.95] tracking-normal">{title}</h1>
        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/82 md:text-lg">{description}</p>
      </div>
    </section>
  );
}
