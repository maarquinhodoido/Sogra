import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Luxe Nails Atelier",
    short_name: "Luxe Nails",
    description: "Salão premium de unhas com marcação online e painel de administração completo.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8f5",
    theme_color: "#d8a7b4",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}