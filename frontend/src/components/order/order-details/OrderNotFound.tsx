import { Link } from "react-router-dom";

export function OrderNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-white px-6 py-24 sm:py-32 lg:px-8">
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        ORDER NOT ROUND
      </h1>
      <p className="mt-6 text-base leading-7 text-gray-600">
        Sorry, we couldn’t find the order you’re looking for.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          to="/"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
