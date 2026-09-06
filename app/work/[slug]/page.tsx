import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, projectBySlug } from "@/lib/content";
import { CaseOpening } from "@/components/case/CaseOpening";
import { CaseProgress } from "@/components/case/CaseProgress";
import { Movements } from "@/components/case/Movements";
import { NextProject } from "@/components/case/NextProject";
import { CaseClose } from "@/components/case/CaseClose";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.name} — ${project.discipline}`,
    description: project.tagline,
    openGraph: { title: project.name, description: project.tagline },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <CaseProgress />
      <CaseOpening project={project} />
      <Movements movements={project.movements} />
      <CaseClose project={project} />
      <NextProject project={next} />
    </article>
  );
}
