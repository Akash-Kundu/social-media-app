import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export const Navbar = () => {
  const [user] =
    useAuthState(
      auth
    ); /* Automatically updates the username and image when login through a new acc */
  const signUserOut = async () => {
    await signOut(auth);
  };
  return (
    <div className="navbar">
      <div className="links">
        <Link to="/"> Home </Link>
        {user?<Link to="/createPost"> Create Post </Link> : <Link to="/login"> Login </Link>}
      </div>

      <div className="user">
        {user && (
          <>
            <p>{user?.displayName}</p>
            <img src={user?.photoURL || ""} width="100" height="100" alt="" />
            <button className="logout-button" onClick={signUserOut}> Log Out </button>
          </>
        )}
      </div>
    </div>
  );
};
