import {
    addDoc,
    getDocs,
    collection,
    query,
    where,
    deleteDoc,
    doc,
    limit,
  } from "firebase/firestore";
  import { useCallback, useEffect, useState } from "react";
  import { useAuthState } from "react-firebase-hooks/auth";
  import { dataBase, auth } from "../../config/firebase";
  import { Post as IPost } from "./main";
  import * as yup from "yup";
  import { useForm } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";

  interface Props {
    post: IPost;
  }
  
  interface Like {
    likeId: string;
    userId: string;
  }
  
  interface Comment {
    commentText: string;
    userName?: string;
    userId?: string;
  }

  const COMMENTS_PAGE_SIZE = 10;
  
  export const Post = (props: Props) => {
    const { post } = props;
    const [user] = useAuthState(auth);
  
    const schema = yup.object().shape({
      commentText: yup.string().required("Cannot Pass Empty Comment"),
    });
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Comment>({
      resolver: yupResolver(schema),
    });
    const [comments, setComments] = useState<Comment[] | null>(null);
  
    const [likes, setLikes] = useState<Like[] | null>(null);
    const likesRef = collection(dataBase, "likes");
    const likesDoc = query(likesRef, where("postId", "==", post.id));
  
    const commentRef = collection(dataBase, "comment");
    const onCreateComment = async (data: Comment) => {
      await addDoc(commentRef, {
        ...data,
        userName: user?.displayName,
        userId: user?.uid,
        postId: post.id,
      });
    };
  
    const getLikes = async () => {
      const data = await getDocs(likesDoc);
      setLikes(
        data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
      );
    };
    const addLike = async () => {
      try {
        const newDoc = await addDoc(likesRef, {
          userId: user?.uid,
          postId: post.id,
        });
        if (user) {
          setLikes((prev) =>
            prev
              ? [...prev, { userId: user.uid, likeId: newDoc.id }]
              : [{ userId: user.uid, likeId: newDoc.id }]
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    const removeLike = async () => {
      try {
        const likeToDeleteQuery = query(
          likesRef,
          where("postId", "==", post.id),
          where("userId", "==", user?.uid)
        );
  
        const likeToDeleteData = await getDocs(likeToDeleteQuery);
        const likeId = likeToDeleteData.docs[0].id;
        const likeToDelete = doc(dataBase, "likes", likeId);
        await deleteDoc(likeToDelete);
        if (user) {
          setLikes(
            (prev) => prev && prev.filter((like) => like.likeId !== likeId)
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    const hasUserLiked = likes?.find((like) => like.userId === user?.uid);
  
    const hasUserCommented = comments?.find(
      (comment) => comment.userId === user?.uid
    );
  
    const getComments = useCallback(async () => {
      const data = await getDocs(
        query(commentRef, where("postId", "==", post.id), limit(COMMENTS_PAGE_SIZE))
      );
      setComments(
        data.docs.map((doc) => ({
          commentText: doc.data().commentText,
          userName: doc.data().userName,
          userId: doc.data().userId,
        }))
      );
    }, [commentRef, post.id]);
  
    useEffect(() => {
      getLikes();
      getComments();
    }, [comments]);
  
    return (
      <div className="post-grid">
        <div className="post-container">
          <div className="title">
            <h1> {post.title}</h1>
          </div>
  
          <div className="body">
            <p> {post.description} </p>
          </div>
  
          <div className="footer">
            <p> @{post.username} </p>
            <button
              className="like-button"
              onClick={hasUserLiked ? removeLike : addLike}
            >
              {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}{" "}
            </button>
            {likes && <p> Likes: {likes?.length} </p>}
  
            <h2>Comments</h2>
            {comments?.map((comment, index) => (
              <p>
                @{comment.userName} : {comment.commentText}
              </p>
            ))}
  
            {hasUserCommented ? (
              <div></div>
            ) : (
              <>
                <form onSubmit={handleSubmit(onCreateComment)}>
                  <input
                    type="text"
                    className="comment-field"
                    placeholder="Add Comment"
                    {...register("commentText")}
                  />
                  <p style={{ color: "red" }}>{errors.commentText?.message}</p>
  
                  <input type="submit" value="Comment" className="comment-button" />
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
