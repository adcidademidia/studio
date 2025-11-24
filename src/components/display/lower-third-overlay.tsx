"use client";

import { useState, useEffect, useRef } from "react";
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
  const [animationClass, setAnimationClass] = useState("opacity-0");

  const [maskWidth, setMaskWidth] = useState(0);
  const textContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textContentRef.current) {
        // Calculate width of text content + padding and set mask width
        const textWidth = textContentRef.current.scrollWidth;
        setMaskWidth(textWidth);
    }
  }, [prevActiveData]); // Recalculate on data change

  useEffect(() => {
    const hasDataChanged = activeData?.lowerThird?.id !== prevActiveData?.lowerThird?.id || activeData?.theme.id !== prevActiveData?.theme.id;

    if (isLoading) return;

    if (activeData) {
      if (isVisible && hasDataChanged) {
        // Data changed, animate out then in
        setAnimationClass("animate-lower-third-out");
        setTimeout(() => {
          setPrevActiveData(activeData);
          setAnimationClass("animate-lower-third-in");
        }, 500);
      } else if (!isVisible) {
        // Not visible, just animate in
        setPrevActiveData(activeData);
        setIsVisible(true);
        setAnimationClass("animate-lower-third-in");
      }
    } else if (isVisible) {
      // No active data, animate out
      setAnimationClass("animate-lower-third-out");
      setTimeout(() => {
        setIsVisible(false);
        setPrevActiveData(null);
      }, 500);
    }
  }, [activeData, prevActiveData, isVisible, isLoading]);


  const displayData = prevActiveData;

  if (!displayData) {
    return null;
  }

  const { lowerThird, theme } = displayData;
  const IMAGE_WIDTH = 1920;
  const IMAGE_HEIGHT = 180;
  const MASK_HEIGHT = 120;
  const TEXT_LEFT_PADDING = 220;

  return (
    <div
      className={cn(
        "absolute bottom-[8vh] left-0 w-[1920px] h-[180px]",
        "transition-opacity duration-500",
        animationClass
      )}
    >
      <div className="relative w-full h-full">
        {/* Layer 1: Top Image (z-30), left aligned */}
        {theme.backgroundLayer1 && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            <Image
              src={theme.backgroundLayer1}
              alt="Lower third top layer"
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              className="absolute left-0 top-0"
              unoptimized
            />
          </div>
        )}

        {/* Mask Container */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[120px] overflow-hidden rounded-r-full transition-[width] duration-500 ease-in-out"
          style={{ 
            width: `${maskWidth}px`, 
            backgroundColor: theme.backgroundColor
          }}
        >
            {/* Layer 3: Background Image (z-10), left aligned, inside mask */}
            {theme.backgroundLayer3 && (
            <div className="absolute inset-0 z-10 pointer-events-none">
                <Image
                src={theme.backgroundLayer3}
                alt="Lower third background layer"
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                className="absolute left-0 top-1/2 -translate-y-1/2"
                unoptimized
                />
            </div>
            )}

            {/* Layer 2: Middle Image (z-20), right aligned, inside mask */}
            {theme.backgroundLayer2 && (
            <div className="absolute inset-0 z-20 pointer-events-none">
                <Image
                src={theme.backgroundLayer2}
                alt="Lower third middle layer"
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                className="absolute right-0 top-1/2 -translate-y-1/2"
                unoptimized
                />
            </div>
            )}
        </div>

        {/* Text Content - used for sizing and display */}
        <div
            ref={textContentRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 h-[120px] flex flex-col justify-center whitespace-nowrap"
            style={{ paddingLeft: `${TEXT_LEFT_PADDING}px`, paddingRight: '60px' }}
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
