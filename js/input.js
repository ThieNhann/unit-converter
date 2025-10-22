document.addEventListener('DOMContentLoaded', () => {
    let inputNumberEl = document.getElementById('input-number');
    let resultNumberEl = document.getElementById('result-number');
    let buttons = document.querySelectorAll('.number-button');

    const factor = 0.3048;
    
    let rawInputString = '0'; 

    const displayLocale = 'de-DE'; 

    function updateDisplay() {
        let numericValue = parseFloat(rawInputString);
        if (isNaN(numericValue)) {
            numericValue = 0;
        }

        let displayInput;
        if (rawInputString.endsWith('.')) {
            let integerPart = Math.floor(numericValue).toLocaleString(displayLocale);
            displayInput = integerPart + ',';
        } else if (rawInputString.includes('.')) {
            const parts = rawInputString.split('.');
            const integerPart = (parseInt(parts[0]) || 0).toLocaleString(displayLocale);
            displayInput = integerPart + ',' + parts[1];
        } else {
            displayInput = numericValue.toLocaleString(displayLocale);
        }
        
        let resultValue = (numericValue * factor);
        let displayResult = resultValue.toLocaleString(displayLocale);

        inputNumberEl.innerText = displayInput;
        resultNumberEl.innerText = displayResult;
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const buttonText = button.innerText;

            if (buttonText == 'Reset') {
                rawInputString = '0';
            } 
            else if (buttonText == 'Back') {
                if (rawInputString.length > 1) {
                    rawInputString = rawInputString.substring(0, rawInputString.length - 1);
                } else {
                    rawInputString = '0';
                }
            } 
            else if (buttonText === ',' || buttonText === '.') { 
                if (!rawInputString.includes('.')) {
                    rawInputString += '.';
                }
            } 
            else if (!isNaN(parseInt(buttonText))) { 
                if (rawInputString.length >= 15) return;

                if (rawInputString == '0') {
                    rawInputString = buttonText;
                } else {
                    rawInputString += buttonText;
                }
            }
            updateDisplay();
        });
    });

    updateDisplay();
});
