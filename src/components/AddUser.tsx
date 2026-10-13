import { useContext, useEffect, useState } from "react";
import { API_URL } from "../lib/config";
import { AuthContext } from "../contexts/AuthContext";
import { UserContext, type SentRequest } from "../contexts/UserContext";

const AddUser = () => {
  const { users } = useContext(UserContext);
  const { user, token } = useContext(AuthContext);
  const [addFriendUser, setAddFriendUser] = useState<SentRequest[]>(
   []
  );

  useEffect(() => {
    const currentUser = users.find(myUser => myUser.id === user?.id)
    setAddFriendUser(currentUser?.sentRequests ?? []);
  }, [users, user?.id]);

  const isRequestSent = (reqUserId: number) => {
    return addFriendUser.some(reqUser => reqUser.receiver.id === reqUserId);
  }

  const addUserToFollowing = async (userId: number) => {
    try {
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
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      {users
        ?.filter((myUser) => myUser.username !== user?.username)
        .map((resUser) => (
          <div
            key={resUser.id}
            className="flex gap-2 items-center text-white my-3"
          >
            <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-md font-bold">
              {resUser.name.split(" ")[0][0]}
            </div>
            <div>
              <h2>{resUser.username}</h2>
            </div>
            {isRequestSent(resUser.id) ? <div className="ms-auto bg-[#FF5C6C] text-md px-3 py-2 rounded-lg cursor-pointer">Cancel</div> : <div
                          className="ms-auto bg-[#6E62FF] text-md px-3 py-2 rounded-lg cursor-pointer"
                          onClick={() => addUserToFollowing(resUser.id)}
                        >
                          Add User
                        </div>}
          </div>
        ))}
    </div>
  );
};

export default AddUser;
