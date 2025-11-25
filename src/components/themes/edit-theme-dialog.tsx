
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

const themeSchema = z.object({
  name: z.string().min(1, "Theme name is required."),
  titleColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color."),
  subtitleColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color."),
  backgroundColor: z.string(), // Can be any CSS color
  backgroundLayer1: z.string().optional(),
  backgroundLayer2: z.string().optional(),
  backgroundLayer3: z.string().optional(),
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
      backgroundColor: "rgba(0, 0, 0, 0.0)",
      backgroundLayer1: "",
      backgroundLayer2: "",
      backgroundLayer3: "",
    },
  });

  useEffect(() => {
    if (open && isEditing && theme) {
      form.reset({
        name: theme.name,
        titleColor: theme.titleColor,
        subtitleColor: theme.subtitleColor,
        backgroundColor: theme.backgroundColor,
        backgroundLayer1: theme.backgroundLayer1 || "",
        backgroundLayer2: theme.backgroundLayer2 || "",
        backgroundLayer3: theme.backgroundLayer3 || "",
      });
    } else if (open && !isEditing) {
      form.reset({
        name: "",
        titleColor: "#FFFFFF",
        subtitleColor: "#CCCCCC",
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        backgroundLayer1: "",
        backgroundLayer2: "",
        backgroundLayer3: "",
      });
    }
  }, [open, isEditing, theme, form]);

  const onSubmit = (values: z.infer<typeof themeSchema>) => {
    const submissionValues = {
        ...values,
        backgroundLayer1: values.backgroundLayer1 || undefined,
        backgroundLayer2: values.backgroundLayer2 || undefined,
        backgroundLayer3: values.backgroundLayer3 || undefined,
    };

    if (isEditing && theme) {
      updateTheme({ ...theme, ...submissionValues });
    } else {
      addTheme(submissionValues);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? "Edit Theme" : "Create New Theme"}</DialogTitle>
          <DialogDescription>
            Customize the appearance of your lower third. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
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
                            <FormLabel>Mask Background Color</FormLabel>
                            <FormControl>
                            <Input placeholder="rgba(0,0,0,0.5)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="backgroundLayer1"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Layer 1 Image URL (Top, Left)</FormLabel>
                            <FormControl>
                                <Input placeholder="Paste Google Drive link or image URL" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="backgroundLayer2"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Layer 2 Image URL (Middle, Right, Masked)</FormLabel>
                        <FormControl>
                             <Input placeholder="Paste Google Drive link or image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="backgroundLayer3"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Layer 3 Image URL (Bottom, Left, Masked)</FormLabel>
                        <FormControl>
                            <Input placeholder="Paste Google Drive link or image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">{isEditing ? "Save Changes" : "Create Theme"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
