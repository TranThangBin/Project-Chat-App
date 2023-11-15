import FriendModel from "../../model/friend.model";

export default (friendsList: HTMLUListElement) => (friend: FriendModel) => {
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
            <p class="text-center text-sm italic text-slate-400">id: ${
              friend.id
            }</p>
          </div>
          <button
            data-btn-remove-friend
            data-user-id="${friend.id}"
            class="ml-auto rounded-md bg-red-600 p-1 text-white transition duration-150 hover:bg-red-500 hover:text-black"
          >
            Remove Friend
          </button>
        `;
  friendsList.appendChild(listItem);
};
