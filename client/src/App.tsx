import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ClinicalUpload from "./pages/ClinicalUpload";
import Explanation from "./pages/Explanation";
import Eligibility from "./pages/Eligibility";
import PDFGeneration from "./pages/PDFGeneration";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/upload"} component={ClinicalUpload} />
      <Route path={"/explanation"} component={Explanation} />
      <Route path={"/eligibility"} component={Eligibility} />
      <Route path={"/pdf"} component={PDFGeneration} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Design Philosophy: Empathetic Healthcare Minimalism
 * - Light theme with soft, calming colors
 * - Medical blue (#0066CC) and sage green (#6B9E7F) palette
 * - Soft rounded corners and subtle shadows
 * - Reassuring animations and progressive disclosure
 */

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
