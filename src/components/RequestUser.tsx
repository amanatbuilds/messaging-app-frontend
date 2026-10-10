import { useState } from "react";

const RequestUser = () => {
  const [activeTab, setActiveTab] = useState("sent");
  const arr = [1, 2, 3];
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
          {arr.length === 0 ? (
            <div>Sent Request to other user first</div>
          ) : (
            arr.map((elem) => (
              <div className="flex gap-3 items-center mb-3 text-white">
                <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-md font-bold"></div>
                <h2>Fake User{elem}</h2>
                <button className="ms-auto">Cancel</button>
              </div>
            ))
          )}
        </div>
      )}
      {activeTab === "receive" && (
        <div className="text-white">
          {arr.length === 0 ? (
            <div>You didn't have any requests.</div>
          ) : (
            arr.map((elem) => (
              <div className="flex gap-3 items-center mb-3 text-white">
                <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-md font-bold"></div>
                <h2>{elem}Fake User</h2>
                <button className="ms-auto">Accept</button>
              </div>
            ))
          )}
          {}
        </div>
      )}
    </div>
  );
};

export default RequestUser;
