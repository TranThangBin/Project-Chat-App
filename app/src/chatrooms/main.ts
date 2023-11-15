import "/src/index.postcss";

const btn: HTMLButtonElement | null =
  document.querySelector("#btn-toggle-modal");
const modal: HTMLDialogElement | null = document.querySelector("#modal");
btn?.addEventListener("click", () => {
  modal?.showModal();
});
const btnq: HTMLButtonElement | null =
  document.querySelector("#btn-close-modal");
  btnq?.addEventListener("click", () => {
    modal?.close();
  });

