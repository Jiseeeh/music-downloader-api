import { Request, Response, NextFunction } from "express";
import axios from "axios";
import youtubedl from "youtube-dl-exec";

import logger from "@logger";
import { HttpException } from "@exceptions/httpException";

const download = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, formatId } = req.query;
    const video = await getVideo(String(url));

    let fileName = generateCleanFileName(video.title);

    const videoFormat = video.formats.find(
      (video) => video.format_id === String(formatId)
    );

    fileName = `${fileName}.${videoFormat?.ext as string}`;

    logger.info("Download filename: %s", fileName);

    if (!videoFormat) {
      throw new HttpException(404, "There is no format found with that ID.");
    }

    // make it downloadable
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    const response = await axios.get(String(videoFormat?.url), {
      responseType: "stream",
    });

    // set headers
    res.setHeader("Content-Type", response.headers["content-type"]);

    // ? sometimes gets undefined
    // res.setHeader("Content-Length", response.headers["content-length"]);

    // pipe to client
    response.data.pipe(res);

    response.data.on("error", (err: Error) => {
      logger.error("Something went wrong while streaming to client.");
    });
  } catch (error) {
    next(error);
  }
};

const getDownloadInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { url } = req.query;

    const video = await getVideo(String(url));

    const downloadInfo = video.formats.map((format) => {
      const { acodec, vcodec, ext, format_note, format_id } = format;
      const fileName = generateCleanFileName(video.title) + `.${ext}`;
      let type = "unknown";

      const isVideo = acodec !== "none" && vcodec !== "none";
      const isVideoWithoutAudio = acodec === "none" && vcodec !== "none";
      const isAudio = acodec !== "none" && vcodec === "none";

      if (isVideo) type = "video";
      else if (isAudio) type = "audio";
      else if (isVideoWithoutAudio) type = "video only";

      return {
        id: format_id,
        fileName,
        type,
        extension: ext,
        quality: format_note || "unknown",
      };
    });

    res.json({ downloadInfo });
  } catch (error) {
    next(error);
  }
};

// ? NOTE (can be extracted to a helper fn if gets used more than 2 times)
/**
 * The function `getVideo` is an asynchronous function that takes a URL as input and returns a JSON
 * object of the video information.
 * @param {string} url - The `url` parameter is a string that represents the URL of the video that you
 * want to retrieve.
 * @returns the videoJSON object.
 */
async function getVideo(url: string) {
  const flags = {
    dumpSingleJson: true,
    preferFreeFormats: true,
    noCheckCertificates: true,
  };

  const videoJSON = await youtubedl(String(url), flags);

  return videoJSON;
}

// ? NOTE (can be extracted to a helper fn if gets used more than 2 times)
/**
 * The function generates a clean file name by removing special characters and replacing spaces with
 * hyphens.
 * @param {string} fileName - The `fileName` parameter is a string that represents the name of a file.
 * @returns a clean file name by removing any non-ASCII characters, special characters, and replacing
 * spaces with hyphens.
 */
function generateCleanFileName(fileName: string) {
  return fileName
    .replace(/[^\x00-\x7F\s]|[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, "")
    .replace(/\s+/g, "-");
}

export { download, getDownloadInfo };
