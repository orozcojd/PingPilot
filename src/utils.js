export const determineStatus = (alive, latency) => {
    // If the connection is down or latency is not available, return 'red'.
    if (!alive || latency === null || latency === undefined) {
        return 'red';
    }
    // Otherwise, check the latency thresholds.
    if (latency < 50) {
        return 'green';
    } else if (latency < 200) {
        return 'yellow';
    } else {
        return 'red';
    }
}
