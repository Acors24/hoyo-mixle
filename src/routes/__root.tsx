import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import "../index.css";
import StorageProvider from "../StorageProvider";
import Navbar from "../components/Navbar/Navbar";
import React from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

export const Route = createRootRoute({
  component: () => (
    <>
      <StorageProvider>
        <div
          className="w-screen h-screen grid grid-cols-[auto_1fr] overflow-auto"
          style={{
            scrollbarColor: "rgb(255 255 255 / 0.2) rgb(255 255 255 / 0.1)",
            scrollbarWidth: "thin",
          }}
        >
          <Navbar />
          <Outlet />
        </div>
      </StorageProvider>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),

  notFoundComponent: () => (
    <div className="m-auto text-center">
      <h1 className="text-4xl">Route Not Found</h1>
      <Link to="/genshin-impact" className="text-2xl underline text-amber-300">
        Return to the default game
      </Link>
    </div>
  ),

  errorComponent: () => (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl">Oops, an error occurred.</h1>
      <p className="m-2">
        <button
          onClick={() => location.reload()}
          className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 duration-200"
        >
          Refresh the page.
        </button>{" "}
        If the error persists, try again later.
      </p>
    </div>
  ),
});
