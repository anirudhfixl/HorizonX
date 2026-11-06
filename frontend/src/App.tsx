import React from "react";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/app/providers";
import { router } from "@/app/router";

/**
 * HorizonX Application Root Component.
 * Establishes provider composition, state persistence across navigation,
 * smooth scrolling, and route coordination.
 */
export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;

