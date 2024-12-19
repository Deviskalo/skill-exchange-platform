
import { useState } from 'react';
import { SkillFilter } from './skill-filter';

interface SkillFilterClientProps {
  categories: string[];
  availableTags: string[];
}

export default function SkillFilterClient({ 
  categories, 
  availableTags 
}: SkillFilterClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleFilterToggle = (filterType: 'category' | 'tag', value: string) => {
    if (filterType === 'category') {
      setSelectedCategories(prev => 
        prev.includes(value) 
          ? prev.filter(cat => cat !== value)
          : [...prev, value]
      );
    } else {
      setSelectedTags(prev => 
        prev.includes(value) 
          ? prev.filter(tag => tag !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <SkillFilter
      categories={categories}
      availableTags={availableTags}
      onFilter={({ search, categories, tags }) => {
        // Perform filtering or other actions with the complete filters object
        console.log('Filtering', { search, categories, tags });
        // You can add your filtering logic here
      }}
    />
  );
}