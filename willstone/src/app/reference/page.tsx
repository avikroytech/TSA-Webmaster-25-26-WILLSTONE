import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export default function Reference() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Main content area with your soft red/pink background */}
            <main className="flex-1 bg-[#f5f0eb] p-4 md:p-12 flex flex-col items-center">

                <div className="w-full max-w-6xl">
                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-[#264D52] font-black uppercase tracking-[0.3em] text-3xl md:text-4xl text-center">
                            Reference Page
                        </h1>
                        <div className="h-1.5 w-24 bg-[#496A49] mx-auto mt-4" />
                    </div>

                    {/* PDF Embed Wrapper */}
                    <div className="bg-white border-[8px] border-[#264D52] shadow-[20px_20px_0px_rgba(45,51,107,0.1)] relative">
                        {/* Using an object tag as it's often more robust than iframe 
                            for PDFs, but both work well in modern browsers.
                        */}
                        <object
                            data="/Webmaster_Work.pdf#view=FitH"
                            type="application/pdf"
                            className="w-full h-[700px] md:h-[900px]"
                        >
                            {/* Detailed Fallback for browsers that don't support embeds */}
                            <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                                <p className="text-[#264D52] font-bold text-xl mb-4">
                                    PDF Viewer not supported by your browser.
                                </p>
                                <a
                                    href="/document.pdf"
                                    className="px-8 py-3 bg-[#264D52] text-white font-black uppercase tracking-widest hover:bg-[#496A49] transition-colors"
                                >
                                    Download Document
                                </a>
                            </div>
                        </object>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}