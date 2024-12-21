"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CategoryCardProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  index: number;
}

export function CategoryCard({
  name,
  icon,
  description,
  index,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/skills?category=${name.toLowerCase()}`}
        className="group block p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex flex-col items-center text-center">
          <div className="transform transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          <h3 className="mt-4 text-xl font-semibold group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
