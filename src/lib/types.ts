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
  backgroundImageUrl: string;
};

export type ActiveData = {
  lowerThird: LowerThird;
  theme: Theme;
};
