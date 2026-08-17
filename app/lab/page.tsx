import type { Metadata } from "next";
import AILabPage from "./AILabPage";
import "./lab.css";

export const metadata: Metadata = {
  title: "More Cases — Jean",
  description: "Jean 的过往案例与持续探索。",
};

export default function LabPage() {
  return <AILabPage />;
}
