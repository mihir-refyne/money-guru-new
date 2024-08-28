import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PageLayout from "../PageLayout";
import ListCard from "../ListCard";
import VoucherCard from "./VoucherCard";
import Image from "next/image";
import Input from "../Input";
import Modal from "../Modal";
import styles from "./styles.module.css";
import { CheckCircle } from "phosphor-react";

interface VoucherLandingPageProps {
  pageTitle: string;
  belowNavbarText?: string;
  showBelowNavbarText?: boolean;
  heroCardImageUrl: string;
  heroCardImageFullWidth?: boolean;
  heroCardTitle: string;
  heroCardDescription: string;
  heroCardCtaText: string;
  heroCardCtaLoading: boolean;
  onHeroCtaClick: () => void;
  onBackToHomeClick: () => void;
  voucherCode?: string;
  voucherDetails: Array<string>;
  redeemStepsTitleText?: string;
  redeemSteps: Array<string>;
  voucherAllocated: boolean;
  canRedeemPostPurchase: boolean;
  termsAndConditions: Array<string>;
  termsAndConditionsExternalUrl?: string;
  onMount: () => void;
}

export default function VoucherLandingPage({
  pageTitle,
  belowNavbarText,
  showBelowNavbarText = false,
  heroCardImageUrl,
  heroCardImageFullWidth = false,
  heroCardTitle,
  heroCardDescription,
  heroCardCtaText,
  heroCardCtaLoading,
  voucherCode,
  onHeroCtaClick,
  onBackToHomeClick,
  voucherDetails,
  redeemStepsTitleText,
  redeemSteps,
  voucherAllocated,
  canRedeemPostPurchase,
  termsAndConditions,
  termsAndConditionsExternalUrl,
  onMount,
}: VoucherLandingPageProps) {
  const router = useRouter();

  const [isRedeemStepModalActive, setIsRedeemStepModalActive] =
    useState<boolean>(false);
  const [isTermsAndConditionModalActive, setIsTermsAndConditionModalActive] =
    useState<boolean>(false);

  function handleRedeemClick() {
    handleRedeemModalOpen();
    // Propagate the click event to parent
    onHeroCtaClick();
  }
  function handleRedeemModalOpen() {
    setIsRedeemStepModalActive(true);
  }
  function handleRedeemModalClose() {
    setIsRedeemStepModalActive(false);
  }

  function handleTermsAndConditionClick() {
    if (termsAndConditionsExternalUrl) {
      return router.push(termsAndConditionsExternalUrl);
    }
    setIsTermsAndConditionModalActive(true);
  }
  function handleTermsAndConditionModalClose() {
    setIsTermsAndConditionModalActive(false);
  }

  useEffect(() => {
    onMount();
  }, []);

  const PageFooterElem = voucherAllocated ? (
    <div className="p-4">
      <button
        className="btn btn-primary-outline btn-block"
        onClick={onBackToHomeClick}
      >
        Back to Home
      </button>
    </div>
  ) : undefined;

  const cardFooterHidden = voucherAllocated && !canRedeemPostPurchase;

  return (
    <PageLayout
      title={pageTitle}
      navbarText={pageTitle}
      hasLocaleChange={false}
      hasShare={false}
      hasContentPadding={false}
      pageBackground="#F7F7F7"
      dispatchPopEventOnBackClick
      footer={PageFooterElem}
    >
      {showBelowNavbarText && (
        <div className={styles.BelowNavBarText}>{belowNavbarText}</div>
      )}
      <div className="p-4 pt-6">
        <VoucherCard
          bodyCentered
          footer={
            !cardFooterHidden && (
              <VoucherCardFooter
                voucherAllocated={voucherAllocated}
                canRedeem={canRedeemPostPurchase}
                heroCardCtaText={heroCardCtaText}
                voucherCode={voucherCode}
                ctaLoading={heroCardCtaLoading}
                onHeroCtaClick={onHeroCtaClick}
                onRedeemClick={handleRedeemClick}
              />
            )
          }
        >
          {heroCardImageFullWidth ? (
            <img
              src={heroCardImageUrl}
              alt={heroCardTitle}
              style={{ width: "100%" }}
            />
          ) : (
            <Image
              src={heroCardImageUrl}
              height={96}
              width={96}
              alt={heroCardTitle}
            />
          )}

          <h4 className="text-heading mt-4 mb-1">{heroCardTitle}</h4>
          <p className="text-center clr-text-secondary">
            {heroCardDescription}
          </p>
          {voucherAllocated && (
            <p className={styles.PostPurchaseStrip}>
              <CheckCircle weight="fill" size={16} />
              <span className="ml-2">Thank you for your purchase!</span>
            </p>
          )}
        </VoucherCard>
        <VoucherCard>
          <h5 className="text-heading-small">Details</h5>
          <ul className="pl-6">
            {voucherDetails.map((detail) => (
              <li key={detail} className="clr-text-secondary">
                {detail}
              </li>
            ))}
          </ul>
        </VoucherCard>
        <VoucherCard>
          <ListCard
            className="p-0"
            background="none"
            items={[
              {
                contentLeftTitle: redeemStepsTitleText ?? "How to redeem",
                onClick: handleRedeemModalOpen,
              },
              {
                contentLeftTitle: "Terms and conditions",
                onClick: handleTermsAndConditionClick,
              },
            ]}
          />
        </VoucherCard>
      </div>
      <Modal
        active={isTermsAndConditionModalActive}
        onClose={handleTermsAndConditionModalClose}
        bottomSheetOnMobile
      >
        <VoucherTermsAndConditionModalContent
          termsAndConditions={termsAndConditions}
          onClose={handleTermsAndConditionModalClose}
        />
      </Modal>
      <Modal
        active={isRedeemStepModalActive}
        onClose={handleRedeemModalClose}
        bottomSheetOnMobile
      >
        <VoucherHowToRedeemModalContent
          redeemSteps={redeemSteps}
          onClose={handleRedeemModalClose}
        />
      </Modal>
    </PageLayout>
  );
}

