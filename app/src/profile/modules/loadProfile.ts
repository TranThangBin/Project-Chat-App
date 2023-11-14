import makeAuthorizedRequest from "../../lib/makeAuthorizedRequest";
import ProfileModel from "../../model/profile.model";

const fullNameElem: HTMLParagraphElement | null =
  document.querySelector("#full-name");
const sexElem: HTMLParagraphElement | null = document.querySelector("#sex");
const emailElem: HTMLParagraphElement | null = document.querySelector("#email");
const phonenumberElem: HTMLParagraphElement | null =
  document.querySelector("#phonenumber");
const createdAtElem: HTMLParagraphElement | null =
  document.querySelector("#created-at");

export default makeAuthorizedRequest(async (token) => {
  const profileRequest = await fetch("http://localhost:8080/auth/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!profileRequest.ok) {
    window.alert("something went wrong");
    return;
  }
  const profile = (await profileRequest.json()) as ProfileModel;
  if (fullNameElem !== null) {
    fullNameElem.innerText = [profile.firstname, profile.lastname].join(" ");
  }
  if (sexElem !== null) {
    sexElem.innerText = profile.gender;
  }
  if (emailElem !== null) {
    emailElem.innerText = profile.email;
  }
  if (phonenumberElem !== null) {
    phonenumberElem.innerText = profile.phonenumber;
  }
  if (createdAtElem !== null) {
    createdAtElem.innerText = new Date(profile.createdAt).toLocaleString(
      "fr-FR",
    );
  }
});
