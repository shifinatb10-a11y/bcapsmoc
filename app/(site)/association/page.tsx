import { getAssociations, getHeroImage } from "@/lib/queries";
import { Container, PageHero } from "@/components/ui";
import { AssociationsExplorer } from "@/components/AssociationsExplorer";
import { notFound } from "next/navigation";
import { publicPageVisible } from "@/lib/page-visibility";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Association",
  description:
    "Office bearers, completed event reports and department magazines of the BCA Student Association, PSMO College Tirurangadi.",
  alternates: { canonical: "/association" },
};

export default async function AssociationPage() {
  if (!(await publicPageVisible("association"))) notFound();

  const [associations, heroImage] = await Promise.all([
    getAssociations(),
    getHeroImage(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Student Association"
        title="BCA Students' Association"
        description="Every academic year the department's students' association elects an office bearer and organises a range of technical and cultural activities. Browse the reports and magazines of each association term."
        imageUrl={heroImage}
      />

      <Container className="py-14 sm:py-20">
        <AssociationsExplorer associations={associations} />
      </Container>
    </>
  );
}
