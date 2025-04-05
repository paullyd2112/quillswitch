
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  email: string;
  title: string;
  message: string;
  notificationType: string;
  projectName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, title, message, notificationType, projectName } = await req.json() as NotificationEmailRequest;
    
    if (!email || !title || !message) {
      throw new Error("Missing required fields: email, title, message");
    }

    // Create a subject line based on notification type
    let subject = `Migration Notification: ${title}`;
    if (projectName) {
      subject = `[${projectName}] ${subject}`;
    }

    // Choose a notification icon/color based on type
    let notificationColor = "#3B82F6"; // Default blue
    let iconEmoji = "🔔";
    
    switch (notificationType) {
      case "migration_completed":
        notificationColor = "#10B981"; // Green
        iconEmoji = "✅";
        break;
      case "error_occurred":
        notificationColor = "#EF4444"; // Red
        iconEmoji = "❌";
        break;
      case "validation_completed":
        notificationColor = "#8B5CF6"; // Purple
        iconEmoji = "📋";
        break;
      case "migration_paused":
        notificationColor = "#F59E0B"; // Amber
        iconEmoji = "⏸️";
        break;
      case "migration_started":
      case "migration_resumed":
        notificationColor = "#3B82F6"; // Blue
        iconEmoji = "▶️";
        break;
      case "stage_completed":
        notificationColor = "#10B981"; // Green
        iconEmoji = "🔄";
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "CRM Migration <notifications@your-domain.com>", // Replace with your domain
      to: [email],
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: ${notificationColor}; color: white; padding: 15px; border-radius: 4px 4px 0 0;">
            <h1 style="margin: 0; font-size: 20px;">${iconEmoji} ${title}</h1>
          </div>
          <div style="border: 1px solid #e2e8f0; border-top: none; padding: 20px; border-radius: 0 0 4px 4px;">
            <p style="line-height: 1.5; color: #4b5563; font-size: 16px;">${message}</p>
            ${projectName ? `<p style="font-size: 14px; color: #6b7280; margin-top: 20px;">Project: ${projectName}</p>` : ''}
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 14px; color: #6b7280; margin: 0;">
                This is an automated notification from your CRM Migration platform.
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin-top: 5px;">
                You can manage your notification preferences in the <a href="${process.env.APP_URL || 'https://your-app.com'}/settings?tab=notifications" style="color: #3b82f6; text-decoration: none;">settings</a>.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending notification email:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email notification" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
