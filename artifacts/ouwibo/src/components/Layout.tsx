import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-border mt-8">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-muted-foreground">
          <span className="font-semibold text-foreground">OuwiboCloud</span>
          <div className="flex gap-4">
            <a href="/airdrops" className="hover:text-foreground">Airdrops</a>
            <a href="/news" className="hover:text-foreground">News</a>
            <a href="/admin" className="hover:text-foreground">Write</a>
          </div>
          <span>© {new Date().getFullYear()} OuwiboCloud · Not financial advice</span>
        </div>
      </footer>
    </div>
  );
}
