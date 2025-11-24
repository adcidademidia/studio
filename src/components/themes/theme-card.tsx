import Image from "next/image";
import { CheckCircle, Edit, Star, Trash2 } from "lucide-react";
import type { Theme } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils";

interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  onEdit: () => void;
  onSetActive: () => void;
  onDelete: () => void;
}

export function ThemeCard({
  theme,
  isActive,
  onEdit,
  onSetActive,
  onDelete,
}: ThemeCardProps) {
  return (
    <Card className={cn("flex flex-col transition-all", isActive && "border-primary ring-2 ring-primary")}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-headline">{theme.name}</span>
          {isActive && <CheckCircle className="h-5 w-5 text-primary" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div
          className="relative aspect-video w-full overflow-hidden rounded-md border"
        >
          {theme.backgroundLayer3 && (
             <Image
              src={theme.backgroundLayer3}
              alt={theme.name}
              fill
              className="object-cover"
              data-ai-hint="abstract background"
            />
          )}
          {theme.backgroundLayer2 && (
             <Image
              src={theme.backgroundLayer2}
              alt={theme.name}
              fill
              className="object-cover"
              data-ai-hint="abstract background"
            />
          )}
          {theme.backgroundLayer1 && (
             <Image
              src={theme.backgroundLayer1}
              alt={theme.name}
              fill
              className="object-cover"
              data-ai-hint="abstract background"
            />
          )}
           <div className="absolute bottom-4 left-4 right-4 rounded-lg p-3" style={{ backgroundColor: theme.backgroundColor }}>
              <h3 className="font-bold truncate" style={{ color: theme.titleColor }}>Title Text</h3>
              <p className="text-sm truncate" style={{ color: theme.subtitleColor }}>Subtitle text goes here</p>
           </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Theme</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the theme "{theme.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </Button>
            <Button size="sm" onClick={onSetActive} disabled={isActive}>
                <Star className="mr-2 h-4 w-4" />
                Set Active
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
