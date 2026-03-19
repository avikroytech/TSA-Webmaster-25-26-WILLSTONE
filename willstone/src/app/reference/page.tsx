"use client";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, FileText, Code, Link as LinkIcon, Info } from "lucide-react";
import { imageLinks } from "@/data/referenceLinks";


interface AccordionItemProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

const AccordionItem = ({ title, icon, children, isOpen, onToggle }: AccordionItemProps) => {
    return (
        <div className="border-b border-[#264D52]/20 last:border-0 mb-4 bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm border border-[#264D52]/10">
            <button
                onClick={onToggle}
                className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-[#264D52]/5 transition-colors group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg transition-colors ${isOpen ? 'bg-[#264D52] text-white' : 'bg-[#264D52]/10 text-[#264D52] group-hover:bg-[#264D52]/20'}`}>
                        {icon}
                    </div>
                    <span className="font-display text-xl font-bold text-[#264D52] tracking-wide">
                        {title}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="text-[#264D52]"
                >
                    <ChevronDown size={24} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className="p-6 pt-0 border-t border-[#264D52]/10">
                            <div className="mt-4">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const PDFViewer = ({ src }: { src: string }) => {
    return (
        <div className="bg-white border-4 border-[#264D52] shadow-xl relative overflow-hidden rounded-lg">
            <object
                data={`${src}#view=FitH`}
                type="application/pdf"
                className="w-full h-[600px] md:h-[800px]"
            >
                <div className="flex flex-col items-center justify-center h-full p-10 text-center bg-[#f5f0eb]">
                    <FileText size={48} className="text-[#264D52] mb-4 opacity-50" />
                    <p className="text-[#264D52] font-bold text-xl mb-4">
                        PDF Viewer not supported by your browser.
                    </p>
                    <a
                        href={src}
                        className="px-8 py-3 bg-[#264D52] text-white font-black tracking-widest hover:bg-[#496A49] transition-all transform hover:scale-105"
                        download
                    >
                        Download Document
                    </a>
                </div>
            </object>
        </div>
    );
};

const LinkList = ({ items }: { items: { label: string; url: string }[] }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, index) => (
                <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white border border-[#264D52]/20 rounded-xl hover:border-[#264D52] hover:shadow-lg transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <LinkIcon size={18} className="text-[#264D52] opacity-50 group-hover:opacity-100" />
                        <span className="font-sans font-semibold text-[#264D52] group-hover:text-[#496A49]">
                            {item.label}
                        </span>
                    </div>
                    <ExternalLink size={16} className="text-[#264D52] opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
            ))}
        </div>
    );
};

