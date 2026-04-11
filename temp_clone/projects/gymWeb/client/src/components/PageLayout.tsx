import Navigation from "@/components/Navigation";

/**
 * PageLayout wraps every non-Home page to apply the correct
 * xl:pl-64 left offset so content is never hidden behind the sidebar.
 */
export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white xl:pl-64 flex flex-col overflow-x-hidden">
      <Navigation />
      {children}
    </div>
  );
}
