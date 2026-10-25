import { getHeroImage, getStudyMaterials, getQuizzes } from "@/lib/queries";
import { Container, PageHero } from "@/components/ui";
import { StudyZoneView } from "@/components/StudyZoneView";
import { notFound } from "next/navigation";
import { publicPageVisible } from "@/lib/page-visibility";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Study Zone",
  description:
    "Previous year BCA question papers and interactive subject quizzes across semesters.",
  alternates: { canonical: "/study-zone" },
};

export default async function StudyZonePage() {
  if (!(await publicPageVisible("study-zone"))) notFound();

  const [materials, quizzes, heroImage] = await Promise.all([
    getStudyMaterials(),
    getQuizzes(),
    getHeroImage(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Study Zone"
        title="Question papers & subject quizzes"
        description="A comprehensive academic resource for BCA students. Test your knowledge with interactive subject quizzes organized semester-by-semester, and prepare with previous year exam question papers."
        imageUrl={heroImage}
      />

      <Container className="py-14 sm:py-20">
        <StudyZoneView quizzes={quizzes} materials={materials} />
      </Container>
    </>
  );
}
