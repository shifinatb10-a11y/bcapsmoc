<<<<<<< HEAD
import { getHeroImage, getStudyMaterials, getQuizzes } from "@/lib/queries";
import { Container, PageHero } from "@/components/ui";
import { StudyZoneView } from "@/components/StudyZoneView";
=======
import { getHeroImage, getStudyMaterials } from "@/lib/queries";
import { Container, PageHero } from "@/components/ui";
import { StudyMaterialsExplorer } from "@/components/StudyMaterialsExplorer";
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
import { notFound } from "next/navigation";
import { publicPageVisible } from "@/lib/page-visibility";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Study Zone",
  description:
<<<<<<< HEAD
    "Previous year BCA question papers and interactive subject quizzes across semesters.",
=======
    "Previous year BCA question papers and study notes — view or download in PDF format.",
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
  alternates: { canonical: "/study-zone" },
};

export default async function StudyZonePage() {
  if (!(await publicPageVisible("study-zone"))) notFound();

<<<<<<< HEAD
  const [materials, quizzes, heroImage] = await Promise.all([
    getStudyMaterials(),
    getQuizzes(),
=======
  const [materials, heroImage] = await Promise.all([
    getStudyMaterials(),
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
    getHeroImage(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Study Zone"
<<<<<<< HEAD
        title="Question papers & subject quizzes"
        description="A comprehensive academic resource for BCA students. Test your knowledge with interactive subject quizzes organized semester-by-semester, and prepare with previous year exam question papers."
=======
        title="Question papers & study notes"
        description="A growing library of previous year question papers and prepared notes for BCA students. Open any resource in the built-in viewer or download it for offline study."
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
        imageUrl={heroImage}
      />

      <Container className="py-14 sm:py-20">
<<<<<<< HEAD
        <StudyZoneView quizzes={quizzes} materials={materials} />
=======
        <StudyMaterialsExplorer materials={materials} />
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
      </Container>
    </>
  );
}
