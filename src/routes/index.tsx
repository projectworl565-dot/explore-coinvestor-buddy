import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import referenceMarkup from "../reference.html?raw";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "vvEntra · Venture Intelligence Marketplace" },
      { name: "description", content: "Explore the vvEntra private venture intelligence marketplace: live deal flow, sector demand, curated opportunities, and market signals." },
      { property: "og:title", content: "vvEntra · Venture Intelligence Marketplace" },
      { property: "og:description", content: "Explore live deal flow, sector demand, curated opportunities, and market signals on vvEntra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    // The supplied reference uses hash navigation. Open its intelligence
    // terminal by default, while preserving direct links to its other views.
    const savedTheme = window.localStorage.getItem("vve-theme");
    document.documentElement.setAttribute("data-theme", savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    document.documentElement.setAttribute("data-role", window.localStorage.getItem("vve-role") || "investor");
    if (!window.location.hash) window.history.replaceState(null, "", "#dashboard");
    const existing = document.getElementById("vventra-interactions");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "vventra-interactions";
      script.src = "/vventra.js";
      document.body.appendChild(script);
    }
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: referenceMarkup }} />;
}