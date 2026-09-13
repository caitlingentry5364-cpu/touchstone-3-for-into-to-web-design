const helpOptions = [
  {
    value: "volunteer",
    title: "Volunteer",
    description: "Volunteer roles can include pet care, events, transportation, supplies, and community outreach.",
    nextStep: "Tell us when you are available and what type of volunteer work interests you."
  },
  {
    value: "foster",
    title: "Foster",
    description: "Foster families give rescue pets a temporary, calmer place to stay while they wait for adoption.",
    nextStep: "Share your availability and any experience you have caring for pets."
  },
  {
    value: "adoption",
    title: "Adoption Information",
    description: "Adoption starts with learning about a pet, asking questions, and finding a match that works for everyone.",
    nextStep: "Use the form to ask about adoption and tell us what kind of pet you are interested in."
  }
];

const validationMessages = {
  name: "Please enter at least 2 characters for your name.",
  email: "Please enter a valid email address.",
  interest: "Please choose an interest type.",
  availability: "Please enter at least 3 characters for your availability."
};

const storageKey = "tcarInterestForm";
const savedFieldIds = ["name", "email", "interest", "availability"];

function getHelpOption(value) {
  return helpOptions.find((option) => option.value === value);
}

function updateInterestDetails() {
  const interest = document.getElementById("interest");
  const details = document.getElementById("interest-details");
  if (!interest || !details) return;

  const option = getHelpOption(interest.value);
  if (!option) {
    details.hidden = true;
    details.innerHTML = "";
    return;
  }

  details.hidden = false;
  details.innerHTML = `<h3>${option.title}</h3><p>${option.description}</p><p><strong>Next step:</strong> ${option.nextStep}</p>`;
}

function saveFormData() {
  const data = {};
  savedFieldIds.forEach((id) => {
    const field = document.getElementById(id);
    if (field) data[id] = field.value;
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function restoreFormData() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    savedFieldIds.forEach((id) => {
      const field = document.getElementById(id);
      if (field && typeof data[id] === "string") field.value = data[id];
    });
    updateInterestDetails();
    const note = document.getElementById("saved-note");
    if (note) note.textContent = "Your saved information was restored from this browser.";
  } catch (error) {
    localStorage.removeItem(storageKey);
  }
}

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  if (!field || !error) return;
  field.classList.add("field-error");
  field.setAttribute("aria-invalid", "true");
  error.textContent = message;
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  if (!field || !error) return;
  field.classList.remove("field-error");
  field.removeAttribute("aria-invalid");
  error.textContent = "";
}

function validateForm(event) {
  event.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const interest = document.getElementById("interest");
  const availability = document.getElementById("availability");
  const status = document.getElementById("form-status");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  ["name", "email", "interest", "availability"].forEach(clearFieldError);
  let valid = true;

  if (name.value.trim().length < 2) {
    setFieldError("name", validationMessages.name);
    valid = false;
  }
  if (!emailPattern.test(email.value.trim())) {
    setFieldError("email", validationMessages.email);
    valid = false;
  }
  if (!interest.value) {
    setFieldError("interest", validationMessages.interest);
    valid = false;
  }
  if (availability.value.trim().length < 3) {
    setFieldError("availability", validationMessages.availability);
    valid = false;
  }

  if (!valid) {
    status.textContent = "Please fix the highlighted fields before sending the form.";
    status.className = "form-status error";
    const firstError = document.querySelector(".field-error");
    if (firstError) firstError.focus();
    return;
  }

  saveFormData();
  status.textContent = "Thanks! Your interest form is ready to send. For this class project, the information is saved in your browser instead of being sent to a server.";
  status.className = "form-status success";
}

function setupForm() {
  const form = document.getElementById("interest-form");
  const interest = document.getElementById("interest");
  if (!form || !interest) return;

  restoreFormData();
  interest.addEventListener("change", () => {
    updateInterestDetails();
    saveFormData();
  });

  savedFieldIds.forEach((id) => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener("input", () => {
        clearFieldError(id);
        saveFormData();
      });
    }
  });

  form.addEventListener("submit", validateForm);
}

document.addEventListener("DOMContentLoaded", setupForm);
