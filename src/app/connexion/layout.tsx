import InscriptionNavbar from '@/components/common/NavBarInscription';
import HydrationFix from '@/components/common/HydrationFix';
import Footer from '@/components/common/Footer';

export default function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HydrationFix />
      <InscriptionNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 