import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, ExternalLink, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid business email").max(255),
  location: z.string().min(2, "Location is required").max(100),
  category: z.string().min(1, "Please select a category"),
});

type FormData = z.infer<typeof formSchema>;

const LeadForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [faceBookLink, setFaceBookLink] = useState("https://chat.whatsapp.com/example");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", data);

    const locationLinks: { [key: string]: string } = {
      "bangalore": "https://www.facebook.com/groups/1321067659396729",
      "noida": "https://www.facebook.com/groups/1197770975576336",
      "mumbai": "https://www.facebook.com/groups/2088698548542011",
      "gurugram": "https://www.facebook.com/groups/1712568552763078",
      "pune": "https://www.facebook.com/groups/839356278417787",
      "hyderabad":"https://www.facebook.com/groups/664408663062271",
      "default": "https://chat.whatsapp.com/example",
    };

    const locationKey = data.location.toLowerCase().split(',')[0].trim();
    const link = locationLinks[locationKey] || locationLinks["default"];
    setFaceBookLink(link);

    setSubmittedEmail(data.email);
    setSubmitted(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(submittedEmail);
      setCopied(true);
      toast({
        title: "Email copied!",
        description: "Email address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-scale-in">
            <div className="inline-flex p-6 bg-accent rounded-full">
              <CheckCircle2 className="w-16 h-16 text-primary" />
            </div>
            
            <h2 className="text-4xl font-bold">You're on the list!</h2>
            <p className="text-xl text-muted-foreground">
              Thank you for your interest. We'll notify you when Corposale launches.
            </p>
            
            <div className="bg-card rounded-lg p-4 border border-border max-w-md mx-auto">
              <p className="text-sm text-muted-foreground mb-2">Registered Email</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-foreground font-mono text-sm bg-accent px-3 py-2 rounded">
                  {submittedEmail}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button
              size="lg"
              variant="outline"
              className="shadow-soft"
              onClick={() => window.open(faceBookLink, "_blank")}
            >
              Join Private Group
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="early-access" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Join early access
            </h2>
            <p className="text-xl text-muted-foreground">
              Be among the first to experience Corposale
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card rounded-2xl p-8 md:p-12 shadow-card space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                className="h-12"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Business Email ID</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@company.com"
                {...register("email")}
                className="h-12"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Bangalore, India"
                {...register("location")}
                className="h-12"
              />
              {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category of Interest</Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger id="category" className="h-12">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-lg shadow-soft hover:shadow-lg transition-smooth"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Join Early Access"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;
