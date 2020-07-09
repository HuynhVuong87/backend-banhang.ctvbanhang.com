import * as admin from "../admin";

export async function verifyToken(
  req: any,
  secDef: any,
  token: string,
  next: Function
) {
  // console.log(req);
  const bearerRegex = /^Bearer\s/;
  //   console.log("start");
  //   await admin
  //     .auth()
  //     .setCustomUserClaims("4Zc0GAYPsEh7zP9RXVVarFFy10I3", { role: "admin" })
  //     .catch((err) => console.log("loi", err));
  //   console.log("4Zc0GAYPsEh7zP9RXVVarFFy10I3");
  if (token && bearerRegex.test(token)) {
    // console.log("test");
    const newToken = token.replace(bearerRegex, "");
    try {
      const decodedToken: admin.auth.DecodedIdToken = await admin
        .auth()
        .verifyIdToken(newToken);
      req.res.locals = {
        ...req.res.locals,
        uid: decodedToken.uid,
        role: decodedToken.role,
        email: decodedToken.email,
        name: decodedToken.name,
        quanlyBy: decodedToken.quanlyBy,
      };

      return next();
    } catch (error) {
      return next(req.res.status(401).send({ message: "Lỗi token" }));
    }
  } else {
    return next(req.res.sendStatus(403));
  }
  // next();
}