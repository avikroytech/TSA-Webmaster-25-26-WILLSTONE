"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Accessibility,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Compass,
  FilePlus2,
  HandHeart,
  HeartPulse,
  Landmark,
  Languages,
  Leaf,
  MapPinned,
  Network,
  Scale,
  Search,
  ShieldCheck,
  Train,
  Trees,
  UsersRound,
  Waves,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Footer from "@/components/home/Footer";
import SubpageHero from "@/components/layout/SubpageHero";

const islands = [
  {
    name: "Coastal Island",
    image: "/right.png",
    icon: Waves,
    label: "Waterfront neighborhoods",
    transit: "Shoreline service area",
    text: "Coastal Island is Willstone's connection to the water and one of the most community-driven parts of the city. Known for its lively shoreline neighborhoods, it is a place where people know their neighbors and local pride runs deep. With shared spaces, city services, and constant activity, Coastal turns the waterfront into something everyone can enjoy.",
  },
  {
    name: "Emerald Island",
    image: "/left.png",
    icon: Trees,
    label: "Green residential district",
    transit: "Emerald Line",
    text: "Emerald Island stands out for its natural beauty and peaceful residential feel. It offers a quieter lifestyle while still staying fully connected to the rest of Willstone. Home to families and long-time residents, Emerald values green space, wellness, and strong neighborhood ties. The Emerald Line makes travel across the archipelago simple and reliable.",
  },
  {
    name: "Central Island",
    image: "/small.png",
    icon: Landmark,
    label: "Civic and administrative hub",
    transit: "Central Loop",
    text: "Central Island is the center of Willstone in every sense. It serves as the city's civic and administrative hub, where government services, transit, and daily activity all come together. As the most accessible island, it helps keep the entire archipelago connected. The Central Loop ensures movement between all four islands stays efficient and constant.",
  },
  {
    name: "Talon Island",
    image: "/bottom.png",
    icon: Compass,
    label: "Active civic community",
    transit: "Summit Shuttle",
    text: "Talon Island is a growing and energetic community shaped by strong civic involvement. Its residents play an active role in guiding Willstone's future, bringing new ideas and momentum to city life. With a culture built around participation and progress, Talon continues to make its voice heard. The Summit Shuttle keeps it closely linked to the rest of the city.",
  },
];

const goals = [
  {
    title: "Accessibility for Every Resident",
    icon: Accessibility,
    text: "Every Willstone resource, whether in-person or digital, should be available to all residents regardless of island, income, ability, or background. The Resource Hub and city transit network help make that possible, and the city continues working to expand access wherever gaps exist.",
  },
  {
    title: "Civic Participation and Transparent Government",
    icon: Landmark,
    text: "Willstone believes residents should help shape their city, not just live in it. Through open calendars, accessible public information, community guides, and resident-led submissions, government stays visible, understandable, and connected to the people it serves.",
  },
  {
    title: "A Connected Archipelago",
    icon: Network,
    text: "No island should ever feel isolated from the rest of the city. The Emerald Line, Central Loop, and Summit Shuttle were created to ensure reliable movement between communities. In Willstone, connection is essential.",
  },
  {
    title: "Health and Wellbeing as a Priority",
    icon: HeartPulse,
    text: "Willstone treats physical and mental wellbeing as a core responsibility of city life. Through wellness resources, health services, and community programming, residents are supported in ways that promote long-term quality of life.",
  },
  {
    title: "Culture, Community, and Celebration",
    icon: CalendarDays,
    text: "Strong communities are built by coming together. Through civic, cultural, social, and wellness events, the city creates space to celebrate traditions, welcome new voices, and strengthen the everyday connections that make a city feel like home.",
  },
];

const inclusion = [
  {
    title: "Racial Equity",
    icon: Scale,
    text: "Willstone is committed to building a city where race never determines access to opportunity, quality of service, or community support. Resources are distributed with fairness, representation, and accountability in mind across all four islands.",
  },
  {
    title: "LGBTQ+ Affirmation",
    icon: BadgeCheck,
    text: "Willstone is a proud and welcoming home for LGBTQ+ residents. City programs, events, and services are designed to reflect and celebrate the full range of identities within the community.",
  },
  {
    title: "Disability Access",
    icon: ShieldCheck,
    text: "A truly connected city leaves no one behind. Willstone continues working to remove barriers through accessible transit, virtual participation options, organized resources, and thoughtful digital design.",
  },
  {
    title: "Language Inclusion",
    icon: Languages,
    text: "Willstone is home to residents who speak many languages, and language should never stand in the way of connection or access. The city is expanding multilingual communication across services, programs, and public information.",
  },
];

