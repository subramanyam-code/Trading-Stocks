import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTrading } from '@/contexts/TradingContext';
import LoginModal from './LoginModal';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { profile } = useTrading();
  const [showLoginModal, setShowLoginModal] = React.useState(!profile.isAuthenticated);

  React.useEffect(() => {
    setShowLoginModal(!profile.isAuthenticated);
  }, [profile.isAuthenticated]);

  if (!profile.isAuthenticated) {
    return (
      <>
        {children}
        <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
