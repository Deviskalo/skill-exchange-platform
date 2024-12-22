import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="ml-2 text-xl font-bold">SkillSwap</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Exchange skills, learn together, and grow your knowledge with our
              global community.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/skills">Browse Skills</Link>
              </li>
              <li>
                <Link href="/teach">Teach</Link>
              </li>
              <li>
                <Link href="/how-it-works">How It Works</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help">Help Center</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              <li>
                <Link href="/safety">Safety Guidelines</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link href="/cookies">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} SkillSwap. All rights reserved.
          </p>
          <p>
            Made with ❤️ in Liberia, West Africa and maintained by the Iskalo
            Tech Team.
          </p>
        </div>
      </div>
    </footer>
  );
}
