import {
  getObjectFromS3,
  getReactionMapOfShorts,
  parseMarkdown,
} from "@/lib/shorts/server";
import { trimNumberFromStartOrEndOfSlug } from "@/lib/utils";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
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
  let ContinuationToken = req.query.ContinuationToken;
  if (Array.isArray(ContinuationToken)) {
    ContinuationToken = ContinuationToken[0];
  }
  if (Array.isArray(req.query.limit)) {
    req.query.limit = req.query.limit[0];
  }

  const locale = req.query.locale ?? "en";
  let limit;
  try {
    limit = parseInt(req.query.limit ?? DEFAULT_LIMIT);
    if (!ContinuationToken) {
      limit += 1;
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: "limit should be a number",
    });
  }

  let listObjectsResponse;
  const client = new S3Client();
  let response: ShortsResponse = {
    data: [],
    isTruncated: false,
  };
  try {
    const command = new ListObjectsV2Command({
      Bucket: RSHORTS_S3_BUCKET,
      Prefix: RSHORTS_S3_PATH,
      MaxKeys: limit,
      Delimiter: "/",
      ContinuationToken,
    });

    listObjectsResponse = await client.send(command);
  } catch (error) {
    const errorMsg = "Failed to list objects in shorts folder";
    console.error(errorMsg, error);
    return res.status(500).json({
      error: errorMsg,
    });
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
    console.error(error);
    return res.status(500).json({
      error: "Failed to get or parse shorts data",
    });
  }

  return res.status(200).send(response);
};

export default handler;
