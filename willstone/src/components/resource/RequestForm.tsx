'use client';

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { sendConfirmationEmail } from "@/utils/sendEmail";
import { Send, MapPin, Tag, Info, AlertTriangle, CheckCircle } from "lucide-react";

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
    const maxChars = 500;

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
    const inputClasses = "w-full px-4 py-3 bg-white border-2 border-[#264D52]/20 text-[#264D52] focus:outline-none focus:border-[#496A49] focus:ring-1 focus:ring-[#496A49] transition-all placeholder:text-[#C59F82]";
    const labelClasses = "flex items-center gap-2 text-[#264D52] font-black uppercase tracking-widest text-xs mb-2";

    if (status === "success" && submittedData) {
        return (
            <div className="bg-[#f5f0eb] p-8 md:p-12 border-4 border-[#264D52] shadow-[12px_12px_0px_#C59F82] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border-b-2 border-[#264D52]/10 pb-6 mb-8 text-center flex flex-col items-center">
                    <CheckCircle size={48} className="text-[#496A49] mb-4" />
                    <h2 className="text-3xl font-display font-black text-[#264D52] uppercase tracking-tighter">
                        Resource <span className="text-[#496A49]">Submitted</span>
                    </h2>
                    <p className="text-[#264D52] text-sm font-medium mt-2 uppercase tracking-widest">Thank you for contributing to Willstone</p>
                </div>

                <div className="space-y-4 mb-10">
                    <h3 className="font-black text-[#264D52] uppercase tracking-widest text-sm border-b-2 border-[#496A49]/30 pb-2 flex items-center gap-2"><Info size={16} /> Submission Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/50 border-2 border-[#264D52]/10">
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
                    className="group w-full relative overflow-hidden"
                >
                    <div className="bg-[#264D52] text-[#f5f0eb] font-black uppercase tracking-[0.2em] text-sm py-4 transform -skew-x-12 group-hover:bg-[#496A49] transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_#C59F82] active:translate-y-1 active:shadow-none">
                        <div className="transform skew-x-12">Submit Another Resource</div>
                    </div>
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-[#f5f0eb] p-8 md:p-12 border-4 border-[#264D52] shadow-[12px_12px_0px_#C59F82]">

            <div className="border-b-2 border-[#264D52]/10 pb-6 mb-8">
                <h2 className="text-3xl font-display font-black text-[#264D52] uppercase tracking-tighter">
                    Submit a <span className="text-[#496A49]">Resource</span>
                </h2>
                <p className="text-[#496A49] text-sm font-medium mt-1 uppercase tracking-widest">Suggest a program/service to add to the community</p>
            </div>

            {status === "error" && (
                <div className="bg-red-50 border-2 border-red-500 p-4 mb-8 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300 shadow-[4px_4px_0px_rgba(239,68,68,0.2)]">
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
                    <label className={labelClasses}>First Name</label>
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
                    <label className={labelClasses}>Last Name</label>
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
                    <label className={labelClasses}>Email Address</label>
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
                        required
                        className={inputClasses}
                    />
                </div>
            </div>

            {/* Resource Title */}
            <div>
                <label className={labelClasses}><Info size={14} /> Resource Title</label>
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
                <div>
                    <label className={labelClasses}><Tag size={14} /> Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className={`${inputClasses} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%232D336B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat`}
                    >
                        <option value="">Select a category</option>
                        <option value="education">Education</option>
                        <option value="health">Health</option>
                        <option value="community">Community</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {formData.category === "other" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className={labelClasses}>Custom Category</label>
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
                    required
                    className={inputClasses}
                />
            </div>

            {/* Resource Description */}
            <div>
                <label className={labelClasses}>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={maxChars}
                    placeholder="Provide details about this resource..."
                    required
                    className={`${inputClasses} resize-none h-32`}
                />
                <p className="text-[#496A49] text-[10px] font-bold uppercase tracking-widest mt-2 text-right">
                    {charCount} / {maxChars} Characters
                </p>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={status === "submitting"}
                className="group w-full relative overflow-hidden"
            >
                <div className="bg-[#264D52] text-[#f5f0eb] font-black uppercase tracking-[0.2em] text-sm py-4 transform -skew-x-12 group-hover:bg-[#496A49] transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_#C59F82] active:translate-y-1 active:shadow-none">
                    <div className="transform skew-x-12 flex items-center gap-2">
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