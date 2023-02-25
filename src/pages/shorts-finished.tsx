import React from "react";
import PageLayout from "@/components/PageLayout";
import { BellRinging } from "phosphor-react";
import emptyBoxIllustrationUrl from "@/images/empty-box-illustration.svg";
import Image from "next/image";

export default function ShortsFinishedPage() {
  return (
    <PageLayout
      footer={
        <div className="p-4">
          <button className="btn btn-primary flex-center btn-block">
            <BellRinging size={24} className="mr-2" />
            <span>Notify Me</span>
          </button>
        </div>
      }
      alignContentCenter
    >
      <Image src={emptyBoxIllustrationUrl} alt="ill" />
      <h3 className="text-sub-title mt-4">Well Done!</h3>
      <p className="text-heading clr-text-secondary text-center mt-4">
        You’ve finished all the R-Shorts. We’ll be adding more soon…
      </p>
    </PageLayout>
  );
}
