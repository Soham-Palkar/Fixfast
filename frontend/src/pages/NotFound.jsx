import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-4xl font-extrabold">404</h1>
      <p className="mt-2 text-gray-600">Page not found</p>
      <Link className="inline-block mt-6 px-6 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition" to="/">
        Go Home
      </Link>
    </div>
  );
}
