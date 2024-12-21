export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>

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

        <div className="mt-8 p-6 bg-secondary rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Cookie Types We Use</h2>
          <div className="grid gap-4">
            {cookieTypes.map((type) => (
              <div key={type.name} className="p-4 bg-background rounded-lg">
                <h3 className="font-semibold mb-2">{type.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const sections = [
  {
    title: "What Are Cookies",
    content: [
      "Cookies are small text files that are placed on your device when you visit our website.",
      "They help us provide you with a better experience by remembering your preferences and how you use our site.",
    ],
  },
  {
    title: "How We Use Cookies",
    content: [
      "We use cookies to understand how you interact with our website and to improve our services.",
      "Cookies help us remember your preferences and provide personalized features.",
    ],
  },
  {
    title: "Your Cookie Choices",
    content: [
      "You can control and/or delete cookies as you wish.",
      "You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.",
    ],
  },
];

const cookieTypes = [
  {
    name: "Essential Cookies",
    description:
      "These cookies are necessary for the website to function and cannot be switched off in our systems.",
  },
  {
    name: "Performance Cookies",
    description:
      "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.",
  },
  {
    name: "Functional Cookies",
    description:
      "These cookies enable the website to provide enhanced functionality and personalization.",
  },
  {
    name: "Targeting Cookies",
    description:
      "These cookies may be set through our site by our advertising partners to build a profile of your interests.",
  },
];
