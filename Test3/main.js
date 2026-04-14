// Get elements
const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const button = document.querySelector("button");
const results = document.getElementById("results");

// Add event listener
button.addEventListener("click", function () {

    let weightKg = parseFloat(weightInput.value);
    let heightM = parseFloat(heightInput.value);

    // Input validation
    if (isNaN(weightKg) || isNaN(heightM) || weightKg <= 0 || heightM <= 0) {
        results.innerHTML = " Please enter valid positive values.";
        return;
    }

    // Convert to lbs and inches
    let weightLbs = weightKg * 2.2046226218;
    let heightInches = heightM * 39.3700787402;

    // BMI formula (imperial)
    let bmi = (weightLbs / (heightInches * heightInches)) * 703;
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