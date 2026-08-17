import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "../../caseData";
import { CasePageClient } from "./CasePageClient";
import "./case.css";

export function generateStaticParams() {
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) notFound();

  return (
    <CasePageClient
      project={project}
      relatedProjects={caseStudies
        .filter((item) => item.slug !== project.slug)
        .slice(0, 3)}
    />
  );
}
