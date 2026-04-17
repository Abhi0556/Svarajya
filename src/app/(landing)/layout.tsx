// Landing layout — marketing pages share this.
// No extra providers needed: LanguageProvider is already in the root layout.
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

