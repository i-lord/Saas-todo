import admin from "firebase-admin";
admin.initializeApp();

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('Backend Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (e) {
    res.status(401).send("Unauthorized");
  }
}

/** 
 * Middleware that verifies Firebase ID tokens passed in the Authorization header.
 *
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {function} next - Express next function
 */
export default authenticate;