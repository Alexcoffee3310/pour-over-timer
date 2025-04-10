import React from 'react';
import TimerControls from './TimerControls';
import RecipeSelector from './RecipeSelector';
import TimerStagesTable from './TimerStagesTable';
import TimerDisplay from './TimerDisplay';
import SaveRecipeButton from './SaveRecipeButton';
import { useTimer } from '@/hooks/timer/use-timer';
import { useRecipes } from '@/hooks/useRecipes';

interface TimerProps {
  initialTimeInSeconds?: number;
}

const Timer: React.FC<TimerProps> = ({ initialTimeInSeconds = 60 }) => {
  const {
    recipes,
    selectedRecipeId,
    currentSections,
    handleSelectRecipe,
    handleSaveRecipe,
    isCurrentRecipeModified
  } = useRecipes();
  
  const {
    timerState,
    timeRemaining,
    currentSection,
    progress,
    handleStart,
    handlePause,
    handleReset,
    handleSetTime,
    handleSetPourAmount,
    updateSections,
    handleRestart
  } = useTimer(currentSections);
  
  const onSelectRecipe = (recipeId: string) => {
    const success = handleSelectRecipe(recipeId, timerState.isRunning);
    if (success && recipes.find(r => r.id === recipeId)) {
      const selectedRecipe = recipes.find(r => r.id === recipeId)!;
      updateSections(selectedRecipe.sections);
    }
  };
  
  const onSaveRecipe = () => {
    handleSaveRecipe(timerState.sections, timerState.isRunning);
  };
  
  const showSaveButton = isCurrentRecipeModified(timerState.sections) && !timerState.isRunning;

  return (
    <div className="flex flex-col items-center gap-2">
      <RecipeSelector
        recipes={recipes}
        selectedRecipeId={selectedRecipeId}
        onSelectRecipe={onSelectRecipe}
      />
      
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-sm p-3 rounded-xl shadow-sm space-y-2">
          <TimerDisplay 
            currentSection={currentSection}
            timeRemaining={timeRemaining}
            progress={progress}
            isRunning={timerState.isRunning}
            isCompleted={timerState.isCompleted}
          />
          
          <TimerStagesTable 
            sections={timerState.sections}
            currentSectionIndex={timerState.currentSectionIndex}
            isRunning={timerState.isRunning}
          />
          
          <SaveRecipeButton 
            showSaveButton={showSaveButton}
            onSaveRecipe={onSaveRecipe}
          />
        </div>
        
        <div className="flex-1 flex flex-col items-center bg-white/10 backdrop-blur-sm p-3 rounded-xl shadow-sm">
          <div className="w-full">
            <TimerControls
              sections={timerState.sections}
              isRunning={timerState.isRunning}
              isCompleted={timerState.isCompleted}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              onRestart={handleRestart}
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
