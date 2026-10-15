import { getStudyMaterials } from "@/lib/queries";
import { Container, PageHero } from "@/components/ui";
import { StudyMaterialsExplorer } from "@/components/StudyMaterialsExplorer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Study Zone",
  description:
    "Previous year BCA question papers and study notes — view or download in PDF format.",
};

export default async function StudyZonePage() {
  const materials = await getStudyMaterials();

  return (
    <>
      <PageHero
        eyebrow="Study Zone"
        title="Question papers & study notes"
        description="A growing library of previous year question papers and prepared notes for BCA students. Open any resource in the built-in viewer or download it for offline study."
      />

      <Container className="py-14 sm:py-20">
        <StudyMaterialsExplorer materials={materials} />
      </Container>
    </>
  );
}
