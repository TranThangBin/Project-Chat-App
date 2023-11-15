export default function createRemoveFriendHandler(token: string) {
  return async (e: Event) => {
    const currentBtn = e.currentTarget as HTMLButtonElement;
    const userID = currentBtn.getAttribute("data-user-id");
    const removeFriendRequest = await fetch(
      `http://localhost:8080/friend/${userID}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!removeFriendRequest.ok) {
      window.alert("something went wrong");
      return;
    }
    currentBtn.innerText = "You are now no longer friend";
    currentBtn.classList.remove("bg-red-600", "hover:bg-red-500");
    currentBtn.classList.add("bg-[#1877F2]", "hover:bg-[#2980b9]");
  };
}
