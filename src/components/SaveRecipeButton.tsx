
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { TimerSection } from '@/types/timer';

interface SaveRecipeButtonProps {
  showSaveButton: boolean;
  onSaveRecipe: () => void;
}

const SaveRecipeButton: React.FC<SaveRecipeButtonProps> = ({
  showSaveButton,
  onSaveRecipe
}) => {
  if (!showSaveButton) return null;
  
  return (
    <Button 
      onClick={onSaveRecipe}
      className="bg-green-600 hover:bg-green-700 text-white mb-1 mt-1"
      size="sm"
    >
      <Save className="w-4 h-4 mr-2" />
      Save Custom Recipe
    </Button>
  );
};

export default SaveRecipeButton;