const CodeStackItem = ({ name, description }: { name: string; description: string }) => (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-4 last:mb-0 p-4 bg-white/40 border border-[#264D52]/10 rounded-xl hover:bg-white hover:border-[#264D52]/30 transition-all group">
        <span className="px-4 py-1.5 bg-[#264D52] text-white rounded-full text-xs whitespace-nowrap w-fit shadow-sm group-hover:bg-[#496A49] transition-colors">
            {name}
        </span>
        <p className="text-[#264D52] font-sans text-sm md:text-base leading-relaxed font-medium">
            {description}
        </p>
    </div>
);

export default function Reference() {
    const [openSection, setOpenSection] = useState<string | null>("Worklog");

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const researchLinks = [
        {
            "label": "UK Government Design System - Get Started",
            "url": "https://design-system.service.gov.uk/get-started/"
        },
        {
            "label": "Gouvernement du Québec",
            "url": "https://www.quebec.ca/en"
        },
        {
            "label": "Government of the Netherlands",
            "url": "https://www.government.nl/"
        },
        {
            "label": "City of Amsterdam",
            "url": "https://www.amsterdam.nl/en/"
        },
        {
            "label": "City and County of San Francisco",
            "url": "https://www.sf.gov/"
        },
        {
            "label": "City of Oakland",
            "url": "https://www.oaklandca.gov/Home"
        },
        {
            "label": "City of Seattle",
            "url": "https://www.seattle.gov/"
        },
        {
            "label": "City of Miami",
            "url": "https://www.miami.gov/Home"
        },
        {
            "label": "East Bay Regional Park District",
            "url": "https://www.ebparks.org/"
        },
        {
            "label": "Commonwealth of Massachusetts",
            "url": "https://www.mass.gov/"
        },
        {
            "label": "City of Minneapolis",
            "url": "https://www.minneapolismn.gov/"
        },
        {
            "label": "Colts Neck Township",
            "url": "https://coltsneck.org/"
        },
        {
            "label": "City of Riga",
            "url": "https://www.riga.lv/lv"
        },
        {
            "label": "10 Must-Have Features of Government Websites - MunicipalOne",
            "url": "https://www.municipalone.com/news/11/10-must-have-features-of-government-websites"
        },
        {
            "label": "5 Tips for Creating the Best City Websites - SDL",
            "url": "https://getsdl.com/resources/blog/5-tips-for-creating-the-best-city-websites/"
        },
        {
            "label": "Municipal Website Best Practices - Town Web",
            "url": "https://townweb.com/blog/municipal-website-best-practice/"
        },
        {
            "label": "Small Town, Big Website?: Cities and their Representation on the Internet",
            "url": "https://www.sciencedirect.com/science/article/abs/pii/S0264275101000452"
        },
        {
            "label": "Metropolitan Websites as Urban Communication",
            "url": "https://academic.oup.com/jcmc/article/11/4/957/4617710"
        },
        {
            "label": "Are small cities online? Content, ranking, and variation of U.S. municipal websites",
            "url": "https://www.sciencedirect.com/science/article/abs/pii/S0740624X16302313"
        }
    ];

    const codeStack = [
        { name: "lucide-react", description: "A library of modern icons for React-based websites." },
        { name: "framer-motion", description: "A library used to create smooth animations and interactive transitions." },
        { name: "supabase", description: "A backend service from Supabase used to communicate with the PostgreSQL database API." },
        { name: "nodemailer", description: "A library used to send automated emails from a specified email address." },
        { name: "vercel", description: "Our hosting platform, especially optimized for Next.js web application deployment." },
        { name: "Gemini API", description: "An interface used to communicate with Google's advanced Gemini AI models." },
        { name: "google/genai", description: "A library built for seamless Gemini API integration in Next.js applications." }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f0eb]">
            <Navbar />

            <main className="flex-1 px-6 pt-32 pb-16 md:px-16 md:pt-40 md:pb-24 lg:px-24 lg:pt-48 lg:pb-32 flex flex-col items-center">
                <div className="w-full max-w-5xl">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 text-center"
                    >
                        <h1 className="text-[#264D52] font-display font-black text-4xl md:text-6xl mb-6">
                            References
                        </h1>
                    </motion.div>

                    {/* Accordion List */}
                    <div className="space-y-2">
                        <AccordionItem
                            title="Worklog"
                            icon={<FileText size={22} />}
                            isOpen={openSection === "Worklog"}
                            onToggle={() => toggleSection("Worklog")}
                        >
                            <PDFViewer src="/pdf/Webmaster_Worklog_States.pdf" />
                        </AccordionItem>

                        <AccordionItem
                            title="Copyright Checklist"
                            icon={<Info size={22} />}
                            isOpen={openSection === "Copyright Checklist"}
                            onToggle={() => toggleSection("Copyright Checklist")}
                        >
                            <PDFViewer src="/pdf/Copyright-Checklist-Signed.pdf" />
                        </AccordionItem>

                        <AccordionItem
                            title="Code Stack"
                            icon={<Code size={22} />}
                            isOpen={openSection === "Code Stack"}
                            onToggle={() => toggleSection("Code Stack")}
                        >
                            <p className="text-foreground text-lg mb-4">
                                This website was built on NextJS, a professional optimized framework that is built on top of ReactJS.
                                For deployment, we used Vercel as it has a semi-customizable URL for recognizability and a reliable
                                server-hosting platform. Figma was mainly used for picking out the color scheme, designing components,
                                and putting together all the pages shown on our website. These designs were then translated into HTML
                                using a combination of TailwindCSS, a framework with a robust set of predefined classes that allow
                                shorthand CSS to be written on components, and our own CSS classes. The logo and map are both designed
                                by our team in Adobe Illustrator. All information for the resources, guides, and news articles, and
                                calendar events are all written by our team. For storing our information relating to our website, we use
                                Supabase, a PostgreSQL database, and its API library to retrieve and add data. We also utilized Google
                                Gemini’s API to run our AI assistant on the backend.
                            </p>
                            <h2 className="text-foreground text-lg mt-4">
                                Libraries Used:
                            </h2>
                            <div className="space-y-3">
                                {codeStack.map((item, i) => (
                                    <CodeStackItem key={i} name={item.name} description={item.description} />
                                ))}
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            title="Image Links"
                            icon={<LinkIcon size={22} />}
                            isOpen={openSection === "Image Links"}
                            onToggle={() => toggleSection("Image Links")}
                        >
                            <p className="text-foreground text-lg mb-4">All images used are licensed under Unsplash, Pixabay, or Creative Commons license, or were part of public domain.</p>
                            <LinkList items={imageLinks} />
                        </AccordionItem>

                        <AccordionItem
                            title="Research Links"
                            icon={<LinkIcon size={22} />}
                            isOpen={openSection === "Research Links"}
                            onToggle={() => toggleSection("Research Links")}
                        >
                            <LinkList items={researchLinks} />
                        </AccordionItem>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
