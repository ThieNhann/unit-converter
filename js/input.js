document.addEventListener('DOMContentLoaded', () => {
    let inputNumber = document.getElementById('input-number');
    let resultNumber = document.getElementById('result-number');

    let buttons = document.querySelectorAll('.number-button');

    let convert = 0.3048;

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.innerText == 'Reset') {
                inputNumber.innerText = '0';
                resultNumber.innerText ='0';
                console.log('reset');
                return;
            }
            if (inputNumber.innerText.length >= 19) return;
            let value = (parseInt(button.innerText));
            if (inputNumber.innerText == '0') {
                inputNumber.innerText = value;
                resultNumber.innerText = (Number(inputNumber.innerText) * convert).toLocaleString('en-US').replace(/,/g, '.'); 
            }
            else {
                let rawNumber = inputNumber.innerText.replace(/\./g, '');
                if (button.innerText == 'Back') {
                    rawNumber = rawNumber.substring(0, rawNumber.length - 1);
                }
                else {
                    rawNumber = rawNumber + value;
                }
                resultNumber.innerText = (Number(rawNumber) * convert).toLocaleString('en-US').replace(/,/g, '.'); 
                inputNumber.innerText = Number(rawNumber).toLocaleString('en-US').replace(/,/g, '.');
            }
        });
    });
});