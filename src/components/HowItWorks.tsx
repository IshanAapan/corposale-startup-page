import { PackagePlus, ShieldCheck, Handshake } from "lucide-react";

const steps = [
  {
    icon: PackagePlus,
    title: "List your item",
    description: "Post items you want to sell with photos and details",
  },
  {
    icon: ShieldCheck,
    title: "Verified employees only",
    description: "Access limited to verified corporate email addresses",
  },
  {
    icon: Handshake,
    title: "Safe community deals",
    description: "Connect and transact within your trusted network",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How it works</h2>
          <p className="text-xl text-muted-foreground">
            Three simple steps to start trading
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-card rounded-2xl p-8 shadow-card hover:shadow-soft transition-smooth group"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg shadow-soft">
                {index + 1}
              </div>
              
              <div className="mb-6 inline-flex p-4 bg-accent rounded-xl group-hover:scale-110 transition-transform">
                <step.icon className="w-8 h-8 text-accent-foreground" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
