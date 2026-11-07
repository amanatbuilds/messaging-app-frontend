import { useContext, useState } from "react";
import { API_URL } from "../lib/config";
import { AuthContext } from "../contexts/AuthContext";
import { UserContext } from "../contexts/UserContext";
import { ChatContext } from "../contexts/ChatContext";

type Action = "friendRequest" | "cancelRequest" | "acceptRequest";

const AddUser = () => {
  const { token } = useContext(AuthContext);
  const { users, loading, refetchUsers } = useContext(UserContext);
  const { openDirectChat } = useContext(ChatContext);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const updateRequest = async (userId: number, action: Action) => {
    setError("");
    setBusyId(userId);
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }
      if (action === "acceptRequest") await openDirectChat(userId);
      await refetchUsers();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      // The list may be out of date (e.g. the other user cancelled), so refresh it.
      await refetchUsers();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <h1 className="text-xl text-white">Loading...</h1>;

  return (
    <div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {users.length === 0 && (
        <p className="text-white mt-3">No other users yet.</p>
      )}
      {users.map((resUser) => {
        const busy = busyId === resUser.id;
        const buttonBase =
          "ms-auto px-3 py-2 rounded-lg text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

        return (
          <div
            key={resUser.id}
            className="flex gap-2 items-center text-white my-3"
          >
            <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-md font-bold">
              {(resUser.name.trim()[0] ?? "?").toUpperCase()}
            </div>
            <div>
              <h2>{resUser.username}</h2>
            </div>

            {resUser.relation === "friends" && (
              <span className="ms-auto text-sm text-[#3DDC84]">Friends</span>
            )}

            {resUser.relation === "none" && (
              <button
                type="button"
                disabled={busy}
                onClick={() => updateRequest(resUser.id, "friendRequest")}
                className={`${buttonBase} bg-[#6E62FF]`}
              >
                Add User
              </button>
            )}

            {resUser.relation === "sent" && (
              <button
                type="button"
                disabled={busy}
                onClick={() => updateRequest(resUser.id, "cancelRequest")}
                className={`${buttonBase} bg-[#FF5C6C]`}
              >
                Cancel
              </button>
            )}

            {resUser.relation === "received" && (
              <button
                type="button"
                disabled={busy}
                onClick={() => updateRequest(resUser.id, "acceptRequest")}
                className={`${buttonBase} bg-[#3DDC84] text-black`}
              >
                Accept
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AddUser;
