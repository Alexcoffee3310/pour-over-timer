
import React from 'react';
import Timer from '@/components/Timer';

const Index = () => {
  return (
    <div className="min-h-screen bg-timer-background flex flex-col items-center justify-start p-4 pt-8 luxury-gradient">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-timer-text">
          Pour over timer
        </h1>
      </div>
      
      <p className="text-sm font-light text-timer-text/50 mb-3 tracking-wide text-center">
        Craft your perfect brew with customizable recipes
      </p>
      
      <div className="p-5 w-full max-w-3xl">
        <Timer />
      </div>
    </div>
  );
};

export default Index;
