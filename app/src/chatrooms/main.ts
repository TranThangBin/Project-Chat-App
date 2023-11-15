import "/src/index.postcss";
import { closeModal, openModal } from "./modules/toggleModal";
import loadChatRooms from "./modules/loadChatRooms";

window.addEventListener("load", loadChatRooms);

const btnOpenModal = document.querySelector("#btn-open-modal");
const btnCloseModal = document.querySelector("#btn-close-modal");

btnOpenModal?.addEventListener("click", openModal);
btnCloseModal?.addEventListener("click", closeModal);
