import * as functions from "firebase-functions";
import fs = require("fs");
import http = require("http");
import jsyaml = require("js-yaml");
import path = require("path");
import { app, optionsObject } from "./app";
// tslint:disable-next-line: no-var-requires
const oasTools = require("oas-tools");

const spec = fs.readFileSync(path.join(__dirname, "/api/oas-doc.yaml"), "utf8");
const oasDoc = jsyaml.safeLoad(spec);
const serverPort = 8080;

oasTools.configure(optionsObject);

oasTools.initialize(oasDoc, app, () => {
  http.createServer(app).listen(serverPort, () => {
    console.log("App running at http://localhost:" + serverPort);
    console.log(
      "________________________________________________________________"
    );
    if (optionsObject.docs !== false) {
      console.log(
        "API docs (Swagger UI) available on http://localhost:" +
          serverPort +
          "/docs"
      );
      console.log(
        "________________________________________________________________"
      );
    }
  });
});

export const api = functions.https.onRequest(app as any);

export const getOAS = functions.https.onRequest((req, res) => {
  console.log("oas");
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.status(200).send(spec);
});
