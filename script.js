const API_POST_URL = "https://9uuzmgq5p3.execute-api.ap-south-1.amazonaws.com/dev/send";
const API_GET_URL = "https://9uuzmgq5p3.execute-api.ap-south-1.amazonaws.com/dev/latest";

// Send simulated machine data
async function sendData() {
    const payload = {
        machine_id: "machine01",
        temperature: Math.random() * 100,
        vibration: Math.random() * 2
    };

    try {
        const response = await fetch(API_POST_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        logEntry(result);
    } catch (err) {
        log("Error sending: " + err);
    }
}

// Fetch latest data from Lambda
async function fetchLatest() {
    try {
        const response = await fetch(API_GET_URL);
        const result = await response.json();
        logEntry(result);
    } catch (err) {
        log("Error fetching latest: " + err);
    }
}

// Display logs with anomaly detection coloring
function logEntry(data) {
    const logDiv = document.getElementById("log");
    const entryDiv = document.createElement("div");
    entryDiv.className = "log-entry";

    let statusHtml = "";
    if (data.anomaly) {
        statusHtml = `<span class="anomaly">⚠ Anomaly Detected: ${data.details.join(", ")}</span>`;
    } else {
        statusHtml = `<span class="normal">✅ Normal</span>`;
    }

    entryDiv.innerHTML = `
        <strong>Machine:</strong> ${data.machine_id}<br>
        <strong>Temperature:</strong> ${data.temperature.toFixed(2)}<br>
        <strong>Vibration:</strong> ${data.vibration.toFixed(2)}<br>
        <strong>Status:</strong> ${statusHtml}<br>
        <small>${data.timestamp || new Date().toISOString()}</small>
    `;

    logDiv.prepend(entryDiv); // newest on top
}

// Optional: simple text log for errors or messages
function log(msg) {
    const logDiv = document.getElementById("log");
    const p = document.createElement("div");
    p.textContent = msg;
    logDiv.prepend(p);
}

// Auto-poll every 5 seconds
setInterval(fetchLatest, 5000);
