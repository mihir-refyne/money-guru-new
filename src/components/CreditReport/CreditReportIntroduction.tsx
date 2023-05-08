import { useState } from "react";
import AvatarYes from "../../images/avatar-yes.svg";
import AvatarNo from "../../images/avatar-no.svg";
import AvatarNotSure from "../../images/avatar-maybe.svg";
import CreditReportLayout from "./CreditReportLayout";
import RadioButtonGroup from "../RadioButtonGroup";
import List from "../List";

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
      navbarText="Credit Score"
      dispatchPopEventOnBackClick={directAccess}
      footer={
        <div className="p-4">
          <button
            className="btn btn-primary btn-block"
            onClick={handleNextClick}
          >
            Let&apos;s Check
          </button>
          <List
            type="tick"
            items={[
              "No sharing of credit report with any 3rd party",
              "Checking your Credit score will not reduce your score",
            ]}
          />
        </div>
      }
    >
      <h2 className="text-heading text-medium p-4 text-center">
        A good CREDIT SCORE gets you better interest rates on your Salary Top
        Up. Wonder if you have a good score?
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
