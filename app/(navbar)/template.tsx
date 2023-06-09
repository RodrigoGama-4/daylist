'use client';
import CustomNavbar from '@/src/components/navbar';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="position-fixed">
        <CustomNavbar />
      </div>
      {children}
    </>
  );
}

/** Todas as sub-rotas compartilham deste template
 *
 * Os parênteses significam que o router vai ignorar essa pasta
 * e não tratá-la como uma nova rota, apenas como grupo
 *
 * A intenção é impedir que a navbar apareça em outras rotas,
 * e apareça apenas nas subpastas (rotas) desta
 */
