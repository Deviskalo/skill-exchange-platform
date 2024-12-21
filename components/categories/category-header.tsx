import { Category } from "@prisma/client";
import { Icons } from "../icons";

interface CategoryHeaderProps {
  category: Category & {
    skills: any[];
  };
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  const Icon = Icons[category.icon as keyof typeof Icons];

  return (
    <div className="text-center">
      <div className="mb-6 inline-block p-4 bg-primary/10 rounded-full">
        {Icon && <Icon className="w-12 h-12 text-primary" />}
      </div>
      <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        {category.description}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        {category.skills.length} skills available
      </p>
    </div>
  );
}
