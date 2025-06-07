import InscriptionNavbar from '@/components/common/NavBarInscription';
import HydrationFix from '@/components/common/HydrationFix';
import Footer from '@/components/common/Footer';
import styles from './styles/layout.module.scss';

export default function InscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.inscriptionLayout}>
      <HydrationFix />
      <InscriptionNavbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
} 