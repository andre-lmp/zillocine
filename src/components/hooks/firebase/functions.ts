import { onRequest } from "firebase-functions/v2/https";
import admin from "firebase-admin";

admin.initializeApp();

exports.deleteUserData = onRequest({ cors: ["*"] }, async (req, res) => {
  const { uid } = req.body;

  try {
    await admin.firestore().collection("users").doc(uid).delete();

    await admin
      .storage()
      .bucket()
      .deleteFiles({ prefix: `users/${uid}` });

    await admin.auth().deleteUser(uid);
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).send({ message: "Erro ao excluir usuário", error });
  }
});
