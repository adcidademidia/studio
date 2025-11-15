import type { Theme } from "@/lib/types";
import { ThemeCard } from "@/components/themes/theme-card";

interface ThemeListProps {
  themes: Theme[];
  activeThemeId: string | null;
  onSetEditTheme: (id: string) => void;
  onSetActiveTheme: (id: string) => void;
  onDeleteTheme: (id: string) => void;
}

export function ThemeList({ 
  themes,
  activeThemeId,
  onSetEditTheme,
  onSetActiveTheme,
  onDeleteTheme 
}: ThemeListProps) {
  if (themes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
        <h3 className="text-lg font-semibold text-muted-foreground">No themes found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by creating a new theme.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {themes.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isActive={theme.id === activeThemeId}
          onEdit={() => onSetEditTheme(theme.id)}
          onSetActive={() => onSetActiveTheme(theme.id)}
          onDelete={() => onDeleteTheme(theme.id)}
        />
      ))}
    </div>
  );
}
