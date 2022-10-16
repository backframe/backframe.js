import {
  IconBell,
  IconChevronRight,
  IconCode,
  IconDashboard,
  IconDatabase,
  IconEyeglass,
  IconFolder,
  IconPlug,
  IconReportAnalytics,
  IconSearch,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons";
import clsx from "clsx";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function App() {
  const links = [
    {
      title: "Overview",
      icon: (props: any) => <IconDashboard {...props} />,
      link: "/app/overview",
    },
    {
      title: "Analytics",
      icon: (props: any) => <IconReportAnalytics {...props} />,
      link: "/app/analytics",
    },
    {
      title: "Authentication",
      icon: (props: any) => <IconUserCircle {...props} />,
      link: "/app/auth",
    },
    {
      title: "Database",
      icon: (props: any) => <IconDatabase {...props} />,
      link: "/app/database",
    },
    {
      title: "Resources",
      icon: (props: any) => <IconCode {...props} />,
      link: "/app/resources",
    },
    {
      title: "Storage",
      icon: (props: any) => <IconFolder {...props} />,
      link: "/app/storage",
    },
    {
      title: "Plugins",
      icon: (props: any) => <IconPlug {...props} />,
      link: "/app/plugins",
    },
  ];

  const location = useLocation();

  return (
    <main className="flex justify-between bg-white dark:bg-black text-slate-900 dark:text-slate-100">
      <aside className="hidden w-0 lg:flex lg:w-80 flex-col h-screen sticky top-0 border-r border-gray-300/60 dark:border-gray-800/60 ">
        <Link to="/" className="inline-flex gap-2 items-center p-5">
          <IconEyeglass size={35} className="text-purple-500" />
          <h1 className="font-medium text-3xl">backframe</h1>
        </Link>
        <section className="px-5">
          {links.map((link, idx) => {
            return (
              <Link to={link.link} key={idx}>
                <div
                  className={clsx(
                    "p-3 w-full rounded-md inline-flex gap-4 hover:bg-gray-200 dark:hover:bg-gray-900 items-center",
                    location?.pathname.includes(link.link) &&
                      "bg-gray-200 dark:bg-gray-900"
                  )}
                >
                  <link.icon size={25} />
                  <span>{link.title}</span>
                </div>
              </Link>
            );
          })}
        </section>
        <div className="absolute bottom-0 border-t border-gray-300/60 dark:border-gray-800/60 flex w-full p-3 items-center gap-3">
          <IconUserCircle size={50} stroke={1} />
          <div>
            <h1>Victor Ndaba</h1>
            <span className="text-sm text-slate-300">Logged in as Admin</span>
          </div>
        </div>
      </aside>
      <section className="w-full">
        <header className="flex justify-between items-center px-10 pt-7">
          <div className="inline-flex gap-1 items-center text-black/80 dark:text-white/70">
            <span>Dashboard</span>
            {location.pathname
              .replace("app", "")
              .split("/")
              .filter((p) => p.length > 0)
              .map((p) => {
                return (
                  <div className="inline-flex items-center gap-1">
                    <IconChevronRight size={18} />
                    <span className="capitalize">{p}</span>
                  </div>
                );
              })}
          </div>
          <div className="inline-flex gap-7 items-center">
            <IconSearch size={25} />
            <IconBell size={25} />
            <IconSettings size={25} />
          </div>
        </header>
        <div>
          <Outlet />
        </div>
      </section>
    </main>
  );
}
