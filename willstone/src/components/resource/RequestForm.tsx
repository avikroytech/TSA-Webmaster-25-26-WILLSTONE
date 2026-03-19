'use client';

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { sendConfirmationEmail } from "@/utils/sendEmail";
import { Send, MapPin, Tag, Info, AlertTriangle, CheckCircle, ChevronDown } from "lucide-react";

export default function RequestForm() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        title: "",
        description: "",
        category: "",
        custom_category: "",
        address: "",
    });

    const [charCount, setCharCount] = useState(0);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const categoryRef = useRef<HTMLDivElement>(null);
    const maxChars = 500;

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const { data, error } = await supabase
                    .from("community_resources")
                    .select("category");

                if (error) {
                    console.error("Error fetching categories:", error);
                } else if (data) {
                    const uniqueCategories = Array.from(
                        new Set(data.map((item: any) => item.category))
                    ).filter(Boolean) as string[];

                    setCategories(uniqueCategories.sort());
                }
            } catch (err) {
                console.error("Unexpected error fetching categories:", err);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "description") {
            setCharCount(value.length);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");

        try {
            const { error } = await supabase
                .from("community_requests")
                .insert([formData]);

            if (error) {
                console.error("Error inserting record:", error);
                setStatus("error");
                setErrorMessage("Failed to submit resource to the database.");
                return;
            }

            // 2. Trigger Server-Side Email
            const emailResult = await sendConfirmationEmail(
                formData.email,
                formData.first_name,
                formData.title
            );

            if (!emailResult.success) {
                console.warn("Database succeeded, but email failed:", emailResult.error);
            }

            setSubmittedData(formData);
            setStatus("success");
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                title: "",
                description: "",
                category: "",
                custom_category: "",
                address: "",
            });
            setCharCount(0);
        } catch (err) {
            console.error("Unexpected error:", err);
            setStatus("error");
            setErrorMessage("An unexpected error occurred while submitting.");
        }
    };

    // Shared tailwind classes for inputs
    const inputClasses = "w-full px-4 py-3 bg-white border-2 border-[#264D52]/20 rounded-xl text-[#264D52] focus:outline-none focus:border-[#496A49] focus:ring-1 focus:ring-[#496A49] transition-all placeholder:text-[#264D52]/40";
    const darkInputClasses = "w-full px-4 py-3 bg-[#264D52] border-2 border-[#264D52] rounded-xl text-white focus:outline-none focus:border-[#496A49] focus:ring-1 focus:ring-[#496A49] transition-all placeholder:text-white/50";
    const labelClasses = "flex items-center gap-2 text-[#264D52] font-black tracking-widest text-s mb-2";
    const RequiredMarker = () => <span className="text-red-500 ml-1">*</span>;

    if (status === "success" && submittedData) {
        return (
            <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 border border-[#264D52]/10 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border-b-2 border-[#264D52]/10 pb-6 mb-8 text-center flex flex-col items-center">
                    <CheckCircle size={48} className="text-[#496A49] mb-4" />
                    <h2 className="text-3xl font-display font-black text-[#264D52]">
                        Resource <span className="text-[#496A49]">Submitted</span>
                    </h2>
                    <p className="text-[#264D52] text-sm font-medium mt-2 uppercase tracking-widest">Thank you for contributing to Willstone. An email has been sent to you with the details of your request.</p>
                </div>

                <div className="space-y-4 mb-10">
                    <h3 className="font-black text-[#264D52] uppercase tracking-widest text-sm border-b-2 border-[#496A49]/30 pb-2 flex items-center gap-2"><Info size={16} /> Submission Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#f5f0eb]/50 border-2 border-[#264D52]/10 rounded-2xl">
                        <div>
                            <p className="text-[#496A49] text-[10px] font-bold uppercase tracking-widest mb-1">Submitted By</p>
                            <p className="text-[#264D52] font-medium">{submittedData.first_name} {submittedData.last_name}</p>
                            <p className="text-[#264D52]/70 text-sm mt-1">{submittedData.email}</p>
                            <p className="text-[#264D52]/70 text-sm">{submittedData.phone}</p>
                        </div>
                        <div>
                            <p className="text-[#496A49] text-[10px] font-bold uppercase tracking-widest mb-1">Resource Info</p>
                            <p className="text-[#264D52] font-black text-lg">{submittedData.title}</p>
                            <p className="text-[#264D52] capitalize text-sm font-bold my-1">
                                {submittedData.category === 'other' ? submittedData.custom_category : submittedData.category}
                            </p>
                            <p className="text-[#264D52]/80 text-sm flex items-start gap-1 mt-2">
                                <MapPin size={14} className="mt-0.5 shrink-0" /> {submittedData.address}
                            </p>
                        </div>
                        <div className="md:col-span-2 pt-4 border-t-2 border-[#264D52]/10">
                            <p className="text-[#496A49] text-[10px] font-bold uppercase tracking-widest mb-2">Description</p>
                            <p className="text-[#264D52] font-medium leading-relaxed italic border-l-4 border-[#496A49] pl-4">{submittedData.description}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => { setStatus("idle"); setSubmittedData(null); }}
                    className="group w-full relative overflow-hidden rounded-xl"
                >
                    <div className="bg-[#264D52] text-[#f5f0eb] font-black uppercase tracking-[0.2em] text-sm py-4 group-hover:bg-[#496A49] transition-all flex items-center justify-center gap-3 active:translate-y-1">
                        <div className="flex items-center gap-2">Submit Another Resource</div>
                    </div>
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl">

            <div className="border-b-2 border-[#264D52]/10 pb-6 mb-8">
                <h1 className="text-4xl text-center font-display font-black text-[#264D52]">
                    Submit A Resource
                </h1>
                <p className="text-[var(--brand-dark)] text-sm font-medium mt-1 tracking-widest">Suggest a program/service to add to the community</p>
                <div className="mt-4 flex items-center gap-1.5 bg-[#264D52]/5 px-4 py-2 rounded-xl text-xs font-bold text-[#264D52] border border-[#264D52]/10 w-fit">
                    <span className="text-red-500 text-lg leading-none">*</span>
                    <span className="uppercase tracking-widest">Indicates a mandatory field</span>
                </div>
            </div>

            {status === "error" && (
                <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 mb-8 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300 shadow-sm">
                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="font-black uppercase tracking-widest text-red-600 text-sm mb-1">Submission Error</p>
                        <p className="text-red-800 font-medium text-sm">{errorMessage}</p>
                    </div>
                </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>First Name <RequiredMarker /></label>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    />
                </div>
                <div>
                    <label className={labelClasses}>Last Name <RequiredMarker /></label>
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    />
                </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Email Address <RequiredMarker /></label>
                    <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    />
                </div>
                <div>
                    <label className={labelClasses}>Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="(555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses}
                    />
                </div>
            </div>

            {/* Resource Title */}
            <div>
                <label className={labelClasses}><Info size={14} /> Resource Title <RequiredMarker /></label>
                <input
                    type="text"
                    name="title"
                    placeholder="e.g., Willstone Central Library"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                />
            </div>

            {/* Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div ref={categoryRef} className="relative z-50">
                    <label className={labelClasses}><Tag size={14} /> Category <RequiredMarker /></label>
                    <div
                        className={`${darkInputClasses} flex justify-between items-center cursor-pointer select-none`}
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    >
                        <span className={formData.category ? "text-white" : "text-white/50"}>
                            {formData.category ?
                                (formData.category === 'other' ? 'Other' :
                                    formData.category.charAt(0).toUpperCase() + formData.category.slice(1))
                                : (isLoadingCategories ? "Loading categories..." : "Select a category")}
                        </span>
                        <ChevronDown size={20} className={`text-white transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isCategoryOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#264D52] border-2 border-[#264D52] rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 z-50">
                            {[
                                ...categories.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) })),
                                { value: "other", label: "Other" }
                            ].map((option) => (
                                <div
                                    key={option.value}
                                    className="px-5 py-3 text-white hover:bg-[#496A49] transition-colors cursor-pointer first:border-t-0 border-t border-white/10"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, category: option.value }));
                                        setIsCategoryOpen(false);
                                    }}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {formData.category === "other" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className={labelClasses}>Custom Category <RequiredMarker /></label>
                        <input
                            type="text"
                            name="custom_category"
                            value={formData.custom_category}
                            onChange={handleChange}
                            placeholder="Enter custom category"
                            required
                            className={inputClasses}
                        />
                    </div>
                )}
            </div>

            {/* Address */}
            <div>
                <label className={labelClasses}><MapPin size={14} /> Location / Address</label>
                <input
                    type="text"
                    name="address"
                    placeholder="123 Highway Ave, Willstone"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClasses}
                />
            </div>

            {/* Resource Description */}
            <div>
                <label className={labelClasses}>Description <RequiredMarker /></label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={maxChars}
                    placeholder="Provide details about this resource..."
                    required
                    className={`${inputClasses} resize-none h-32 rounded-xl`}
                />
                <p className="text-[#496A49] text-[10px] font-bold uppercase tracking-widest mt-2 text-right">
                    {charCount} / {maxChars} Characters
                </p>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={status === "submitting"}
                className="group w-full relative overflow-hidden rounded-xl"
            >
                <div className="bg-[#264D52] text-[#f5f0eb] font-black uppercase tracking-[0.2em] text-sm py-4 group-hover:bg-[#496A49] transition-all flex items-center justify-center gap-3 active:translate-y-1">
                    <div className="flex items-center gap-2">
                        {status === "submitting" ? "Processing..." : (
                            <>
                                Submit Entry <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                </div>
            </button>
        </form>
    );
}