function VoucherCardFooter(props: {
  voucherAllocated: boolean;
  canRedeem: boolean;
  voucherCode?: string;
  heroCardCtaText: string;
  ctaLoading: boolean;
  onHeroCtaClick: () => void;
  onRedeemClick: () => void;
}) {
  const {
    voucherAllocated,
    canRedeem,
    voucherCode,
    heroCardCtaText,
    ctaLoading,
    onHeroCtaClick,
    onRedeemClick,
  } = props;
  if (voucherAllocated && !canRedeem) return null;
  if (canRedeem && voucherAllocated && voucherCode) {
    return (
      <>
        <Input
          name="voucherCode"
          label="Use code"
          value={voucherCode}
          readOnly
          hasCopyButton
        />
        <button
          className="btn-block btn-primary mt-4"
          onClick={onRedeemClick}
          disabled={ctaLoading}
        >
          {heroCardCtaText}
        </button>
      </>
    );
  }
  return (
    <button
      className="btn-block btn-primary"
      onClick={onHeroCtaClick}
      disabled={ctaLoading}
    >
      {heroCardCtaText}
    </button>
  );
}

function StepPoint(props: { children: number }) {
  return (
    <div
      className="text-heading-small"
      style={{
        width: "var(--spacing-8)",
        height: "var(--spacing-8)",
        borderRadius: "99rem",
        backgroundColor: "var(--clr-bg-primary-lighter)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {props.children}
    </div>
  );
}

function VoucherHowToRedeemModalContent(props: {
  redeemSteps: Array<string>;
  onClose: () => void;
}) {
  return (
    <div>
      <h5 className="text-heading-small mb-3 clr-text-secondary">
        How to redeem
      </h5>
      <VoucherCard>
        <ListCard
          className="p-0"
          background="none"
          items={props.redeemSteps.map((step, index) => ({
            leftIcon: <StepPoint>{index + 1}</StepPoint>,
            contentLeftTitle: step,
          }))}
        />
      </VoucherCard>
      <button className="btn-block btn-primary" onClick={props.onClose}>
        Got it
      </button>
    </div>
  );
}

function VoucherTermsAndConditionModalContent(props: {
  termsAndConditions: Array<string>;
  onClose: () => void;
}) {
  return (
    <div>
      <h5 className="text-heading-small mb-3">Terms and conditions</h5>
      <ul className="pl-6">
        {props.termsAndConditions.map((item) => (
          <li key={item} className="clr-text-secondary">
            {item}
          </li>
        ))}
      </ul>
      <button className="btn-block btn-primary mt-4" onClick={props.onClose}>
        Got it
      </button>
    </div>
  );
}
