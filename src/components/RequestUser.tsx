import { useCallback, useContext, useEffect, useState } from "react";
import { API_URL } from "../lib/config";
import { AuthContext } from "../contexts/AuthContext";
import { UserContext } from "../contexts/UserContext";
import { ChatContext } from "../contexts/ChatContext";

interface Person {
  id: number;
  name: string;
  username: string;
}

type Status = "PENDING" | "ACCEPTED" | "REJECTED";

interface SentRequest {
  status: Status;
  receiver: Person;
}
interface ReceivedRequest {
  status: Status;
  sender: Person;
}

const RequestUser = () => {
  const [activeTab, setActiveTab] = useState<"sent" | "receive">("sent");
  const { token } = useContext(AuthContext);
  const { refetchUsers } = useContext(UserContext);
  const { openDirectChat } = useContext(ChatContext);
  const [sentRequest, setSentRequest] = useState<SentRequest[]>([]);
  const [receiveRequest, setReceiveRequest] = useState<ReceivedRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const authHeaders = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const path = activeTab === "sent" ? "sent" : "received";
      const res = await fetch(`${API_URL}/api/users/me/${path}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Request Failed: ${res.status}`);
      const data = await res.json();
      if (activeTab === "sent") setSentRequest(data.sentRequests ?? []);
      else setReceiveRequest(data.receivedRequests ?? []);
    } catch (err) {
      setError("Could not load request. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, token]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const respond = async (
    userId: number,
    action: "cancelRequest" | "acceptRequest",
  ) => {
    setError("");
    setBusyId(userId);
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/${action}`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error(`Request Failed: ${res.status}`);
      if (action === "acceptRequest") await openDirectChat(userId);
      await Promise.all([loadRequests(), refetchUsers()]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const tabClass = (tab: string) =>
    `border-2 border-cyan-500 px-5 py-2 rounded-xl cursor-pointer ${
      activeTab === tab ? "bg-[#6E62FF] border-transparent" : ""
    }`;

  const pendingSent = sentRequest.filter((r) => r.status === "PENDING");
  const pendingReceived = receiveRequest.filter((r) => r.status === "PENDING");

  return (
    <div>
      <div className="flex items-center justify-center gap-5 mt-5  text-white">
        <button
          type="button"
          className={tabClass("sent")}
          onClick={() => setActiveTab("sent")}
        >
          Sent
        </button>
        <button
          type="button"
          className={tabClass("receive")}
          onClick={() => setActiveTab("receive")}
        >
          Receive
        </button>
      </div>

      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
      {loading && <p className="mt-3">Loading...</p>}

      {!loading && activeTab === "sent" && (
        <div className="mt-3">
          {pendingSent.length === 0 ? (
            <div className="text-white">You haven't sent any requests.</div>
          ) : (
            pendingSent.map((req) => (
              <div
                key={req.receiver.id}
                className="flex gap-3 items-center mb-3"
              >
                <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-base font-bold">
                  {req.receiver.name.split(" ")[0][0]}
                </div>
                <h2 className="text-white">{req.receiver.username}</h2>
                <button
                  type="button"
                  disabled={busyId === req.receiver.id}
                  onClick={() => respond(req.receiver.id, "cancelRequest")}
                  className="ms-auto bg-[#FF5C6C] px-3 py-2 text-base rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && activeTab === "receive" && (
        <div className="mt-3">
          {pendingReceived.length === 0 ? (
            <div className="text-white">You don't have any requests.</div>
          ) : (
            pendingReceived.map((req) => (
              <div key={req.sender.id} className="flex gap-3 items-center mb-3">
                <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-base font-bold">
                  {req.sender.name.split(" ")[0][0]}
                </div>
                <h2 className="text-white">{req.sender.username}</h2>
                <button
                  type="button"
                  disabled={busyId === req.sender.id}
                  onClick={() => respond(req.sender.id, "acceptRequest")}
                  className="ms-auto bg-[#3DDC84] px-3 py-2 rounded-lg text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Accept
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RequestUser;
