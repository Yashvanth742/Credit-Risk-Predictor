const form = document.querySelector("#riskForm");
const button = document.querySelector("#analyzeButton");
const buttonText = document.querySelector("#buttonText");
const spinner = document.querySelector("#loadingSpinner");
const errorBox = document.querySelector("#errorBox");
const emptyState = document.querySelector("#emptyState");
const resultState = document.querySelector("#resultState");
const newAssessment = document.querySelector("#newAssessment");
const riskGauge = document.querySelector("#riskGauge");
const scaleMarker = document.querySelector("#scaleMarker");
const scaleThreshold = document.querySelector("#scaleThreshold");
const API_URL = "https://credit-risk-predictor-rem3.onrender.com";

const presets = {
  steady: {
    person_age: 34,
    person_income: 72000,
    person_home_ownership: "MORTGAGE",
    person_emp_length: 7,
    loan_intent: "PERSONAL",
    loan_grade: "B",
    loan_amnt: 10000,
    loan_int_rate: 10.5,
    loan_percent_income: 0.14,
    cb_person_default_on_file: "N",
    cb_person_cred_hist_length: 11,
  },
  watch: {
    person_age: 27,
    person_income: 36000,
    person_home_ownership: "RENT",
    person_emp_length: 2,
    loan_intent: "DEBTCONSOLIDATION",
    loan_grade: "D",
    loan_amnt: 12500,
    loan_int_rate: 17.8,
    loan_percent_income: 0.35,
    cb_person_default_on_file: "Y",
    cb_person_cred_hist_length: 4,
  },
};

for (const presetButton of document.querySelectorAll("[data-preset]")) {
  presetButton.addEventListener("click", () =>
    fillForm(presets[presetButton.dataset.preset]),
  );
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setLoading(true);
  errorBox.hidden = true;

  const formData = new FormData(form);
  const payload = {
    person_age: Number(formData.get("person_age")),
    person_income: Number(formData.get("person_income")),
    person_home_ownership: formData.get("person_home_ownership"),
    person_emp_length: Number(formData.get("person_emp_length")),
    loan_intent: formData.get("loan_intent"),
    loan_grade: formData.get("loan_grade"),
    loan_amnt: Number(formData.get("loan_amnt")),
    loan_int_rate: Number(formData.get("loan_int_rate")),
    loan_percent_income: Number(formData.get("loan_percent_income")),
    cb_person_default_on_file: formData.get("cb_person_default_on_file"),
    cb_person_cred_hist_length: Number(
      formData.get("cb_person_cred_hist_length"),
    ),
  };

  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.detail || `Assessment failed (${response.status})`);
    displayResult(data);
  } catch (error) {
    errorBox.textContent = error.message.includes("Failed to fetch")
      ? "The local prediction service is offline. Start Uvicorn and try again."
      : error.message;
    errorBox.hidden = false;
  } finally {
    setLoading(false);
  }
});

newAssessment.addEventListener("click", () => {
  form.reset();
  resultState.hidden = true;
  emptyState.hidden = false;
  errorBox.hidden = true;
  window.scrollTo({
    top: document.querySelector("#assessment").offsetTop - 24,
    behavior: "smooth",
  });
});

function fillForm(values) {
  for (const [name, value] of Object.entries(values))
    form.elements[name].value = value;
  document
    .querySelector("#assessment")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

function setLoading(isLoading) {
  button.disabled = isLoading;
  spinner.hidden = !isLoading;
  buttonText.textContent = isLoading
    ? "Reading signals..."
    : "Run risk assessment";
}

function displayResult(data) {
  const probability = clamp(Number(data.default_probability), 0, 1);
  const threshold = clamp(Number(data.threshold), 0, 1);
  const isHighRisk = Number(data.default_prediction) === 1;
  const probabilityPercent = probability * 100;
  const thresholdPercent = threshold * 100;

  emptyState.hidden = true;
  resultState.hidden = false;
  document.querySelector("#probability").textContent =
    `${probabilityPercent.toFixed(1)}%`;
  document.querySelector("#metricProbability").textContent =
    `${probabilityPercent.toFixed(1)}%`;
  document.querySelector("#metricThreshold").textContent =
    `${thresholdPercent.toFixed(1)}%`;
  document.querySelector("#metricPrediction").textContent = isHighRisk
    ? "1 / HIGH"
    : "0 / LOW";

  const badge = document.querySelector("#riskBadge");
  badge.textContent = isHighRisk ? "HIGH RISK" : "LOW RISK";
  badge.className = `risk-badge ${isHighRisk ? "high" : "low"}`;
  document.querySelector("#riskMessage").textContent = isHighRisk
    ? "Above the model's decision threshold."
    : "Below the model's decision threshold.";
  document.querySelector("#summaryRisk").textContent = isHighRisk
    ? "High risk profile"
    : "Low risk profile";
  document.querySelector("#summaryCopy").textContent = isHighRisk
    ? "Review the application before proceeding."
    : "The current signals sit below the default threshold.";

  riskGauge.style.setProperty("--risk", `${probabilityPercent * 3.6}deg`);
  scaleMarker.style.left = `${probabilityPercent}%`;
  scaleThreshold.style.left = `${thresholdPercent}%`;
}

function clamp(value, minimum, maximum) {
  return Number.isFinite(value)
    ? Math.min(Math.max(value, minimum), maximum)
    : minimum;
}
