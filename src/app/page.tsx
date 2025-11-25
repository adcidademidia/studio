"use client";

import * as React from "react";
import { Music, Plus, User, FileInput } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddLowerThirdDialog } from "@/components/lower-thirds/add-lower-third-dialog";
import { ImportPlanningCenterDialog } from "@/components/lower-thirds/import-planning-center-dialog";
import { LowerThirdsTabContent } from "@/components/lower-thirds/lower-thirds-tab-content";
import { useAppStore } from "@/hooks/use-app-store";

export default function Home() {
  const [addPersonOpen, setAddPersonOpen] = React.useState(false);
  const [addMusicOpen, setAddMusicOpen] = React.useState(false);
  const [importMusicOpen, setImportMusicOpen] = React.useState(false);
  const { isInitialized } = useAppStore();

  if (!isInitialized) {
    // Render nothing or a loading spinner on the server and during initial client render
    return null;
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Lower Thirds Configuration"
          description="Manage, add, and activate lower thirds for your stream. The active item will show on the display page."
        />

        <Tabs defaultValue="people" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="people">
              <User className="mr-2" />
              People
            </TabsTrigger>
            <TabsTrigger value="music">
              <Music className="mr-2" />
              Music
            </TabsTrigger>
          </TabsList>
          <TabsContent value="people" className="mt-6">
            <LowerThirdsTabContent
              type="person"
              actions={
                <Button onClick={() => setAddPersonOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Person
                </Button>
              }
            />
          </TabsContent>
          <TabsContent value="music" className="mt-6">
            <LowerThirdsTabContent
              type="music"
              actions={
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setImportMusicOpen(true)}>
                    <FileInput className="mr-2 h-4 w-4" /> Import from PCO
                  </Button>
                  <Button onClick={() => setAddMusicOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Music
                  </Button>
                </div>
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      <AddLowerThirdDialog
        type="person"
        open={addPersonOpen}
        onOpenChange={setAddPersonOpen}
      />
      <AddLowerThirdDialog
        type="music"
        open={addMusicOpen}
        onOpenChange={setAddMusicOpen}
      />
      <ImportPlanningCenterDialog
        open={importMusicOpen}
        onOpenChange={setImportMusicOpen}
      />
    </MainLayout>
  );
}
