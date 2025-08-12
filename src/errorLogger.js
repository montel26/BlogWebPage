// src/errorLogger.js
const errorLogger = (() => {
    // 1) In-memory store
    const logs = [];
    // track how many we've already sent
    let lastSentIndex = 0;

    // 2) Send *only new* logs to parent
    function postNewToParent() {
        if (window.parent && window.parent !== window) {
            const newLogs = logs.slice(lastSentIndex);
            if (newLogs.length > 0) {
                window.parent.postMessage(
                    { type: 'REACT_ERROR_LOGS', payload: newLogs },
                    '*' // lock this down in prod!
                );
                lastSentIndex = logs.length;
            } else {
                window.parent.postMessage(
                    { type: 'REACT_ERROR_LOGS', payload: null },
                    '*' // lock this down in prod!
                );
            }
        }
    }

    // 3) Normalize and record an Error
    function recordError({ message, file, line, column, stack }) {
        logs.push({
            message,
            file,
            line,
            column,
            stack,
            timestamp: new Date().toISOString(),
        });
    }

    // 4) Capture global errors
    window.onerror = (message, source, lineno, colno, errorObj) => {
        recordError({
            message: message?.toString(),
            file: source,
            line: lineno,
            column: colno,
            stack: errorObj?.stack,
        });
        return false; // let browser default handler run too
    };

    // 5) Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const err = event.reason instanceof Error
            ? event.reason
            : new Error(
                typeof event.reason === 'string'
                    ? event.reason
                    : JSON.stringify(event.reason)
            );
        recordError({
            message: err.message,
            file: err.fileName || '',
            line: err.lineNumber || 0,
            column: err.columnNumber || 0,
            stack: err.stack,
        });
    });

    // 6) On full page load, send everything in one batch
    window.addEventListener('load', () => {
        // 6b) After 4 seconds, if the React root is still empty, send *only* any new logs
        setTimeout(() => {
            // const root = document.getElementById('root');
            // if (!root || root.childElementCount === 0) {
                postNewToParent();
            // }
        }, 4000);
    });

    // 7) Expose logs if needed
    return { logs };
})();

export default errorLogger;
