
import React from 'react';
import Timer from '@/components/Timer';

const Index = () => {
  return (
    <div className="min-h-screen bg-timer-background flex flex-col items-center justify-center p-2">
      <div className="text-center mb-3">
        <h1 className="text-2xl font-bold text-timer-text">Pour over timer</h1>
        <p className="text-xs text-timer-text/70">Choose a recipe and track your pour over coffee timing</p>
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl shadow-lg w-full max-w-3xl">
        <Timer />
      </div>
      
      <p className="text-xs text-timer-text/50 mt-2">
        Customize times and save your personal recipes
      </p>
    </div>
  );
};

export default Index;
