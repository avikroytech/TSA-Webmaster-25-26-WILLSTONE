import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { supabase } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    const { data: article, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching article:", error);
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const imageUrl = article?.image && Array.isArray(article.image) && article.image.length > 0
        ? article.image[0]
        : "";

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f0eb] text-[#1c2b2b]">
            <Navbar />
            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
                {article && (
                    <article>
                        {/* Back Link */}
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 text-[#264D52] hover:text-[#70AC90] font-bold text-sm uppercase tracking-wide mb-12 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to News
                        </Link>

                        {/* Title & Date */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-[#1c2b2b] leading-[1.1] mb-8">
                            {article.title}
                        </h1>

                        <div className="mb-12">
                            <p className="text-[#1c2b2b]/60 text-sm font-medium">
                                Published on {formatDate(article.date)}
                            </p>
                        </div>

                        {/* Hero Image */}
                        {imageUrl && (
                            <div className="relative w-full aspect-[4/3] md:aspect-[2/1] rounded-3xl overflow-hidden mb-16 shadow-lg">
                                <Image
                                    src={imageUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="prose prose-lg md:prose-xl max-w-none text-[#1c2b2b] font-sans leading-relaxed whitespace-pre-wrap">
                            {article.content}
                        </div>
                    </article>
                )}
            </main>
            <Footer />
        </div>
    );
}