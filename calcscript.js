const display = document.getElementById("display");

let currentInput = "0";
let resetNext = false;

function copyToClipboard() {
  if (currentInput !== "Error") {
    navigator.clipboard.writeText(currentInput);
    display.classList.add("copied");

    setTimeout(() => {
      display.classList.remove("copied");
    }, 800);
  }
}

function updateDisplay() {
  display.textContent = currentInput;
  display.classList.toggle("shrink", currentInput.length > 12);
}

function appendNumber(number) {
  if (currentInput === "0" || resetNext) {
    currentInput = number;
    resetNext = false;
  } else {
    currentInput += number;
  }
  updateDisplay();
}

function appendOperator(operator) {
  if (resetNext) resetNext = false;

  // Prevent multiple operators in a row
  if (/[+\-*/%]$/.test(currentInput)) {
    currentInput = currentInput.slice(0, -1) + operator;
  } else {
    currentInput += operator;
  }
  updateDisplay();
}

function appendDecimal() {
  const lastPart = currentInput.split(/[\+\-\*\/%]/).pop();
  if (!lastPart.includes(".")) {
    currentInput += ".";
    updateDisplay();
  }
}

function clearDisplay() {
  currentInput = "0";
  resetNext = false;
  updateDisplay();
}

function deleteLast() {
  if (resetNext) {
    clearDisplay();
    return;
  }

  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
  updateDisplay();
}

function calculate() {
  try {
    // Basic validation: no invalid endings, no double operators
    if (/[^0-9)]$/.test(currentInput) || /[+\-*/%]{2,}/.test(currentInput)) {
      throw new Error("Invalid expression");
    }

    const result = Function('"use strict";return (' + currentInput + ')')();
    
    if (!isFinite(result)) {
      throw new Error("Math error");
    }

    currentInput = result.toString();
    resetNext = true;
  } catch (err) {
    currentInput = "Error";
    resetNext = true;
  }
  updateDisplay();
}


updateDisplay();

//Adding keyboard interactivity
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (/\d/.test(key)) {
    appendNumber(key);
  } else if (["+", "-", "*", "/", "%"].includes(key)) {
    appendOperator(key);
  } else if (key === "." || key === ",") {
    appendDecimal();
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();  // Prevent form submission (just in case)
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key.toLowerCase() === "c") {
    clearDisplay();
  }

  const button = document.querySelector(`[data-key="${key}"]`);
  if (button) {
    button.classList.add("pressed");
    setTimeout(() => {
      button.classList.remove("pressed");
    }, 150);
  }
});

