"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EditThemeDialog } from "@/components/themes/edit-theme-dialog";
import { ThemeList } from "@/components/themes/theme-list";

export default function ThemesPage() {
  const { themes, activeThemeId, setActiveThemeId, removeTheme, isInitialized } = useAppStore();
  const [editTheme, setEditTheme] = React.useState<string | null | "new">(null);
  
  if (!isInitialized) {
    // Render nothing or a loading spinner on the server and during initial client render
    return null;
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Theme Management"
          description="Create, edit, and apply themes to your lower thirds. The active theme is used on the display page."
          actions={
            <Button onClick={() => setEditTheme("new")}>
              <Plus className="mr-2 h-4 w-4" /> Add Theme
            </Button>
          }
        />
        
        <ThemeList 
          themes={themes}
          activeThemeId={activeThemeId}
          onSetEditTheme={setEditTheme}
          onSetActiveTheme={setActiveThemeId}
          onDeleteTheme={removeTheme}
        />

      </div>

      <EditThemeDialog
        open={editTheme !== null}
        onOpenChange={(isOpen) => !isOpen && setEditTheme(null)}
        themeId={editTheme !== "new" ? editTheme : undefined}
      />
    </MainLayout>
  );
}
