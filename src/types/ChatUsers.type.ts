export interface ChatUser {
  id: number;
  name: string;
  username: string;
  message: string;
  avatar: string;
}

export interface Member {
  id: number;
  name: string;
  username: string;
}

export interface Message {
  id: number;
  text: string;
  createdAt: string;
  userId: number;
  chatId: number;
  user: Member;
}

export interface Chat {
  id: number;
  name: string;
  isGroup: boolean;
  members: Member[];
  lastMessage: Message | null;
}
