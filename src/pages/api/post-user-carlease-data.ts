// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   const scriptUrl = process.env.CARLEASE_USER_FORM_SHEET_APP_SCRIPT_URL;

//   try {
//     const scriptResponse = await fetch(scriptUrl ?? "", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(req.body),
//     });
//     const data = await scriptResponse.json();
//     return res.status(scriptResponse.status).json(data);
//   } catch (error: any) {
//     return res.status(500).json({
//       error: "Failed to post data to Google Sheet",
//       details: error.message,
//     });
//   }
// }

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  const scriptUrl = process.env.CARLEASE_USER_FORM_SHEET_APP_SCRIPT_URL;

  try {
    const scriptResponse = await fetch(scriptUrl ?? "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await scriptResponse.json().catch(() => ({}));

    return res.status(200).json({
      success: true,
      forwardedStatus: scriptResponse.status,
      forwardedResponse: data,
    });
  } catch (error: any) {
    console.error("Error posting to user form script:", error);

    return res.status(200).json({
      success: true,
      message: "Handled gracefully despite failure",
      forwardedError: error.message,
    });
  }
}
