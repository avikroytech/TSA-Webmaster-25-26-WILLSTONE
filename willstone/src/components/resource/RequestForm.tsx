"use client";

import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Info,
  MapPin,
  Send,
  Tag,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sendConfirmationEmail } from "@/utils/sendEmail";
import { supabase } from "@/utils/supabase/client";

type CategoryRow = {
  category: string | null;
};

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
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(
    null,
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
          const categoryRows = data as CategoryRow[];
          const uniqueCategories = Array.from(
            new Set(categoryRows.map((item) => item.category)),
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
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "description") {
      setCharCount(value.length);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.first_name.trim())
      errors.first_name = "First name is required.";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      errors.email = "Enter a valid email address.";
    if (
      formData.phone.trim() &&
      !/^[0-9()+\-\s.]{7,20}$/.test(formData.phone.trim())
    )
      errors.phone = "Enter a valid phone number.";
    if (!formData.title.trim()) errors.title = "Resource title is required.";
    if (!formData.category) errors.category = "Choose a category.";
    if (formData.category === "other" && !formData.custom_category.trim())
      errors.custom_category = "Custom category is required.";
    if (!formData.description.trim() || formData.description.trim().length < 24)
      errors.description =
        "Add at least 24 characters so reviewers have enough context.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent,
    selectOption: () => void,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("community_requests")
        .insert([formData]);

      if (error) {
        console.error("Error inserting record:", error);
        setStatus("error");
        setErrorMessage(
          "We couldn't save this resource request. Please check your connection and try again.",
        );
        return;
      }

      // 2. Trigger Server-Side Email
      const emailResult = await sendConfirmationEmail(
        formData.email,
        formData.first_name,
        formData.title,
      );

      if (!emailResult.success) {
        console.warn(
          "Database succeeded, but email failed:",
          emailResult.error,
        );
      }

      const savedSubmissions = window.localStorage.getItem(
        "willstone-submissions",
      );
      const submissions = savedSubmissions ? JSON.parse(savedSubmissions) : [];
      window.localStorage.setItem(
        "willstone-submissions",
        JSON.stringify(
          [
            {
              ...formData,
              id: crypto.randomUUID(),
              submitted_at: new Date().toISOString(),
            },
            ...submissions,
          ].slice(0, 25),
        ),
      );

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
      setErrorMessage(
        "Something went wrong while submitting. Your form entries are still here, so you can try again.",
      );
    }
  };

  // Shared tailwind classes for inputs
  const inputClasses =
    "w-full px-4 py-3 bg-white border-2 border-[#264D52]/20 rounded-xl text-[#264D52] focus:outline-none focus:border-[#496A49] focus:ring-1 focus:ring-[#496A49] transition-all placeholder:text-[#264D52]/40";
  const darkInputClasses =
    "w-full px-4 py-3 bg-[#264D52] border-2 border-[#264D52] rounded-xl text-white focus:outline-none focus:border-[#496A49] focus:ring-1 focus:ring-[#496A49] transition-all placeholder:text-white/50";
  const labelClasses =
    "flex items-center gap-2 text-[#264D52] font-black tracking-widest text-sm mb-2";
  const RequiredMarker = () => (
    <span className="ml-1 text-[#8a3f19]" aria-hidden="true">
      *
    </span>
  );
  const FieldError = ({ name }: { name: string }) =>
    fieldErrors[name] ? (
      <p className="mt-2 text-xs font-bold text-red-600">{fieldErrors[name]}</p>
    ) : null;

  if (status === "success" && submittedData) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 border border-[#264D52]/10 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="border-b-2 border-[#264D52]/10 pb-6 mb-8 text-center flex flex-col items-center">
          <CheckCircle size={48} className="text-[#496A49] mb-4" />
          <h2 className="text-3xl font-display font-black text-[#264D52]">
            Resource <span className="text-[#496A49]">Submitted</span>
          </h2>
          <p className="text-[#264D52] text-sm font-medium mt-2 uppercase tracking-widest">
            Thank you for contributing to Willstone. An email has been sent to
            you with the details of your request.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          <h3 className="font-black text-[#264D52] uppercase tracking-widest text-sm border-b-2 border-[#496A49]/30 pb-2 flex items-center gap-2">
            <Info size={16} /> Submission Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#f5f0eb]/50 border-2 border-[#264D52]/10 rounded-2xl">
            <div>
              <p className="text-[#496A49] text-[10px] font-bold uppercase tracking-widest mb-1">
                Submitted By
              </p>
              <p className="text-[#264D52] font-medium">
                {submittedData.first_name} {submittedData.last_name}
              </p>
              <p className="text-[#264D52]/70 text-sm mt-1">
                {submittedData.email}
              </p>
              <p className="text-[#264D52]/70 text-sm">{submittedData.phone}</p>
            </div>
            <div>
              <p className="text-[#496A49] text-[10px] font-bold uppercase tracking-widest mb-1">
                Resource Info
              </p>
              <p className="text-[#264D52] font-black text-lg">
                {submittedData.title}
              </p>
              <p className="text-[#264D52] capitalize text-sm font-bold my-1">
                {submittedData.category === "other"
                  ? submittedData.custom_category
                  : submittedData.category}
              </p>
              <p className="text-[#264D52]/80 text-sm flex items-start gap-1 mt-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />{" "}
                {submittedData.address}
              </p>
            </div>
            <div className="md:col-span-2 pt-4 border-t-2 border-[#264D52]/10">
              <p className="text-[#496A49] text-[10px] font-bold uppercase tracking-widest mb-2">
                Description
              </p>
              <p className="rounded-xl border border-[#496A49]/20 bg-[#496A49]/5 p-4 text-[#264D52] font-medium leading-relaxed italic">
                {submittedData.description}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setSubmittedData(null);
          }}
          className="group w-full relative overflow-hidden rounded-xl"
        >
          <div className="bg-[#264D52] text-[#f5f0eb] font-black uppercase tracking-[0.2em] text-sm py-4 group-hover:bg-[#496A49] transition-all flex items-center justify-center gap-3 active:translate-y-1">
            <div className="flex items-center gap-2">
              Submit Another Resource
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl"
    >
      <div className="border-b-2 border-[#264D52]/10 pb-6 mb-8">
        <h1 className="text-4xl text-center font-display font-black text-[#264D52]">
          Submit A Resource
        </h1>
        <p className="text-[var(--brand-dark)] text-sm font-medium mt-1 tracking-widest">
          Suggest a program/service to add to the community
        </p>
        <div className="mt-4 flex items-center gap-1.5 bg-[#264D52]/5 px-4 py-2 rounded-xl text-xs font-bold text-[#264D52] border border-[#264D52]/10 w-fit">
          <span
            className="text-[#8a3f19] text-lg leading-none"
            aria-hidden="true"
          >
            *
          </span>
          <span className="text-sm">Indicates a mandatory field</span>
        </div>
      </div>

      {status === "error" && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 mb-8 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300 shadow-sm">
          <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-black uppercase tracking-widest text-red-600 text-sm mb-1">
              Submission Error
            </p>
            <p className="text-red-800 font-medium text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="first_name" className={labelClasses}>
            First Name <RequiredMarker />
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            placeholder="First name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className={inputClasses}
            aria-invalid={Boolean(fieldErrors.first_name)}
          />
          <FieldError name="first_name" />
        </div>
        <div>
          <label htmlFor="last_name" className={labelClasses}>
            Last Name <RequiredMarker />
          </label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            placeholder="Last name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className={inputClasses}
            aria-invalid={Boolean(fieldErrors.last_name)}
          />
          <FieldError name="last_name" />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email Address <RequiredMarker />
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClasses}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          <FieldError name="email" />
        </div>
        <div>
          <label htmlFor="phone" className={labelClasses}>
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="(555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses}
            aria-invalid={Boolean(fieldErrors.phone)}
          />
          <FieldError name="phone" />
        </div>
      </div>

      {/* Resource Title */}
      <div>
        <label htmlFor="title" className={labelClasses}>
          <Info size={14} /> Resource Title <RequiredMarker />
        </label>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="e.g., Willstone Central Library"
          value={formData.title}
          onChange={handleChange}
          required
          className={inputClasses}
          aria-invalid={Boolean(fieldErrors.title)}
        />
        <FieldError name="title" />
      </div>

      {/* Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div ref={categoryRef} className="relative z-50">
          <span id="category-label" className={labelClasses}>
            <Tag size={14} /> Category <RequiredMarker />
          </span>
          <button
            type="button"
            aria-labelledby="category-label"
            aria-haspopup="listbox"
            aria-expanded={isCategoryOpen}
            className={`${darkInputClasses} flex justify-between items-center cursor-pointer select-none`}
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span
              className={formData.category ? "text-white" : "text-white/50"}
            >
              {formData.category
                ? formData.category === "other"
                  ? "Other"
                  : formData.category.charAt(0).toUpperCase() +
                    formData.category.slice(1)
                : isLoadingCategories
                  ? "Loading categories..."
                  : "Select a category"}
            </span>
            <ChevronDown
              size={20}
              className={`text-white transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
            />
          </button>
          <FieldError name="category" />

          {isCategoryOpen && (
            <div
              role="listbox"
              className="absolute top-full left-0 right-0 mt-2 bg-[#264D52] border-2 border-[#264D52] rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 z-50"
            >
              {[
                ...categories.map((cat) => ({
                  value: cat,
                  label: cat.charAt(0).toUpperCase() + cat.slice(1),
                })),
                { value: "other", label: "Other" },
              ].map((option) => (
                <button
                  type="button"
                  key={option.value}
                  role="option"
                  aria-selected={formData.category === option.value}
                  className="block w-full px-5 py-3 text-left text-white hover:bg-[#496A49] transition-colors cursor-pointer first:border-t-0 border-t border-white/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#d5b08c]"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      category: option.value,
                    }));
                    setIsCategoryOpen(false);
                  }}
                  onKeyDown={(event) =>
                    handleOptionKeyDown(event, () => {
                      setFormData((prev) => ({
                        ...prev,
                        category: option.value,
                      }));
                      setIsCategoryOpen(false);
                    })
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {formData.category === "other" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label htmlFor="custom_category" className={labelClasses}>
              Custom Category <RequiredMarker />
            </label>
            <input
              id="custom_category"
              type="text"
              name="custom_category"
              value={formData.custom_category}
              onChange={handleChange}
              placeholder="Enter custom category"
              required
              className={inputClasses}
              aria-invalid={Boolean(fieldErrors.custom_category)}
            />
            <FieldError name="custom_category" />
          </div>
        )}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className={labelClasses}>
          <MapPin size={14} /> Location / Address
        </label>
        <input
          id="address"
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
        <label htmlFor="description" className={labelClasses}>
          Description <RequiredMarker />
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={maxChars}
          placeholder="Provide details about this resource..."
          required
          className={`${inputClasses} resize-none h-32 rounded-xl`}
          aria-invalid={Boolean(fieldErrors.description)}
        />
        <FieldError name="description" />
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
            {status === "submitting" ? (
              "Processing..."
            ) : (
              <>
                Submit Entry{" "}
                <Send
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </div>
        </div>
      </button>
    </form>
  );
}
