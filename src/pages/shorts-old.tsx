import PageLayout from "@/components/PageLayout";
import SwipePrompt from "@/components/SwipePrompt";
import Image from "next/image";
import { CaretDoubleUp, CaretLeft, ShareNetwork } from "phosphor-react";
import contentThumbNailImageUrl from "../images/how-to-manage-money.png";
import languageIconUrl from "../images/language-icon.svg";

export default function ShortsPage() {
  return (
    <PageLayout hasContentPadding={false}>
      <div className="shorts-container">
        <SwipePrompt
          position="top"
          prompt="Swipe Down"
          className="shorts-item"
          id="1"
        >
          <figure>
            <Image
              src={contentThumbNailImageUrl}
              alt="title here"
              style={{
                width: "100%",
                maxHeight: "24rem",
              }}
            />
          </figure>
          <h3 className="text-heading text-medium my-3">
            How to Manage Your Money 1?
          </h3>
          <p className="clr-text-secondary">
            Handling your finances the right way should be a priority, and it
            should drive your daily spending and saving decisions. Personal
            Finance experts advise taking the time to learn the basics, from how
            to manage a checking or debit account to how to pay your bills on
            time and build from there. Managing your money demands constant
            attention to your spending and to your accounts and not living
            beyond your financial means.
          </p>
          <button className="btn btn-primary-light flex-center btn-block mt-4">
            <ShareNetwork size={24} className="mr-2" />
            <span>Share</span>
          </button>
        </SwipePrompt>
        <div className="shorts-item" id="2">
          <figure>
            <Image
              src={contentThumbNailImageUrl}
              alt="title here"
              style={{
                width: "100%",
                maxHeight: "24rem",
              }}
            />
          </figure>
          <h3 className="text-heading text-medium my-3">
            How to Manage Your Money 2?
          </h3>
          <p className="clr-text-secondary">
            Handling your finances the right way should be a priority, and it
            should drive your daily spending and saving decisions. Personal
            Finance experts advise taking the time to learn the basics, from how
            to manage a checking or debit account to how to pay your bills on
            time and build from there. Managing your money demands constant
            attention to your spending and to your accounts and not living
            beyond your financial means.
          </p>
          <button className="btn btn-primary-light flex-center btn-block mt-4">
            <ShareNetwork size={24} className="mr-2" />
            <span>Share</span>
          </button>
        </div>
        <div className="shorts-item" id="3">
          <figure>
            <Image
              src={contentThumbNailImageUrl}
              alt="title here"
              style={{
                width: "100%",
                maxHeight: "24rem",
              }}
            />
          </figure>
          <h3 className="text-heading text-medium my-3">
            How to Manage Your Money 3?
          </h3>
          <p className="clr-text-secondary">
            Handling your finances the right way should be a priority, and it
            should drive your daily spending and saving decisions. Personal
            Finance experts advise taking the time to learn the basics, from how
            to manage a checking or debit account to how to pay your bills on
            time and build from there. Managing your money demands constant
            attention to your spending and to your accounts and not living
            beyond your financial means.
          </p>
          <button className="btn btn-primary-light flex-center btn-block mt-4">
            <ShareNetwork size={24} className="mr-2" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
