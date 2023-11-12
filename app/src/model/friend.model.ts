export type FriendModel = {
  id: number;
  firstname: string;
  lastname: string;
  status: "friend" | "sent request" | "recieved request" | "stranger";
};
