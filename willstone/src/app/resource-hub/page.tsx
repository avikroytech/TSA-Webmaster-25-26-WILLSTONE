import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ResourceDirectory from "@/components/resource/ResourceDirectory";

export default function ResourceHub() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f5f0eb] p-2">
        <ResourceDirectory />
      </main>
      <Footer />
    </div>
  );
}