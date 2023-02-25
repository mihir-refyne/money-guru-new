import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import { CaretLeft, ShareNetwork } from "phosphor-react";
import contentThumbNailImageUrl from "../images/how-to-manage-money.png";
import languageIconUrl from "../images/language-icon.svg";

export default function ShortsPage() {
  return (
    <PageLayout
      footer={
        <div className="p-4">
          <button className="btn btn-primary-light flex-center btn-block">
            <ShareNetwork size={24} className="mr-2" />
            <span>Share</span>
          </button>
        </div>
      }
    >
      <figure>
        <Image
          src={contentThumbNailImageUrl}
          alt="title here"
          style={{
            width: "100%",
          }}
        />
      </figure>
      <h3 className="text-heading text-medium my-3">
        How to Manage Your Money?
      </h3>
      <p className="clr-text-secondary">
        Handling your finances the right way should be a priority, and it should
        drive your daily spending and saving decisions. Personal Finance experts
        advise taking the time to learn the basics, from how to manage a
        checking or debit account to how to pay your bills on time and build
        from there. Managing your money demands constant attention to your
        spending and to your accounts and not living beyond your financial
        means.
      </p>
    </PageLayout>
  );
}
