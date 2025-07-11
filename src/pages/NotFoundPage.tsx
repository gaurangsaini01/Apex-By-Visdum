import React from 'react';

const NotFoundPage: React.FC = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
        </div>
        
        <div className="error-code">404</div>
        
        <h1 className="error-title">Page Not Found</h1>
        
        <p className="error-description">
          Sorry, the page you are looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to continue browsing.
        </p>
        
        <div className="error-actions">
          <button className="btn btn-primary" onClick={handleGoHome}>
            Go to Homepage
          </button>
          <button className="btn btn-secondary" onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;