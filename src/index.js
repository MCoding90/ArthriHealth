import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase-Config";

initializeApp(firebaseConfig);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
