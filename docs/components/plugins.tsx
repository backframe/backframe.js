import {
  FingerprintIcon,
  LayoutDashboardIcon,
  UploadCloudIcon,
  UnplugIcon,
  MonitorSmartphoneIcon,
  LucideProps,
} from "lucide-react";
import { IconBrandGraphql } from "@tabler/icons-react";

export function Plugins() {
  const plugins = [
    {
      title: "@backframe/auth",
      description:
        "Authentication plugin for backframe.js. Enable social authentication, email/password authentication, and more on your server.",
      label: "development",
      icon: (p: LucideProps) => <FingerprintIcon {...p} />,
    },
    {
      title: "@backframe/admin",
      description:
        "Admin dashboard plugin for backframe.js. Manage your backend without writing any code.",
      label: "development",
      icon: (p: LucideProps) => <LayoutDashboardIcon {...p} />,
    },
    {
      title: "@backframe/storage",
      description:
        "Storage plugin for backframe.js. Manage file uploads and storage.",
      label: "development",
      icon: (p: LucideProps) => <UploadCloudIcon {...p} />,
    },
    {
      title: "@backframe/graphql",
      description:
        "GraphQL plugin for backframe.js. Enable GraphQL on your server.",
      label: "development",
      icon: (p: any) => <IconBrandGraphql {...p} />,
    },
    {
      title: "@backframe/sockets",
      description:
        "Sockets plugin for backframe.js. Enable realtime websocket connections for your server.",
      label: "development",
      icon: (p: LucideProps) => <MonitorSmartphoneIcon {...p} />,
    },
    {
      title: "@backframe/client-*",
      description:
        "Client libraries for backframe.js to connect to your backend from mobile and web apps in your preferred language.",
      label: "coming soon",
      icon: (p: LucideProps) => <UnplugIcon {...p} />,
    },
  ];

  return (
    <div className="flex my-20 gap-10 flex-col">
      <h2 className="text-3xl md:text-4xl font-semibold mb-3">
        Backframe.js has a cheatsheet - plugins!
      </h2>
      <p className="text-black/50 dark:text-white/50 text-xl mb-5 max-w-4xl !leading-relaxed">
        Plugins are a way to extend the functionality of backframe.js. They are
        at the heart of the framework and the foundation on which it is built.
        Whilst most official plugins are still in development, once familiar,
        you can already see their appeal. The "plugable" nature is what allows
        us to maintain simplicity and ease of use, whilst also allowing for a
        huge amount of flexibility and customizability. We are currently working
        on the following plugins:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        {plugins.map((plugin, index) => (
          <div
            key={plugin.title}
            className="flex flex-col items-center justify-between rounded-xl p-5 py-8 border border-gray-200/50 dark:border-gray-700/50 transition-colors hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
          >
            <div className="bg-gradient-to-bl from-orange-400 via-yellow-500 to-red-400 p-[1px] rounded-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/80 dark:bg-black/80">
                {plugin.icon({ className: "w-8 h-8" })}
              </div>
            </div>
            <h3 className="mt-6 mb-2 text-xl font-semibold text-center">
              {plugin.title}
            </h3>
            <p className="text-center text-gray-700/70 dark:text-gray-200/70">
              {plugin.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
