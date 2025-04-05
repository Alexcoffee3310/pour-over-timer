import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Recipe, TimerSection } from '@/types/timer';
import { formatDuration } from '@/utils/time-formatter';

const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 'recipe-a',
    name: `Recipe A - Quick (${formatDuration(95)})`,
    description: 'A quick brew with shorter intervals between pours',
    sections: [
      { name: 'Bloom', timeInSeconds: 15, type: 'pour', pourAmount: 45 },
      { name: 'Wait', timeInSeconds: 30, type: 'sit' },
      { name: '1st Pour', timeInSeconds: 10, type: 'pour', pourAmount: 200 },
      { name: 'Wait', timeInSeconds: 10, type: 'sit' },
      { name: '2nd Pour', timeInSeconds: 10, type: 'pour', pourAmount: 300 },
      { name: 'Wait', timeInSeconds: 10, type: 'sit' }
    ]
  },
  {
    id: 'recipe-b',
    name: `Recipe B - Balanced (${formatDuration(120)})`,
    description: 'A balanced brew with medium intervals',
    sections: [
      { name: 'Bloom', timeInSeconds: 15, type: 'pour', pourAmount: 45 },
      { name: 'Wait', timeInSeconds: 30, type: 'sit' },
      { name: '1st Pour', timeInSeconds: 15, type: 'pour', pourAmount: 200 },
      { name: 'Wait', timeInSeconds: 15, type: 'sit' },
      { name: '2nd Pour', timeInSeconds: 15, type: 'pour', pourAmount: 300 },
      { name: 'Wait', timeInSeconds: 15, type: 'sit' }
    ]
  },
  {
    id: 'recipe-c',
    name: `Recipe C - Extended (${formatDuration(145)})`,
    description: 'A longer brew with extended intervals for deeper extraction',
    sections: [
      { name: 'Bloom', timeInSeconds: 15, type: 'pour', pourAmount: 45 },
      { name: 'Wait', timeInSeconds: 30, type: 'sit' },
      { name: '1st Pour', timeInSeconds: 20, type: 'pour', pourAmount: 200 },
      { name: 'Wait', timeInSeconds: 20, type: 'sit' },
      { name: '2nd Pour', timeInSeconds: 20, type: 'pour', pourAmount: 300 },
      { name: 'Wait', timeInSeconds: 20, type: 'sit' }
    ]
  },
];

const getSavedRecipes = (): Recipe[] => {
  try {
    const savedRecipes = localStorage.getItem('customRecipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  } catch (error) {
    console.error('Error loading saved recipes:', error);
    return [];
  }
};

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([
    ...DEFAULT_RECIPES,
    ...getSavedRecipes()
  ]);
  
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0].id);
  const [currentSections, setCurrentSections] = useState<TimerSection[]>(recipes[0].sections);
  const { toast } = useToast();

  const handleSelectRecipe = (recipeId: string, isRunning: boolean) => {
    if (!isRunning) {
      const selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
      if (selectedRecipe) {
        setSelectedRecipeId(recipeId);
        setCurrentSections(selectedRecipe.sections);
        return true;
      }
    } else {
      toast({
        title: "Cannot change recipe",
        description: "Please pause the timer before changing recipes",
        variant: "destructive",
      });
    }
    return false;
  };

  const handleSaveRecipe = (sections: TimerSection[], isRunning: boolean) => {
    if (isRunning) {
      toast({
        title: "Cannot save recipe",
        description: "Please pause the timer before saving recipe",
        variant: "destructive",
      });
      return;
    }

    try {
      const existingCustomRecipes = getSavedRecipes();
      
      const nextRecipeLetter = String.fromCharCode(
        'D'.charCodeAt(0) + existingCustomRecipes.length
      );
      
      const totalSeconds = sections.reduce(
        (sum, section) => sum + section.timeInSeconds, 0
      );
      
      const newRecipe: Recipe = {
        id: `recipe-${nextRecipeLetter.toLowerCase()}`,
        name: `Recipe ${nextRecipeLetter} - Custom (${formatDuration(totalSeconds)})`,
        description: 'Your custom pour over recipe',
        sections: [...sections],
        isCustom: true
      };
      
      const updatedCustomRecipes = [...existingCustomRecipes, newRecipe];
      
      localStorage.setItem('customRecipes', JSON.stringify(updatedCustomRecipes));
      
      setRecipes([...DEFAULT_RECIPES, ...updatedCustomRecipes]);
      
      setSelectedRecipeId(newRecipe.id);
      
      toast({
        title: "Recipe saved!",
        description: `Your custom recipe has been saved as ${newRecipe.name}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error saving recipe",
        description: "An error occurred while saving your recipe",
        variant: "destructive",
      });
    }
  };

  const isCurrentRecipeModified = (sections: TimerSection[]) => {
    const originalRecipe = recipes.find(r => r.id === selectedRecipeId);
    if (!originalRecipe) return true;
    
    if (originalRecipe.sections.length !== sections.length) return true;
    
    return sections.some((section, index) => 
      section.timeInSeconds !== originalRecipe.sections[index].timeInSeconds
    );
  };

  return {
    recipes,
    selectedRecipeId,
    currentSections,
    handleSelectRecipe,
    handleSaveRecipe,
    isCurrentRecipeModified
  };
}
