import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Add this import
import App from "./App";

// 1. Create a theme
let theme = createTheme({
  typography: {
    fontFamily: "'Rubik', system-ui, Avenir, Helvetica, Arial, sans-serif",
    h1: { fontWeight: 700, fontSize: "3rem" },
    h2: { fontWeight: 600, fontSize: "2.5rem" },
    h3: { fontWeight: 600, fontSize: "2rem" },
    h4: { fontWeight: 600, fontSize: "1.75rem" },
    h5: { fontWeight: 600, fontSize: "1.5rem" },
    h6: { fontWeight: 600, fontSize: "1.25rem" },
    body1: { fontSize: "1rem" },
    body2: { fontSize: "0.875rem" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          margin: 0,
          background: "radial-gradient(circle, #1164ee 0%, #381daa 100%)",
          color: "#fff",
        },
      },
    },
  },
});

// 2. Make it responsive
theme = responsiveFontSizes(theme, { factor: 2 });

// 3. Wrap App inside BrowserRouter + ThemeProvider
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter> {/* ✅ Added Router here */}
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
