"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

type EditLowerThirdDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: LowerThird;
  onSave: (item: LowerThird) => void;
};

export function EditLowerThirdDialog({ open, onOpenChange, item, onSave }: EditLowerThirdDialogProps) {
  const form = useForm<z.infer<typeof lowerThirdSchema>>({
    resolver: zodResolver(lowerThirdSchema),
    defaultValues: {
      title: item.title,
      subtitle: item.subtitle,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: item.title,
        subtitle: item.subtitle,
      });
    }
  }, [open, item, form]);

  const onSubmit = (values: z.infer<typeof lowerThirdSchema>) => {
    onSave({ ...item, ...values });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Edit {item.type === "person" ? "Person" : "Music"}</DialogTitle>
          <DialogDescription>
            Make changes to the lower third details.
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
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
