import { useContext, useEffect, useState } from "react";
import { API_URL } from "../lib/config";
import { AuthContext } from "../contexts/AuthContext";

interface SendFriendRequest {
  status: "pending" | "accepted" | "rejected";
  receiver: {
    id: number;
    name: string;
    username: string;
  }
}

interface ReceiveFriendRequest {
  status: "pending" | "accepted" | "rejected";
  sender: {
    id: number;
    name: string;
    username: string;
  }
}

const RequestUser = () => {
  const [activeTab, setActiveTab] = useState("sent");
  const { user } = useContext(AuthContext)
  const [sentRequest, setSentRequest] = useState<SendFriendRequest[]>([])
  const [receiveRequest, setReceiveRequest] = useState<ReceiveFriendRequest[]>([]);

  const sendFriendRequest = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${user?.id}/sendRequest` )
      if(!res.ok) {
        return new Error("Cannot Fetch Users")
      }
      const data = await res.json()
      setSentRequest(data.sentRequests);
    } catch(error) {
      console.error(error)
    }
  }
  
  const receiveFriendRequest = async () => {
    try{
      const res = await fetch(`${API_URL}/api/users/${user?.id}/receiveRequest`)
      if(!res.ok) {
        return new Error("Cannot Fetch Users")
      }
      const data = await res.json();
      setReceiveRequest(data.receivedRequests)
    } catch(error) {
      console.error(error)
    }
  } 

  useEffect(() => {
    if(activeTab === "sent") {
      sendFriendRequest();
      return;
    } else if(activeTab === "receive") {
      receiveFriendRequest();
      return;
    }
  }, [activeTab])

  return (
    <div>
      <div className="flex items-center justify-center gap-5 mt-5  text-white">
        <div
          className={`border-2 border-cyan-500 px-5 py-2 rounded-xl ${activeTab === "sent" && "bg-[#6E62FF] border-none"}`}
          onClick={() => setActiveTab("sent")}
        >
          Sent
        </div>
        <div
          className={`border-2 border-cyan-500 px-5 py-2 rounded-xl ${activeTab === "receive" && "bg-[#6E62FF] border-none"}`}
          onClick={() => setActiveTab("receive")}
        >
          Receive
        </div>
      </div>

      {activeTab === "sent" && (
        <div className="text-white">
          {sentRequest.length === 0 ? (
            <div>Sent Request to other user first</div>
          ) : (
            sentRequest.map((user) => (
              <div className="flex gap-3 items-center mb-3 text-white">
                <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-md font-bold">{user.receiver.name.split(" ")[0][0]}</div>
                <h2>{user.receiver.username}</h2>
                <button className="ms-auto bg-[#FF5C6C] px-3 py-2 text-md rounded-lg cursor-pointer">Cancel</button>
              </div>
            ))
          )}
        </div>
      )}
      {activeTab === "receive" && (
        <div className="text-white">
          {receiveRequest.length === 0 ? (
            <div>You didn't have any requests.</div>
          ) : (
            receiveRequest.map((user) => (
              <div className="flex gap-3 items-center mb-3 text-white">
                <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-md font-bold">{user.sender.name.split(" ")[0][0]}</div>
                <h2>{user.sender.username}</h2>
                <button className="ms-auto bg-[#3DDC84] px-3 py-2 rounded-lg text-md cursor-pointer">Accept</button>
              </div>
            ))
          )}
          
        </div>
      )}
    </div>
  );
};

export default RequestUser;
