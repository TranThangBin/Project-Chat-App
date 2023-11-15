export function createAddFriendHandler(token: string) {
  return async (e: Event) => {
    const currentBtn = e.currentTarget as HTMLButtonElement;
    const userID = currentBtn.getAttribute("data-user-id");
    const addFriendRequest = await fetch(
      `http://localhost:8080/friend/${userID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!addFriendRequest.ok) {
      window.alert("something went wrong");
      return;
    }
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
  };
}

export function createAcceptFRHandler(
  container: HTMLDivElement,
  userID: string | null,
  token: string,
) {
  return async () => {
    const acceptFriendRequest = await fetch(
      `http://localhost:8080/friend/${userID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!acceptFriendRequest.ok) {
      window.alert("something went wrong");
      return;
    }
    container.innerText = "You are now friend";
  };
}

export function createRejecctFRHandler(
  container: HTMLDivElement,
  userID: string | null,
  token: string,
) {
  return async () => {
    const rejectFriendRequest = await fetch(
      `http://localhost:8080/friend/${userID}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!rejectFriendRequest.ok) {
      window.alert("something went wrong");
      return;
    }
    container.innerText = "You reject the friend request";
  };
}
