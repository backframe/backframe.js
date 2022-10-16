export default function Metrics() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="max-w-lg text-center text-lg pt-10">
        You have not enabled metrics for this project. To do so, run the command
        `<span>bf add metrics</span>` and then restart the server.
      </h1>
    </div>
  );
}
