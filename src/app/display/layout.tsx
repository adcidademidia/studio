export default function DisplayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent">
      {children}
    </div>
  );
}
