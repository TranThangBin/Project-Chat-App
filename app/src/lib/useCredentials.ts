import CredentialsModel from "../model/credentials.model";

export function getCredentials() {
  const creds = localStorage.getItem("credentials");
  if (creds === null) {
    return null;
  }
  return JSON.parse(creds) as CredentialsModel;
}

export function setCredentials(creds: CredentialsModel) {
  localStorage.setItem("credentials", JSON.stringify(creds));
}

export function clearCredentials() {
  localStorage.removeItem("credentials");
}
