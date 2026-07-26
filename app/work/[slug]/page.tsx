import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "../../caseData";
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
    <main className="case-page">
      <header className="case-nav">
        <Link href="/" className="case-brand">
          JEAN ZHOU<sup>®</sup>
        </Link>
        <span>ARCHIVE / {project.index}</span>
        <Link href="/#work">CLOSE ×</Link>
      </header>

      <section className="case-hero">
        <p>{project.category}</p>
        <h1>{project.title}</h1>
        <h2>{project.englishTitle}</h2>
        <div className="case-meta">
          <span>YEAR / {project.year}</span>
          <span>TYPE / CASE STUDY</span>
          <span>STATUS / CURATING</span>
        </div>
      </section>

      <section className="case-summary">
        <span>OVERVIEW</span>
        <p>{project.summary}</p>
      </section>

      <section className="document-window">
        <div className="document-bar">
          <span>{project.document ? "CASE-STUDY.PDF" : "PROJECT-PREVIEW.PNG"}</span>
          <div>
            <i />
            <i />
            <i />
          </div>
        </div>
        {project.document ? (
          <object
            data={project.document}
            type="application/pdf"
            aria-label={`${project.title} PDF 案例`}
          >
            <img src={project.image} alt={`${project.title} 项目预览`} />
          </object>
        ) : (
          <img
            className="case-detail-image"
            src={project.image}
            alt={`${project.title} 项目预览`}
          />
        )}
      </section>

      <aside className="case-placeholder-note">
        <span>NEXT ITERATION</span>
        <p>
          当前版本先验证首页视觉与详情页容器。项目叙事、个人职责、过程图与结果数据将在下一轮整理后进入。
        </p>
      </aside>

      <nav className="next-case" aria-label="其他案例">
        {caseStudies
          .filter((item) => item.slug !== project.slug)
          .slice(0, 3)
          .map((item) => (
            <Link key={item.slug} href={`/work/${item.slug}`}>
              <span>{item.index}</span>
              <strong>{item.title}</strong>
              <i>↗</i>
            </Link>
          ))}
      </nav>

      <footer className="case-footer">
        <Link href="/#work">← BACK TO SELECTED WORK</Link>
        <span>JEAN ZHOU · PORTFOLIO V.01</span>
      </footer>
    </main>
  );
}
