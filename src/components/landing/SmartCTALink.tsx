import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../lib/auth';

interface SmartCTALinkProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Tombol CTA yang cerdas:
 * - Sudah login  → /dashboard
 * - Belum login  → /register
 */
export default function SmartCTALink({ className, children }: SmartCTALinkProps) {
  const to = isAuthenticated() ? '/dashboard' : '/register';
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
