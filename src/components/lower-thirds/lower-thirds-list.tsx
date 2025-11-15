import type { LowerThird, Theme } from "@/lib/types";
import { LowerThirdItemControls } from "./lower-third-item-controls";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface LowerThirdsListProps {
  items: LowerThird[];
  onDelete: (id: string) => void;
  onUpdate: (item: LowerThird) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  activeTheme?: Theme;
}

export function LowerThirdsList({
  items,
  onDelete,
  onUpdate,
  onMove,
  activeTheme,
}: LowerThirdsListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
        <h3 className="text-lg font-semibold text-muted-foreground">No items found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by adding a new item.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl capitalize">{items[0]?.type} List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group flex items-center justify-between gap-4 rounded-lg border bg-background p-3 hover:bg-muted/50"
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>
              <LowerThirdItemControls
                item={item}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onMove={onMove}
                activeTheme={activeTheme}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
