const modal: HTMLDialogElement | null = document.querySelector("#modal");

export function openModal() {
  modal?.showModal();
}

export function closeModal() {
  modal?.close();
}
