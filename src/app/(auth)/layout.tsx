// Auth layout - minimal, no dashboard layout or sidebar
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
