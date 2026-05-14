import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const { error } = await supabase.from("newsletter_subscribers").insert([{ name, email }]);

  if (error) {
    console.error("Newsletter signup failed:", error);
    return NextResponse.json({ error: "Unable to save subscription." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
