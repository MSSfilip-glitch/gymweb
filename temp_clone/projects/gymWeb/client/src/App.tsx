import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import News from "./pages/News";
import Calendar from "./pages/Calendar";
import Contact from "./pages/Contact";
import Clubs from "./pages/Clubs";
import ResultsGallery from "./pages/ResultsGallery";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Rules from "./pages/Rules";
import Documents from "./pages/Documents";
import Exercises from "./pages/Exercises";

function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path={"/"} component={Home} />
      <Route path={"/vijesti"} component={News} />
      <Route path={"/kalendar"} component={Calendar} />
      <Route path={"/kontakt"} component={Contact} />
      <Route path={"/klubovi"} component={Clubs} />
      <Route path={"/rezultati"} component={ResultsGallery} />
      <Route path="/admin" component={Admin} />
      <Route path="/o-nama" component={About} />
      <Route path="/pravila" component={Rules} />
      <Route path="/dokumenti" component={Documents} />
      <Route path="/vjezbe" component={Exercises} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
