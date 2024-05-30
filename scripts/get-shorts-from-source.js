const json2md = require("json2md");
const { requestGet, toJSON } = require("./utils.js");
const YAML = require("yamljs");
const { mkdir, writeFile } = require("fs/promises");
const { join } = require("path");
const { identify } = require("imagemagick");

const tmpPath = join(__dirname, process.env.TMP_DIR ?? "shorts-tmp");
const minImageWidth = process.env.MIN_IMAGE_WIDTH ?? 640;
const minImageHeight = process.env.MIN_IMAGE_HEIGHT ?? 480;
const minDescLength = process.env.MIN_DESCRIPTION_LENGTH ?? 300;
const limit = process.env.LIMIT ?? 5;

async function main() {
  const articles = await fetchNewsArticles();

  await mkdir(tmpPath);

  // INFO: This prefix makes sure that new articles are added to the top of the bucket (for S3 ascending alphabetical sort-order)
  const epochInverse = 9999999999 - Math.floor(new Date().getTime() / 1000);

  const filteredArticles = await filterArticles(articles, {
    minWidth: minImageWidth,
    minHeight: minImageHeight,
    minDescLength: minDescLength,
  });

  console.log(
    `Found ${filteredArticles.length} articles with an image bigger than ${minImageWidth} x ${minImageHeight} and content length bigger than ${minDescLength} characters from list of ${articles.length} articles`
  );

  const limitedArticles = filteredArticles.slice(0, limit);

  for (const article of limitedArticles) {
    const mdBody = json2md([{ h3: article.title }, { p: article.description }]);
    const frontmatter = YAML.stringify({
      mediaType: "image",
      mediaUrl: article.image_url,
      tag: "business",
      link: article.link,
      source: article.source_id,
      pubDate: article.pubDate,
      id: article.article_id,
    });

    const md = `---
${frontmatter}---

${mdBody}`;

    const normArticleTitle = article.title
      .trim()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase();

    const articleDirPath = join(tmpPath, `${epochInverse}-${normArticleTitle}`);

    await mkdir(articleDirPath);

    await writeFile(join(articleDirPath, "en.md"), md);
  }
}

const promisify = (fn) => {
  return (arg) => {
    return new Promise((res, rej) => {
      fn(arg, (err, data) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    });
  };
};

const promiseIdentify = promisify(identify);

async function filterArticles(articles, filter) {
  const filterPromises = articles.map(async (a) => {
    const [width, height] = await promiseIdentify(a.image_url).then((data) => [
      data.width,
      data.height,
    ]);
    if (
      width >= filter.minWidth &&
      height >= filter.minHeight &&
      a?.description?.length >= filter.minDescLength
    ) {
      a.include = true;
    }
    return a;
  });

  const promiseResult = await Promise.all(filterPromises);
  return promiseResult.filter((a) => a.include);
}

async function fetchNewsArticles() {
  const searchParams = new URLSearchParams({
    apiKey: process.env.NEWSSOURCE_API_KEY,
    q: process.env.NEWSSOURCE_Q,
    country: "in",
    language: "en",
    category: "business",
    size: 10,
    image: 1,
  });

  const results = [];

  for (let i = 0; i < 10; i++) {
    const sourceUrl = new URL(
      `https://newsdata.io/api/1/news?${searchParams.toString()}`
    );

    const response = await requestGet(sourceUrl);
    const responseJson = toJSON(response.body);

    if (Array.isArray(responseJson?.results)) {
      results.push(...responseJson.results);
    }
    if (!responseJson.nextPage) break;

    searchParams.set("page", responseJson.nextPage);
  }

  return results;
}

main().catch(console.error);
