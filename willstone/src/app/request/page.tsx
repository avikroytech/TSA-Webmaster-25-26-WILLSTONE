import RequireAuth from "@/components/auth/RequireAuth";
import Footer from "@/components/home/Footer";
import SubpageHero from "@/components/layout/SubpageHero";
import RequestForm from "@/components/resource/RequestForm";

export default function Request() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f5f0eb]">
      <SubpageHero
        title="Submit a Resource"
        eyebrow="Resident powered directory"
        description="Recommend a local service, nonprofit, program, or public facility for review by the Willstone team."
        image="/img/city-home2.jpg"
      />

      <main className="relative z-10 flex-1 px-[var(--space-page-x)] py-[var(--space-section-tight)]">
        <div className="mx-auto w-full max-w-2xl">
          <RequireAuth redirectTo="/request">
            <RequestForm />
          </RequireAuth>
        </div>
      </main>

      <Footer />
    </div>
  );
}
