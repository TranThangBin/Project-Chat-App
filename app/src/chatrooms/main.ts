import "/src/index.postcss";
import makeAuthorizedRequest from "../lib/makeAuthorizedRequest";
import { closeModal, openModal } from "./modules/toggleModal";

window.addEventListener("load", makeAuthorizedRequest());

const btnOpenModal = document.querySelector("#btn-open-modal");
const btnCloseModal = document.querySelector("#btn-close-modal");

btnOpenModal?.addEventListener("click", openModal);
btnCloseModal?.addEventListener("click", closeModal);
