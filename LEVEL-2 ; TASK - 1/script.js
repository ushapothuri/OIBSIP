const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");
const buttons = document.querySelectorAll(".buttons button");

let currentInput = "";
let previousInput = "";
let operator = "";
let history = [];

buttons.forEach(button => {
    button.addEventListener("click", () => {
        let value = button.innerText;
        if (value === "AC") { clearCalculator(); }
        else if (value === "⌫") { deleteNumber(); }
        else if (value === "=") { calculate(); }
        else if (
            ["+", "−", "×", "÷", "%"]
                .includes(value)
        ) {
            selectOperator(value);
        }
        else {
            addNumber(value);
        }
    });

});

function addNumber(number) {
    currentInput += number;
    resultDisplay.innerText = currentInput;
}

function selectOperator(op) {
    if (currentInput === "")
        return;

    previousInput = currentInput;
    currentInput = "";
    operator = op;

    expressionDisplay.innerText = `${previousInput} ${operator}`;
}

function calculate() {
    if (previousInput === "" || currentInput === "") return;

    let a = Number(previousInput);
    let b = Number(currentInput);
    let answer;

    switch (operator) {
        case "+":
            answer = a + b;
            break;
        case "−":
            answer = a - b;
            break;
        case "×":
            answer = a * b;
            break;
        case "÷":
            answer = b !== 0 ? a / b : "Error";
            break;
        case "%":
            answer = a % b;
            break;
    }

    expressionDisplay.innerText = `${a} ${operator} ${b}`;
    resultDisplay.innerText = answer;
    saveHistory(`${a} ${operator} ${b} = ${answer}`);



    currentInput = answer.toString();
    previousInput = "";
    operator = "";
}

function clearCalculator() {
    currentInput = "";
    previousInput = "";
    operator = "";
    expressionDisplay.innerText = "";
    resultDisplay.innerText = "0";
}

function deleteNumber() {
    currentInput = currentInput.slice(0, -1);
    resultDisplay.innerText = currentInput || "0";
}

function saveHistory(data) {
    history.unshift(data);
    updateHistory();
}

function updateHistory() {
    const list = document.getElementById("historyList");
    list.innerHTML = "";
    history.forEach(item => {
        let p = document.createElement("p");
        p.innerText = item;
        list.appendChild(p);
    });
}

const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");
const closeHistory = document.getElementById("closeHistory");
const overlay = document.getElementById("overlay");

historyBtn.onclick = () => {
    historyPanel.classList.add("active");
    overlay.classList.add("active");
};

function closeDrawer() {
    historyPanel.classList.remove("active");
    overlay.classList.remove("active");
}

closeHistory.onclick = closeDrawer;
overlay.onclick = closeDrawer;

const themeToggle = document.getElementById("themeToggle");
themeToggle.onclick = () => {
    document.body.classList.toggle("light-mode");
    themeToggle.innerText = document.body.classList.contains("light-mode")
        ? "☀" : "◐";
};

document.addEventListener("keydown", (e) => {
    if (!isNaN(e.key)) { addNumber(e.key); }
    else if (["+", "-", "*", "/"].includes(e.key)) {
        let op = e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key === "-" ? "−" : e.key;
        selectOperator(op);
    }
    else if (e.key === "Enter") { calculate(); }
    else if (e.key === "Backspace") { deleteNumber(); }
});