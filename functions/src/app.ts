import bodyParser = require("body-parser");
// import Busboy from "busboy";
import cors from "cors";
import express = require("express");
// import fs from "fs";
// import os from "os";
// import multer = require("multer");
import fs = require("fs");
import path = require("path");
import { verifyToken } from "./middlewares/authenticated";
import { grants } from "./middlewares/authorized";

// const storage = multer.diskStorage({
//     destination: "src/uploads/",
//     filename(req, file, cb) {
//         const nameOrigin = file.originalname;
//         const name = `temp${nameOrigin.substring(nameOrigin.lastIndexOf("."), nameOrigin.length)}`;
//         cb(null, name);
//     }
// });

// const upload = multer({ storage });

// const upload = multer({ dest: "/uploads/" });
const apps = express();

apps.use(
  cors({
    credentials: true,
    origin: [
      "chrome-extension://emjcmfdegoedmnonokjjmagmaahmaeck",
      "chrome-extension://lijfcadcbeooipbbmfnmjnhodajahepm",
      "ctvbanhang-a398d.web.app",
      "https://banhang.ctvbanhang.com",
      "http://localhost:4200",
      "https://banhang.shopee.vn",
      "https://gomdon.ctvbanhang.com/",
    ],
  })
);

apps.use(bodyParser.json());
apps.use(bodyParser.urlencoded({ extended: true }));
// apps.use(upload.any());

apps.use((req: any, res: any, next: any) => {
  console.log("using");
  if (
    req.method === "POST" &&
    req.headers["content-type"] &&
    req.headers["content-type"].startsWith("multipart/form-data")
  ) {
    console.log("multipart");
    const Busboy = require("busboy");
    // See https://cloud.google.com/functions/docs/writing/http#multipart_data
    const busboy = new Busboy({
      headers: req.headers,
    });
    const fields: any = {};
    const files: any = [];
    let fileBuffer = new Buffer("");
    busboy.on(
      "file",
      (
        fieldname: any,
        file: any,
        filename: any,
        encoding: any,
        mimetype: any
      ) => {
        console.log("in file");
        file.on("data", (data: any) => {
          fileBuffer = Buffer.concat([fileBuffer, data]);
        });
        file.on("end", () => {
          // console.log(fileBuffer);
          files.push({
            fieldname,
            originalname: filename,
            // tslint:disable-next-line: object-literal-sort-keys
            encoding,
            mimetype,
            buffer: fileBuffer,
            size: Buffer.byteLength(fileBuffer),
          });
        });
      }
    );
    busboy.on(
      "field",
      (
        fieldname: any,
        val: any,
        fieldnameTruncated: any,
        valTruncated: any,
        encoding: any,
        mimetype: any
      ) => {
        fields[fieldname] = val;
        // console.log("Field [" + fieldname + "]: value: " + val);
      }
    );

    busboy.on("finish", () => {
      req.body = fields;
      req.files = files;
      // console.log("finish");
      next();
    });
    req.pipe(busboy);
  } else {
    next();
  }
});

export const optionsObject: any = {
  controllers: path.join(__dirname, "./routes"),
  docs: false,
  failedValidation: true,
  grantsFile: {
    Bearer: grants,
  },
  loglevel: "info",
  oasAuth: true,
  oasSecurity: true,
  router: true,
  securityFile: {
    Bearer: verifyToken,
  },
  strict: true,
  validator: true,
};

apps.post("/upload", (req: any, res: express.Response) => {
  console.log("test");
  console.log(req.body);
  console.log(req.files);
  res.send({
    files: req.files,
    info: "This API was generated using oas-generator!",
  });
});

apps.get("/oas", (req, res) => {
  const spec = fs.readFileSync(
    path.join(__dirname, "/api/oas-doc.yaml"),
    "utf8"
  );
  res.send(spec);
});

export const app = apps;
