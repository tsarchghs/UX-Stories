import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "react-apollo": path.resolve(__dirname, "src/lib/reactApolloCompat.jsx"),
      "react-event-listener": path.resolve(__dirname, "src/lib/reactEventListenerCompat.jsx"),
      "react-facebook-login": path.resolve(__dirname, "src/lib/facebookLoginCompat.jsx"),
      "react-ga": path.resolve(__dirname, "src/lib/reactGaCompat.js"),
      "react-google-login": path.resolve(__dirname, "src/lib/googleLoginCompat.jsx"),
      "react-stripe-elements": path.resolve(__dirname, "src/lib/stripeElementsCompat.jsx"),
      recompose: path.resolve(__dirname, "src/lib/recomposeCompat.js")
    }
  }
});
