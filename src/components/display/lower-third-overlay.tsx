"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { ActiveData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ACTIVE_LOWER_THIRD_ID } from "@/lib/constants";

export function LowerThirdOverlay() {
  const firestore = useFirestore();
  const [prevActiveData, setPrevActiveData] = useState<ActiveData | null>(null);

  const activeStateRef = useMemoFirebase(
    () => firestore ? doc(firestore, 'activeState', ACTIVE_LOWER_THIRD_ID) : null,
    [firestore]
  );
  const { data: activeData, isLoading } = useDoc<ActiveData>(activeStateRef);

  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    const hasDataChanged = activeData?.lowerThird?.id !== prevActiveData?.lowerThird?.id;

    if (isLoading) return;

    if (hasDataChanged) {
      if (isVisible) {
        // Animate out the old one
        setAnimationClass("animate-lower-third-out");
        setTimeout(() => {
          setPrevActiveData(activeData || null);
          if (activeData) {
            // Animate in the new one
            setIsVisible(true);
            setAnimationClass("animate-lower-third-in");
          } else {
            setIsVisible(false);
          }
        }, 500); // match out-animation duration
      } else if (activeData) {
        // Nothing is visible, just animate in the new one
        setPrevActiveData(activeData);
        setIsVisible(true);
        setAnimationClass("animate-lower-third-in");
      }
    } else if (!activeData && isVisible) {
      // Handle hiding the lower third
      setAnimationClass("animate-lower-third-out");
      setTimeout(() => {
        setIsVisible(false);
        setPrevActiveData(null);
      }, 500);
    }
  }, [activeData, prevActiveData, isVisible, isLoading]);


  const displayData = isVisible ? prevActiveData : null;

  if (!displayData) {
    return null;
  }

  const { lowerThird, theme } = displayData;

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
