import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-lg mx-auto pb-20 pt-2">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
