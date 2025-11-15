"use client";

import { useEffect } from "react";
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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const themeSchema = z.object({
  name: z.string().min(1, "Theme name is required."),
  titleColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color."),
  subtitleColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color."),
  backgroundColor: z.string(), // Can be any CSS color
  backgroundImageUrl: z.string().url("Must be a valid URL.").or(z.literal("")),
});

type EditThemeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themeId?: string;
};

export function EditThemeDialog({ open, onOpenChange, themeId }: EditThemeDialogProps) {
  const { getThemeById, addTheme, updateTheme } = useAppStore();
  const isEditing = !!themeId;
  const theme = isEditing ? getThemeById(themeId) : null;

  const form = useForm<z.infer<typeof themeSchema>>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      name: "",
      titleColor: "#FFFFFF",
      subtitleColor: "#CCCCCC",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backgroundImageUrl: "",
    },
  });

  useEffect(() => {
    if (open && isEditing && theme) {
      form.reset({
        name: theme.name,
        titleColor: theme.titleColor,
        subtitleColor: theme.subtitleColor,
        backgroundColor: theme.backgroundColor,
        backgroundImageUrl: theme.backgroundImageUrl || "",
      });
    } else if (open && !isEditing) {
      form.reset({
        name: "",
        titleColor: "#FFFFFF",
        subtitleColor: "#CCCCCC",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backgroundImageUrl: "",
      });
    }
  }, [open, isEditing, theme, form]);

  const onSubmit = (values: z.infer<typeof themeSchema>) => {
    if (isEditing && theme) {
      updateTheme({ ...theme, ...values });
    } else {
      addTheme(values);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? "Edit Theme" : "Create New Theme"}</DialogTitle>
          <DialogDescription>
            Customize the appearance of your lower third. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sunday Service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="titleColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} className="p-1"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subtitleColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} className="p-1"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Color</FormLabel>
                    <FormControl>
                       <Input placeholder="rgba(0,0,0,0.5)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <FormField
                control={form.control}
                name="backgroundImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Image</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a background or leave empty" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {PlaceHolderImages.map(img => (
                                <SelectItem key={img.id} value={img.imageUrl}>{img.description}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <DialogFooter className="mt-4">
              <Button type="submit">{isEditing ? "Save Changes" : "Create Theme"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
