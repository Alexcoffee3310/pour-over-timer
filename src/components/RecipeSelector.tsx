
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
    <div className="w-full max-w-md mb-4">
      <Select
        value={selectedRecipeId}
        onValueChange={onSelectRecipe}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a recipe" />
        </SelectTrigger>
        <SelectContent>
          {recipes.map((recipe) => (
            <SelectItem key={recipe.id} value={recipe.id}>
              <div className="flex items-center justify-between">
                <span>{recipe.name}</span>
                {recipe.id === selectedRecipeId && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {recipes.find(r => r.id === selectedRecipeId)?.description && (
        <p className="text-xs text-gray-500 mt-1">
          {recipes.find(r => r.id === selectedRecipeId)?.description}
        </p>
      )}
    </div>
  );
};

export default RecipeSelector;
