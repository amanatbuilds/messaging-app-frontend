import { useEffect, useState } from "react";
import { API_URL } from "../lib/config";
import type { User } from "../pages/Home";

const AddUser = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  useEffect(() => {
    async function users() {
      try {
        const res = await fetch(`${API_URL}/api/users`);
        if (!res.ok) {
          console.log(res);
          return;
        }
        const data = await res.json();
        console.log(data);
        setUsers(data.users);
      } catch (error) {
        console.error(error);
      }
    }
    users();
  }, []);
  return (
    <div>
      {users?.map((user) => (
        <div className="flex gap-2 items-center text-white my-3">
          <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-md font-bold">
            {user.name.split(" ")[0][0]}
          </div>
          <div>
            <h2>{user.name}</h2>
          </div>
          <div className="ms-auto bg-[#6E62FF] text-md px-3 py-2 rounded-lg">
            Add User
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddUser;
