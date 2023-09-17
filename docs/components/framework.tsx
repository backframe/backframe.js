import Image from "next/image";
import anatomyImage from "../assets/anatomy.png";
import typeSafetyImage from "../assets/safety.png";
import pluginImage from "../assets/plugins.png";

export function Framework() {
  const benefits = [
    {
      image: anatomyImage,
      title: "Separation of concerns is overrated!",
      items: [
        "We have a thing against boilerplate, so we got rid of it",
        "Simplify your codebase by keeping everything in one place",
        "No controllers, no services, no routers. Just exported methods in files",
        "No more jumping between files to find the code you're looking for",
        "It's really simple, innit ? :)",
      ],
    },
    {
      image: typeSafetyImage,
      title: "Type safety that you'll just love",
      items: [
        "Typesafe input and output validation",
        "Out of the box type safety. No config required",
        "We re-export zod, so you can use it anywhere in your code",
        "Input and output sanitization also included so you don't have to worry about injected or leaked fields",
      ],
    },
    {
      image: pluginImage,
      title: "Intuitive plugin system",
      items: [
        "We 'borrowed' vite's intuitive plugin system API",
        "Plugins can extend the CLI, the server, or both",
        "Install from npm or from a local path",
        "Add plugins to your project with a single command",
        "Create your own plugins in minutes",
      ],
    },
  ];

  return (
    <div className="flex flex-col my-10 gap-40">
      {benefits.map((benefit, idx) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-5">
            <h3 className="text-2xl md:text-3xl mb-5 font-semibold">
              {benefit.title}
            </h3>
            <div className="flex flex-col gap-5">
              {benefit.items.map((item) => (
                <p className="text-black/60 text-xl items-center inline-flex dark:text-white/60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-green-400 mr-2 flex-shrink-0"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>

                  {item}
                </p>
              ))}
            </div>
          </div>
          <div
            className={`flex flex-col items-center ${
              idx % 2 !== 0 && "order-first"
            }`}
          >
            <Image
              src={benefit.image}
              alt="Backframe.js Anatomy"
              width={600}
              height={600}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
