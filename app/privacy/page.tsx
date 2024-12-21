export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

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
    title: "Information We Collect",
    content: [
      "We collect information you provide directly to us, including name, email address, and profile information.",
      "We automatically collect certain information about your device when you use our services.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "We use the information we collect to provide, maintain, and improve our services.",
      "We may use your email address to send you updates about our services.",
    ],
  },
  {
    title: "Information Sharing",
    content: [
      "We do not share your personal information with third parties except as described in this policy.",
      "We may share aggregated, non-personal information about our users with third parties for industry analysis.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "We implement appropriate security measures to protect your personal information.",
      "While we strive to protect your information, no method of transmission over the Internet is 100% secure.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "You have the right to access, correct, or delete your personal information.",
      "You can opt out of receiving promotional emails by following the instructions in the emails.",
    ],
  },
];
