import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { LearningModuleType } from "@/lib/utils/learningModulesFetcher";
import Link from "next/link";
import { useRouter } from "next/router";
import learningModuleCalculatorLinks from "../../../data/learning_module_calculator_links.json";
import LearningModuleGridItem from "./LearningModuleGridItem";
import styles from "./LearningModulePreview.module.css";

type LinkedCalculatorConfig = Record<string, { url: string; label: string }>;
const LINKED_CALCULATORS =
  learningModuleCalculatorLinks as LinkedCalculatorConfig;

const PREVIEW_MODULE_COUNT = 4;

interface LearningModulePreviewProps {
  modules: Array<LearningModuleType>;
  isLoading: boolean;
  hasError: boolean;
}

export default function LearningModulePreview({
  modules,
  isLoading,
  hasError,
}: LearningModulePreviewProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const previewModules = modules.slice(0, PREVIEW_MODULE_COUNT);

  function handleModuleOpened(module: LearningModuleType) {
    logMoneyGuruEvent(AnalyticEvent.MODULE_OPENED, {
      module_name: module.title,
    });
  }

  function handleCalculatorClick(destination: string) {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, { destination });
    router.push(destination);
  }

  return (
    <div className={styles.LearningModulePreview}>
      <div className={styles.LearningModulePreview__Header}>
        <h3 className="text-body text-semibold">
          {t("money_guru_learning_modules_title")}
        </h3>
        {!isLoading && !hasError && modules.length > 0 && (
          <Link
            href="/learning-module"
            className={styles.LearningModulePreview__ViewAll}
          >
            {t("money_guru_learning_modules_view_all")}
          </Link>
        )}
      </div>

      {!isLoading && (hasError || modules.length === 0) && (
        <div className={styles.LearningModulePreview__EmptyState}>
          <p className="text-caption clr-text-secondary">
            {t("money_guru_learning_modules_empty_state")}
          </p>
        </div>
      )}

      {!isLoading && !hasError && modules.length > 0 && (
        <div className={styles.LearningModulePreview__Grid}>
          {previewModules.map((module) => {
            const linkedCalculator = LINKED_CALCULATORS[module.id];
            return (
              <div key={module.id}>
                <LearningModuleGridItem
                  module={module}
                  onBeforeNavigate={handleModuleOpened}
                />
                {linkedCalculator && (
                  <button
                    type="button"
                    className={styles.LearningModulePreview__CalculatorLink}
                    onClick={() => handleCalculatorClick(linkedCalculator.url)}
                  >
                    Try: {linkedCalculator.label}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
