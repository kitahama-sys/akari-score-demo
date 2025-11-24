import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CompareEvaluations from "./pages/CompareEvaluations";
import Dashboard from "./pages/Dashboard";
import SelfEvaluation from "./pages/SelfEvaluation";
import Results from "./pages/Results";
import ManagerEvaluation from "./pages/ManagerEvaluation";
import ManagerEvaluationInput from "./pages/ManagerEvaluationInput";
import History from "./pages/History";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import ChangePassword from "./pages/ChangePassword";
import MVV from "./pages/MVV";
import Roadmap from "./pages/Roadmap";
import MemberRoadmaps from "./pages/MemberRoadmaps";
import MemberRoadmapView from "./pages/MemberRoadmapView";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/compare-evaluations"} component={CompareEvaluations} />
      <Route path={"/404"} component={NotFound} />
      <Route path={"/users"} component={UserManagement} />
      <Route path={"/change-password"} component={ChangePassword} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/self-evaluation"} component={SelfEvaluation} />
      <Route path={"/results"} component={Results} />
      <Route path={"/history"} component={History} />
      <Route path={"/manager-evaluation"} component={ManagerEvaluation} />
      <Route path={"/manager-evaluation/:userId"} component={ManagerEvaluationInput} />
      <Route path={"/mvv"} component={MVV} />
      <Route path={"/roadmap"} component={Roadmap} />
      <Route path={"/member-roadmaps"} component={MemberRoadmaps} />
      <Route path={"/member-roadmap/:userId"} component={MemberRoadmapView} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
