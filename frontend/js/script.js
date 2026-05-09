/* ================================
   BACKEND API URL
================================ */
const API_BASE = "https://YOUR-RENDER-URL.onrender.com";

/* ================================
   TAB SWITCHING
================================ */
function openTab(name, btn) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(name).classList.add('active');

    if (btn) btn.classList.add('active');
}

function openTabByName(name) {
    const btns = document.querySelectorAll('.tab-btn');
    const panels = ['home', 'noise', 'waste', 'bio', 'dashboard'];

    const idx = panels.indexOf(name);

    openTab(name, btns[idx]);
}

/* ================================
   NOISE PREDICTION
================================ */
async function predictNoise() {

    const noise_db = parseFloat(document.getElementById('noise-db').value) || 60;
    const traffic = parseFloat(document.getElementById('traffic').value) || 0;
    const zone = document.getElementById('zone-type').value;
    const time = document.getElementById('time-of-day').value;

    const zoneMap = {
        residential: "Residential",
        commercial: "Commercial",
        industrial: "Industrial",
        park: "Residential"
    };

    const timeMap = {
        morning: "Morning",
        day: "Afternoon",
        evening: "Evening",
        night: "Night"
    };

    const payload = {
        noise_db: noise_db,
        traffic_density: traffic,
        area_type: zoneMap[zone],
        time_of_day: timeMap[time]
    };

    const box = document.getElementById('noiseResult');

    box.innerHTML = `
        <div class="result-detail">
            Predicting...
        </div>
    `;

    box.classList.add('show');

    try {

        const res = await fetch(`${API_BASE}/predict_noise`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.error) throw new Error(data.error);

        let color;

        if (data.level === "Low") {
            color = "var(--accent)";
        } else if (data.level === "Medium") {
            color = "var(--accent3)";
        } else {
            color = "var(--warn)";
        }

        box.innerHTML = `
            <div class="result-level" style="color:${color}">
                ${data.level} — ${data.score}
            </div>

            <div class="result-detail">
                ML-based health risk prediction
            </div>

            <div class="result-action">
                Based on traffic, zone type, and time of day
            </div>
        `;

    } catch (err) {

        console.error(err);

        box.innerHTML = `
            <div class="result-level" style="color:var(--warn)">
                Error
            </div>

            <div class="result-detail">
                Backend not running or invalid input
            </div>
        `;
    }
}

/* ================================
   BIOREMEDIATION PREDICTION
================================ */
const bioData = {

    heavy_metals: {
        org: 'Geobacter sulfurreducens + Thlaspi caerulescens',
        method: 'Phytoremediation + microbial immobilization',
        time: {
            low: '3–6 months',
            medium: '8–14 months',
            high: '18–36 months'
        },
        notes: 'Maintain soil pH 6.0–7.0. Use chelating agents if needed.'
    },

    hydrocarbons: {
        org: 'Pseudomonas putida + Bacillus subtilis',
        method: 'In-situ biodegradation',
        time: {
            low: '1–3 months',
            medium: '4–8 months',
            high: '10–18 months'
        },
        notes: 'Ensure aeration for better degradation.'
    },

    pesticides: {
        org: 'Sphingomonas sp. + Trametes versicolor',
        method: 'Mycoremediation',
        time: {
            low: '4–8 months',
            medium: '10–18 months',
            high: '24–42 months'
        },
        notes: 'Maintain moisture and organic matter.'
    },

    nitrates: {
        org: 'Paracoccus denitrificans + Lemna minor',
        method: 'Denitrification',
        time: {
            low: '1–2 months',
            medium: '3–6 months',
            high: '8–12 months'
        },
        notes: 'Best in wetland conditions.'
    }
};

function predictBio() {

    const pollutant = document.getElementById('pollutant').value;
    const level = document.getElementById('contam-level').value;

    if (!pollutant) {
        alert('Please select a contaminant type.');
        return;
    }

    const d = bioData[pollutant];

    if (!d) {
        alert("Invalid pollutant selection");
        return;
    }

    const box = document.getElementById('bioResult');

    box.innerHTML = `
        <div class="result-level" style="color:var(--accent3)">
            Treatment Plan Ready
        </div>

        <div class="result-detail">
            <strong>Organisms:</strong> ${d.org}<br>
            <strong>Method:</strong> ${d.method}<br>
            <strong>Est. Recovery:</strong> ${d.time[level]}
        </div>

        <div class="result-action">
            ${d.notes}
        </div>
    `;

    box.classList.add('show');
}

/* ================================
   WASTE WISE
================================ */
let sampleItems = [];

/* Load items */
async function loadItems() {

    try {

        const res = await fetch(`${API_BASE}/get_items`);

        sampleItems = await res.json();

    } catch (err) {

        console.error("Error loading items:", err);
    }
}

loadItems();

