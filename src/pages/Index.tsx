
import React from 'react';
import Timer from '@/components/Timer';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  return (
    <ScrollArea className="h-screen w-full">
      <div className="min-h-screen bg-timer-background flex flex-col items-center justify-start p-4 pt-8 rustic-gradient wood-texture">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-timer-text">
            Pour Over Timer
          </h1>
        </div>
        
        <p className="text-sm font-light text-timer-text/60 mb-1 tracking-wide text-center">
          Craft your perfect brew with customizable recipes
        </p>
        
        <div className="p-5 w-full max-w-3xl">
          <Timer />
        </div>
      </div>
    </ScrollArea>
  );
};

export default Index;
