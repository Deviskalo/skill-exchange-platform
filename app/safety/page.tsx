import { Shield, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

export default function SafetyGuidelinesPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Safety Guidelines</h1>
        <p className="text-xl text-muted-foreground">
          Your safety is our top priority
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {safetyTips.map((tip) => (
          <div key={tip.title} className="bg-card rounded-lg p-6">
            {/* Title element for the safety tip, should be a short phrase that sums up the tip. */}
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {tip.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
            <p className="text-muted-foreground">{tip.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-secondary rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Reporting Issues
        </h2>
        <div className="grid gap-6 max-w-3xl mx-auto">
          {reportingSteps.map((step, index) => (
            <div key={step.title} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const safetyTips = [
  {
    title: "Verify Profiles",
    description:
      "Always check user profiles, reviews, and ratings before booking a session.",
    icon: <Shield className="w-6 h-6 text-primary" />,
  },
  {
    title: "Safe Communication",
    description:
      "Keep all communication within the platform for your protection.",
    icon: <CheckCircle className="w-6 h-6 text-primary" />,
  },
  {
    title: "Report Issues",
    description:
      "Report any suspicious behavior or safety concerns immediately.",
    icon: <AlertTriangle className="w-6 h-6 text-primary" />,
  },
  {
    title: "Trust Your Instincts",
    description:
      "If something doesn't feel right, don't hesitate to cancel or report.",
    icon: <HelpCircle className="w-6 h-6 text-primary" />,
  },
];

const reportingSteps = [
  {
    title: "Document the Issue",
    description: "Take screenshots or save messages related to the problem.",
  },
  {
    title: "Contact Support",
    description: "Use our reporting system or contact support directly.",
  },
  {
    title: "Provide Details",
    description: "Include as much information as possible about the incident.",
  },
  {
    title: "Follow Up",
    description: "Our team will investigate and take appropriate action.",
  },
];
