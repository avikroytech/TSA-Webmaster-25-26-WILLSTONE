import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { supabase } from "@/utils/supabase/server";

export default async function Test() {
    const {data: resources, error} = await supabase.from("community_resources").select();
    console.log(resources[0]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-slate-950 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources?.map((resource) => (
                        <div key={resource.id} className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700 hover:border-slate-500 transition">
                            <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                            <p className="text-slate-300 text-sm mb-4">{resource.category}</p>
                            <p className="text-slate-300 text-sm mb-4">{resource.address}</p>
                            <p className="text-slate-300 text-sm mb-4">{resource.description}</p>
                            <p className="text-slate-300 text-sm mb-4">{resource.email}</p>
                            <p className="text-slate-300 text-sm mb-4">{resource.website}</p>
                            <p className="text-slate-300 text-sm mb-4">{JSON.stringify(resource.images, null, 2)}</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}