import type { BfConfig, BfPluginConfig } from "@backframe/core";
import { logger } from "@backframe/utils";
import multer from "multer";
import { DEFAULT_CONFIG, IStorageConfig } from "./config.js";

export default function (cfg: IStorageConfig = DEFAULT_CONFIG): BfPluginConfig {
  return {
    onServerInit(bfCfg) {
      const storage = createStorageObject(cfg, bfCfg);
      const upload = multer({ storage });
      const app = bfCfg.$server.$app;

      cfg.routes.forEach((r) => {
        const { fileKey, route } = r;
        app.post(route, upload.single(fileKey), (req, res) => {
          const { file } = req;
          // TODO: Send back url to file?
          res.status(200).send({
            msg: "File uploaded successfully",
            file,
          });
        });
        logger.info(`file uploads enabled on route: \`${r.route}\``);
      });
    },
  };
}

function createStorageObject(store: IStorageConfig, _bfConfig: BfConfig) {
  // TODO: Implement other storage engines
  if (store.engine === "local") {
    return multer.diskStorage({
      destination: store.destination,
      filename: function (_req, file, cb) {
        const ext = file.originalname.split(".").pop();
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
      },
    });
  }
  throw new Error(`storage engine ${store.engine} unimplemented!!!`);
}
