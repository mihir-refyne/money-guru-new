import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../storage/browserstorage";

const CREDIT_REPORT_INTRODUCTION_VIEW_KEY = "__CreditReportIntroViewed";

export function isCreditReportIntroViewed(): boolean {
  return !!getFromLocalStorage(CREDIT_REPORT_INTRODUCTION_VIEW_KEY);
}

export function setCreditReportIntroViewed() {
  setInLocalStorage(CREDIT_REPORT_INTRODUCTION_VIEW_KEY, Date.now().toString());
}
