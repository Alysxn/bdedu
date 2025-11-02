import { ReactNode, useEffect, useState } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import Tutorial from "./Tutorial";
import { useTutorial } from "@/hooks/useTutorial";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { shouldShowTutorial, markTutorialCompleted } = useTutorial();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (shouldShowTutorial) {
      // Small delay to ensure the layout is rendered
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldShowTutorial]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    markTutorialCompleted();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
      <Tutorial open={showTutorial} onClose={handleCloseTutorial} />
    </div>
  );
};
