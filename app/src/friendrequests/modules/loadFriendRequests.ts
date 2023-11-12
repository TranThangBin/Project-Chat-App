import validateSession from "../../lib/validateSession";
import { clearCredentials } from "../../lib/credentials";
import { FriendModel } from "../../model/friend.model";

const friendRequestList: HTMLUListElement | null =
  document.querySelector("#request-list");

export default async () => {
  if (friendRequestList === null) {
    window.alert("missing element #request-list");
    return;
  }
  const creds = await validateSession();
  if (creds === null) {
    window.alert("your session has expired");
    window.location.href = "/login/";
    clearCredentials();
    return;
  }
  while (friendRequestList.firstChild !== null) {
    friendRequestList.removeChild(friendRequestList.firstChild);
  }
  const friendRequest = await fetch("http://localhost:8080/friends/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creds.jwt}`,
    },
  });
  const friends = (await friendRequest.json()) as FriendModel[];
  friends
    .filter((friend) => friend.status === "recieved request")
    .forEach((friend) => {
      const listItem = document.createElement("li");
      listItem.classList.add(
        "my-3",
        "flex",
        "w-full",
        "items-center",
        "rounded-xl",
        "border-[1px]",
        "bg-[#4284]",
        "p-3",
        "text-black",
        "transition",
        "duration-100",
        "hover:border-red-400",
        "hover:bg-[#6f44c044]",
      );
      listItem.innerHTML = `
          <img
            class="float-left mr-3 h-16 w-16 rounded-[50%] border-[2px]"
            src="/images/user.png"
            alt=""
          />
          <div class="text-white">
            <h2>${[friend.firstname, friend.lastname].join(" ")}</h2>
            <p class="text-[13px] italic">people you may know.</p>
          </div>
          <div
            class="ml-auto inline-grid gap-2 text-white"
            data-user-id="${friend.id}"
            data-accept-reject
          >
            <button
              data-btn-accept
              class="ml-9 w-24 rounded-md bg-[#1877F2] text-white transition duration-150 hover:bg-[#2980b9] hover:text-black"
            >
              Accept
            </button>
            <button
              data-btn-reject
              class="ml-9 w-24 rounded-md bg-red-500 text-white transition duration-150 hover:bg-red-600 hover:text-black"
            >
              reject
            </button>
          </div>
      `;
      friendRequestList.appendChild(listItem);
    });
  friends
    .filter((friend) => friend.status === "sent request")
    .forEach((friend) => {
      const listItem = document.createElement("li");
      listItem.classList.add(
        "my-3",
        "flex",
        "w-full",
        "items-center",
        "rounded-xl",
        "border-[1px]",
        "bg-[#4284]",
        "p-3",
        "text-black",
        "transition",
        "duration-100",
        "hover:border-red-400",
        "hover:bg-[#6f44c044]",
      );
      listItem.innerHTML = `
          <img
            class="float-left mr-3 h-16 w-16 rounded-[50%] border-[2px]"
            src="/images/user.png"
            alt=""
          />
          <div class="text-white">
            <h2 class="">${[friend.firstname, friend.lastname].join(" ")}</h2>
            <p class="text-[13px] italic">people you may know.</p>
          </div>
          <button
            data-user-id="${friend.id}"
            class="ml-auto w-24 rounded-md bg-slate-500 text-white transition duration-150 hover:bg-slate-600 hover:text-black"
          >
            Request Sent
          </button>
      `;
      friendRequestList.appendChild(listItem);
    });
  friends
    .filter((friend) => friend.status === "stranger")
    .forEach((friend) => {
      const listItem = document.createElement("li");
      listItem.classList.add(
        "my-3",
        "flex",
        "w-full",
        "items-center",
        "rounded-xl",
        "border-[1px]",
        "bg-[#4284]",
        "p-3",
        "text-black",
        "transition",
        "duration-100",
        "hover:border-red-400",
        "hover:bg-[#6f44c044]",
      );
      listItem.innerHTML = `
          <img
            class="float-left mr-3 h-16 w-16 rounded-[50%] border-[2px]"
            src="/images/user.png"
            alt=""
          />
          <div class="text-white">
            <h2 class="">${[friend.firstname, friend.lastname].join(" ")}</h2>
            <p class="text-[13px] italic">people you may know.</p>
          </div>
          <button
            data-user-id="${friend.id}"
            data-btn-add-friend
            class="ml-auto w-24 rounded-md bg-[#1877F2] text-white transition duration-150 hover:bg-[#2980b9] hover:text-black"
          >
            Add Friend
          </button>
      `;
      friendRequestList.appendChild(listItem);
    });
  document.querySelectorAll("[data-btn-add-friend]").forEach((btn) =>
    btn.addEventListener(
      "click",
      async (e) => {
        const currentBtn = e.currentTarget as HTMLButtonElement;
        const userID = currentBtn.getAttribute("data-user-id");
        const addFriendRequest = await fetch(
          `http://localhost:8080/friends/${userID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${creds.jwt}`,
            },
          },
        );
        if (addFriendRequest.ok) {
          currentBtn.classList.remove(...currentBtn.classList.values());
          currentBtn.classList.add(
            "ml-auto",
            "w-24",
            "rounded-md",
            "bg-slate-500",
            "text-white",
            "transition",
            "duration-150",
            "hover:bg-slate-600",
            "hover:text-black",
          );
          currentBtn.innerText = "Request Sent";
          currentBtn.removeAttribute("data-btn-add-friend");
        } else {
          window.alert("something went wrong");
        }
      },
      { once: true },
    ),
  );
  document.querySelectorAll("[data-accept-reject]").forEach((container) => {
    const acceptBtn: HTMLButtonElement | null =
      container.querySelector("[data-btn-accept]");
    const userID = container.getAttribute("data-user-id");
    acceptBtn?.addEventListener(
      "click",
      async () => {
        const acceptFriendRequest = await fetch(
          `http://localhost:8080/friends/${userID}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${creds.jwt}`,
            },
          },
        );
        if (acceptFriendRequest.ok) {
          (container as HTMLDivElement).innerText = "You are now friend";
        } else {
          window.alert("something went wrong");
        }
      },
      { once: true },
    );
  });
};
