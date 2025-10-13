import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

const Index = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById("early-access");
    formElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={scrollToForm} />
      <HowItWorks />
      <LeadForm />
      <Footer />
    </div>
  );
};

export default Index;
