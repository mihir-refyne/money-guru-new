import PageLayout from "@/components/PageLayout";
import Shorts from "@/components/Shorts";
import SwipePrompt from "@/components/SwipePrompt";
import Image from "next/image";
import { CaretDoubleUp, CaretLeft, ShareNetwork } from "phosphor-react";
import contentThumbNailImageUrl from "../images/how-to-manage-money.png";
import languageIconUrl from "../images/language-icon.svg";

export default function ShortsPage() {
  return (
    <PageLayout hasContentPadding={false}>
      <Shorts
        items={[
          {
            id: "1",
            media: {
              type: "image",
              url: contentThumbNailImageUrl.src,
            },
            content: (
              <>
                <h3>How to Manage Your Money 1?</h3>
                <p>
                  Handling your finances the right way should be a priority, and
                  it should drive your daily spending and saving decisions.
                  Personal Finance experts advise taking the time to learn the
                  basics, from how to manage a checking or debit account to how
                  to pay your bills on time and build from there. Managing your
                  money demands constant attention to your spending and to your
                  accounts and not living beyond your financial means.
                </p>
              </>
            ),
          },
          {
            id: "2",
            media: {
              type: "image",
              url: contentThumbNailImageUrl.src,
            },
            content: (
              <>
                <h3>How to Manage Your Money 2?</h3>
                <p>
                  Handling your finances the right way should be a priority, and
                  it should drive your daily spending and saving decisions.
                  Personal Finance experts advise taking the time to learn the
                  basics, from how to manage a checking or debit account to how
                  to pay your bills on time and build from there. Managing your
                  money demands constant attention to your spending and to your
                  accounts and not living beyond your financial means.
                </p>
              </>
            ),
          },
          {
            id: "3",
            media: {
              type: "image",
              url: contentThumbNailImageUrl.src,
            },
            content: (
              <>
                <h3>How to Manage Your Money 3?</h3>
                <p>
                  Handling your finances the right way should be a priority, and
                  it should drive your daily spending and saving decisions.
                  Personal Finance experts advise taking the time to learn the
                  basics, from how to manage a checking or debit account to how
                  to pay your bills on time and build from there. Managing your
                  money demands constant attention to your spending and to your
                  accounts and not living beyond your financial means.
                </p>
              </>
            ),
          },
        ]}
      />
    </PageLayout>
  );
}
