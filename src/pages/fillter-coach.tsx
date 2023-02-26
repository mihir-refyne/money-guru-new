import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import fincoachFillerIllustrationUrl from "../images/fincoach-filler-illustration.svg";

export default function FinCoachFillerPage() {
  return (
    <PageLayout
      hasNavbar={false}
      footer={
        <div className="p-4">
          <button className="btn btn-primary btn-block">Book A Session</button>
        </div>
      }
    >
      <h1 className="text-title">
        1,000+ Users Have Benefitted From 1:1 Sessions
      </h1>
      <figure className="my-6">
        <Image
          src={fincoachFillerIllustrationUrl}
          alt="Fin coach Filler Illustration"
        />
      </figure>
      <div className="alert alert-grey">
        Our financial experts will help you manage expenses, increase savings &
        plan investments.
      </div>
    </PageLayout>
  );
}

export function getStaticProps() {
  return {
    props: {},
  };
}
