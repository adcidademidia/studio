"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/hooks/use-app-store";
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
import { useToast } from "@/hooks/use-toast";

const importSchema = z.object({
  url: z.string().url("Please enter a valid Planning Center plan URL."),
});

// Dummy data to simulate API response
const dummyImportData = [
    { title: "Living Hope", subtitle: "Phil Wickham, Brian Johnson" },
    { title: "Graves Into Gardens", subtitle: "Elevation Worship" },
    { title: "Goodness of God", subtitle: "Bethel Music" },
];


export function ImportPlanningCenterDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { addLowerThird } = useAppStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof importSchema>>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (values: z.infer<typeof importSchema>) => {
    // Simulate API call and import
    console.log("Importing from:", values.url);
    dummyImportData.forEach(item => {
        addLowerThird({ ...item, type: 'music' });
    });
    
    toast({
        title: "Import Successful",
        description: `${dummyImportData.length} songs were imported from the plan.`,
    });

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Import from Planning Center</DialogTitle>
          <DialogDescription>
            Paste the URL of a Planning Center plan to automatically import song titles and authors.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://services.planningcenteronline.com/plans/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Import</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
