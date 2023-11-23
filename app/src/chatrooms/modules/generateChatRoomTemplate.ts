import makeAuthorizedRequest from "../../lib/makeAuthorizedRequest";
import ChatRoomModel from "../../model/chatroom.model";
import MessageModel from "../../model/message.model";
import joinRoomHandler from "./roomHandler";

export function generateJoinedChatRoom(
  chatRoom: ChatRoomModel,
  chatZone: HTMLElement,
) {
  const listItem = document.createElement("li");
  listItem.classList.add(
    "my-3",
    "flex",
    "w-full",
    "items-center",
    "rounded",
    "p-3",
    "text-black",
    "transition",
    "duration-100",
    "hover:bg-slate-400",
    "cursor-pointer",
  );
  listItem.innerHTML = `
        <img
          class="float-left mr-3 h-16 w-16 rounded-[50%] border-2"
          src="/images/user.png"
          alt=""
        />
        <div class="text-blue-400">
          <h2 class="">${[chatRoom.name, `#${chatRoom.id}`].join(" ")}</h2>
        </div>
  `;
  listItem.setAttribute("data-joined-room", "");
  listItem.setAttribute("data-chat-room-id", chatRoom.id + "");
  listItem.addEventListener(
    "click",
    makeAuthorizedRequest((token) => {
      chatZone.innerHTML = "";
      chatZone.appendChild(generateChatZone(token, chatRoom.id, chatRoom.name));
    }),
  );
  return listItem;
}

export function generateNotJoinedChatRoom(
  chatRoom: ChatRoomModel,
  joinedList: HTMLUListElement,
  notJoinedList: HTMLUListElement,
  chatZone: HTMLDivElement,
) {
  const listItem = document.createElement("li");
  listItem.classList.add(
    "my-3",
    "flex",
    "w-full",
    "items-center",
    "rounded",
    "p-3",
    "text-black",
    "transition",
    "duration-100",
    "hover:bg-slate-400",
    "cursor-pointer",
  );
  listItem.innerHTML = `
        <img
          class="float-left mr-3 h-16 w-16 rounded-[50%] border-2"
          src="/images/user.png"
          alt=""
        />
        <div class="text-blue-400">
          <h2 class="">${[chatRoom.name, `#${chatRoom.id}`].join(" ")}</h2>
        </div>
  `;
  listItem.setAttribute("data-not-joined-room", "");
  listItem.setAttribute("data-chat-room-id", chatRoom.id + "");
  listItem.onclick = joinRoomHandler(
    chatRoom.name,
    chatZone,
    joinedList,
    notJoinedList,
  );
  return listItem;
}

export function generateChatZone(
  token: string,
  roomID: number,
  roomName: string,
) {
  const div = document.createElement("div");
  div.innerHTML = `
        <ul>
          <li
            class="flex items-center border-2 border-black bg-slate-200 p-3 text-black transition duration-100 hover:border-blue-400 hover:bg-slate-400"
          >
            <img
              class="float-left mr-3 h-16 w-16 rounded-full border-2"
              src="/images/user.png"
              alt=""
            />
            <div class="text-blue-400">
              <h2 class="">${roomName}</h2>
            </div>
          </li>
        </ul>
        <div
          class="h-4/5 border-2 border-black bg-slate-200 hover:border-blue-400"
        >
          <div class="flex h-5/6 flex-col justify-end border">
            <div id="message-container" class="overflow-auto">
            </div>
          </div>
        </div>
        <div class="bg-slate-200">
          <form
            id="form-send-message"
            class="h-24 border-2 border-black text-center hover:border-blue-400"
          >
            <input
              type="text"
              name="content"
              placeholder="Type your message here"
              class="texr-xl mt-6 w-1/2 rounded bg-slate-500 px-3 py-2 text-black"
            />
            <button
              type="submit"
              class="rounded-lg bg-white px-3 py-3 text-black"
            >
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
    `;
  const roomSocket = new WebSocket(
    `ws://localhost:3000/message?init-token=${token}&room-id=${roomID}`,
  );
  roomSocket.addEventListener("message", (e) => {
    div
      .querySelector("#message-container")
      ?.appendChild(generateMessage(JSON.parse(e.data)));
  });
  div.querySelector("#form-send-message")?.addEventListener(
    "submit",
    makeAuthorizedRequest((token, e) => {
      e.preventDefault();
      const currentForm = e.currentTarget as HTMLFormElement;
      const messageInfo = new FormData(currentForm);
      roomSocket.send(
        JSON.stringify({ token, ...Object.fromEntries(messageInfo.entries()) }),
      );
      currentForm.querySelectorAll("input").forEach((inp) => {
        inp.value = "";
      });
    }),
  );
  return div;
}

function generateMessage(message: MessageModel) {
  const div = document.createElement("div");
  div.classList.add("flex", "items-center", "justify-end");
  div.innerHTML = `
       <img
         class="ml-2 mt-6 h-8 w-8 rounded-full border"
         src="/images/user.png"
         alt=""
       />
       <div class="p-2">
         <p class="text-center opacity-50">${[
           message.firstname,
           message.lastname,
           `#${message["user-id"]}`,
         ].join(" ")}</p>
         <p
           class="inline-block self-start whitespace-normal rounded bg-white px-2 py-2"
         >
            ${message.content}
         </p>
         <br />
       </div>
    `;
  return div;
}
