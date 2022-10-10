import { Link } from "react-router-dom";
import FormField from "~/components/FormField";

export function Register() {
  return (
    <main className="relative w-full flex min-h-[100vh] text-slate-900 bg-gray-100/40">
      <section className="mx-auto flex flex-col justify-center text-center w-[90%] md:w-[30%]">
        <Link
          to="/"
          className="flex items-center justify-center w-full scale-75 my-3"
        >
          <h1 className="font-bold text-4xl">Backframe</h1>
        </Link>
        <h1 className="font-signika text-4xl">Create an account</h1>
        <h5 className="text-lg">
          Or{" "}
          <Link to="/login" className="text-green-500">
            login instead
          </Link>
        </h5>

        <form className="bg-white mx-auto rounded-lg ring-1 ring-black ring-opacity-5 shadow-lg my-5 p-5 px-8 w-full">
          <FormField name="email" label="Email address" />
          <FormField name="password" label="Password" type="password" />
          <div className="flex justify-between mb-5">
            <span>
              <input type={"checkbox"} name="remember" /> Remember me
            </span>
            <Link to="/login" className="text-green-500">
              Forgot password
            </Link>
          </div>
          <button
            type="submit"
            className="btn w-full bg-green-600 text-white py-2"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
