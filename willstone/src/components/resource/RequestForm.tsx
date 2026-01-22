'use client';

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

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
        console.log(formData);
        setLoading(true);

        try {
            const { error } = await supabase
                .from("community_requests")
                .insert([
                    formData
                ]);

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
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white font-semibold mb-2">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-white font-semibold mb-2">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-white font-semibold mb-2">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Resource Title */}
            <div>
                <label className="block text-white font-semibold mb-2">Resource Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Resource Description */}
            <div>
                <label className="block text-white font-semibold mb-2">Resource Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={maxChars}
                    required
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 resize-none"
                    rows={4}
                />
                <p className="text-slate-400 text-sm mt-1">{charCount}/{maxChars} characters</p>
            </div>

            {/* Category */}
            <div>
                <label className="block text-white font-semibold mb-2">Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                >
                    <option value="">Select a category</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="community">Community</option>
                    <option value="other">Other</option>
                </select>
                
                {formData.category === "other" && (
                    <input
                        type="text"
                        name="custom_category"
                        value={formData.custom_category}
                        onChange={handleChange}
                        placeholder="Enter custom category"
                        required
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 mt-2"
                    />
                )}
            </div>

            {/* Address */}
            <div>
                <label className="block text-white font-semibold mb-2">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-3 rounded transition"
            >
                {loading ? "Submitting..." : "Submit Resource"}
            </button>
        </form>
    );
}