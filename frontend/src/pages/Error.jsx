import { useRouteError } from "react-router";
import MainNavigation from "../components/Navigation";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "An error occurred!";
  let message = "Something went wrong";

  if (error.status === 500) {
    message = error.message;
  }

  if (error.status === 404) {
    title = "Not found!";
    message = "Could not find resource or page.";
  }

  return (
    <>
      <MainNavigation />
      <main className="main-content">
        <div className="text-center">
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
      </main>
    </>
  );
}
