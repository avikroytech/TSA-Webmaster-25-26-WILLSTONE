"use client";

import React from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Info, ChevronRight, Play } from "lucide-react";

export default function UITestPage() {
    return (
        <div className="min-h-screen bg-[#FBFFF1] text-foreground p-8 font-sans selection:bg-[#496A49] selection:text-white">
            <div className="max-w-7xl mx-auto space-y-16">
                <header className="border-b-2 border-[#C59F82]/30 pb-8 pt-10">
                    <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-[#264D52]">Design System</h1>
                    <p className="font-sans text-xl text-[#496A49] mt-4 max-w-2xl">
                        A comprehensive testing ground for Willstone's typography, color palettes, and core UI components.
                    </p>
                </header>

                {/* COLORS */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#496A49] flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-[#FBFFF1]" />
                        </div>
                        <h2 className="text-3xl font-display font-semibold text-[#264D52]">Color Palette</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <ColorSwatch name="Brand Light" variable="--brand-light" hex="#70AC90" className="bg-[#70AC90] text-[#264D52] border border-[#C59F82]/20" />
                        <ColorSwatch name="Brand Muted" variable="--brand-muted" hex="#C59F82" className="bg-[#C59F82] text-[#264D52]" />
                        <ColorSwatch name="Brand Medium" variable="--brand-medium" hex="#264D52" className="bg-[#264D52] text-white" />
                        <ColorSwatch name="Brand Dark" variable="--brand-dark" hex="#496A49" className="bg-[#496A49] text-white" />
                        <ColorSwatch name="Brand Text" variable="--brand-text" hex="#1c2b2b" className="bg-[#1c2b2b] text-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-8">
                        <ColorSwatch name="Background" variable="--background" hex="#f5f0eb" className="bg-[var(--background)] text-[var(--foreground)] border-2 border-dashed border-[#C59F82]/50" />
                        <ColorSwatch name="Foreground" variable="--foreground" hex="#264D52" className="bg-[var(--foreground)] text-[var(--background)] border-2 border-dashed border-[#496A49]/50" />
                    </div>
                </section>

                {/* TYPOGRAPHY */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#496A49] text-white font-display flex items-center justify-center text-xl">
                            Aa
                        </div>
                        <h2 className="text-3xl font-display font-semibold text-[#264D52]">Typography</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-[#C59F82]/30 shadow-sm">

                        {/* Sans Serif - Inter */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[#496A49] font-sans font-semibold mb-2 uppercase tracking-widest text-sm">Primary Font (Sans-serif)</h3>
                                <p className="text-4xl font-sans font-bold text-[#264D52]">Inter</p>
                                <p className="font-sans text-[#C59F82] mt-1">System default, clean, legible</p>
                            </div>

                            <div className="space-y-6 font-sans">
                                <div>
                                    <p className="text-xs text-[#496A49] mb-1">Display (6xl, Bold)</p>
                                    <p className="text-6xl font-bold leading-none text-[#264D52]">Ag</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#496A49] mb-1">Heading 1 (4xl, Semibold)</p>
                                    <p className="text-4xl font-semibold text-[#264D52]">The quick brown fox</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#496A49] mb-1">Heading 2 (2xl, Medium)</p>
                                    <p className="text-2xl font-medium text-[#264D52]">Jumps over the lazy dog</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#496A49] mb-1">Body Large (lg, Regular)</p>
                                    <p className="text-lg text-[#264D52]/80 hover:text-[#264D52] transition-colors line-clamp-2">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#496A49] mb-1">Body Small (sm, Regular)</p>
                                    <p className="text-sm text-[#264D52]/70 line-clamp-2">
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Serif - Playfair */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[#496A49] font-sans font-semibold mb-2 uppercase tracking-widest text-sm">Display Font (Serif)</h3>
                                <p className="text-4xl font-display font-bold text-[#264D52]">Playfair Display</p>
                                <p className="font-sans text-[#C59F82] mt-1">Headings, editorial, elegant</p>
                            </div>

                            <div className="space-y-6 font-display">
                                <div>
                                    <p className="text-xs font-sans text-[#496A49] mb-1">Display (6xl, Bold)</p>
                                    <p className="text-6xl font-bold leading-none text-[#264D52]">Ag</p>
                                </div>
                                <div>
                                    <p className="text-xs font-sans text-[#496A49] mb-1">Heading 1 (4xl, Bold)</p>
                                    <p className="text-4xl font-bold text-[#264D52]">The quick brown fox</p>
                                </div>
                                <div>
                                    <p className="text-xs font-sans text-[#496A49] mb-1">Heading 2 (2xl, Semibold)</p>
                                    <p className="text-2xl font-semibold text-[#264D52]">Jumps over the lazy dog</p>
                                </div>
                                <div className="font-sans text-[#264D52]">
                                    <p className="text-xs text-[#496A49] mb-1">Blockquote (xl, Italic)</p>
                                    <blockquote className="text-xl font-display italic text-[#264D52]/80 border-l-4 border-[#496A49] pl-4 py-1">
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
                        <div className="w-8 h-8 rounded-lg bg-[#264D52] flex items-center justify-center p-1.5">
                            <div className="w-full h-full bg-[#f5f0eb] rounded-sm" />
                        </div>
                        <h2 className="text-3xl font-display font-semibold text-[#264D52]">Interactive Elements</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Buttons & Controls */}
                        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-[#C59F82]/30 shadow-sm space-y-8">
                            <h3 className="text-xl font-display font-semibold text-[#264D52]">Buttons</h3>

                            <div className="space-y-6">
                                <div className="flex flex-wrap gap-4 items-center">
                                    <button type="button" className="bg-[#264D52] hover:bg-[#1a2a2a] text-[#f5f0eb] px-6 py-3 rounded-full font-sans font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
                                        Primary Action <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button type="button" className="bg-[#496A49] hover:bg-[#5a67a6] text-white px-6 py-3 rounded-full font-sans font-medium transition-all hover:shadow-lg hover:-translate-y-0.5">
                                        Secondary
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-4 items-center">
                                    <button type="button" className="bg-transparent border-2 border-[#264D52] text-[#264D52] hover:bg-[#264D52] hover:text-[#f5f0eb] px-6 py-2.5 rounded-full font-sans font-medium transition-all">
                                        Outline Button
                                    </button>
                                    <button type="button" className="text-[#496A49] hover:text-[#264D52] font-sans font-medium px-4 py-2 hover:bg-[#C59F82]/20 rounded-lg transition-colors flex items-center gap-1">
                                        Ghost Button <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <button type="button" className="w-12 h-12 rounded-full bg-[#264D52] text-[#f5f0eb] flex items-center justify-center hover:scale-110 transition-transform shadow-md" aria-label="Play">
                                        <Play className="w-5 h-5 ml-1" />
                                    </button>
                                    <button type="button" className="w-12 h-12 rounded-2xl bg-[#f5f0eb] text-[#264D52] border-2 border-[#C59F82]/40 flex items-center justify-center hover:bg-[#C59F82]/20 transition-colors" aria-label="Info">
                                        <Info className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <hr className="border-[#C59F82]/30" />

                            <h3 className="text-xl font-display font-semibold text-[#264D52]">Form Inputs</h3>
                            <div className="space-y-4 font-sans">
                                <div>
                                    <label className="block text-sm font-medium text-[#264D52] mb-1.5 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="hello@willstone.city"
                                        className="w-full bg-white border-2 border-[#C59F82]/40 rounded-xl px-4 py-3 text-[#264D52] placeholder-[#C59F82] focus:outline-none focus:border-[#496A49] focus:ring-4 focus:ring-[#496A49]/20 transition-all"
                                    />
                                </div>
                                <div className="flex items-center gap-3 bg-[#C59F82]/10 p-4 rounded-xl border border-[#C59F82]/30">
                                    <input type="checkbox" className="w-5 h-5 rounded border-[#C59F82] text-[#496A49] focus:ring-[#496A49]" defaultChecked />
                                    <span className="text-sm font-medium text-[#264D52]">Subscribe to city updates</span>
                                </div>
                            </div>
                        </div>

                        {/* Cards & Badges */}
                        <div className="space-y-6">
                            <div className="bg-[#264D52] p-8 rounded-3xl shadow-xl text-[#f5f0eb] group cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#496A49] rounded-bl-full opacity-20 group-hover:scale-110 transition-transform" />
                                <div className="relative z-10 space-y-4">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f0eb]/10 backdrop-blur-md text-sm font-sans font-medium text-[#f5f0eb] border border-[#f5f0eb]/20">
                                        <span className="w-2 h-2 rounded-full bg-[#496A49] animate-pulse" />
                                        Dark Card Concept
                                    </div>
                                    <h3 className="text-3xl font-display font-bold">Night time visibility rendering</h3>
                                    <p className="font-sans text-[#C59F82] leading-relaxed">
                                        Testing how text renders on our dark asphalt component. Ensure contrast ratios remain accessible.
                                    </p>
                                    <div className="pt-4 flex items-center font-sans font-medium text-[#496A49] group-hover:text-[#f5f0eb] transition-colors">
                                        Read Analysis <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#f5f0eb] p-6 rounded-3xl border border-[#C59F82]/40 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#496A49] shadow-sm">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <span className="bg-[#496A49]/10 text-[#496A49] font-sans font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-[#496A49]/20">
                                        System Status
                                    </span>
                                </div>
                                <h4 className="font-sans font-bold text-[#264D52] text-lg mb-1">All Systems Operational</h4>
                                <p className="font-sans text-sm text-[#C59F82]">Light card concept with standard border radius and subtle shadows.</p>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-red-200 flex gap-4 items-start shadow-sm">
                                <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                                <div className="font-sans">
                                    <h5 className="font-semibold text-[#264D52]">Alert Component</h5>
                                    <p className="text-sm text-[#264D52]/70 mt-1">This is how a standard warning or alert message would look within our palette.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="pt-16 pb-8 text-center text-[#C59F82] font-sans text-sm">
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
                <p className="font-sans font-bold text-[#264D52]">{name}</p>
                <p className="font-mono text-xs text-[#C59F82]">{variable}</p>
            </div>
        </div>
    );
}
