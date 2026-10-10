import { useContext, useEffect, useState } from "react";
import { API_URL } from "../lib/config";
// import type { User } from "../pages/Home";
import { AuthContext } from "../contexts/AuthContext";
import { type FriendRequestUser, UserContext } from "../contexts/UserContext";

const AddUser = () => {
  // const [users, setUsers] = useState<User[] | null>(null);
  const { users } = useContext(UserContext);
  const [sentFriendRequest, setSentFriendRequest] =
    useState<FriendRequestUser[]>();
  const { user, token } = useContext(AuthContext);
  useEffect(() => {
    setSentFriendRequest(
      users.find((resUser) => resUser.id === user?.id)?.sentRequests,
    );
  }, []);

  const addUserToFollowing = async (userId: number) => {
    const res = await fetch(`${API_URL}/api/users/${userId}/friendRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ senderId: user?.id }),
    });
    const data = await res.json();
    console.log(data);
  };
  console.log(sentFriendRequest);
  return (
    <div>
      {users
        ?.filter((myUser) => myUser.username !== user?.username)
        .map((resUser) => (
          <div className="flex gap-2 items-center text-white my-3">
            <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-md font-bold">
              {resUser.name.split(" ")[0][0]}
            </div>
            <div>
              <h2>{resUser.username}</h2>
            </div>

            <div
              className="ms-auto bg-[#6E62FF] text-md px-3 py-2 rounded-lg cursor-pointer"
              onClick={() => addUserToFollowing(resUser.id)}
            >
              Add User
            </div>
          </div>
        ))}
    </div>
  );
};

export default AddUser;