/* Waste prediction */
async function predictWaste() {

    const itemInput = document.getElementById("wasteItem");
    const item = itemInput.value.trim();

    if (!item) {
        alert("Please enter an item");
        return;
    }

    const loader = document.getElementById("loader");
    const resultBox = document.getElementById("wasteResult");
    const detailEmpty = document.getElementById("detailEmpty");
    const detailContent = document.getElementById("detailContent");

    try {

        loader.style.display = "flex";

        resultBox.innerHTML = "";

        const res = await fetch(`${API_BASE}/predict_waste`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                item: item
            })
        });

        const data = await res.json();

        loader.style.display = "none";

        if (data.error) {
            resultBox.innerHTML = `<span style="color:red">${data.error}</span>`;
            return;
        }

        if (detailEmpty) detailEmpty.style.display = "none";
        if (detailContent) detailContent.style.display = "block";

        /* Item Name */
        const itemNameEl = document.getElementById("itemName");

        if (itemNameEl) {
            itemNameEl.innerText = data.matched_item || item;
        }

        /* Emoji */
        const emojiEl = document.getElementById("detailEmoji");

        if (emojiEl) {

            emojiEl.innerText =
                data.category === "wet" ? "🌿" :
                data.category === "dry" ? "📦" :
                data.category === "hazardous" ? "⚠️" :
                data.category === "ewaste" ? "💻" :
                "♻️";
        }

        /* Category */
        const categoryEl = document.getElementById("category");

        if (categoryEl) {
            categoryEl.innerText = data.category;
            categoryEl.className = "cat-tag " + data.category.toLowerCase();
        }

        /* Description */
        const descEl = document.getElementById("description");

        if (descEl) {
            descEl.innerText = data.description || "No description available";
        }

        /* Impact */
        const impactEl = document.getElementById("impactMeter");

        if (impactEl) {

            impactEl.innerHTML = `
                <div class="impact-row">
                    <span>Impact Level:</span>

                    <span style="color:var(--accent)">
                        ${data.impact || "Moderate"}
                    </span>
                </div>
            `;
        }

        /* Recommendations */
        const recList = document.getElementById("recommendations");

        if (recList) {

            recList.innerHTML = "";

            if (data.recommendations && data.recommendations.length > 0) {

                data.recommendations.forEach((rec, index) => {

                    const li = document.createElement("li");

                    li.className = "step";

                    li.innerHTML = `
                        <span class="step-num">
                            0${index + 1}
                        </span>

                        <div>
                            <div class="step-text">
                                ${index === 0 ? "⭐ " : ""}
                                ${rec.method}
                            </div>

                            <div class="step-tag">
                                ${index === 0 ? "Most Recommended" : "Alternative Option"}
                            </div>
                        </div>
                    `;

                    recList.appendChild(li);
                });

            } else {

                recList.innerHTML = `
                    <li>No recommendations available</li>
                `;
            }
        }

        resultBox.innerHTML = `
            <div style="font-size:13px;color:var(--muted)">
                You searched: <b>${item}</b>
            </div>
        `;

    } catch (error) {

        loader.style.display = "none";

        resultBox.innerHTML = `
            <span style="color:red">
                Server error. Try again.
            </span>
        `;

        console.error("Error:", error);
    }
}

/* Suggestions */
function hideSuggestions() {

    setTimeout(() => {

        const box = document.getElementById("suggestions");

        box.style.display = "none";

    }, 200);
}

function showSuggestions() {

    const input = document.getElementById("wasteItem").value.toLowerCase();

    const box = document.getElementById("suggestions");

    box.innerHTML = "";

    if (!input) {
        box.style.display = "none";
        return;
    }

    const filtered = sampleItems
        .filter(item => item.toLowerCase().includes(input))
        .slice(0, 6);

    filtered.forEach(item => {

        const div = document.createElement("div");

        div.innerText = item;

        div.onclick = () => {
            document.getElementById("wasteItem").value = item;
            box.style.display = "none";
        };

        box.appendChild(div);
    });

    box.style.display = "block";
}

/* ================================
   CHARTS
================================ */
document.addEventListener("DOMContentLoaded", () => {

    Chart.defaults.color = '#7d8590';
    Chart.defaults.font.family = 'DM Sans';

    /* Weekly Collection */
    const ctx1 = document.getElementById('collectionChart');

    if (ctx1) {

        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Waste (tons)',
                    data: [12, 15, 11, 18, 14, 9, 7]
                }]
            }
        });
    }

    /* Category Split */
    const ctx2 = document.getElementById('categoryChart');

    if (ctx2) {

        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Organic', 'Recyclable', 'General'],
                datasets: [{
                    data: [28, 32, 40]
                }]
            }
        });
    }

    /* Recycling Trend */
    const ctx3 = document.getElementById('recycleChart');

    if (ctx3) {

        new Chart(ctx3, {
            type: 'line',
            data: {
                labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
                datasets: [{
                    label: 'Recycling %',
                    data: [58, 62, 65, 68, 72, 78]
                }]
            }
        });
    }

    /* Noise Trend */
    const noiseChart = document.getElementById('noiseChart');

    if (noiseChart) {

        new Chart(noiseChart, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Noise Level',
                    data: [68, 74, 71, 76, 79, 65, 60],
                    borderColor: '#f85149',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    /* Waste Categories */
    const wasteChart = document.getElementById('wasteChart');

    if (wasteChart) {

        new Chart(wasteChart, {
            type: 'doughnut',
            data: {
                labels: ['Organic', 'Recyclable', 'Hazardous', 'E-Waste'],
                datasets: [{
                    data: [42, 28, 9, 11],
                    backgroundColor: ['#3fb950', '#58a6ff', '#f85149', '#d29922'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    /* Bioremediation */
    const bioChart = document.getElementById('bioChart');

    if (bioChart) {

        new Chart(bioChart, {
            type: 'bar',
            data: {
                labels: ['Andheri', 'Kurla', 'Dadar', 'Mulund', 'Thane'],
                datasets: [{
                    data: [82, 63, 74, 91, 57],
                    backgroundColor: '#58a6ff',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
});

/* ================================
   LIVE CLOCK
================================ */
setInterval(() => {

    const clock = document.getElementById('clock');

    if (clock) {

        clock.textContent =
            new Date().toLocaleTimeString('en-IN');
    }

}, 1000);
