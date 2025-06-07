import InscriptionNavbar from '@/components/InscriptionNavbar';
import HydrationFix from '@/components/common/HydrationFix';

export default function InscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="inscription-layout">
      <HydrationFix />
      <InscriptionNavbar />
      <main>
        {children}
      </main>
    </div>
  );
} 