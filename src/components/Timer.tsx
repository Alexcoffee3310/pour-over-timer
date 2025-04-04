
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';
import CircularProgress from './CircularProgress';
import TimerControls from './TimerControls';
import RecipeSelector from './RecipeSelector';
import TimerStagesTable from './TimerStagesTable';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/utils/time-formatter';
import { TimerSection, TimerState, Recipe } from '@/types/timer';

interface TimerProps {
  initialTimeInSeconds?: number;
}

const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 'recipe-a',
    name: 'Recipe A - Quick (95s)',
    description: 'A quick brew with shorter intervals between pours',
    sections: [
      { name: 'Bloom', timeInSeconds: 45, type: 'pour', pourAmount: 45 },
      { name: 'Wait', timeInSeconds: 10, type: 'sit' },
      { name: '1st Pour', timeInSeconds: 10, type: 'pour', pourAmount: 150 },
      { name: 'Wait', timeInSeconds: 10, type: 'sit' },
      { name: '2nd Pour', timeInSeconds: 10, type: 'pour', pourAmount: 300 },
      { name: 'Wait', timeInSeconds: 10, type: 'sit' }
    ]
  },
  {
    id: 'recipe-b',
    name: 'Recipe B - Balanced (120s)',
    description: 'A balanced brew with medium intervals',
    sections: [
      { name: 'Bloom', timeInSeconds: 45, type: 'pour', pourAmount: 45 },
      { name: 'Wait', timeInSeconds: 15, type: 'sit' },
      { name: '1st Pour', timeInSeconds: 15, type: 'pour', pourAmount: 150 },
      { name: 'Wait', timeInSeconds: 15, type: 'sit' },
      { name: '2nd Pour', timeInSeconds: 15, type: 'pour', pourAmount: 300 },
      { name: 'Wait', timeInSeconds: 15, type: 'sit' }
    ]
  },
  {
    id: 'recipe-c',
    name: 'Recipe C - Extended (145s)',
    description: 'A longer brew with extended intervals for deeper extraction',
    sections: [
      { name: 'Bloom', timeInSeconds: 45, type: 'pour', pourAmount: 45 },
      { name: 'Wait', timeInSeconds: 20, type: 'sit' },
      { name: '1st Pour', timeInSeconds: 20, type: 'pour', pourAmount: 150 },
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

const Timer: React.FC<TimerProps> = ({ initialTimeInSeconds = 60 }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([
    ...DEFAULT_RECIPES,
    ...getSavedRecipes()
  ]);
  
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0].id);
  const [timerState, setTimerState] = useState<TimerState>({
    sections: recipes[0].sections,
    currentSectionIndex: 0,
    isRunning: false,
    isCompleted: false,
    totalTimeInSeconds: recipes[0].sections.reduce((sum, section) => sum + section.timeInSeconds, 0)
  });
  
  const [timeRemaining, setTimeRemaining] = useState(timerState.sections[0].timeInSeconds);
  const { toast } = useToast();
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const total = timerState.sections.reduce((sum, section) => sum + section.timeInSeconds, 0);
    setTimerState(prev => ({
      ...prev,
      totalTimeInSeconds: total
    }));
  }, [timerState.sections]);
  
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setTimeRemaining(timerState.sections[timerState.currentSectionIndex].timeInSeconds);
  }, [timerState.currentSectionIndex, timerState.sections]);
  
  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            const nextSectionIndex = timerState.currentSectionIndex + 1;
            
            if (nextSectionIndex < timerState.sections.length) {
              setTimerState(prev => ({
                ...prev,
                currentSectionIndex: nextSectionIndex
              }));
              
              if (audioRef.current) {
                audioRef.current.play().catch(error => 
                  console.error("Audio playback failed:", error)
                );
              }
              
              const currentSection = timerState.sections[timerState.currentSectionIndex];
              const nextSection = timerState.sections[nextSectionIndex];
              toast({
                title: `${currentSection.name} completed!`,
                description: `Moving to ${nextSection.name}`,
                duration: 3000,
              });
              
              return timerState.sections[nextSectionIndex].timeInSeconds;
            } else {
              clearInterval(intervalRef.current!);
              setTimerState(prev => ({
                ...prev,
                isRunning: false,
                isCompleted: true
              }));
              
              if (audioRef.current) {
                audioRef.current.play().catch(error => 
                  console.error("Audio playback failed:", error)
                );
              }
              
              toast({
                title: "All sections completed!",
                description: "Your pour over is ready.",
                duration: 5000,
              });
              
              return 0;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.currentSectionIndex, timerState.sections, toast]);
  
  const handleSelectRecipe = (recipeId: string) => {
    if (!timerState.isRunning) {
      const selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
      if (selectedRecipe) {
        setSelectedRecipeId(recipeId);
        setTimerState({
          sections: selectedRecipe.sections,
          currentSectionIndex: 0,
          isRunning: false,
          isCompleted: false,
          totalTimeInSeconds: selectedRecipe.sections.reduce(
            (sum, section) => sum + section.timeInSeconds, 0
          )
        });
      }
    } else {
      toast({
        title: "Cannot change recipe",
        description: "Please pause the timer before changing recipes",
        variant: "destructive",
      });
    }
  };
  
  const handleStart = () => {
    if (timeRemaining > 0) {
      setTimerState(prev => ({
        ...prev,
        isRunning: true,
        isCompleted: false
      }));
    }
  };
  
  const handlePause = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false
    }));
  };
  
  const handleReset = () => {
    setTimerState(prev => ({
      ...prev,
      currentSectionIndex: 0,
      isRunning: false,
      isCompleted: false
    }));
    setTimeRemaining(timerState.sections[0].timeInSeconds);
  };
  
  const handleSetTime = (sectionIndex: number, seconds: number) => {
    if (seconds <= 0) return;
    
    setTimerState(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        timeInSeconds: seconds
      };
      
      const totalTime = updatedSections.reduce(
        (sum, section) => sum + section.timeInSeconds,
        0
      );
      
      return {
        ...prev,
        sections: updatedSections,
        isRunning: false,
        isCompleted: false,
        totalTimeInSeconds: totalTime
      };
    });
    
    if (sectionIndex === timerState.currentSectionIndex) {
      setTimeRemaining(seconds);
    }
  };

  const handleSetPourAmount = (sectionIndex: number, amount: number) => {
    if (amount < 0) return;
    
    setTimerState(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        pourAmount: amount
      };
      
      return {
        ...prev,
        sections: updatedSections,
        isRunning: false,
        isCompleted: false
      };
    });
    
    toast({
      title: "Pour amount updated",
      description: `Updated to ${amount} ml`,
      duration: 2000,
    });
  };

  const handleSaveRecipe = () => {
    if (timerState.isRunning) {
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
      
      const totalSeconds = timerState.sections.reduce(
        (sum, section) => sum + section.timeInSeconds, 0
      );
      
      const newRecipe: Recipe = {
        id: `recipe-${nextRecipeLetter.toLowerCase()}`,
        name: `Recipe ${nextRecipeLetter} - Custom (${totalSeconds}s)`,
        description: 'Your custom pour over recipe',
        sections: [...timerState.sections],
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
  
  const currentSection = timerState.sections[timerState.currentSectionIndex];
  const progress = currentSection.timeInSeconds > 0 
    ? (currentSection.timeInSeconds - timeRemaining) / currentSection.timeInSeconds 
    : 0;
  
  const isCurrentRecipeModified = () => {
    const originalRecipe = recipes.find(r => r.id === selectedRecipeId);
    if (!originalRecipe) return true;
    
    if (originalRecipe.sections.length !== timerState.sections.length) return true;
    
    return timerState.sections.some((section, index) => 
      section.timeInSeconds !== originalRecipe.sections[index].timeInSeconds
    );
  };
  
  const showSaveButton = isCurrentRecipeModified() && !timerState.isRunning;

  return (
    <div className="flex flex-col items-center gap-3">
      <RecipeSelector
        recipes={recipes}
        selectedRecipeId={selectedRecipeId}
        onSelectRecipe={handleSelectRecipe}
      />
      
      <div className="flex flex-col md:flex-row gap-3 w-full">
        <div className="flex-1 bg-white/10 backdrop-blur-sm p-3 rounded-xl shadow-sm">
          <TimerStagesTable 
            sections={timerState.sections}
            currentSectionIndex={timerState.currentSectionIndex}
            isRunning={timerState.isRunning}
          />
          
          {showSaveButton && (
            <Button 
              onClick={handleSaveRecipe}
              className="bg-green-600 hover:bg-green-700 text-white mb-1 mt-2"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Custom Recipe
            </Button>
          )}
        </div>
        
        <div className="flex-1 flex flex-col items-center bg-white/10 backdrop-blur-sm p-3 rounded-xl shadow-sm">
          <div className="relative mb-2">
            <CircularProgress 
              progress={progress} 
              size={200} 
              strokeWidth={12} 
              isCompleted={timerState.isCompleted}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-medium text-timer-text/70 uppercase tracking-wider mb-1">
                  {currentSection.name}
                </div>
                <div className="text-4xl font-light text-timer-text mb-1">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-timer-text/70 tracking-wide">
                  {timerState.isRunning ? 'Brewing...' : timerState.isCompleted ? 'Completed' : 'Ready'}
                </div>
                {currentSection.pourAmount && currentSection.type === 'pour' && (
                  <div className="text-sm text-timer-primary font-medium mt-1 bg-timer-primary/5 px-3 py-1 rounded-full backdrop-blur-sm">
                    {currentSection.pourAmount} ml
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-full mt-1">
            <TimerControls
              sections={timerState.sections}
              isRunning={timerState.isRunning}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              onSetTime={handleSetTime}
              onSetPourAmount={handleSetPourAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
