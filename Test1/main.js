// Get elements
const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const calcBtn = document.getElementById("calcBtn");
const results = document.getElementById("results");

// Add event listener
calcBtn.addEventListener("click", function () {

    let weight = parseFloat(weightInput.value);
    let height = parseFloat(heightInput.value);

    // Input validation
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        results.innerHTML = "Please enter valid positive values for weight and height.";
        return;
    }

    // Convert height from cm to meters
    height = height / 100;

    // Calculate BMI
    let bmi = weight / (height * height);
    bmi = bmi.toFixed(2);

    // Determine category
    let category = "";

    if (bmi <= 18.4) {
        category = "Underweight";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = "Normal";
    } else if (bmi >= 25 && bmi <= 29.9) {
        category = "Overweight";
    } else {
        category = "Obese";
    }

    // Show result
    results.innerHTML = `
        Your BMI is <strong>${bmi}</strong><br>
        Category: <strong>${category}</strong>
    `;
});

// 👉 innerHTML = “put this HTML inside the div”
// 👉 ` ` = “write flexible text”
// 👉 ${} = “insert variable value”