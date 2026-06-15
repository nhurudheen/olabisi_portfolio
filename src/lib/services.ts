export type Service = {
  id: string;
  title: string;
  description: string;
  price: string; // display string e.g. "£67", "FREE"
  free?: boolean;
};

export const SERVICE_RECIPIENT = "hello@olabisi.co";

export const services: Service[] = [
  {
    id: "cv-linkedin-makeover",
    title: "CV & LinkedIn Makeover",
    description: "Repositioned for UK recruiters — so you get callbacks, not silence.",
    price: "£67",
  },
  {
    id: "interview-prep-intensive",
    title: "Interview Prep Intensive",
    description: "Practise with someone who passed them — walk in prepared, not hopeful.",
    price: "£97",
  },
  {
    id: "survival-jobs-guide",
    title: "10 Mistakes Keeping You Stuck in Survival Jobs",
    description: "Fix these before you send another CV — instant download.",
    price: "FREE",
    free: true,
  },
  {
    id: "income-clarity-course",
    title: "Income Clarity Course",
    description: "Position your expertise so the market sees your value — and pays for it.",
    price: "£97",
  },
  {
    id: "strategy-session",
    title: "1:1 Strategy Session",
    description: "60 minutes on the decision that matters — leave with a written plan.",
    price: "£50",
  },
  {
    id: "business-structure-audit",
    title: "Business Structure & Systems Audit",
    description: "An assurance-grade review that makes your business scalable and fundable.",
    price: "£347",
  },
];
