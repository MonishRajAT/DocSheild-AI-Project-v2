/* ==========================================================================
   DocShield AI — app.js
   Handles: navigation, file selection/drag-drop, validation, API call to
   the FastAPI backend, and the upload -> preview -> analyzing -> result /
   error state machine.
   ========================================================================== */

(function () {
  "use strict";

  // ---------- Configuration ----------
  const API_BASE_URL = "http://127.0.0.1:8000";
  const PREDICT_ENDPOINT = `${API_BASE_URL}/api/predict`;
  const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
  const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB, UX guardrail only

  // ---------- Element references ----------
  const els = {
    navToggle: document.getElementById("navToggle"),
    mobileMenu: document.getElementById("mobileMenu"),

    dropzone: document.getElementById("dropzone"),
    fileInput: document.getElementById("fileInput"),
    uploadError: document.getElementById("uploadError"),

    stateUpload: document.getElementById("stateUpload"),
    statePreview: document.getElementById("statePreview"),
    stateResult: document.getElementById("stateResult"),
    stateErrorPanel: document.getElementById("stateErrorPanel"),

    previewImage: document.getElementById("previewImage"),
    scanLine: document.getElementById("scanLine"),
    fileName: document.getElementById("fileName"),
    fileDetails: document.getElementById("fileDetails"),
    analyzeBtn: document.getElementById("analyzeBtn"),
    changeFileBtn: document.getElementById("changeFileBtn"),
    analyzingLabel: document.getElementById("analyzingLabel"),

    resultImage: document.getElementById("resultImage"),
    resultVerdict: document.getElementById("resultVerdict"),
    resultIcon: document.getElementById("resultIcon"),
    resultLabel: document.getElementById("resultLabel"),
    resultConfidence: document.getElementById("resultConfidence"),
    resultMeterFill: document.getElementById("resultMeterFill"),
    resultProbability: document.getElementById("resultProbability"),
    resetBtn: document.getElementById("resetBtn"),

    errorMessage: document.getElementById("errorMessage"),
    errorRetryBtn: document.getElementById("errorRetryBtn"),

    year: document.getElementById("year"),
  };

  // ---------- App state ----------
  let selectedFile = null;
  let objectUrl = null;
  let isAnalyzing = false;

  // ==========================================================================
  // Navigation (mobile menu)
  // ==========================================================================
  function initNavbar() {
    els.navToggle.addEventListener("click", () => {
      const isOpen = els.mobileMenu.classList.toggle("is-open");
      els.navToggle.setAttribute("aria-expanded", String(isOpen));
      els.navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    els.mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        els.mobileMenu.classList.remove("is-open");
        els.navToggle.setAttribute("aria-expanded", "false");
        els.navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // ==========================================================================
  // State machine helpers
  // ==========================================================================
  function showState(name) {
    const map = {
      upload: els.stateUpload,
      preview: els.statePreview,
      result: els.stateResult,
      error: els.stateErrorPanel,
    };
    Object.values(map).forEach((el) => el.classList.remove("is-active"));
    map[name].classList.add("is-active");
  }

  function resetToUpload() {
    selectedFile = null;
    isAnalyzing = false;

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }

    els.fileInput.value = "";
    hideUploadError();
    els.analyzingLabel.hidden = true;
    els.analyzeBtn.disabled = false;
    els.analyzeBtn.textContent = "Analyze Document";
    els.scanLine.classList.remove("is-scanning");

    showState("upload");
    els.dropzone.focus();
  }

  // ==========================================================================
  // Validation
  // ==========================================================================
  function getExtension(filename) {
    const idx = filename.lastIndexOf(".");
    return idx === -1 ? "" : filename.slice(idx).toLowerCase();
  }

  function validateFile(file) {
    if (!file) {
      return "No file selected. Please choose a document image to continue.";
    }

    const extension = getExtension(file.name || "");
    const extensionOk = ALLOWED_EXTENSIONS.includes(extension);
    const mimeOk = file.type === "" || ALLOWED_MIME_TYPES.includes(file.type);

    if (!extensionOk || !mimeOk) {
      return "Unsupported file type. Please upload a JPG, JPEG, PNG, or WEBP image.";
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "This file is too large. Please upload an image under 15 MB.";
    }

    return null;
  }

  function showUploadError(message) {
    els.uploadError.textContent = message;
    els.uploadError.hidden = false;
  }

  function hideUploadError() {
    els.uploadError.hidden = true;
    els.uploadError.textContent = "";
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  // ==========================================================================
  // File selection -> preview
  // ==========================================================================
  function handleFileSelected(file) {
    const validationError = validateFile(file);

    if (validationError) {
      showUploadError(validationError);
      return;
    }

    hideUploadError();
    selectedFile = file;

    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);

    els.previewImage.src = objectUrl;
    els.previewImage.alt = `Preview of ${file.name}`;

    els.fileName.textContent = file.name;
    const extension = getExtension(file.name).replace(".", "").toUpperCase();
    els.fileDetails.textContent = `${extension} \u00b7 ${formatFileSize(file.size)}`;

    els.analyzingLabel.hidden = true;
    els.analyzeBtn.disabled = false;
    els.analyzeBtn.textContent = "Analyze Document";

    showState("preview");
  }

  function initDropzone() {
    els.dropzone.addEventListener("click", (e) => {
      // The input is inside the label; avoid double-triggering on label click.
      if (e.target === els.fileInput) return;
    });

    els.dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        els.fileInput.click();
      }
    });

    els.fileInput.addEventListener("change", () => {
      const file = els.fileInput.files && els.fileInput.files[0];
      if (file) handleFileSelected(file);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      els.dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        els.dropzone.classList.add("is-dragover");
      });
    });

    ["dragleave", "dragend"].forEach((eventName) => {
      els.dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        els.dropzone.classList.remove("is-dragover");
      });
    });

    els.dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      els.dropzone.classList.remove("is-dragover");

      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) handleFileSelected(file);
    });
  }

  // ==========================================================================
  // Analysis (API call)
  // ==========================================================================
  async function analyzeDocument() {
    if (isAnalyzing || !selectedFile) return;

    isAnalyzing = true;
    els.analyzeBtn.disabled = true;
    els.analyzeBtn.textContent = "Analyzing\u2026";
    els.analyzingLabel.hidden = false;
    els.scanLine.classList.add("is-scanning");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(PREDICT_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let detail = "";
        try {
          const errorBody = await response.json();
          detail = typeof errorBody.detail === "string" ? errorBody.detail : "";
        } catch (_) {
          /* response body wasn't JSON; ignore */
        }

        if (response.status === 400) {
          throw new Error(detail || "Unsupported file type. Please upload a JPG, JPEG, PNG, or WEBP image.");
        }
        if (response.status >= 500) {
          throw new Error("The analysis failed on the server. Please try a different image or try again shortly.");
        }
        throw new Error(detail || "Unable to analyze the document. Please try again.");
      }

      const data = await response.json();
      validateResponseShape(data);
      showResult(data);
    } catch (error) {
      handleAnalysisError(error);
    } finally {
      isAnalyzing = false;
      els.scanLine.classList.remove("is-scanning");
    }
  }

  function validateResponseShape(data) {
    const hasPrediction = data && typeof data.prediction === "string";
    const hasConfidence = data && typeof data.confidence === "number";
    const hasProbability = data && typeof data.probability === "number";

    if (!hasPrediction || !hasConfidence || !hasProbability) {
      throw new Error("Received an unexpected response from the server. Please try again.");
    }
  }

  function handleAnalysisError(error) {
    let message = "Unable to analyze the document. Please make sure the API server is running and try again.";

    if (error instanceof TypeError) {
      // fetch() throws a TypeError on network failure / CORS / server down.
      message = "Unable to reach DocShield AI. Please make sure the API server is running and try again.";
    } else if (error && error.message) {
      message = error.message;
    }

    els.errorMessage.textContent = message;
    showState("error");
  }

  // ==========================================================================
  // Result rendering
  // ==========================================================================
  function showResult(data) {
    const isGenuine = data.prediction.trim().toLowerCase() === "genuine";

    els.resultImage.src = objectUrl;
    els.resultImage.alt = `Analyzed document, classified as ${data.prediction}`;

    els.resultVerdict.classList.remove("result--genuine", "result--forged");
    els.resultVerdict.classList.add(isGenuine ? "result--genuine" : "result--forged");

    // textContent only — never render API values as HTML.
    els.resultLabel.textContent = data.prediction;

    const confidenceValue = clamp(data.confidence, 0, 100);
    els.resultConfidence.textContent = `${confidenceValue.toFixed(2)}%`;
    els.resultMeterFill.style.width = `${confidenceValue}%`;

    els.resultProbability.textContent = clamp(data.probability, 0, 1).toFixed(4);

    showState("result");
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  // ==========================================================================
  // Wire up buttons
  // ==========================================================================
  function initActions() {
    els.analyzeBtn.addEventListener("click", analyzeDocument);
    els.changeFileBtn.addEventListener("click", resetToUpload);
    els.resetBtn.addEventListener("click", resetToUpload);
    els.errorRetryBtn.addEventListener("click", () => {
      if (selectedFile) {
        showState("preview");
      } else {
        resetToUpload();
      }
    });
  }

  // ==========================================================================
  // Init
  // ==========================================================================
  function init() {
    els.year.textContent = String(new Date().getFullYear());
    initNavbar();
    initDropzone();
    initActions();
    showState("upload");
  }

  document.addEventListener("DOMContentLoaded", init);
})();