import { setCredentials } from "../../lib/useCredentials";
import CredentialsModel from "../../model/credentials.model";

export default async (e: Event) => {
  e.preventDefault();
  const loginInfo = new FormData(e.currentTarget as HTMLFormElement);
  const loginResponse = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(loginInfo.entries())),
  });
  if (!loginResponse.ok) {
    window.alert("username or password is incorrect");
    return;
  }
  const creds = (await loginResponse.json()) as CredentialsModel;
  setCredentials(creds);
  window.location.href = "/profile/";
};
