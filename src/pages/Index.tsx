
import React from 'react';
import Timer from '@/components/Timer';

const Index = () => {
  return (
    <div className="min-h-screen bg-timer-background flex flex-col items-center justify-center p-2">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-timer-text">Pour over timer</h1>
        <p className="text-sm text-timer-text/70">Choose a recipe and track the countdown with a visual progress indicator.</p>
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-lg w-full">
        <Timer />
      </div>
      
      <p className="text-xs text-timer-text/50 mt-3">
        Select a recipe or customize the time for each section and press Start to begin the countdown.
      </p>
    </div>
  );
};

export default Index;
