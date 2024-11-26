import * as cloudFunctions from "firebase-functions";
import * as admin from "firebase-admin";

export interface CommentsBasicProps {
  userName: string;
  userPhoto: null | string;
  commentText: string;
  date: number;
  likesCount: number;
  unlikesCount: number;
  userReaction?: string | null;
  type: "comment" | "reply";
  status: "ready" | "modifying";
}

export interface CommentProps extends CommentsBasicProps {
  id: string;
  replies?: ReplyProps[] | null;
  repliesCount: number;
}

export interface ReplyProps extends CommentsBasicProps {
  id: string;
  replyingId: string;
}

type ReactionsListProps = {
  [key: string]: { reaction: string };
}

admin.initializeApp({databaseURL: "https://zillocine-default-rtdb.firebaseio.com/"});

exports.updateReactionsCount = cloudFunctions.https.onRequest(
  {cors: true}, async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send({error: "Metodo não permitido"});
    }

    try {
      const {path, commentId} = req.body;
      if (!path || !commentId) {
        res.status(400).send(
          {error: "Parametros invalidos, 'path e commentId' são obrigatorios"}
        );
        return;
      }
      const reactionsRef = admin.database().ref(`${path}/${commentId}`);
      const reactions = await reactionsRef.get();
      const reactionsList: ReactionsListProps | undefined = reactions.val();
      let likesCount = 0;
      let unlikesCount = 0;

      if (reactionsList) {
        Object.values(reactionsList).forEach((value) => {
          if (value.reaction === "liked") {
            likesCount++;
          } else {
            unlikesCount++;
          }
        });
      }
      const commentRef = admin.database().ref(`comments/${commentId}`);
      const snapshot = await commentRef.get();
      const commentData: CommentProps = snapshot.val().comment;
      const updatedComment = {...commentData, likesCount, unlikesCount};
      await commentRef.update({comment: updatedComment});
      res.status(200).json({success: true, updatedComment});
    } catch (error) {
      res.status(500).send({error: "Erro interno do servidor"});
    }
  }
);
