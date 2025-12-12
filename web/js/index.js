const API_SESSIONS_URL = "http://localhost:3000/sessions";
const API_STREAM_URL = "http://localhost:3000/stream";

// Elemen Sesi
const sessionsDataBody = document.getElementById("sessions-data-body");
const modeFilter = document.getElementById("mode-filter");
const errorMessageSessions = document.getElementById("error-message-sessions");

// Elemen Stream
const statusText = document.getElementById("connectionStatus");
const statusDot = document.getElementById("statusDot");

/* -----------------------------------
       FUNGSI UNTUK DATA SENSOR STREAM 
    -------------------------------------- */

const eventSource = new EventSource(API_STREAM_URL);

eventSource.onopen = function () {
  console.log("Koneksi SSE Terbuka");
  statusText.innerText = "Live Stream Aktif";
  statusDot.classList.add("status-active");
};

eventSource.onmessage = function (event) {
  const parsedData = JSON.parse(event.data);
  const sensorData = parsedData.data; // Struktur data Anda: { data: { ...sensor_data... } }

  console.log("Data diterima:", sensorData);

  // Update UI
  document.getElementById("busVoltage").innerText = sensorData.busVoltage || 0;
  document.getElementById("shuntVoltage").innerText =
    sensorData.shuntVoltage || 0;
  document.getElementById("loadVoltage").innerText =
    sensorData.loadVoltage || 0;
  document.getElementById("current").innerText = sensorData.current || 0;
  document.getElementById("power").innerText = sensorData.power || 0;

  if (sensorData.timestamp) {
    const date = new Date(sensorData.timestamp);
    document.getElementById("timestamp").innerText =
      date.toLocaleTimeString("id-ID"); // Tambahkan 'id-ID' untuk format waktu Indonesia
  }
};

eventSource.onerror = function (err) {
  console.error("EventSource failed:", err);
  statusText.innerText = "Koneksi Terputus / Reconnecting...";
  statusDot.classList.remove("status-active");
};

/* -----------------------------------
       FUNGSI UNTUK DATA SESI
    -------------------------------------- */

/**
 * Mengubah durasi string menjadi format yang lebih mudah dibaca
 */
function formatDuration(durationStr) {
  const parts = durationStr.split(":");
  if (parts.length === 3) {
    const secondsWithMs = parseFloat(parts[2]);
    const minutes = parseInt(parts[1], 10);
    const hours = parseInt(parts[0], 10);

    let display = "";
    if (hours > 0) display += `${hours}j `;
    if (minutes > 0) display += `${minutes}m `;
    display += `${secondsWithMs.toFixed(2)}d`;

    return display.trim();
  }
  return durationStr;
}

/**
 * Mengubah timestamp ISO menjadi format waktu lokal
 */
function formatTime(isoTime) {
  if (!isoTime) return "--";
  try {
    const date = new Date(isoTime);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (e) {
    return isoTime;
  }
}

/**
 * Mengambil data sesi dari API dengan filter mode yang dipilih.
 */
async function fetchSessions() {
  const selectedMode = modeFilter.value;
  let url = API_SESSIONS_URL;

  if (selectedMode) {
    url = `${API_SESSIONS_URL}?mode=${encodeURIComponent(selectedMode)}`;
  }

  sessionsDataBody.innerHTML =
    '<tr><td colspan="7" style="text-align: center;">Memuat data sesi...</td></tr>';
  errorMessageSessions.style.display = "none";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const sessions = await response.json();
    renderSessions(sessions);
  } catch (error) {
    console.error("Gagal mengambil data sesi:", error);
    sessionsDataBody.innerHTML = "";
    errorMessageSessions.innerText = `⚠️ Gagal memuat data sesi. Pastikan server berjalan di ${API_SESSIONS_URL}. Detail: ${error.message}`;
    errorMessageSessions.style.display = "block";
  }
}

/**
 * Merender data sesi ke dalam tabel HTML.
 */
function renderSessions(sessions) {
  sessionsDataBody.innerHTML = "";

  if (!Array.isArray(sessions) || sessions.length === 0) {
    sessionsDataBody.innerHTML =
      '<tr><td colspan="7" style="text-align: center;">Tidak ada data sesi yang ditemukan.</td></tr>';
    return;
  }

  sessions.forEach((session) => {
    const row = sessionsDataBody.insertRow();
    row.innerHTML = `
                    <td>${session.user_name || "Anonim"}</td>
                    <td>${session.mode || "--"}</td>
                    <td>${formatTime(session.start_time)}</td>
                    <td>${formatTime(session.end_time)}</td>
                    <td>${
                      session.duration_ms
                        ? session.duration_ms.toLocaleString()
                        : "--"
                    }</td>
                    <td>${formatDuration(
                      session.duration_str || "0:00:00.000000"
                    )}</td>
                `;
  });
}

// Panggil fungsi untuk memuat data sesi saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", fetchSessions);
