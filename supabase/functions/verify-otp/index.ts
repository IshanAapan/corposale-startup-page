import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.77.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  email: string;
  otp: string;
  name: string;
  location: string;
  category: string;
}

const generateInviteCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp, name, location, category }: VerifyOTPRequest = await req.json();

    if (!email || !otp || !name || !location || !category) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("otp", otp)
      .eq("verified", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError || !otpData) {
      console.error("OTP verification error:", otpError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired OTP" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark OTP as verified
    await supabase
      .from("email_otps")
      .update({ verified: true })
      .eq("id", otpData.id);

    // Check if invite code already exists for this email
    const { data: existingInvite } = await supabase
      .from("invite_codes")
      .select("invite_code")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    let inviteCode = existingInvite?.invite_code;

    // Generate new invite code if not exists
    if (!inviteCode) {
      let isUnique = false;
      while (!isUnique) {
        inviteCode = generateInviteCode();
        const { data: existing } = await supabase
          .from("invite_codes")
          .select("id")
          .eq("invite_code", inviteCode)
          .maybeSingle();
        
        if (!existing) {
          isUnique = true;
        }
      }

      // Store invite code
      const { error: inviteError } = await supabase
        .from("invite_codes")
        .insert({
          email: email.toLowerCase(),
          invite_code: inviteCode,
        });

      if (inviteError) {
        console.error("Invite code error:", inviteError);
      }
    }

    // Store lead submission
    const { error: submissionError } = await supabase
      .from("lead_submissions")
      .insert({
        name,
        email: email.toLowerCase(),
        location,
        category,
        invite_code: inviteCode!,
      });

    if (submissionError) {
      console.error("Submission error:", submissionError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        inviteCode,
        message: "OTP verified successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
