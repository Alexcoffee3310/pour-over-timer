
import React from 'react';
import Timer from '@/components/Timer';

const Index = () => {
  return (
    <div className="min-h-screen bg-timer-background flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-timer-text mb-2">Pour over timer</h1>
        <p className="text-timer-text/70">Set your timer and track the countdown with a visual progress indicator.</p>
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg max-w-lg w-full">
        <Timer initialTimeInSeconds={300} />
      </div>
      
      <p className="text-sm text-timer-text/50 mt-6">
        Customize the time and press Start to begin the countdown.
      </p>
    </div>
  );
};

export default Index;
