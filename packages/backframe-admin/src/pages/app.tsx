import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>The app wrapper</h1>
      <Outlet />
    </div>
  );
}
