import { generateChatZone } from "./generateChatRoomTemplate";
export default (
  token: string,
  roomName: string,
  chatZone: HTMLDivElement,
  joinedList: HTMLUListElement,
  notJoinedList: HTMLUListElement,
) =>
  async function handleJoinRoom(e: Event) {
    const currentChatRoom = e.currentTarget as HTMLLIElement;
    const roomID = currentChatRoom.getAttribute("data-chat-room-id");
    const joinRoomRequest = await fetch(
      `http://localhost:8080/chatroom/join/${roomID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!joinRoomRequest.ok) {
      window.alert("something went wrong");
      return;
    }
    notJoinedList.removeChild(currentChatRoom);
    joinedList.appendChild(currentChatRoom);
    currentChatRoom.removeEventListener("click", handleJoinRoom);
    currentChatRoom.addEventListener("click", () => {
      chatZone.innerHTML = "";
      chatZone.appendChild(
        generateChatZone(token, parseInt(roomID ?? ""), roomName),
      );
    });
  };
