import { getReactionMapOfShorts, parseMarkdown } from "@/lib/shorts/server";
import {
  getObjectFromS3,
  listObjectsV2,
  queryParamsParser,
  trimNumberFromStartOrEndOfSlug,
} from "@/lib/utils";
import { S3Client } from "@aws-sdk/client-s3";
import { NextApiHandler } from "next";

const RSHORTS_S3_PATH = process.env.RSHORTS_S3_PATH;
const RSHORTS_S3_BUCKET = process.env.RSHORTS_S3_BUCKET;
const DEFAULT_LIMIT = "5";

export type ShortsResponse = {
  data: Array<{
    id: string;
    metadata: Record<string, unknown>;
    content: string;
    reaction: {
      liked: number;
    };
  }>;
  NextContinuationToken?: string;
  isTruncated: boolean;
};

export type ShortsError = {
  error: string;
};

const client = new S3Client();

const handler: NextApiHandler<ShortsResponse | ShortsError> = async (
  req,
  res
) => {
  if (!RSHORTS_S3_BUCKET || !RSHORTS_S3_PATH) {
    let errorMsg = "S3 env vars not set correctly";
    return res.status(500).json({
      error: errorMsg,
    });
  }
  const parsedQuery = queryParamsParser(req.query);

  const locale = parsedQuery.locale ?? "en";

  let limit;
  try {
    limit = parseInt(parsedQuery.limit ?? DEFAULT_LIMIT);
    if (!parsedQuery.ContinuationToken) {
      limit += 1;
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: "limit should be a number",
    });
  }

  let response: ShortsResponse = {
    data: [],
    isTruncated: false,
  };

  const listObjectsResponse = await listObjectsV2(
    {
      Bucket: RSHORTS_S3_BUCKET,
      Prefix: RSHORTS_S3_PATH,
      ContinuationToken: parsedQuery.ContinuationToken,
      Delimiter: "/",
      MaxKeys: limit,
    },
    client
  );

  if ("error" in listObjectsResponse) {
    return res.status(500).json(listObjectsResponse);
  }

  if (
    listObjectsResponse.CommonPrefixes &&
    listObjectsResponse.CommonPrefixes.length < 1
  ) {
    return res.status(404).json({
      error: "No objects found",
    });
  }

  response.NextContinuationToken = listObjectsResponse.NextContinuationToken;
  response.isTruncated = listObjectsResponse.IsTruncated ?? false;

  const shortsPaths = listObjectsResponse.CommonPrefixes?.map(
    (p) => p.Prefix
  ) as string[];

  let filePromises = [];

  const shortsReactionMap = await getReactionMapOfShorts();

  for (let i = 0; i < shortsPaths.length; i++) {
    const folderPath = shortsPaths[i];
    const fileKey = `${folderPath}${locale}.md`;
    const slug = fileKey.split("/")[1];
    const trimmedSlug = trimNumberFromStartOrEndOfSlug(slug);
    filePromises.push(
      getObjectFromS3(client, RSHORTS_S3_BUCKET, fileKey)
        .then((rawContent) => {
          if (!rawContent) throw new Error(`${fileKey} is empty`);
          return parseMarkdown(rawContent);
        })
        .then((parsedContent) => {
          response.data[i] = {
            id: trimmedSlug,
            reaction: {
              liked: shortsReactionMap?.[trimmedSlug] ?? 0,
            },
            ...parsedContent,
          };
        })
    );
  }

  try {
    await Promise.all(filePromises);
  } catch (error) {
    // TODO: Sentry instrumentation
    console.error(error);
    return res.status(500).json({
      error: "Failed to get or parse shorts data",
    });
  }

  return res.status(200).send(response);
};

export default handler;
