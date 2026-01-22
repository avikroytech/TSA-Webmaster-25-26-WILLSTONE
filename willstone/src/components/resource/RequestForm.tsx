'use client';

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Send, MapPin, Tag, Info } from "lucide-react";

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
    const [loading, setLoading] = useState(false);
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
        setLoading(true);

        try {
            const { error } = await supabase
                .from("community_requests")
                .insert([formData]);

            if (error) {
                console.error("Error inserting record:", error);
                alert("Failed to submit resource");
                return;
            }

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
            alert("Resource submitted successfully!");
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Shared tailwind classes for inputs
    const inputClasses = "w-full px-4 py-3 bg-white border-2 border-[#2D336B]/20 text-[#2D336B] focus:outline-none focus:border-[#7886C7] focus:ring-1 focus:ring-[#7886C7] transition-all placeholder:text-[#A9B5DF]";
    const labelClasses = "flex items-center gap-2 text-[#2D336B] font-black uppercase tracking-widest text-xs mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-[#FFF2F2] p-8 md:p-12 border-4 border-[#2D336B] shadow-[12px_12px_0px_#A9B5DF]">
            
            <div className="border-b-2 border-[#2D336B]/10 pb-6 mb-8">
                <h2 className="text-3xl font-display font-black text-[#2D336B] uppercase tracking-tighter">
                    Submit a <span className="text-[#7886C7]">Resource</span>
                </h2>
                <p className="text-[#7886C7] text-sm font-medium mt-1 uppercase tracking-widest">Route your contribution to the community</p>
            </div>

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
                <label className={labelClasses}><Info size={14}/> Resource Title</label>
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
                    <label className={labelClasses}><Tag size={14}/> Category</label>
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
                <label className={labelClasses}><MapPin size={14}/> Location / Address</label>
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
                <p className="text-[#7886C7] text-[10px] font-bold uppercase tracking-widest mt-2 text-right">
                    {charCount} / {maxChars} Characters
                </p>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="group w-full relative overflow-hidden"
            >
                <div className="bg-[#2D336B] text-[#FFF2F2] font-black uppercase tracking-[0.2em] text-sm py-4 transform -skew-x-12 group-hover:bg-[#7886C7] transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_#A9B5DF] active:translate-y-1 active:shadow-none">
                    <div className="transform skew-x-12 flex items-center gap-2">
                        {loading ? "Processing..." : (
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