const residentRoutes = [
  {
    title: "Find support nearby",
    href: "/resource-hub",
    icon: Search,
    text: "Explore health, housing, childcare, legal assistance, and local programs by island.",
  },
  {
    title: "Join city life",
    href: "/calendar",
    icon: CalendarDays,
    text: "See civic, cultural, social, and health events happening across Willstone.",
  },
  {
    title: "Submit a resource",
    href: "/request",
    icon: FilePlus2,
    text: "Recommend a service, program, or opportunity for city review.",
  },
];

const storySignals = [
  {
    title: "Residents move first",
    text: "Transit, resource access, and public information are planned around daily life.",
  },
  {
    title: "Services cross water",
    text: "The Resource Hub keeps support visible across every island, not buried by department.",
  },
  {
    title: "The city listens back",
    text: "Submissions, calendars, guides, and civic offices turn resident input into action.",
  },
];

function CityStoryMotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const harborShift = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const ferryShift = useTransform(scrollYProgress, [0.08, 0.92], ["2%", "82%"]);
  const lineScale = useTransform(scrollYProgress, [0.2, 0.78], [0.14, 1]);
  const civicPulse = useTransform(
    scrollYProgress,
    [0.18, 0.48, 0.82],
    [0.82, 1.12, 0.94],
  );

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#173b3f] px-6 py-20 text-[#f8f4ec] md:py-28"
      aria-labelledby="city-story-title"
    >
      <motion.div
        aria-hidden="true"
        style={{ x: prefersReducedMotion ? 0 : harborShift }}
        className="absolute inset-x-[-12%] top-8 h-px bg-[#d5b08c]/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(#f8f4ec 1px, transparent 1px), linear-gradient(90deg, #f8f4ec 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="city-kicker text-[#d5b08c]">City story</p>
          <h2
            id="city-story-title"
            className="mt-4 font-display text-[clamp(3.4rem,9vw,8.5rem)] font-black leading-[0.82] tracking-normal text-[#f8f4ec]"
          >
            The city moves when residents do
          </h2>
          <p className="mt-7 max-w-xl text-lg font-semibold leading-8 text-[#f8f4ec]/78">
            Willstone is not a static map. It is a working archipelago: ferries,
            service desks, meeting rooms, calendars, neighbors, and resource
            submissions moving in the same civic loop.
          </p>
        </motion.div>

        <div className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-[#d5b08c]/25 bg-[#f8f4ec] text-[#173b3f] shadow-[0_28px_80px_rgba(8,22,24,0.28)]">
          <motion.div
            aria-hidden="true"
            style={{ scaleX: prefersReducedMotion ? 1 : lineScale }}
            className="absolute left-[12%] right-[12%] top-1/2 z-10 h-2 origin-left rounded-full bg-[#b98d63]"
          />
          <motion.div
            aria-hidden="true"
            style={{ left: prefersReducedMotion ? "46%" : ferryShift }}
            className="absolute top-[calc(50%-1.1rem)] z-20 flex h-9 w-16 items-center justify-center rounded-full border border-[#173b3f]/20 bg-[#173b3f] text-[10px] font-black uppercase tracking-[0.12em] text-[#f8f4ec] shadow-[0_14px_28px_rgba(23,59,63,0.28)]"
          >
            Line
          </motion.div>

          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, -10, 0], rotate: [-1, 1, -1] }
            }
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[8%] top-[12%] w-[30%]"
          >
            <Image
              src="/left.png"
              alt="Emerald Island moving map shape"
              width={360}
              height={360}
              className="h-auto w-full drop-shadow-2xl"
            />
          </motion.div>
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, 12, 0], rotate: [1, -1, 1] }
            }
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[9%] top-[18%] w-[38%]"
          >
            <Image
              src="/right.png"
              alt="Coastal Island moving map shape"
              width={460}
              height={360}
              className="h-auto w-full drop-shadow-2xl"
            />
          </motion.div>
          <motion.div
            animate={
              prefersReducedMotion ? undefined : { y: [0, -8, 0], x: [0, 8, 0] }
            }
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[30%] top-[42%] z-20 w-[19%]"
          >
            <Image
              src="/small.png"
              alt="Central Island moving map shape"
              width={260}
              height={260}
              className="h-auto w-full drop-shadow-2xl"
            />
          </motion.div>
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, 10, 0], rotate: [-0.7, 0.8, -0.7] }
            }
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[5%] left-[18%] w-[62%]"
          >
            <Image
              src="/bottom.png"
              alt="Talon Island moving map shape"
              width={720}
              height={360}
              className="h-auto w-full drop-shadow-2xl"
            />
          </motion.div>

          {[
            ["Resource Hub", "left-[12%] bottom-[18%]"],
            ["Council", "right-[14%] top-[12%]"],
            ["Calendar", "right-[18%] bottom-[18%]"],
            ["Transit", "left-[44%] top-[16%]"],
          ].map(([label, position], index) => (
            <motion.div
              key={label}
              style={{ scale: prefersReducedMotion ? 1 : civicPulse }}
              transition={{ delay: index * 0.05 }}
              className={`absolute z-30 ${position} rounded-full border border-[#173b3f]/15 bg-[#fbfaf7] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#173b3f] shadow-[0_12px_28px_rgba(23,59,63,0.14)]`}
            >
              {label}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-10 grid max-w-7xl gap-3 md:grid-cols-3">
        {storySignals.map((signal, index) => (
          <motion.article
            key={signal.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="border border-[#d5b08c]/25 bg-[#f8f4ec]/8 p-5"
          >
            <p className="font-display text-2xl font-black leading-tight text-[#f8f4ec]">
              {signal.title}
            </p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#f8f4ec]/72">
              {signal.text}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main>
        <SubpageHero
          title="About Willstone"
          eyebrow="Four islands, one city"
          description="Willstone is a four-island city built around public access, civic trust, and the residents who keep the archipelago moving."
          image="/img/full_map.png"
        />

        <CityStoryMotion />

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="city-kicker">The four islands</p>
              <h2 className="mt-3 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[#173b3f] md:text-7xl">
                One city, four ways of belonging
              </h2>
            </div>
            <p className="max-w-3xl text-lg font-semibold leading-8 text-[#48605b]">
              Each island has its own rhythm, but Willstone works as one civic
              system. Transit, services, public information, and resident
              participation are designed to make the whole archipelago feel
              connected.
            </p>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-12">
            {islands.map((island, index) => {
              const Icon = island.icon;
              const isWide = index === 0 || index === 3;

              return (
                <motion.article
                  key={island.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.06, duration: 0.42 }}
                  className={`overflow-hidden rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] shadow-[0_12px_36px_rgba(23,59,63,0.07)] ${
                    isWide ? "lg:col-span-7" : "lg:col-span-5"
                  }`}
                >
                  <div className="grid h-full gap-0 md:grid-cols-[minmax(180px,0.78fr)_1fr]">
                    <div className="relative min-h-[210px] border-b border-[#ded6c9] bg-[#173b3f] md:border-b-0 md:border-r">
                      <Image
                        src={island.image}
                        alt={`${island.name} map shape`}
                        fill
                        sizes="(min-width: 1024px) 32vw, (min-width: 768px) 42vw, 100vw"
                        className="object-contain p-8 drop-shadow-xl"
                      />
                    </div>
                    <div className="flex flex-col p-6 md:p-7">
                      <div className="mb-5 flex flex-wrap items-center gap-2">
                        <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#ded6c9] bg-[#f8f4ec] px-3 text-xs font-black uppercase tracking-[0.12em] text-[#173b3f]">
                          <Icon size={15} aria-hidden="true" />
                          {island.label}
                        </span>
                        <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#3f6256]/25 bg-[#3f6256]/10 px-3 text-xs font-black uppercase tracking-[0.12em] text-[#173b3f]">
                          <Train size={15} aria-hidden="true" />
                          {island.transit}
                        </span>
                      </div>
                      <h3 className="font-display text-3xl font-black leading-none text-[#173b3f] md:text-4xl">
                        {island.name}
                      </h3>
                      <p className="mt-4 text-sm font-semibold leading-7 text-[#48605b]">
                        {island.text}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="bg-[#173b3f] px-6 py-20 text-[#f8f4ec] md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="city-kicker text-[#d5b08c]">Life as a resident</p>
              <h2 className="mt-3 font-display text-5xl font-black leading-none md:text-6xl">
                A city built by the people who use it
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/resource-hub"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#f8f4ec] px-5 text-sm font-black text-[#173b3f] transition-colors hover:bg-[#d5b08c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d5b08c]"
                >
                  Resource Hub
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/request"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#d5b08c]/55 px-5 text-sm font-black text-[#f8f4ec] transition-colors hover:bg-[#f8f4ec]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d5b08c]"
                >
                  Submit Resource
                </Link>
              </div>
            </div>

            <div className="space-y-7 text-lg font-semibold leading-9 text-[#f8f4ec]/82">
              <p>
                Willstone is home to a diverse and growing community made up of
                families, students, young professionals, retirees, artists,
                educators, and newcomers finding their place in the city. People
                from different backgrounds, experiences, and all four islands
                come together to shape everyday life here. That diversity is one
                of the city's greatest strengths.
              </p>
              <p>
                No matter where you live across the archipelago, support is
                never far away. The Willstone Resource Hub connects residents to
                programs and services including health and wellness, housing
                support, childcare, legal assistance, and more. Everything is
                organized by island, making it easier to find what matters most
                to your local community.
              </p>
              <p>
                What makes Willstone stand out most is that the people who live
                here help build it. Through the open resource submission
                process, any resident can recommend a new service, program, or
                opportunity for the city to add. That shared sense of ownership
                is at the heart of life in Willstone.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="city-kicker">Goals and impact</p>
                <h2 className="mt-3 font-display text-5xl font-black leading-none text-[#173b3f] md:text-6xl">
                  Purpose made practical
                </h2>
              </div>
              <p className="max-w-3xl text-lg font-semibold leading-8 text-[#48605b]">
                Every service, program, and decision is guided by a clear
                commitment to improving life for the people who call the
                archipelago home.
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-6">
              {goals.map((goal, index) => {
                const Icon = goal.icon;

                return (
                  <motion.article
                    key={goal.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: index * 0.05, duration: 0.36 }}
                    className={`rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] p-6 shadow-[0_12px_36px_rgba(23,59,63,0.07)] ${
                      index < 2 ? "lg:col-span-3" : "lg:col-span-2"
                    }`}
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#173b3f] text-[#f8f4ec]">
                      <Icon size={23} aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-2xl font-black leading-tight text-[#173b3f]">
                      {goal.title}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-[#48605b]">
                      {goal.text}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f0eb] px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="city-kicker">Inclusion and belonging</p>
              <h2 className="mt-3 font-display text-5xl font-black leading-none text-[#173b3f] md:text-6xl">
                A city for everyone
              </h2>
              <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#48605b]">
                Every resident deserves to feel safe, respected, and supported
                regardless of race, ethnicity, national origin, sexual
                orientation, gender identity, religion, age, ability, or
                socioeconomic background. Inclusion is not a side initiative in
                Willstone. It is built into how the city operates and how the
                community grows.
              </p>
            </div>

            <div className="grid gap-3">
              {inclusion.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: index * 0.05, duration: 0.36 }}
                    className="rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] p-5"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#3f6256]/25 bg-[#3f6256]/10 text-[#173b3f]">
                        <Icon size={21} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-black text-[#173b3f]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm font-semibold leading-7 text-[#48605b]">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-[#ded6c9] bg-[#fbfaf7] shadow-[0_18px_46px_rgba(23,59,63,0.11)]">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="bg-[#173b3f] p-8 text-[#f8f4ec] md:p-10 lg:p-12">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d5b08c]/45 bg-[#d5b08c]/15">
                  <HandHeart size={28} aria-hidden="true" />
                </div>
                <p className="city-kicker text-[#d5b08c]">Get involved</p>
                <h2 className="mt-3 font-display text-5xl font-black leading-none md:text-6xl">
                  Your voice matters in Willstone
                </h2>
                <p className="mt-6 text-base font-semibold leading-8 text-[#f8f4ec]/82">
                  Willstone belongs to the people who live here. Whether you are
                  looking for support, hoping to meet neighbors, or ready to
                  help shape what the city becomes next, there is a place for
                  you here.
                </p>
              </div>

              <div className="grid gap-0 divide-y divide-[#ded6c9]">
                {residentRoutes.map((route) => {
                  const Icon = route.icon;

                  return (
                    <Link
                      key={route.title}
                      href={route.href}
                      className="group grid gap-4 p-6 transition-colors hover:bg-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#d5b08c] sm:grid-cols-[3rem_1fr_auto] sm:items-center md:p-8"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173b3f] text-[#f8f4ec]">
                        <Icon size={22} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-black text-[#173b3f]">
                          {route.title}
                        </h3>
                        <p className="mt-1 text-sm font-semibold leading-6 text-[#48605b]">
                          {route.text}
                        </p>
                      </div>
                      <ArrowRight
                        className="text-[#3f6256] transition-transform group-hover:translate-x-1"
                        size={22}
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-[#ded6c9] pt-6 text-sm font-bold text-[#48605b] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <MapPinned size={18} aria-hidden="true" />
              <span>Four islands, one connected civic system.</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf size={18} aria-hidden="true" />
              <UsersRound size={18} aria-hidden="true" />
              <span>Built for access, belonging, and resident action.</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
