import {
  getFromLocalStorage,
  setInLocalStorage,
} from "../storage/browserstorage";

const INTRODUCTION_LOCALSTORAGE_KEY = "__FinLiteracy_Intro_Watched";

export function hasWatchedIntroduction(): boolean {
  return !!getFromLocalStorage(INTRODUCTION_LOCALSTORAGE_KEY);
}

export function setWatchedIntroduction() {
  return setInLocalStorage(INTRODUCTION_LOCALSTORAGE_KEY, "true");
}
