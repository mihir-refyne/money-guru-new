const https = require("https");
const path = require("path");
const fs = require("fs/promises");
const i18nConfig = require("../i18n.json");
const commonLocaleMap = require("../locales/en/common.json");

const LOCALE_FILE_PATH = "client-texts.json";

const LOCALES = i18nConfig.locales;
const COMMON_NAMESPACE = i18nConfig.defaultNS;
const LOCALES_DIR_NAME = "locales";
const regExToCaptureVariable = /#\S+/g;

const requiredKeysFromRemote = new Set(Object.keys(commonLocaleMap));

function requestGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let responseData = "";

      res.on("data", function (chunk) {
        responseData += chunk;
      });

      res.on("end", function () {
        req.end();
        resolve({
          headers: res.headers,
          statusCode: res.statusCode,
          body: responseData,
        });
      });

      res.on("error", function () {
        reject("Failed to fetch");
      });
    });
  });
}

function toJSON(value) {
  if (!value) throw new Error("Falsy value provided");
  return JSON.parse(value);
}

function replaceHashVariableToMustache(valueToBeReplaced = "") {
  return valueToBeReplaced.replace(regExToCaptureVariable, (matched) => {
    const variableName = matched.slice(1);
    return `{{${variableName}}}`;
  });
}

async function getTranslationsFromRemote() {
  const BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL;
  if (!BASE_URL) {
    console.warn(`There is no base url configured in env`);
    return;
  }
  const fileRemoteUrl = new URL(LOCALE_FILE_PATH, BASE_URL);

  console.log(`Fetching Locale JSON from ${fileRemoteUrl.href}`);
  const response = await requestGet(fileRemoteUrl);
  const responseJson = toJSON(response.body);
  console.log(`Fetching Locale JSON successful`);

  const localeGlobalObject = {};
  for (const locale of LOCALES) {
    try {
      const filePath = path.join(
        __dirname,
        `../${LOCALES_DIR_NAME}/${locale}/${COMMON_NAMESPACE}.json`
      );
      console.log(`Reading current file content at ${filePath}`);
      const resp = await fs.readFile(filePath);
      const responseString = resp.toString("utf-8");
      const responseJson = toJSON(responseString);
      localeGlobalObject[locale] = responseJson;
    } catch (error) {
      console.warn(`Failed to read current content for locale ${locale}`);
      localeGlobalObject[locale] = {};
    }
  }

  for (const translationKey in responseJson) {
    if (!requiredKeysFromRemote.has(translationKey)) {
      continue;
    }
    LOCALES.forEach((locale) => {
      const valueInCurrentLocale = responseJson[translationKey][locale];
      // TODO: Comeback on this if required
      if (!valueInCurrentLocale) return;
      //   console.log(`Updating locale: ${locale} key: ${translationKey}`);
      const valueInCurrentLocaleWithReplacedVar = replaceHashVariableToMustache(
        String(valueInCurrentLocale)
      );
      localeGlobalObject[locale][translationKey] =
        valueInCurrentLocaleWithReplacedVar;
    });
  }

  for (const locale of LOCALES) {
    const filePath = path.join(
      __dirname,
      `../${LOCALES_DIR_NAME}/${locale}/${COMMON_NAMESPACE}.json`
    );

    await fs.mkdir(path.dirname(filePath), { recursive: true });

    const data = JSON.stringify(localeGlobalObject[locale]);
    console.log(`Writing file in ${filePath}`);
    await fs.writeFile(filePath, data);
  }
}

getTranslationsFromRemote().catch((e) => {
  console.error(`Failed to get translations from Remote due to ${e}`);
  process.exit(1);
});
