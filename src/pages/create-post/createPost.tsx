import { useAuthState } from "react-firebase-hooks/auth"
import { CreateForm } from "./create-form"
import { auth } from "../../config/firebase"

export const CreatePost = () => {
    const [user] = useAuthState(auth)
    return (
        
        <div>
            {user && <CreateForm />}
        </div>
    )
}