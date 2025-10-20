import { Outlet, useNavigation } from "react-router";
import MainNavigation from "../components/MainNavigation";

export default function RootLayout() {
  return (
    <>
      <MainNavigation />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}
