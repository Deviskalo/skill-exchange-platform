import { Mail, Phone, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HelpCenterPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-xl text-muted-foreground">
          Find answers and support for your questions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {supportOptions.map((option) => (
          <div
            key={option.title}
            className="bg-card rounded-lg p-6 text-center"
          >
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {option.icon}
            </div>
            <h3 className="font-semibold mb-2">{option.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {option.description}
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href={option.link}>{option.buttonText}</Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-secondary rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Topics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {popularTopics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.link}
              className="p-4 bg-background rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-2">{topic.title}</h3>
              <p className="text-sm text-muted-foreground">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const supportOptions = [
  {
    title: "Email Support",
    description: "Get help via email within 24 hours",
    icon: <Mail className="w-6 h-6 text-primary" />,
    link: "/contact",
    buttonText: "Send Email",
  },
  {
    title: "Phone Support",
    description: "Talk to our support team directly",
    icon: <Phone className="w-6 h-6 text-primary" />,
    link: "/contact",
    buttonText: "Call Us",
  },
  {
    title: "Live Chat",
    description: "Chat with our support team",
    icon: <MessageSquare className="w-6 h-6 text-primary" />,
    link: "/chat",
    buttonText: "Start Chat",
  },
  {
    title: "Documentation",
    description: "Browse our detailed guides",
    icon: <FileText className="w-6 h-6 text-primary" />,
    link: "/docs",
    buttonText: "View Docs",
  },
];

const popularTopics = [
  {
    title: "Getting Started",
    description: "Learn the basics of using SkillSwap",
    link: "/help/getting-started",
  },
  {
    title: "Account Settings",
    description: "Manage your account and preferences",
    link: "/help/account",
  },
  {
    title: "Booking Sessions",
    description: "Learn how to book and manage sessions",
    link: "/help/booking",
  },
  {
    title: "Payment & Billing",
    description: "Understanding payments and billing",
    link: "/help/payments",
  },
  {
    title: "Safety Guidelines",
    description: "Stay safe while using SkillSwap",
    link: "/help/safety",
  },
  {
    title: "Technical Issues",
    description: "Common technical problems and solutions",
    link: "/help/technical",
  },
];
