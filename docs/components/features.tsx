export function Features() {
  const features = [
    {
      title: "Out of the box TypeScript support",
      description:
        "Read that again. No config required, no extra packages to install. Just get up and running writing TypeScript.",
    },
    {
      title: "File system based routing",
      description:
        "Create a file, and it becomes a route. Want to nest routes? Just create a folder. Methods are exported constants. It's that simple.",
    },
    {
      title: "Extensible plugin system",
      description:
        "Plugins extend the base functionality of the framework. Need to add a new feature? Just install a plugin. Want to create your own plugin? It's easy.",
    },
    {
      title: "Batteries included, but removable",
      description:
        "Backframe.js is designed to work out of the box, but it's also designed to be easily customizable. Write as much or as little code as you want.",
    },
    {
      title: "No boilerplate",
      description:
        "We go out of our way to get out of your way. No boilerplate, no config, no fuss. It's designed to be stupid simple to get started.",
    },
    {
      title: "Admin dashboard",
      description:
        "Backframe.js comes with a fully functional admin dashboard that allows you to make changes to your backend without writing any code.",
    },
    {
      title: "Powerful CLI",
      description:
        "Use the CLI to bootstrap new projects, run your server, manage your routes, add plugins, and much much more.",
    },
    {
      title: "Built on Express",
      description:
        "Under the hood, it's just Express. Just add TS support, intuitive routing, a powerful CLI, and a plugin system, and you have backframe.js.",
    },
    {
      title: "Type-safe validation",
      description:
        "Intuitive and easy-to-use type-safe input and output validation for all your methods using zod",
    },
  ];

  return (
    <div className="grid grid-cols-1 mb-10 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {features.map((feature) => (
        <div className="flex flex-col bg-black/10 dark:bg-white/10 rounded-lg shadow-lg p-8">
          <h3 className="text-xl mb-3 font-semibold">{feature.title}</h3>
          <p className="text-black/60 dark:text-white/60">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
