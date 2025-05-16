
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MigrationsList = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Automatically redirect to the setup page
    navigate('/app/setup');
  }, [navigate]);

  return (
    <div className="container px-4 py-8">
      <div className="text-center">
        Redirecting to migration setup...
      </div>
    </div>
  );
};

export default MigrationsList;
