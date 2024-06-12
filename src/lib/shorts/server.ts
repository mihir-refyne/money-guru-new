import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { trimNumberFromStartOrEndOfSlug } from "../utils";

const BASE_DIR = "data/shorts";
const SHORTS_REACTION_MAP_FILE_PATH = "data/rshorts_like_count.json";

export async function getAllShortsPath(): Promise<Array<{ slug: string }>> {
  const dirNames = await fs.readdir(path.join(BASE_DIR));

  return dirNames.map((dir) => ({ slug: dir }));
}

export async function getReactionMapOfShorts(): Promise<Record<
  string,
  number
> | null> {
  try {
    const fileContent = await fs.readFile(
      SHORTS_REACTION_MAP_FILE_PATH,
      "utf-8"
    );
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to get ReactionMapOfShorts due to ${error}`);
    return null;
  }
}

export async function getAllShortsPathForAllLocales(locales: Array<string>) {
  const dirNames = await fs.readdir(path.join(BASE_DIR));

  return dirNames.reduce((accu, dirName) => {
    const pathsForAllLocales = locales.map((locale) => ({
      slug: dirName,
      locale,
    }));
    return [...accu, ...pathsForAllLocales];
  }, [] as Array<{ slug: string; locale: string }>);
}

export async function getShortBySlugAndLocale(
  slug: string,
  locale: string
): Promise<{ content: string; metadata: Record<string, unknown> }> {
  const filePath = path.join(BASE_DIR, slug, `/${locale}.md`);
  try {
    const markdownWithMeta = await fs.readFile(filePath, "utf-8");
    // 1-2. Get metadata through Frontmatter and content
    const { data: metadata, content } = matter(markdownWithMeta);
    return {
      content,
      metadata,
    };
  } catch (error) {
    if (locale !== "en") {
      return getShortBySlugAndLocale(slug, "en");
    }
    throw new Error(`Not able to find file at ${filePath}`);
  }
}

export async function getShortsByLocale(locale: string) {
  const shortPaths = await getAllShortsPath();

  let shorts: Array<{
    id: string;
    metadata: Record<string, unknown>;
    content: string;
    reaction: {
      liked: number;
    };
  }> = [];

  const shortsReactionMap = await getReactionMapOfShorts();

  for (const shortPath of shortPaths) {
    const short = await getShortBySlugAndLocale(shortPath.slug, locale);
    const id = trimNumberFromStartOrEndOfSlug(shortPath.slug);
    const likedCount = shortsReactionMap?.[shortPath.slug] ?? 0;
    shorts.push({ id, ...short, reaction: { liked: likedCount } });
  }

  // TODO: Do sorting here only

  return shorts;
}

export function parseMarkdown(rawContent: string) {
  const { data: metadata, content } = matter(rawContent);
  return {
    content,
    metadata,
  };
}
