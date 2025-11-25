"use client";

import { useRef } from "react";
import Image from "next/image";
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { ActiveData } from "@/lib/types";
import { cn, convertGoogleDriveLink } from "@/lib/utils";
import { ACTIVE_LOWER_THIRD_ID } from "@/lib/constants";

export function LowerThirdOverlay() {
  const firestore = useFirestore();

  const activeStateRef = useMemoFirebase(
    () => firestore ? doc(firestore, 'activeState', ACTIVE_LOWER_THIRD_ID) : null,
    [firestore]
  );
  const { data: activeData } = useDoc<ActiveData>(activeStateRef);

  const textContentRef = useRef<HTMLDivElement>(null);

  const isVisible = !!activeData;

  if (!activeData) {
    return null;
  }

  const { lowerThird, theme } = activeData;
  const layer1 = convertGoogleDriveLink(theme.backgroundLayer1);
  const layer2 = convertGoogleDriveLink(theme.backgroundLayer2);
  const layer3 = convertGoogleDriveLink(theme.backgroundLayer3);

  const IMAGE_WIDTH = 1920;
  const IMAGE_HEIGHT = 180;
  const TEXT_LEFT_PADDING = 220;

  return (
    <div
      className={cn(
        "absolute bottom-[8vh] left-0 w-[1920px] h-[180px]",
        "transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="relative w-full h-full">
        {/* Layer 1: Top Image (z-30), left aligned */}
        {layer1 && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            <Image
              src={layer1}
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
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[120px] overflow-hidden rounded-r-full"
          style={{ 
            width: 'fit-content', // Use CSS to determine width
            backgroundColor: theme.backgroundColor
          }}
        >
          <div className="relative w-full h-full">
            {/* Layer 3: Background Image (z-10), left aligned, inside mask */}
            {layer3 && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                  <Image
                  src={layer3}
                  alt="Lower third background layer"
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                  unoptimized
                  />
              </div>
            )}

            {/* Layer 2: Middle Image (z-20), right aligned, inside mask */}
            {layer2 && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                  <Image
                  src={layer2}
                  alt="Lower third middle layer"
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                  unoptimized
                  />
              </div>
            )}

            {/* Text Content - now inside the sizing container */}
            <div
                ref={textContentRef}
                className="relative z-40 h-[120px] flex flex-col justify-center whitespace-nowrap"
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
      </div>
    </div>
  );
}
