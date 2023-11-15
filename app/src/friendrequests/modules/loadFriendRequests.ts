import FriendModel from "../../model/friend.model";
import makeAuthorizedRequest from "../../lib/makeAuthorizedRequest";
import { loadRecievedFR, loadSentFR, loadStranger } from "./loadFRTemplate";
import {
  createAcceptFRHandler,
  createAddFriendHandler,
  createRejecctFRHandler,
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
    .forEach(loadRecievedFR(friendRequestList));
  friends
    .filter((friend) => friend.status === "sent request")
    .forEach(loadSentFR(friendRequestList));
  friends
    .filter((friend) => friend.status === "stranger")
    .forEach(loadStranger(friendRequestList));
  document.querySelectorAll("[data-btn-add-friend]").forEach((btn) =>
    btn.addEventListener("click", createAddFriendHandler(token), {
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
      createAcceptFRHandler(container as HTMLDivElement, userID, token),
    );
    rejectBtn?.addEventListener(
      "click",
      createRejecctFRHandler(container as HTMLDivElement, userID, token),
    );
  });
});
