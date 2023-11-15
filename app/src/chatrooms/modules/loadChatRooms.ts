import makeAuthorizedRequest from "../../lib/makeAuthorizedRequest";
import ChatRoomModel from "../../model/chatroom.model";
import {
  generateJoinedChatRoom,
  generateNotJoinedChatRoom,
} from "./generateChatRoomTemplate";

const joinedRoomList: HTMLUListElement | null =
  document.querySelector("#joined-rooms");
const notJoinedRoomList: HTMLUListElement | null =
  document.querySelector("#not-joined-rooms");
const formAddRoom: HTMLFormElement | null =
  document.querySelector("#form-add-room");
const chatRoom: HTMLDivElement | null = document.querySelector("#chat-room");

export default makeAuthorizedRequest(async (token) => {
  if (joinedRoomList === null) {
    window.alert("missing element #joined-rooms");
    return;
  }
  if (notJoinedRoomList === null) {
    window.alert("missing element #not-joined-rooms");
    return;
  }
  if (chatRoom === null) {
    window.alert("missing element #chat-room");
    return;
  }
  while (joinedRoomList.firstChild !== null) {
    joinedRoomList.removeChild(joinedRoomList.firstChild);
  }
  while (notJoinedRoomList.firstChild !== null) {
    notJoinedRoomList.removeChild(notJoinedRoomList.firstChild);
  }
  while (chatRoom.firstChild !== null) {
    chatRoom.removeChild(chatRoom.firstChild);
  }
  const chatRoomSocket = new WebSocket(
    `ws://localhost:3000/chatroom?init-token=${token}`,
  );
  chatRoomSocket.addEventListener("message", (e) => {
    const chatRoomData = JSON.parse(e.data) as ChatRoomModel;
    if (chatRoomData.isMember) {
      joinedRoomList.appendChild(
        generateJoinedChatRoom(chatRoomData, token, chatRoom),
      );
    } else {
      const chatroom = generateNotJoinedChatRoom(
        chatRoomData,
        token,
        joinedRoomList,
        notJoinedRoomList,
        chatRoom,
      );
      notJoinedRoomList.appendChild(chatroom);
    }
  });
  formAddRoom?.addEventListener("submit", (e) => {
    e.preventDefault();
    const chatRoomInfo = new FormData(e.currentTarget as HTMLFormElement);
    chatRoomSocket.send(
      JSON.stringify({ token, ...Object.fromEntries(chatRoomInfo.entries()) }),
    );
  });
});
