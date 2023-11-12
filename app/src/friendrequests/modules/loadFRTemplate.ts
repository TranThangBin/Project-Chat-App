import FriendModel from "../../model/friend.model";

export function loadRecievedFR(friendRequestList: HTMLUListElement) {
  return (friend: FriendModel) => {
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
  };
}

export function loadSentFR(friendRequestList: HTMLUListElement) {
  return (friend: FriendModel) => {
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
  };
}

export function loadStranger(friendRequestList: HTMLUListElement) {
  return (friend: FriendModel) => {
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
  };
}
