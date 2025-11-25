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
  backgroundLayer1?: string; // Google Drive Link or direct image URL
  backgroundLayer2?: string; // Google Drive Link or direct image URL
  backgroundLayer3?: string; // Google Drive Link or direct image URL
};

export type ActiveData = {
  lowerThird: LowerThird;
  theme: Theme;
};
