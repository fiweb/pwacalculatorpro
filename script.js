// Wait for the DOM to be fully loaded before running any code
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the proportion calculator elements
  const calculateButton = document.getElementById("calculate");
  const resetButton = document.getElementById("reset");
  const aInput = document.getElementById("a");
  const bInput = document.getElementById("b");
  const cInput = document.getElementById("c");
  const dInput = document.getElementById("d");

  // Add click event listener to the calculate button
  calculateButton.addEventListener("click", function () {
    // Get the current values from the proportion calculator inputs
    const a = aInput.value;
    const b = bInput.value;
    const c = cInput.value;
    const d = dInput.value;

    // Logic for the proportion calculator
    // Checks which input contains 'x' and calculates the missing value
    if (a === "x" || a === "X") {
      // If 'a' is the unknown, calculate it using: a = (b*c)/d
      aInput.value = ((b * c) / d).toFixed(1);
    } else if (b === "x" || b === "X") {
      // If 'b' is the unknown, calculate it using: b = (a*d)/c
      bInput.value = ((a * d) / c).toFixed(1);
    } else if (c === "x" || c === "X") {
      // If 'c' is the unknown, calculate it using: c = (a*d)/b
      cInput.value = ((a * d) / b).toFixed(1);
    } else if (d === "x" || d === "X") {
      // If 'd' is the unknown, calculate it using: d = (b*c)/a
      dInput.value = ((b * c) / a).toFixed(1);
    }
  });

  // Add click event listener to the reset button
  resetButton.addEventListener("click", function () {
    // Clear all input fields in the proportion calculator
    aInput.value = "";
    bInput.value = "";
    cInput.value = "";
    dInput.value = "";
  });

  // Dark/Light Theme Toggle
  const themeToggleButton = document.getElementById("theme-toggle-button");
  const body = document.body;
  const themeIconContainer = themeToggleButton.querySelector(
    ".theme-icon-container"
  );

  // Check for saved theme preference or system preference
  const storedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  // Function to update the theme icon based on current theme
  function setThemeIcon(theme) {
    if (theme === "dark") {
      // Set the icon to sun for dark mode (to switch to light)
      themeIconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" data-replit-metadata="client/src/components/ui/theme-toggle.tsx:18:10" data-component-name="Sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;
    } else {
      // Set the icon to moon for light mode (to switch to dark)
      themeIconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" data-replit-metadata="client/src/components/ui/theme-toggle.tsx:19:10" data-component-name="Moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;
    }
  }

  // Apply the stored theme when the page loads
  if (storedTheme) {
    body.classList.add(storedTheme);
    setThemeIcon(storedTheme);
  }

  // Add click event listener to the theme toggle button
  themeToggleButton.addEventListener("click", function () {
    // Toggle the dark class on the body element
    body.classList.toggle("dark");
    // Get the current theme after toggling
    let theme = body.classList.contains("dark") ? "dark" : "light";
    // Save the theme preference to localStorage
    localStorage.setItem("theme", theme);
    // Update the theme icon
    setThemeIcon(theme);
  });

  // Mobile Calculator Toggle
  const calculatorToggleButton = document.getElementById(
    "calculator-toggle-button"
  );
  const calculatorContainer = document.querySelector(".calculator-container");

  // Add click event listener to the calculator toggle button
  calculatorToggleButton.addEventListener("click", function () {
    // Toggle the 'active' class on the calculator container
    calculatorContainer.classList.toggle("active");
    // Update display style based on the active state
    if (calculatorContainer.classList.contains("active")) {
      calculatorContainer.style.display = "block";
    } else {
      calculatorContainer.style.display = "none";
    }
  });

  // Handle responsive behavior when the window is resized
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      // Always show calculator on desktop/tablet
      calculatorContainer.style.display = "block";
    } else if (!calculatorContainer.classList.contains("active")) {
      // Hide calculator on mobile if it's not active
      calculatorContainer.style.display = "none";
    }
  });

  // Calculator functionality
  const calculatorInput = document.getElementById("calculator-input");
  const calcButtons = document.querySelectorAll(".calc-btn");
  const clearButton = document.getElementById("calc-clear");
  const equalsButton = document.getElementById("calc-equals");
  const backspaceButton = document.getElementById("calc-backspace");

  // Variables to store calculator state
  let currentValue = ""; // Current input value
  let currentOperation = null; // Current operation (+, -, *, /)
  let previousValue = ""; // Previous value (before operation)
  let shouldResetInput = false; // Flag to reset input after operation

  // Initialize calculator display with "0"
  calculatorInput.value = "0";

  // Add click event listeners to all calculator buttons (except clear and equals)
  calcButtons.forEach((button) => {
    if (
      button.id !== "calc-clear" &&
      button.id !== "calc-equals" &&
      button.id !== "calc-backspace"
    ) {
      button.addEventListener("click", () => {
        // Get the value from the button's data-value attribute
        const value = button.getAttribute("data-value");

        if (button.classList.contains("operator")) {
          // If it's an operator button, handle the operation
          handleOperator(value);
        } else {
          // If it's a number button, append the number
          appendNumber(value);
        }
      });
    }
  });

  // Add click event listener to the clear button
  clearButton.addEventListener("click", () => {
    clear();
  });

  // Add click event listener to the equals button
  equalsButton.addEventListener("click", () => {
    calculate();
  });

  // Add click event listener to the backspace button
  backspaceButton.addEventListener("click", () => {
    backspace();
  });

  // Function to append a number to the display
  function appendNumber(number) {
    // If display shows "0" or shouldResetInput is true, clear the display
    if (calculatorInput.value === "0" || shouldResetInput) {
      calculatorInput.value = "";
      shouldResetInput = false;
    }

    // Don't allow multiple decimal points
    if (number === "." && calculatorInput.value.includes(".")) {
      return;
    }

    // Append the number to the display
    calculatorInput.value += number;
  }

  // Function to handle operator buttons
  function handleOperator(operator) {
    // If there's already an operation in progress, calculate the result first
    if (currentOperation !== null) {
      calculate();
    }

    // Store the current value and operation
    previousValue = calculatorInput.value;
    currentOperation = operator;
    shouldResetInput = true;
  }

  // Function to perform the calculation
  function calculate() {
    // If there's no operation or input should be reset, do nothing
    if (currentOperation === null || shouldResetInput) {
      return;
    }

    // Convert input values to numbers
    const prev = parseFloat(previousValue);
    const current = parseFloat(calculatorInput.value);
    let result;

    // Perform the calculation based on the operator
    switch (currentOperation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        result = prev / current;
        break;
      default:
        return;
    }

    // Handle division by zero or invalid calculations
    if (!isFinite(result)) {
      calculatorInput.value = "Error";
    } else {
      // Format the result to avoid floating point issues
      result = parseFloat(result.toFixed(8));
      calculatorInput.value = result;
    }

    // Reset operation state
    currentOperation = null;
    shouldResetInput = true;
  }

  // Function to clear the calculator
  function clear() {
    calculatorInput.value = "0";
    currentOperation = null;
    previousValue = "";
    shouldResetInput = false;
  }

  // Function to handle backspace button
  function backspace() {
    // If the input is about to be reset, do nothing
    if (shouldResetInput) {
      return;
    }

    // Remove the last character
    calculatorInput.value = calculatorInput.value.slice(0, -1);

    // If the display is empty after backspace, set it to "0"
    if (calculatorInput.value === "") {
      calculatorInput.value = "0";
    }
  }

  // Listen for keyboard input for calculator functionality
  document.addEventListener("keydown", (event) => {
    // Handle number keys
    if (event.key >= "0" && event.key <= "9") {
      appendNumber(event.key);
    }
    // Handle decimal point
    else if (event.key === ".") {
      appendNumber(".");
    }
    // Handle operator keys
    else if (
      event.key === "+" ||
      event.key === "-" ||
      event.key === "*" ||
      event.key === "/"
    ) {
      handleOperator(event.key);
    }
    // Handle Enter/Equals key for calculating result
    else if (event.key === "Enter" || event.key === "=") {
      calculate();
    }
    // Handle Escape/C key for clearing
    else if (event.key === "Escape" || event.key === "c" || event.key === "C") {
      clear();
    }
    // Handle Backspace key
    else if (event.key === "Backspace") {
      backspace();
    }
  });
});
