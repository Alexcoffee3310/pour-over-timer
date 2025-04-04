
import React from 'react';
import { Check } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Recipe } from '@/types/timer';

interface RecipeSelectorProps {
  recipes: Recipe[];
  selectedRecipeId: string;
  onSelectRecipe: (recipeId: string) => void;
}

const RecipeSelector: React.FC<RecipeSelectorProps> = ({
  recipes,
  selectedRecipeId,
  onSelectRecipe,
}) => {
  return (
    <div className="w-full max-w-md mb-2">
      <Select
        value={selectedRecipeId}
        onValueChange={onSelectRecipe}
      >
        <SelectTrigger className="w-full bg-white/40 border-white/40 backdrop-blur-sm shadow-sm">
          <SelectValue placeholder="Select a recipe" />
        </SelectTrigger>
        <SelectContent className="bg-white/90 backdrop-blur-md border-white/40">
          {recipes.map((recipe) => (
            <SelectItem key={recipe.id} value={recipe.id} className="focus:bg-timer-primary/10">
              <div className="flex items-center justify-between">
                <span>{recipe.name}</span>
                {recipe.id === selectedRecipeId && (
                  <Check className="ml-2 h-4 w-4 text-timer-primary" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {recipes.find(r => r.id === selectedRecipeId)?.description && (
        <p className="text-xs text-timer-text/60 mt-1 tracking-wide italic">
          {recipes.find(r => r.id === selectedRecipeId)?.description}
        </p>
      )}
    </div>
  );
};

export default RecipeSelector;
