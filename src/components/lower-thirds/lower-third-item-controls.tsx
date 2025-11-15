"use client";

import * as React from 'react'
import { ArrowDown, ArrowUp, Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { ACTIVE_LOWER_THIRD_STORAGE_KEY } from "@/lib/constants";
import type { LowerThird, Theme } from "@/lib/types";
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

interface LowerThirdItemControlsProps {
  item: LowerThird;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (id: string) => void;
  onUpdate: (item: LowerThird) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  activeTheme?: Theme;
}

export function LowerThirdItemControls({
  item,
  isFirst,
  isLast,
  onDelete,
  onUpdate,
  onMove,
  activeTheme,
}: LowerThirdItemControlsProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    const checkActive = () => {
        const activeItemRaw = localStorage.getItem(ACTIVE_LOWER_THIRD_STORAGE_KEY);
        if (activeItemRaw) {
            const activeItem = JSON.parse(activeItemRaw);
            setIsActive(activeItem?.lowerThird?.id === item.id);
        } else {
            setIsActive(false);
        }
    };
    checkActive();
    window.addEventListener('storage', checkActive);
    return () => window.removeEventListener('storage', checkActive);
  }, [item.id])

  const handleShow = () => {
    if (activeTheme) {
      const dataToStore = JSON.stringify({ lowerThird: item, theme: activeTheme });
      localStorage.setItem(ACTIVE_LOWER_THIRD_STORAGE_KEY, dataToStore);
      // Manually dispatch a storage event so this tab also updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: ACTIVE_LOWER_THIRD_STORAGE_KEY,
        newValue: dataToStore,
      }));
    } else {
        alert("Please set an active theme first.");
    }
  };

  const handleHide = () => {
    localStorage.removeItem(ACTIVE_LOWER_THIRD_STORAGE_KEY);
     window.dispatchEvent(new StorageEvent('storage', {
        key: ACTIVE_LOWER_THIRD_STORAGE_KEY,
        newValue: null,
      }));
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
