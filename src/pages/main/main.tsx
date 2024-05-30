import { getDocs, collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, dataBase } from "../../config/firebase"
import { Post } from "./post"
import { useAuthState } from "react-firebase-hooks/auth"

export interface Post {
    id: string,
    userId: string,
    title: string,
    username: string,
    description: string
}

export const Main = () => {

    const [user] = useAuthState(auth)
    const [postsList, setPostsList] = useState<Post[] | null>(null)
    const postRef = collection(dataBase, "posts")

    const getPosts = async () => {
        const data = await getDocs(postRef)
        setPostsList(
            data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[] //only gets those 4 elements in the database structure
        )
    }

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <div className="home-page">
            {user ? postsList?.map((post) => <Post post={post} />) : <div></div>}
        </div>
    );

}