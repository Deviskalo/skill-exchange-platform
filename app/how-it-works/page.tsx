import { BookOpen, Users, Calendar, Star } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">How SkillSwap Works</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to make the most of our skill exchange platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {steps.map((step, index) => (
          <div key={step.title} className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-secondary rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 max-w-3xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.question} className="bg-background rounded-lg p-6">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Create Profile",
    description: "Sign up and list your skills and interests",
    icon: <BookOpen className="w-8 h-8 text-primary" />,
  },
  {
    title: "Connect",
    description: "Find people with matching skill interests",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Schedule",
    description: "Book sessions at convenient times",
    icon: <Calendar className="w-8 h-8 text-primary" />,
  },
  {
    title: "Review",
    description: "Share your experience and build trust",
    icon: <Star className="w-8 h-8 text-primary" />,
  },
];

const faqs = [
  {
    question: "How does skill exchange work?",
    answer:
      "Users can both teach and learn skills. You can offer your expertise in exchange for learning something new from another user.",
  },
  {
    question: "Is SkillSwap free to use?",
    answer:
      "Basic features are free. Premium features may require a subscription.",
  },
  {
    question: "How are users verified?",
    answer:
      "We verify users through email confirmation and optional ID verification for enhanced trust.",
  },
  {
    question: "What if I need to cancel a session?",
    answer:
      "Sessions can be cancelled up to 24 hours before the scheduled time without penalty.",
  },
];
