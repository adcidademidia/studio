"use client";

import { useAppStore } from "@/hooks/use-app-store";
import type { LowerThird } from "@/lib/types";
import { LowerThirdsList } from "./lower-thirds-list";

interface LowerThirdsTabContentProps {
  type: LowerThird["type"];
  actions: React.ReactNode;
}

export function LowerThirdsTabContent({ type, actions }: LowerThirdsTabContentProps) {
  const { lowerThirds, removeLowerThird, updateLowerThird, moveLowerThird } = useAppStore();
  
  const items = lowerThirds.filter((item) => item.type === type);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">{actions}</div>
      <LowerThirdsList
        items={items}
        onDelete={removeLowerThird}
        onUpdate={updateLowerThird}
        onMove={moveLowerThird}
      />
    </div>
  );
}
