export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-sm max-w-none">
        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.content.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing or using SkillSwap, you agree to be bound by these Terms of Service.",
      "If you do not agree to these terms, please do not use our services.",
    ],
  },
  {
    title: "User Accounts",
    content: [
      "You must create an account to use certain features of our services.",
      "You are responsible for maintaining the security of your account credentials.",
      "You must be at least 18 years old to create an account.",
    ],
  },
  {
    title: "User Conduct",
    content: [
      "You agree to use our services only for lawful purposes.",
      "You will not engage in any behavior that harasses or harms other users.",
      "You will not attempt to circumvent any security features of our services.",
    ],
  },
  {
    title: "Content Guidelines",
    content: [
      "You retain ownership of content you post on SkillSwap.",
      "By posting content, you grant us a license to use and display that content.",
      "We reserve the right to remove any content that violates our guidelines.",
    ],
  },
  {
    title: "Termination",
    content: [
      "We may terminate or suspend your account for violations of these terms.",
      "You may terminate your account at any time by contacting us.",
    ],
  },
];
