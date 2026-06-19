import BottomNav from "@/components/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#FFF5F7] text-[#000000] min-h-screen pb-20">
      {children}
      <BottomNav />
    </div>
  );
}