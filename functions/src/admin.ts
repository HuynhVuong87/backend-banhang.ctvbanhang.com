import * as admin from "firebase-admin";
import serviceAcc = require("../key.json");

const serviceAccount = serviceAcc as admin.ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "ctvbanhang-a398d.appspot.com",
});

export = admin;
