import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { supabase } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { SpotlightCarouselGallery } from "@/components/ui/spotlight-carousel";
import {
  ArrowLeft, ArrowRight, Map, MapPin, Globe, Phone, Target, Boxes,
  Folder, Stethoscope, Library, Users, TreePine, Briefcase, Scale, Car, Activity
} from "lucide-react";

const getCategoryIcon = (category: string) => {
  if (!category) return <Folder size={22} />;
  const cat = category.toLowerCase();

  if (cat.includes("health") || cat.includes("medical")) return <Stethoscope size={22} />;
  if (cat.includes("library") || cat.includes("book") || cat.includes("education")) return <Library size={22} />;
  if (cat.includes("community") || cat.includes("center")) return <Users size={22} />;
  if (cat.includes("park") || cat.includes("recreation")) return <TreePine size={22} />;
  if (cat.includes("employment") || cat.includes("job") || cat.includes("career")) return <Briefcase size={22} />;
  if (cat.includes("legal") || cat.includes("law")) return <Scale size={22} />;
  if (cat.includes("transport") || cat.includes("transit")) return <Car size={22} />;
  if (cat.includes("sport") || cat.includes("art")) return <Activity size={22} />;
  if (cat === "all") return <Globe size={22} />;

  return <Folder size={22} />;
};

const extractIsland = (resource: any) => {
  const text = `${resource.address || ""} ${resource.description || ""} ${resource.title || ""}`.toLowerCase();
  if (text.includes("emerald")) return "Emerald Isle";
  if (text.includes("north")) return "North Willstone";
  if (text.includes("south")) return "South Beach";
  if (text.includes("central")) return "Central Hub";
  return "Central Hub";
};

