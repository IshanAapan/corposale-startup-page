import { useState, useEffect } from "react";
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
import { CheckCircle2, ExternalLink, Copy, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [emailValue, setEmailValue] = useState("");
  const [domainStatus, setDomainStatus] = useState<"valid" | "invalid" | "checking" | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const checkDomain = async (email: string) => {
    if (!email || !email.includes("@")) {
      setDomainStatus(null);
      return;
    }

    const domain = email.split("@")[1]?.toLowerCase().trim();
    if (!domain) {
      setDomainStatus(null);
      return;
    }

    setDomainStatus("checking");

    try {
      const { data, error } = await supabase
        .from("company_domains")
        .select("is_approved")
        .eq("domain", domain)
        .maybeSingle();

      if (error) {
        console.error("Error checking domain:", error);
        setDomainStatus("invalid");
        return;
      }

      if (data && data.is_approved) {
        setDomainStatus("valid");
      } else {
        setDomainStatus("invalid");
      }
    } catch (error) {
      console.error("Error checking domain:", error);
      setDomainStatus("invalid");
    }
  };

  useEffect(() => {
    const subscription = watch((value) => {
      const email = value.email || "";
      setEmailValue(email);
      
      // Debounce the domain check
      const timer = setTimeout(() => {
        checkDomain(email);
      }, 500);

      return () => clearTimeout(timer);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: FormData) => {
    if (!otpSent) {
      // First submission - send OTP
      try {
        const response = await supabase.functions.invoke("send-otp", {
          body: {
            email: data.email,
            name: data.name,
          },
        });

        if (response.error) {
          throw response.error;
        }

        toast({
          title: "OTP Sent!",
          description: "Please check your email for the verification code.",
        });

        setOtpSent(true);
      } catch (error: any) {
        console.error("Error sending OTP:", error);
        toast({
          title: "Error",
          description: "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);

    try {
      const formData = watch();
      const response = await supabase.functions.invoke("verify-otp", {
        body: {
          email: formData.email,
          otp,
          name: formData.name,
          location: formData.location,
          category: formData.category,
        },
      });

      if (response.error) {
        throw response.error;
      }

      const { inviteCode: code } = response.data;

      // Set up Facebook group link
      const locationLinks: { [key: string]: string } = {
        "bangalore": "https://www.facebook.com/groups/1321067659396729",
        "noida": "https://www.facebook.com/groups/1197770975576336",
        "mumbai": "https://www.facebook.com/groups/2088698548542011",
        "gurugram": "https://www.facebook.com/groups/1712568552763078",
        "pune": "https://www.facebook.com/groups/839356278417787",
        "hyderabad": "https://www.facebook.com/groups/664408663062271",
        "default": "https://chat.whatsapp.com/example",
      };

      const locationKey = formData.location.toLowerCase().split(',')[0].trim();
      const link = locationLinks[locationKey] || locationLinks["default"];

      setFaceBookLink(link);
      setInviteCode(code);
      setSubmittedEmail(formData.email);
      setSubmitted(true);

      toast({
        title: "Success!",
        description: "Your registration is complete.",
      });
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
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
            
            <div className="bg-card rounded-lg p-4 border border-border max-w-md mx-auto space-y-4">
              <div>
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

              <div>
                <p className="text-sm text-muted-foreground mb-2">Your Invite Code</p>
                <code className="text-foreground font-mono text-2xl font-bold bg-accent px-4 py-3 rounded block">
                  {inviteCode}
                </code>
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
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  {...register("email")}
                  className="h-12 pr-10"
                />
                {domainStatus && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {domainStatus === "valid" && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                    {domainStatus === "invalid" && (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
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
              disabled={isSubmitting || domainStatus !== "valid" || otpSent}
            >
              {isSubmitting ? "Sending OTP..." : "Send Verification Code"}
            </Button>

            {otpSent && (
              <div className="space-y-4 pt-6 border-t">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-Digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="h-12 text-center text-2xl tracking-widest"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Check your email for the verification code
                  </p>
                </div>

                <Button
                  type="button"
                  size="lg"
                  className="w-full h-12 text-lg shadow-soft hover:shadow-lg transition-smooth"
                  onClick={verifyOTP}
                  disabled={verifying || otp.length !== 6}
                >
                  {verifying ? "Verifying..." : "Verify & Complete Registration"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;
