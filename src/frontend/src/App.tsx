import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AdminBar, { type AdminView } from "./components/AdminBar";
import AdminDashboard from "./components/AdminDashboard";
import AdminInbox from "./components/AdminInbox";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import SignInPage from "./components/SignInPage";
import StatusTracker from "./components/StatusTracker";
import Team from "./components/Team";
import Testimonials from "./components/Testimonials";
import Visit from "./components/Visit";
import { useIsCallerAdmin } from "./hooks/useQueries";

type View = "home" | "tracker" | AdminView | "signin";

function App() {
  const { isInitializing, identity } = useInternetIdentity();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [view, setView] = useState<View>("home");
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (!isInitializing) {
      queryClient.invalidateQueries();
    }
  }, [isAuthenticated, isInitializing, queryClient]);

  useEffect(() => {
    if (!isAdmin && (view === "inbox" || view === "dashboard")) {
      setView("home");
    }
  }, [isAdmin, view]);

  useEffect(() => {
    if (isAuthenticated && view === "signin") {
      setView("home");
    }
  }, [isAuthenticated, view]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (view === "signin" && !isAuthenticated) {
    return <SignInPage onBack={() => setView("home")} />;
  }

  if (view === "tracker") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header onOpenTracker={() => setView("tracker")} />
        <StatusTracker onBack={() => setView("home")} />
        <Footer onOwnerSignIn={() => setView("signin")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isAdmin && (
        <AdminBar
          view={view === "inbox" || view === "dashboard" ? view : "home"}
          onNavigate={(target) => setView(target)}
        />
      )}
      {isAdmin && view === "inbox" ? (
        <AdminInbox />
      ) : isAdmin && view === "dashboard" ? (
        <AdminDashboard />
      ) : (
        <>
          <Header onOpenTracker={() => setView("tracker")} />
          <main>
            <Hero />
            <Services />
            <Gallery />
            <Team />
            <Testimonials />
            <Visit />
          </main>
          <Footer onOwnerSignIn={() => setView("signin")} />
        </>
      )}
    </div>
  );
}

export default App;
