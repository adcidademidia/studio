"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/hooks/use-app-store";
import type { LowerThird } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const lowerThirdSchema = z.object({
  title: z.string().min(1, "Title is required."),
  subtitle: z.string().min(1, "Subtitle is required."),
});

type AddLowerThirdDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: LowerThird["type"];
};

export function AddLowerThirdDialog({ open, onOpenChange, type }: AddLowerThirdDialogProps) {
  const { addLowerThird } = useAppStore();

  const form = useForm<z.infer<typeof lowerThirdSchema>>({
    resolver: zodResolver(lowerThirdSchema),
    defaultValues: {
      title: "",
      subtitle: "",
    },
  });

  const onSubmit = (values: z.infer<typeof lowerThirdSchema>) => {
    addLowerThird({ ...values, type });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New {type === "person" ? "Person" : "Music"}</DialogTitle>
          <DialogDescription>
            Enter the details for the new lower third.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder={type === 'person' ? "e.g., John Doe" : "e.g., Amazing Grace"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input placeholder={type === 'person' ? "e.g., Lead Pastor" : "e.g., John Newton"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
