import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { supabase } from "@/utils/supabase/server";

export default async function ResourcePage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    const { data, error } = await supabase
        .from('community_resources')
        .select('title, category, description, images, address')
        .eq('page_num', slug)
        .single();

    if (error) {
        console.error('Error fetching resource:', error);
        return <div>Error loading resource</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 p-2">
                <h1>{data.title}</h1>
                <p>{data.category}</p>
                <p>{data.description}</p>
                <p>{data.address}</p>
            </main>
            <Footer />
        </div>
    );
}