import React, { useEffect, useReducer, useState } from 'react';

import './index.css';
import RefreshIcon from './RefreshIcon';
import { determineStatus } from './utils';

// Define our action types
const ACTIONS = {
    SET_RESULT: 'set-result',
};

// Define the initial state for our reducer
const initialState = {
    latency: null,
    status: 'gray', // gray means undetermined
};

// Reducer function to update state based on latency
function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_RESULT: {
            const { alive, latency } = action.payload;
            const status = determineStatus(alive, latency);
            return { latency, status };
        }
        default:
            return state;
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [darkMode, setDarkMode] = useState(true);
    const handleToggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    const checkConnection = () => {
        window.api.checkConnection().then((result) => {
            // result is expected to be { alive: boolean, latency: number|null }
            dispatch({ type: ACTIONS.SET_RESULT, payload: result });
        });
    }
    // Poll the connection status every 5 seconds.
    useEffect(() => {
        checkConnection();
        const interval = setInterval(checkConnection, 59 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handler = (event, payload) => {
            console.log("MY handler called!")
            dispatch({ type: ACTIONS.SET_RESULT, payload });
        };

        window.api.onConnectionStatusUpdate(handler);

        return () => {
            window.api.removeConnectionStatusUpdate(handler);
        };
    }, []);

    // The indicator color comes directly from our state.status.
    const indicatorStyle = {
        backgroundColor: state.status,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        margin: '5px auto',
        border: '2px solid #333',
    };

    return (
        <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="header">
                <button className="dark-mode-toggle" onClick={handleToggleDarkMode}>
                    {darkMode ? 'Light' : 'Dark'}
                </button>
            </div>
            <div className="content">
                <div className="indicator" style={indicatorStyle}></div>
                <p>
                    <strong>Status:</strong> {state.status}
                </p>
                <p>
                    <strong>Latency (ms):</strong> {state.latency !== null ? state.latency : 'N/A'}
                </p>
                <RefreshIcon onClick={checkConnection} />
            </div>
        </div>
    );
}

export default App;
