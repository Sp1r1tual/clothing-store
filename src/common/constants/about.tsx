import { ReactNode } from "react";

import { Fingerprint, Gem, Sparkles } from "lucide-react";

export interface IAboutItem {
  id: string;
  icon: ReactNode;
  titleKey: "whoWeAreTitle" | "differencesTitle" | "productionTitle";
  descKey: "whoWeAreDesc" | "differencesDesc" | "productionDesc";
}

export const ABOUT_ITEMS: IAboutItem[] = [
  {
    id: "who-we-are",
    icon: <Fingerprint size={28} strokeWidth={1.5} />,
    titleKey: "whoWeAreTitle",
    descKey: "whoWeAreDesc",
  },
  {
    id: "differences",
    icon: <Sparkles size={28} strokeWidth={1.5} />,
    titleKey: "differencesTitle",
    descKey: "differencesDesc",
  },
  {
    id: "production",
    icon: <Gem size={28} strokeWidth={1.5} />,
    titleKey: "productionTitle",
    descKey: "productionDesc",
  },
];
