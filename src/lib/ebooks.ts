import ebook1 from "@/assets/ebook-1.jpg";
import ebook2 from "@/assets/ebook-2.jpg";
import ebook3 from "@/assets/ebook-3.jpg";

export type Ebook = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  cover: string;
  pages: number;
  badge?: string;
};

export const ebooks: Ebook[] = [
  {
    id: "clarity-blueprint",
    title: "The Clarity Blueprint",
    subtitle: "Design a career you actually want",
    description:
      "A step-by-step workbook for professionals ready to stop drifting. Define your direction, audit your strengths, and build a 90-day plan that compounds.",
    price: 19,
    originalPrice: 29,
    cover: ebook1,
    pages: 128,
    badge: "Bestseller",
  },
  {
    id: "income-architect",
    title: "Income Architect",
    subtitle: "Structure, price and scale your offer",
    description:
      "The frameworks I use with private clients to turn expertise into recurring income — positioning, pricing tiers, and the systems that hold it together.",
    price: 24,
    cover: ebook2,
    pages: 164,
  },
  {
    id: "visibility-edit",
    title: "The Visibility Edit",
    subtitle: "Be known for the right things",
    description:
      "A practical guide to building strategic visibility without burning out. Personal brand pillars, content rhythms, and the messages that move people.",
    price: 17,
    cover: ebook3,
    pages: 96,
    badge: "New",
  },
];

export const getEbook = (id: string) => ebooks.find((b) => b.id === id);
