import FriendModel from "../../model/friend.model";
import makeAuthorizedRequest from "../../lib/makeAuthorizedRequest";
import {
  generateRecievedFR,
  generateSentFR,
  generateStranger,
} from "./generateFRTemplate";
import {
  handleAcceptFR,
  handleAddFriend,
  handleRejectFR,
} from "./handleFriendRequest";

const friendRequestList: HTMLUListElement | null =
  document.querySelector("#request-list");

export default makeAuthorizedRequest(async (token) => {
  if (friendRequestList === null) {
    window.alert("missing element #request-list");
    return;
  }
  while (friendRequestList.firstChild !== null) {
    friendRequestList.removeChild(friendRequestList.firstChild);
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
    .filter((friend) => friend.status === "recieved request")
    .forEach((friend) =>
      friendRequestList.appendChild(generateRecievedFR(friend)),
    );
  friends
    .filter((friend) => friend.status === "sent request")
    .forEach((friend) => friendRequestList.appendChild(generateSentFR(friend)));
  friends
    .filter((friend) => friend.status === "stranger")
    .forEach((friend) =>
      friendRequestList.appendChild(generateStranger(friend)),
    );
  document.querySelectorAll("[data-btn-add-friend]").forEach((btn) =>
    btn.addEventListener("click", makeAuthorizedRequest(handleAddFriend), {
      once: true,
    }),
  );
  document.querySelectorAll("[data-accept-reject]").forEach((container) => {
    const acceptBtn: HTMLButtonElement | null =
      container.querySelector("[data-btn-accept]");
    const rejectBtn: HTMLButtonElement | null =
      container.querySelector("[data-btn-reject]");
    const userID = container.getAttribute("data-user-id");
    acceptBtn?.addEventListener(
      "click",
      makeAuthorizedRequest((token) =>
        handleAcceptFR(container as HTMLDivElement, userID, token),
      ),
    );
    rejectBtn?.addEventListener(
      "click",
      makeAuthorizedRequest((token) =>
        handleRejectFR(container as HTMLDivElement, userID, token),
      ),
    );
  });
});
