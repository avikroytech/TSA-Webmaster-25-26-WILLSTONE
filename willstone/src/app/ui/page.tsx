"use client";

import React from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Info, ChevronRight, Play } from "lucide-react";

export default function UITestPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8 font-sans selection:bg-[#7886C7] selection:text-white">
            <div className="max-w-7xl mx-auto space-y-16">
                <header className="border-b-2 border-[#A9B5DF]/30 pb-8 pt-10">
                    <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-[#2D336B]">Design System</h1>
                    <p className="font-sans text-xl text-[#7886C7] mt-4 max-w-2xl">
                        A comprehensive testing ground for Willstone's typography, color palettes, and core UI components.
                    </p>
                </header>

                {/* COLORS */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2D336B] flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-[#FFF2F2]" />
                        </div>
                        <h2 className="text-3xl font-display font-semibold text-[#2D336B]">Color Palette</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <ColorSwatch name="Brand Light" variable="--brand-light" hex="#FFF2F2" className="bg-[#FFF2F2] text-[#2D336B] border border-[#A9B5DF]/20" />
                        <ColorSwatch name="Brand Muted" variable="--brand-muted" hex="#A9B5DF" className="bg-[#A9B5DF] text-[#2D336B]" />
                        <ColorSwatch name="Brand Medium" variable="--brand-medium" hex="#7886C7" className="bg-[#7886C7] text-white" />
                        <ColorSwatch name="Brand Dark" variable="--brand-dark" hex="#2D336B" className="bg-[#2D336B] text-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-8">
                        <ColorSwatch name="Background" variable="--background" hex="#FFF2F2" className="bg-[var(--background)] text-[var(--foreground)] border-2 border-dashed border-[#A9B5DF]/50" />
                        <ColorSwatch name="Foreground" variable="--foreground" hex="#2D336B" className="bg-[var(--foreground)] text-[var(--background)] border-2 border-dashed border-[#7886C7]/50" />
                    </div>
                </section>

                {/* TYPOGRAPHY */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#7886C7] text-white font-display flex items-center justify-center text-xl">
                            Aa
                        </div>
                        <h2 className="text-3xl font-display font-semibold text-[#2D336B]">Typography</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-[#A9B5DF]/30 shadow-sm">

                        {/* Sans Serif - Inter */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[#7886C7] font-sans font-semibold mb-2 uppercase tracking-widest text-sm">Primary Font (Sans-serif)</h3>
                                <p className="text-4xl font-sans font-bold text-[#2D336B]">Inter</p>
                                <p className="font-sans text-[#A9B5DF] mt-1">System default, clean, legible</p>
                            </div>

                            <div className="space-y-6 font-sans">
                                <div>
                                    <p className="text-xs text-[#7886C7] mb-1">Display (6xl, Bold)</p>
                                    <p className="text-6xl font-bold leading-none text-[#2D336B]">Ag</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#7886C7] mb-1">Heading 1 (4xl, Semibold)</p>
                                    <p className="text-4xl font-semibold text-[#2D336B]">The quick brown fox</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#7886C7] mb-1">Heading 2 (2xl, Medium)</p>
                                    <p className="text-2xl font-medium text-[#2D336B]">Jumps over the lazy dog</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#7886C7] mb-1">Body Large (lg, Regular)</p>
                                    <p className="text-lg text-[#2D336B]/80 hover:text-[#2D336B] transition-colors line-clamp-2">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#7886C7] mb-1">Body Small (sm, Regular)</p>
                                    <p className="text-sm text-[#2D336B]/70 line-clamp-2">
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Serif - Playfair */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[#7886C7] font-sans font-semibold mb-2 uppercase tracking-widest text-sm">Display Font (Serif)</h3>
                                <p className="text-4xl font-display font-bold text-[#2D336B]">Playfair Display</p>
                                <p className="font-sans text-[#A9B5DF] mt-1">Headings, editorial, elegant</p>
                            </div>

                            <div className="space-y-6 font-display">
                                <div>
                                    <p className="text-xs font-sans text-[#7886C7] mb-1">Display (6xl, Bold)</p>
                                    <p className="text-6xl font-bold leading-none text-[#2D336B]">Ag</p>
                                </div>
                                <div>
                                    <p className="text-xs font-sans text-[#7886C7] mb-1">Heading 1 (4xl, Bold)</p>
                                    <p className="text-4xl font-bold text-[#2D336B]">The quick brown fox</p>
                                </div>
                                <div>
                                    <p className="text-xs font-sans text-[#7886C7] mb-1">Heading 2 (2xl, Semibold)</p>
                                    <p className="text-2xl font-semibold text-[#2D336B]">Jumps over the lazy dog</p>
                                </div>
                                <div className="font-sans text-[#2D336B]">
                                    <p className="text-xs text-[#7886C7] mb-1">Blockquote (xl, Italic)</p>
                                    <blockquote className="text-xl font-display italic text-[#2D336B]/80 border-l-4 border-[#7886C7] pl-4 py-1">
                                        "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
                                    </blockquote>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* UI COMPONENTS PREVIEW */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2D336B] flex items-center justify-center p-1.5">
                            <div className="w-full h-full bg-[#FFF2F2] rounded-sm" />
                        </div>
                        <h2 className="text-3xl font-display font-semibold text-[#2D336B]">Interactive Elements</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Buttons & Controls */}
                        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-[#A9B5DF]/30 shadow-sm space-y-8">
                            <h3 className="text-xl font-display font-semibold text-[#2D336B]">Buttons</h3>

                            <div className="space-y-6">
                                <div className="flex flex-wrap gap-4 items-center">
                                    <button type="button" className="bg-[#2D336B] hover:bg-[#1a1f4d] text-[#FFF2F2] px-6 py-3 rounded-full font-sans font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
                                        Primary Action <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button type="button" className="bg-[#7886C7] hover:bg-[#5a67a6] text-white px-6 py-3 rounded-full font-sans font-medium transition-all hover:shadow-lg hover:-translate-y-0.5">
                                        Secondary
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-4 items-center">
                                    <button type="button" className="bg-transparent border-2 border-[#2D336B] text-[#2D336B] hover:bg-[#2D336B] hover:text-[#FFF2F2] px-6 py-2.5 rounded-full font-sans font-medium transition-all">
                                        Outline Button
                                    </button>
                                    <button type="button" className="text-[#7886C7] hover:text-[#2D336B] font-sans font-medium px-4 py-2 hover:bg-[#A9B5DF]/20 rounded-lg transition-colors flex items-center gap-1">
                                        Ghost Button <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <button type="button" className="w-12 h-12 rounded-full bg-[#2D336B] text-[#FFF2F2] flex items-center justify-center hover:scale-110 transition-transform shadow-md" aria-label="Play">
                                        <Play className="w-5 h-5 ml-1" />
                                    </button>
                                    <button type="button" className="w-12 h-12 rounded-2xl bg-[#FFF2F2] text-[#2D336B] border-2 border-[#A9B5DF]/40 flex items-center justify-center hover:bg-[#A9B5DF]/20 transition-colors" aria-label="Info">
                                        <Info className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <hr className="border-[#A9B5DF]/30" />

                            <h3 className="text-xl font-display font-semibold text-[#2D336B]">Form Inputs</h3>
                            <div className="space-y-4 font-sans">
                                <div>
                                    <label className="block text-sm font-medium text-[#2D336B] mb-1.5 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="hello@willstone.city"
                                        className="w-full bg-white border-2 border-[#A9B5DF]/40 rounded-xl px-4 py-3 text-[#2D336B] placeholder-[#A9B5DF] focus:outline-none focus:border-[#7886C7] focus:ring-4 focus:ring-[#7886C7]/20 transition-all"
                                    />
                                </div>
                                <div className="flex items-center gap-3 bg-[#A9B5DF]/10 p-4 rounded-xl border border-[#A9B5DF]/30">
                                    <input type="checkbox" className="w-5 h-5 rounded border-[#A9B5DF] text-[#7886C7] focus:ring-[#7886C7]" defaultChecked />
                                    <span className="text-sm font-medium text-[#2D336B]">Subscribe to city updates</span>
                                </div>
                            </div>
                        </div>

                        {/* Cards & Badges */}
                        <div className="space-y-6">
                            <div className="bg-[#2D336B] p-8 rounded-3xl shadow-xl text-[#FFF2F2] group cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7886C7] rounded-bl-full opacity-20 group-hover:scale-110 transition-transform" />
                                <div className="relative z-10 space-y-4">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2F2]/10 backdrop-blur-md text-sm font-sans font-medium text-[#FFF2F2] border border-[#FFF2F2]/20">
                                        <span className="w-2 h-2 rounded-full bg-[#7886C7] animate-pulse" />
                                        Dark Card Concept
                                    </div>
                                    <h3 className="text-3xl font-display font-bold">Night time visibility rendering</h3>
                                    <p className="font-sans text-[#A9B5DF] leading-relaxed">
                                        Testing how text renders on our dark asphalt component. Ensure contrast ratios remain accessible.
                                    </p>
                                    <div className="pt-4 flex items-center font-sans font-medium text-[#7886C7] group-hover:text-[#FFF2F2] transition-colors">
                                        Read Analysis <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#FFF2F2] p-6 rounded-3xl border border-[#A9B5DF]/40 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#7886C7] shadow-sm">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <span className="bg-[#7886C7]/10 text-[#7886C7] font-sans font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-[#7886C7]/20">
                                        System Status
                                    </span>
                                </div>
                                <h4 className="font-sans font-bold text-[#2D336B] text-lg mb-1">All Systems Operational</h4>
                                <p className="font-sans text-sm text-[#A9B5DF]">Light card concept with standard border radius and subtle shadows.</p>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-red-200 flex gap-4 items-start shadow-sm">
                                <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                                <div className="font-sans">
                                    <h5 className="font-semibold text-[#2D336B]">Alert Component</h5>
                                    <p className="text-sm text-[#2D336B]/70 mt-1">This is how a standard warning or alert message would look within our palette.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="pt-16 pb-8 text-center text-[#A9B5DF] font-sans text-sm">
                    <p>Willstone Design System &copy; {new Date().getFullYear()}</p>
                </footer>
            </div>
        </div>
    );
}

function ColorSwatch({ name, variable, hex, className }: { name: string, variable: string, hex: string, className: string }) {
    return (
        <div className="group space-y-3">
            <div className={`h-32 rounded-2xl shadow-sm transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg flex items-end p-4 ${className}`}>
                <span className="font-mono text-sm opacity-80 backdrop-blur-md px-2 py-1 rounded bg-black/5 mix-blend-luminosity">{hex}</span>
            </div>
            <div>
                <p className="font-sans font-bold text-[#2D336B]">{name}</p>
                <p className="font-mono text-xs text-[#A9B5DF]">{variable}</p>
            </div>
        </div>
    );
}
