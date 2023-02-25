import SwipeButton from "@/components/SwipeButton";
import Image from "next/image";
import introIllustrationUrl from "@/images/intro-illustration.svg";
import PageLayout from "@/components/PageLayout";

export default function IntroPage() {
  return (
    <PageLayout
      footer={
        <>
          <div
            className="p-4"
            style={{
              borderBottom: "1px dashed #C9CDD1",
            }}
          >
            <p className="clr-text-secondary">
              12,000+ people have benefitted from Financial Advice from Refyne
            </p>
          </div>
          <div className="container">
            {/* <button className="btn btn-primary btn-block">Next</button> */}
            <SwipeButton>Swipe to unlock</SwipeButton>
            {/* <SwipeableButton color="#0057B7" text="Slide to Unlock" text_unlocked="Unlocked" onSuccess={() => {
                console.log("success")
            }} /> */}
          </div>
        </>
      }
    >
      <h1
        className="text-sub-title text-semibold"
        style={{
          lineHeight: "42px",
        }}
      >
        Increase your financial knowledge with Refyne!
      </h1>
      <figure className="my-6">
        <Image src={introIllustrationUrl} alt="Intro illustration" />
      </figure>
    </PageLayout>
  );
}
