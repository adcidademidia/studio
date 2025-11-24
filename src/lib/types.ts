export type LowerThird = {
  id: string;
  type: "person" | "music";
  title: string;
  subtitle: string;
};

export type Theme = {
  id: string;
  name: string;
  titleColor: string;
  subtitleColor: string;
  backgroundColor: string;
  backgroundLayer1?: string; // Image with highest z-index, left-aligned
  backgroundLayer2?: string; // Image with mid z-index, right-aligned, masked
  backgroundLayer3?: string; // Image with lowest z-index, left-aligned, masked
};

export type ActiveData = {
  lowerThird: LowerThird;
  theme: Theme;
};
