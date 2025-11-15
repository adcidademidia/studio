"use client";

import * as React from 'react'
import { doc } from 'firebase/firestore';
import { ArrowDown, ArrowUp, Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { ACTIVE_LOWER_THIRD_ID } from "@/lib/constants";
import type { ActiveData, LowerThird, Theme } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EditLowerThirdDialog } from "./edit-lower-third-dialog";
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
import { useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { useAppStore } from '@/hooks/use-app-store';

interface LowerThirdItemControlsProps {
  item: LowerThird;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (id: string) => void;
  onUpdate: (item: LowerThird) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

export function LowerThirdItemControls({
  item,
  isFirst,
  isLast,
  onDelete,
  onUpdate,
  onMove,
}: LowerThirdItemControlsProps) {
  const firestore = useFirestore();
  const [editOpen, setEditOpen] = React.useState(false);
  const { getActiveTheme } = useAppStore();
  const activeTheme = getActiveTheme();

  const activeStateRef = useMemoFirebase(
    () => firestore ? doc(firestore, 'activeState', ACTIVE_LOWER_THIRD_ID) : null,
    [firestore]
  );
  const { data: activeData } = useDoc<ActiveData>(activeStateRef);

  const isActive = activeData?.lowerThird?.id === item.id;

  const handleShow = () => {
    if (activeTheme && firestore && activeStateRef) {
      const dataToStore: ActiveData = { lowerThird: item, theme: activeTheme };
      setDocumentNonBlocking(activeStateRef, dataToStore, { merge: false });
    } else {
        alert("Please set an active theme first.");
    }
  };

  const handleHide = () => {
    if (firestore && activeStateRef) {
      deleteDocumentNonBlocking(activeStateRef);
    }
  }

  return (
    <>
      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => onMove(item.id, 'up')} disabled={isFirst}>
            <ArrowUp className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onMove(item.id, 'down')} disabled={isLast}>
            <ArrowDown className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{item.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
          <Edit className="h-4 w-4" />
        </Button>
        {isActive ? (
             <Button size="sm" variant="outline" onClick={handleHide}>
                <EyeOff className="mr-2 h-4 w-4" /> Hide
            </Button>
        ) : (
            <Button size="sm" onClick={handleShow}>
                <Eye className="mr-2 h-4 w-4" /> Show
            </Button>
        )}
      </div>

      <EditLowerThirdDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        item={item}
        onSave={onUpdate}
      />
    </>
  );
}
