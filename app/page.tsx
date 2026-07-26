import type { Metadata } from "next";
import PortfolioHome from "./PortfolioHome";

export const metadata: Metadata = {
  title: {
    absolute: "Jean Zhou — Experience Designer",
  },
  description:
    "Jean Zhou 的个人作品集：把复杂系统，设计成自然、清晰、有人情味的体验。",
};

export default function Home() {
  return <PortfolioHome />;
}
