
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
    <div className="w-full max-w-md">
      <Select
        value={selectedRecipeId}
        onValueChange={onSelectRecipe}
      >
        <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm shadow-sm rounded-lg transition-all duration-300 hover:bg-white/20">
          <SelectValue placeholder="Select a recipe" />
        </SelectTrigger>
        <SelectContent className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg">
          {recipes.map((recipe) => (
            <SelectItem key={recipe.id} value={recipe.id} className="focus:bg-timer-primary/10 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="font-light tracking-wide">{recipe.name}</span>
                {recipe.id === selectedRecipeId && (
                  <Check className="ml-2 h-4 w-4 text-timer-primary" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {recipes.find(r => r.id === selectedRecipeId)?.description && (
        <p className="text-xs text-timer-text/60 mt-1 tracking-wide italic font-light">
          {recipes.find(r => r.id === selectedRecipeId)?.description}
        </p>
      )}
    </div>
  );
};

export default RecipeSelector;
