import CredentialsModel from "../model/credentials.model";
import {
  clearCredentials,
  getCredentials,
  setCredentials,
} from "./useCredentials";

export default (callback?: (token: string, e?: Event) => Promise<void>) =>
  async (e: Event) => {
    let creds = getCredentials();
    if (creds === null) {
      window.alert("you are unauthorized");
      window.location.href = "/login/";
      return;
    } else if (creds.expiredAt - Date.now() < 300000) {
      const refreshRequest = await fetch("http://localhost:8080/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${creds.jwt}`,
        },
      });
      if (refreshRequest.ok) {
        creds = (await refreshRequest.json()) as CredentialsModel;
        setCredentials(creds);
      } else {
        window.alert("your session has expired");
        window.location.href = "/login/";
        clearCredentials();
        return;
      }
    }
    if (callback !== undefined) {
      await callback(creds.jwt, e);
    }
  };
