import Footer from "@/components/home/Footer";
import ResourceDirectory from "@/components/resource/ResourceDirectory";
import SubpageHero from "@/components/layout/SubpageHero";

export default function ResourceHub() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-[#f5f0eb]">
        <SubpageHero
          title="Resource Hub"
          eyebrow="Community directory"
          description="Search local services, compare island locations, and submit new resources for residents."
          image="/img/city-home.jpg"
        />
        <ResourceDirectory />
      </main>
      <Footer />
    </div>
  );
}
