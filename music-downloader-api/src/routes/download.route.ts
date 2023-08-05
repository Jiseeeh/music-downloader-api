import express from "express";

import { download, getDownloadInfo } from "@controllers/download.controller";
import { downloadLimiter } from "@limiters/download.limiter";

const downloadRouter = express.Router();

downloadRouter.get("/info", getDownloadInfo);
downloadRouter.get("/", downloadLimiter, download);

export { downloadRouter };
