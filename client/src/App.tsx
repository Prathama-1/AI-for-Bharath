import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ClinicalUpload from "./pages/ClinicalUpload";
import Explanation from "./pages/Explanation";
import Eligibility from "./pages/Eligibility";
import PDFGeneration from "./pages/PDFGeneration";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/upload" component={ClinicalUpload} />
      <Route path="/explanation" component={Explanation} />
      <Route path="/eligibility" component={Eligibility} />
      <Route path="/pdf" component={PDFGeneration} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <Router />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
