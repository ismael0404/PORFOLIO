import { Navbar } from "../components/Navbar";
import { StarBackground } from "@/components/StarBackground";
import { CertificationsSection } from "../components/CertificationsSection";
import { Footer } from "../components/Footer";

export const Certifications = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <StarBackground />
      <Navbar />
      <main className="flex-1 pt-16">
        <CertificationsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Certifications;
