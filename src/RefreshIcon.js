import React from 'react';

function RefreshIcon({ onClick, className = '' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`refresh-icon ${className}`}
        >
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.35-.45 2.59-1.21 3.57l1.46 1.46C19.05 15.54 20 13.85 20 12c0-4.42-3.58-8-8-8zm-6.71 2.88L3.88 5.29C2.54 6.78 2 8.33 2 10c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.01.28-1.96.79-2.88z" />
            </svg>
        </button>
    );
}

export default RefreshIcon;
