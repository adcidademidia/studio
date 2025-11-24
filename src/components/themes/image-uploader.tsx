"use client";

import * as React from "react";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytesResumable, type StorageReference } from "firebase/storage";
import { Check, ImagePlus, Trash2, UploadCloud } from "lucide-react";

import { useStorage } from "@/firebase/storage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  value?: string;
  onChange: (value?: string) => void;
  folder: string;
}

export function ImageUploader({
  value,
  onChange,
  folder,
}: ImageUploaderProps) {
  const storage = useStorage();
  const [uploadTask, setUploadTask] = React.useState<{
    progress: number;
    state: "running" | "paused" | "success" | "error";
  } | null>(null);
  const [isHovering, setIsHovering] = React.useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storage) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload an image smaller than 10MB.",
        });
        return;
    }

    const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadTask({ progress, state: snapshot.state });
      },
      (error) => {
        setUploadTask({ progress: 0, state: "error" });
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: error.message,
        });
        console.error("Upload error:", error);
      },
      () => {
        getDownloadURL(task.snapshot.ref).then((downloadURL) => {
          onChange(downloadURL);
          setUploadTask({ progress: 100, state: "success" });
          setTimeout(() => setUploadTask(null), 2000);
        });
      }
    );
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(undefined);
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  const dropHandler = (ev: React.DragEvent<HTMLLabelElement>) => {
    ev.preventDefault();
    setIsHovering(false);
    if (ev.dataTransfer.items) {
      const item = ev.dataTransfer.items[0];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file && inputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            inputRef.current.files = dataTransfer.files;
            // Manually trigger change event
            const changeEvent = new Event('change', { bubbles: true });
            inputRef.current.dispatchEvent(changeEvent);
        }
      }
    }
  };

  const dragOverHandler = (ev: React.DragEvent<HTMLLabelElement>) => {
    ev.preventDefault();
    setIsHovering(true);
  };
  
  const dragLeaveHandler = () => {
    setIsHovering(false);
  };

  return (
    <div className="relative aspect-video w-full">
      <label
        className={cn(
          "group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20 transition-colors",
          "hover:border-primary hover:bg-primary/10",
          isHovering && "border-primary bg-primary/10"
        )}
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
        onDragLeave={dragLeaveHandler}
      >
        {value && (
          <>
            <Image
              src={value}
              alt="Uploaded background"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 z-10 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={handleRemoveImage}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}

        <div
          className={cn(
            "z-10 flex flex-col items-center text-center text-muted-foreground",
            value && "opacity-0 group-hover:opacity-100"
          )}
        >
          <UploadCloud className="mb-2 h-8 w-8" />
          <p className="text-sm font-semibold">Drop image here</p>
          <p className="text-xs">or click to browse</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/gif, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {uploadTask && uploadTask.state !== "success" && (
         <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md bg-background/80 p-4">
            <Progress value={uploadTask.progress} className="w-[60%]" />
            <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
        </div>
      )}
      {uploadTask && uploadTask.state === "success" && (
         <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md bg-green-500/80 p-4">
            <Check className="h-8 w-8 text-white" />
            <p className="mt-2 text-sm font-semibold text-white">Upload Complete</p>
        </div>
      )}
    </div>
  );
}
