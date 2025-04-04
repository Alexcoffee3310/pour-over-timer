
import React from 'react';
import Timer from '@/components/Timer';

const Index = () => {
  return (
    <div className="min-h-screen bg-timer-background flex flex-col items-center justify-start p-4 pt-8 luxury-gradient">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-light tracking-tight text-timer-text">
          <span className="font-semibold">POUR</span> OVER
        </h1>
        <p className="text-xs uppercase tracking-widest text-timer-text/60 mt-1">
          Precision Timer for Artisanal Coffee
        </p>
      </div>
      
      <div className="p-5 w-full max-w-3xl">
        <Timer />
      </div>
      
      <p className="text-xs text-timer-text/50 mt-2 tracking-wide">
        Craft your perfect brew with customizable recipes
      </p>
    </div>
  );
};

export default Index;