export default async function ResourcePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const { data: resource, error } = await supabase
    .from('community_resources')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) console.warn(error);

  if (error || !resource) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-4xl text-road-paint font-display">Resource Not Found</h1>
          <Link href="/resource-hub" className="mt-4 text-asphalt hover:underline font-bold">Return to Hub</Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch related resources
  const { data: related } = await supabase
    .from('community_resources')
    .select('*')
    .neq('id', resource.id)
    .eq('category', resource.category)
    .limit(3);

  const resourceIsland = extractIsland(resource);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 py-12 flex flex-col gap-10">

        {/* Back Link */}
        <Link
          href="/resource-hub"
          className="inline-flex items-center gap-2 text-asphalt hover:text-road-paint transition-colors font-bold text-sm tracking-wide group w-fit"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Resource Hub
        </Link>

        {/* Image Gallery */}
        {resource.images && resource.images.length > 0 ? (
          <SpotlightCarouselGallery
            items={resource.images.map((img: string, idx: number) => ({
              id: idx,
              image: img,
            }))}
          />
        ) : (
          <div className="w-full h-[300px] md:h-[500px] rounded-[2rem] flex items-center justify-center bg-road-paint/5 text-road-paint/20">
            <Target size={64} />
          </div>
        )}

        {/* Main Content & Quick Info */}
        <div className="flex flex-col lg:flex-row gap-12 mt-4">

          {/* Left: Content */}
          <div className="flex-1 max-w-4xl">
            <h1 className="text-4xl md:text-[3.5rem] leading-tight font-display text-road-paint mb-8">{resource.title}</h1>
            <div className="prose prose-lg text-brand-text/80 leading-relaxed font-sans space-y-6">
              {resource.description ? resource.description.split('\n').map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              )) : (
                <p>No description available.</p>
              )}
            </div>
          </div>

          {/* Right: Quick Info */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="bg-[#264D52] rounded-[2rem] p-8 text-[#f5f0eb] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-display mb-8">Quick Info</h2>

              <div className="flex flex-col gap-8">
                {/* Info Item 1 */}
                <div className="flex items-start gap-4 group cursor-default">
                  <div className="mt-1 text-[#70AC90] group-hover:text-white transition-colors duration-300"><Boxes size={22} className="group-hover:scale-110 transition-transform duration-300 transform-origin-center" /></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-display uppercase tracking-widest text-[#70AC90] mb-1.5 opacity-90">Resource Type</span>
                    <span className="font-bold text-lg tracking-wide">{resource.category || "General"}</span>
                  </div>
                </div>

                {/* Info Item 2 */}
                <div className="flex items-start gap-4 group cursor-default">
                  <div className="mt-1 text-[#70AC90] group-hover:text-white transition-colors duration-300"><Map size={22} className="group-hover:scale-110 transition-transform duration-300 transform-origin-center" /></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-display uppercase tracking-widest text-[#70AC90] mb-1.5 opacity-90">Island Location</span>
                    <span className="font-bold text-lg tracking-wide">{resourceIsland}</span>
                  </div>
                </div>

                {/* Info Item 3 */}
                <div className="flex items-start gap-4 group cursor-default">
                  <div className="mt-1 text-[#70AC90] group-hover:text-white transition-colors duration-300"><MapPin size={22} className="group-hover:scale-110 transition-transform duration-300 transform-origin-center" /></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-display uppercase tracking-widest text-[#70AC90] mb-1.5 opacity-90">Physical Address</span>
                    <span className="font-bold text-lg leading-snug tracking-wide">{resource.address || "N/A"}</span>
                  </div>
                </div>

                {/* Info Item 5 */}
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 text-[#70AC90] group-hover:text-white transition-colors duration-300"><Phone size={22} className="group-hover:scale-110 transition-transform duration-300 transform-origin-center" /></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-display uppercase tracking-widest text-[#70AC90] mb-1.5 opacity-90">Phone Number</span>
                    {resource.phone ? (
                      <a href={`tel:${resource.phone}`} className="font-bold text-lg tracking-wide hover:text-white transition-colors">
                        {resource.phone}
                      </a>
                    ) : (
                      <a href="tel:5551234567" className="font-bold text-lg tracking-wide hover:text-white transition-colors">
                        (555) 123-4567
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        {related && related.length > 0 && (
          <div className="mt-12 pt-16 border-t-2 border-road-paint/10">
            <div className="flex items-center justify-between mb-10 border-b border-transparent">
              <h2 className="text-3xl font-display text-road-paint">Related Resources</h2>
              <Link href="/resource-hub" className="group flex items-center gap-2 text-asphalt font-bold text-sm tracking-widest uppercase hover:text-road-paint transition-colors">
                View all resources
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
              {related.map((rel: any) => {
                const relIsland = extractIsland(rel);
                return (
                  <Link href={`/resource-hub/${rel.slug}`} key={rel.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-road-paint/10 flex flex-col group h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-asphalt/30">
                    {/* Img Section */}
                    <div className="relative w-full h-56 bg-gray-100 overflow-hidden shrink-0">
                      {rel.images?.[0] ? (
                        <Image src={rel.images[0]} alt={rel.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                      ) : (
                        <div className="w-full h-full bg-road-paint/5 flex items-center justify-center text-road-paint/20">
                          <Target size={48} />
                        </div>
                      )}
                    </div>

                    {/* Text Section */}
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl leading-tight font-display text-road-paint mb-6">
                        {rel.title}
                      </h3>

                      <div className="flex flex-row gap-4 mt-auto">
                        <div className="flex items-center gap-3">
                          <span className="text-asphalt flex-shrink-0 bg-asphalt/5 p-2 rounded-lg">{getCategoryIcon(rel.category)}</span>
                          <span className="text-sm font-bold text-asphalt tracking-wide truncate">{rel.category}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-marking flex-shrink-0 bg-marking/10 p-2 rounded-lg"><Target size={22} /></span>
                          <span className="text-sm font-bold text-marking tracking-wide truncate">{relIsland}</span>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-road-paint/10">
                        <div className="inline-block group-hover:text-road-paint relative font-display text-sm tracking-widest uppercase text-asphalt transition-colors">
                          Learn More
                          <span className="absolute -bottom-1.5 left-0 w-0 h-[3px] bg-marking transition-all duration-300 ease-out group-hover:w-full" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}