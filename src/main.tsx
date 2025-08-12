import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialise the DesignVerse bridge early so that it can start polling for
// routes and accept edit-mode commands even before React finishes mounting.
createRoot(document.getElementById("root")!).render(<App />);
