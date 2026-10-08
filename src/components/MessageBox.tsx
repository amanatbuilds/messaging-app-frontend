import { IoMdSend } from "react-icons/io";
import type { User } from "../pages/Home";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
interface MessageBoxProps {
  activeUser: User | null;
}
const MessageBox = ({ activeUser }: MessageBoxProps) => {
  const messageSchema = z.object({
    message: z
      .string()
      .trim()
      .min(2, { error: "Message must be at least 2 character" })
      .max(1000, { error: "Message cannot exceed 1000 characters" }),
  });

  type Schema = z.infer<typeof messageSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm({
    resolver: zodResolver(messageSchema),
  });

  const sendMessage = ({ message }: Schema) => {
    console.log(message);
    resetField("message");
  };
  return (
    <div className="flex-1 min-w-0 flex flex-col h-screen bg-[#0B0D12]">
      <header className="px-8 flex h-24 shrink-0 gap-3 items-center border-b border-[#282c34]">
        <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-lg font-bold">
          {activeUser?.avatar}
        </div>
        <h2 className="text-white text-3xl">{activeUser?.name}</h2>
      </header>

      <section className="flex flex-1 flex-col justify-end px-8 pb-10">
        <div className="text-center text-[#9BA1AC] text-xl mb-10">Today</div>
        {/* Incoming message */}
        <div className="flex justify-start">
          <div className="max-w-120 text-[18px] rounded-[25px] bg-[#242832] px-7 py-5 text-white">
            Send an API Docs which helps to make good projects for your Resume.
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex justify-end">
          <div className="max-w-120 text-[18px] rounded-[25px] bg-[#6E62FF] px-7 py-5 text-white">
            Thanks for sharing its help me for my first job.
          </div>
        </div>
      </section>

      <form
        className="px-6 h-24 flex items-center shrink-0 border-t border-[#282c34]"
        onSubmit={handleSubmit(sendMessage)}
      >
        <input
          type="text"
          {...register("message")}
          className="h-13 min-w-0 flex-1 px-5 bg-[#12151C] border-2 border-[#292e38] text-white outline-none focus:border-[#4a4f5b] placeholder:text-[#626a78] text-[20px] rounded-full"
          placeholder={`Message User`}
        />
        {errors.message && (
          <p className="text-red-400">{errors.message.message}</p>
        )}
        <button
          type="submit"
          className="w-14 h-14 ms-2 flex items-center justify-center shrink-0 text-5xl cursor-pointer text-[#6b5cff] hover:scale-120 -rotate-20"
        >
          <IoMdSend />
        </button>
      </form>
    </div>
  );
};

export default MessageBox;
