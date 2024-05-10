const json2md = require("json2md")
const { requestGet, toJSON } = require("./utils.js")
const YAML = require("yamljs")
const { mkdir, writeFile } = require("fs/promises")
const { join } = require("path")

async function main() {
  const searchParams = new URLSearchParams({
    apiKey: process.env.NEWSSOURCE_API_KEY,
    q: process.env.NEWSSOURCE_Q,
    country: "in",
    language: "en",
    category: "business",
    size: 5,
    image: 1
  })
  
  const sourceUrl = new URL(`https://newsdata.io/api/1/news?${searchParams.toString()}`);

  const response = await requestGet(sourceUrl);
  const responseJson = toJSON(response.body);

  await mkdir(join(__dirname, "tmp"));

  const epochInverse = 9999999999 - Math.floor(new Date().getTime() / 1000);

  for(const article of responseJson.results) {
    const mdBody = json2md([
      {h3: article.title},
      {p: article.description}
    ])
    const frontmatter = YAML.stringify({
      mediaType: "image",
      mediaUrl: article.image_url,
      tag: "business",
      link: article.link,
      source: article.source_id,
      pubDate: article.pubDate,
      id: article.article_id 
    })

    const md = `---
${frontmatter}---

${mdBody}`;

    const normArticleTitle = article.title.trim().replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "-").toLowerCase();

    const tmpPath = join(__dirname, "tmp");

    const articleDirPath = join(tmpPath, `${epochInverse}-${normArticleTitle}`);

    await mkdir(articleDirPath)

    await writeFile(join(articleDirPath, "en.md"), md);
  }

}

main().catch(console.error)