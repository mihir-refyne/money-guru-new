import { useState } from "react";
import AvatarYes from "../../images/avatar-yes.svg";
import AvatarNo from "../../images/avatar-no.svg";
import AvatarNotSure from "../../images/avatar-maybe.svg";
import CreditReportLayout from "./CreditReportLayout";
import RadioButtonGroup from "../RadioButtonGroup";
import { List } from "../List";
import useTranslation from "@/hooks/useTranslation";

interface CreditReportIntroductionProps {
  onUserFeedbackChange?: (answer: string) => void;
  onNext?: () => void;
  directAccess?: boolean;
}

export default function CreditReportIntroduction({
  onUserFeedbackChange,
  onNext,
  directAccess = false,
}: CreditReportIntroductionProps) {
  const { t } = useTranslation("common");
  const [userFeedback, setUserFeedback] = useState<string>("");

  function handleUserFeedbackUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    setUserFeedback(value);
    onUserFeedbackChange?.(value);
  }

  function handleNextClick() {
    onNext?.();
  }

  return (
    <CreditReportLayout
      navbarText={t("credit_score")}
      dispatchPopEventOnBackClick={directAccess}
      footer={
        <div className="p-4">
          <button
            className="btn btn-primary btn-block"
            onClick={handleNextClick}
          >
            {t("lets_check")}
          </button>
          <div className="mt-4">
            <List
              type="tick"
              items={[
                t("no_sharing_credit_report_with_third_party"),
                t("check_credit_score_impact"),
              ]}
            />
          </div>
        </div>
      }
    >
      <h2 className="text-heading text-medium p-4 text-center">
        {t("good_credit_score_benefits")}
      </h2>
      <RadioButtonGroup
        name="question"
        value={userFeedback}
        onChange={handleUserFeedbackUpdate}
        columnsPerLine={3}
        items={[
          {
            imageUrl: AvatarYes.src,
            value: "YES",
          },
          {
            imageUrl: AvatarNotSure.src,
            value: "NOT_SURE",
          },
          {
            imageUrl: AvatarNo.src,
            value: "NO",
          },
        ]}
      />
    </CreditReportLayout>
  );
}
