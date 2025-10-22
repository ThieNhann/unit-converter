document.addEventListener('DOMContentLoaded', () => {
    let inputNumber = document.getElementById('input-number');
    let resultNumber = document.getElementById('result-number');

    let buttons = document.querySelectorAll('.number-button');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.innerText == 'Reset') {
                inputNumber.innerText = '0';
                console.log('reset');
                return;
            }
            if (inputNumber.innerText.length >= 19) return;
            let value = (parseInt(button.innerText));
            if (inputNumber.innerText == '0') {
                inputNumber.innerText = value;
            }
            else {
                let rawNumber = inputNumber.innerText.replace(/\./g, '');
                if (button.innerText == 'Back') {
                    rawNumber = rawNumber.substring(0, rawNumber.length - 1);
                }
                else {
                    rawNumber = rawNumber + value;
                }
                inputNumber.innerText = Number(rawNumber).toLocaleString('en-US').replace(/,/g, '.');
            }
        });
    });
});