// src/ipInput.jsx
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './ipInput.css';
const IPInput = () => {
    const [ip, setIp] = useState('');

    useEffect(() => {
        window.api.getTargetIP().then((currentIP) => {
            setIp(currentIP);
        });
    }, []);

    const handleSave = () => {
        if (ip.trim()) {
            window.api.setTargetIP(ip.trim());
            window.close(); // Close the window after saving.
        }
    };

    const handleCancel = () => {
        window.close();
    };

    return (
        <div className="no-scrollbar ip-input" style={{ fontFamily: 'sans-serif' }}>
            <input
                className='no-drag'
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="8.8.8.8"
                style={{ width: '100%', padding: '5px', fontSize: '14px' }}
            />
            <button onClick={handleSave} style={{ marginTop: '10px', padding: '5px', fontSize: '14px' }}>
                Save
            </button>
            <button onClick={handleCancel} style={{ marginTop: '10px', padding: '5px', fontSize: '14px' }}>
                Cancel
            </button>
        </div>

    );
};

const container = document.getElementById('ip-root');
const root = createRoot(container);
root.render(<IPInput />);
