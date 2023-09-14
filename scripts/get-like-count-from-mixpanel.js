const { requestGet, toJSON } = require("./utils");
const path = require("path");
const fs = require("fs/promises");

const MIXPANEL_BASIC_AUTH_TOKEN = process.env.MIXPANEL_BASIC_AUTH_TOKEN;
const MIXPANEL_PROJECT_ID = process.env.MIXPANEL_PROJECT_ID;
const MIXPANEL_INSIGHTS_BOOKMARK_ID =
  process.env.MIXPANEL_INSIGHTS_BOOKMARK_ID_FOR_RSHORT_LIKE_COUNT;

const FILE_NAME = "rshorts_like_count.json";
const SERIES_KEY_NAME = "R_SHORTS_REACTED - Total";

async function getMixpanelInsights() {
  if (
    !MIXPANEL_BASIC_AUTH_TOKEN ||
    !MIXPANEL_PROJECT_ID ||
    !MIXPANEL_INSIGHTS_BOOKMARK_ID
  ) {
    throw new Error("Required env values are missing");
  }
  const response = await requestGet({
    port: 443,
    hostname: "mixpanel.com",
    path: `/api/2.0/insights?project_id=${MIXPANEL_PROJECT_ID}&bookmark_id=${MIXPANEL_INSIGHTS_BOOKMARK_ID}`,
    headers: {
      accept: "application/json",
      authorization: `Basic ${MIXPANEL_BASIC_AUTH_TOKEN}`,
    },
  });
  const responseJson = toJSON(response.body);
  const parsedMixpanelInsightResponse = responseJson.series[SERIES_KEY_NAME];
  return parsedMixpanelInsightResponse;
}

async function getRShortLikeCountFromMixpanelAndUpdate() {
  console.log("Started getMixpanelInsights");
  const insights = await getMixpanelInsights();
  console.log("Finished getMixpanelInsights");

  const updatedObject = {};
  const keys = Object.keys(insights);
  keys.forEach((key) => {
    if (key === "$overall") return;
    updatedObject[key] = insights[key].all;
  });

  const filePath = path.join(__dirname, "../data/", FILE_NAME);

  const data = JSON.stringify(updatedObject);
  console.log(`Writing file in ${filePath}`);
  await fs.writeFile(filePath, data);
}

getRShortLikeCountFromMixpanelAndUpdate().catch((error) => {
  console.error(`Failed to get RShortLikeCountFromMixpanel due to ${error}`);
});
