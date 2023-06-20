import CustomNavbar from '@/src/components/Navbar';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <div className="flex relative z-50 mr-1">
        <CustomNavbar />
      </div>
      <main className="h-full flex-1 overflow-y-scroll">{children}</main>
    </div>
  );
}
