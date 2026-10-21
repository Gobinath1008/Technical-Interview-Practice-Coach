import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function ErrorMessage({ message, details, onRetry, onDismiss }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <div className="error-banner-content">
        <div className="error-icon-box">
          <AlertTriangle size={20} className="error-icon" />
        </div>
        <div className="error-text-box">
          <div className="error-title-row">
            <h4 className="error-title">Evaluation Request Failed</h4>
            {details && (
              <button
                type="button"
                className="error-toggle-btn"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? (
                  <>Hide Technical Details <ChevronUp size={14} /></>
                ) : (
                  <>Show Technical Details <ChevronDown size={14} /></>
                )}
              </button>
            )}
          </div>
          <p className="error-message">{message}</p>
          {showDetails && details && (
            <pre className="error-details-pre">
              <code>{typeof details === 'object' ? JSON.stringify(details, null, 2) : String(details)}</code>
            </pre>
          )}
        </div>
      </div>

      <div className="error-actions">
        {onRetry && (
          <button type="button" className="error-retry-btn" onClick={onRetry}>
            <RefreshCw size={14} /> Retry
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="error-dismiss-btn"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            <XCircle size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

