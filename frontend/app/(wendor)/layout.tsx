// Route group (no URL segment) wrapping her original sections:
// transactions/*, commerce/*, billing/*, support/*.
//
// She previously rendered her own <Sidebar /> here; that's now folded
// into the single combined AppShell sidebar (components/shell/AppShell.tsx),
// per the "one combined sidebar" decision. This layout's only job is to
// re-apply her exact dark "depot console" theme (background, selection,
// focus ring, console-label typography) to this section only, via the
// .wendor-scope class in globals.css, so her screens still look exactly
// like they did in her own repo.
export default function WendorSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wendor-scope font-sans -mx-4 -my-6 min-h-[calc(100vh-3.5rem)] px-4 py-6 sm:-mx-6 sm:px-6">
      {children}
    </div>
  );
}
