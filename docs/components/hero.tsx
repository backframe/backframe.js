import { FadeIn } from "./fade-in";
import { font } from "./fonts";

function handleCopy() {
  const command = document.querySelector("#command");
  const commandText = document.querySelector("#command-text");
  const copyIcon = document.querySelector("#copy-icon");
  const checkIcon = document.querySelector("#check-icon");
  let cooldown = false;

  function toggleIcons() {
    copyIcon.classList.toggle("hidden");
    checkIcon.classList.toggle("hidden");
  }

  if (cooldown === false) {
    cooldown = true;
    // @ts-ignore
    navigator.clipboard.writeText(commandText.innerText);
    toggleIcons();

    setTimeout(() => {
      toggleIcons();
      cooldown = false;
    }, 2000);
  }
}

export function Hero() {
  return (
    <FadeIn
      className={`flex flex-col mx-auto gap-8 p-5 lg:py-24 ${font.className}`}
    >
      <h1
        className={`mx-auto max-w-5xl md:mt-20 text-3xl font-semibold md:text-6xl !leading-tight text-center`}
      >
        A framework for rapid development of APIs and backends
      </h1>

      <div className="text-center mx-auto text-xl md:text-2xl max-w-4xl text-black/40 dark:text-white/40">
        Whether you are looking to spin up a simple API in seconds, or build a
        complex backend for your next big project, backframe.js provides the
        tools you need to get started and keep iterating quickly and easily.
      </div>

      <div className="flex w-full flex-col items-center">
        <div className="relative flex my-2 h-full">
          <button
            className="relative flex cursor-pointer rounded-full flex-row items-center gap-2 border px-2 py-2 text-sm transition-colors duration-300 md:px-3 md:py-3 md:text-lg lg:px-5 lg:py-4"
            title="Copy the command to get started"
            id="command"
          >
            <code id="command-text">npx create-bf@latest</code>
            <div onClick={handleCopy}>
              <svg
                id="copy-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </div>
            <svg
              id="check-icon"
              className="hidden"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </FadeIn>
  );
}
