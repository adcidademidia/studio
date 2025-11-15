"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ACTIVE_LOWER_THIRD_STORAGE_KEY } from "@/lib/constants";
import type { LowerThird, Theme } from "@/lib/types";
import { cn } from "@/lib/utils";

type ActiveData = {
  lowerThird: LowerThird;
  theme: Theme;
};

export function LowerThirdOverlay() {
  const [activeData, setActiveData] = useState<ActiveData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  
  const handleStorageChange = () => {
    const data = localStorage.getItem(ACTIVE_LOWER_THIRD_STORAGE_KEY);
    const parsedData: ActiveData | null = data ? JSON.parse(data) : null;
    
    if (parsedData?.lowerThird?.id !== activeData?.lowerThird?.id) {
       // If there's something visible, animate it out first
       if(isVisible) {
         setAnimationClass("animate-lower-third-out");
         setTimeout(() => {
           setActiveData(parsedData);
           if (parsedData) {
             setIsVisible(true);
             setAnimationClass("animate-lower-third-in");
           } else {
             setIsVisible(false);
           }
         }, 500); // match out-animation duration
       } else if (parsedData) {
         // If nothing is visible, just animate in
         setActiveData(parsedData);
         setIsVisible(true);
         setAnimationClass("animate-lower-third-in");
       }
    } else if (!parsedData) {
      // Handle hiding the lower third
      setAnimationClass("animate-lower-third-out");
      setTimeout(() => {
          setIsVisible(false);
          setActiveData(null);
      }, 500);
    }
  };

  useEffect(() => {
    // Initial load
    handleStorageChange();
    
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Run only on mount and unmount

  if (!activeData || !isVisible) {
    return null;
  }

  const { lowerThird, theme } = activeData;

  return (
    <div
      className={cn(
        "absolute bottom-[8vh] left-[5vw] w-[40vw] max-w-[700px] min-w-[400px]",
        animationClass
      )}
    >
      <div className="relative shadow-2xl rounded-lg overflow-hidden">
        {theme.backgroundImageUrl && (
          <Image
            src={theme.backgroundImageUrl}
            alt="Background"
            fill
            className="object-cover"
            priority
            data-ai-hint="abstract background"
          />
        )}
        <div
          className="relative px-8 py-4"
          style={{ backgroundColor: theme.backgroundColor }}
        >
          <h1
            className="font-headline text-5xl font-bold tracking-tight text-shadow"
            style={{ color: theme.titleColor }}
          >
            {lowerThird.title}
          </h1>
          <p
            className="text-3xl font-medium text-shadow-sm mt-1"
            style={{ color: theme.subtitleColor }}
          >
            {lowerThird.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
