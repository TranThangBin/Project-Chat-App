import handleRegister from "./modules/handleRegister";
import "/src/index.postcss";

const registerForm = document.querySelector("[data-register-form]");

registerForm?.addEventListener("submit", handleRegister);
