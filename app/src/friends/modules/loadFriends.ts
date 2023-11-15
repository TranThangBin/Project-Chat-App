import FriendModel from "../../model/friend.model";
import makeAuthorizedRequest from "../../lib/makeAuthorizedRequest";
import generateFriendTemplate from "./generateFriendTemplate";
import createRemoveFriendHandler from "./handleRemoveFriend";

const friendsList: HTMLUListElement | null =
  document.querySelector("#friends-list");

export default makeAuthorizedRequest(async (token) => {
  if (friendsList === null) {
    alert("missing element #friend-list");
    return;
  }
  while (friendsList.firstChild !== null) {
    friendsList.removeChild(friendsList.firstChild);
  }
  const friendRequest = await fetch("http://localhost:8080/friend", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!friendRequest.ok) {
    window.alert("something went wrong");
    return;
  }
  const friends = (await friendRequest.json()) as FriendModel[];
  friends
    .filter((friend) => friend.status === "friend")
    .forEach((friend) =>
      friendsList.appendChild(generateFriendTemplate(friend)),
    );
  document.querySelectorAll("[data-btn-remove-friend]").forEach((btn) =>
    btn.addEventListener("click", createRemoveFriendHandler(token), {
      once: true,
    }),
  );
});
