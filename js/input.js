document.addEventListener('DOMContentLoaded', () => {
    let inputNumber = document.getElementById('input-number');
    let resultNumber = document.getElementById('result-number');

    let buttons = document.querySelectorAll('.number-button');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            let value = (parseInt(button.innerText));
            if (inputNumber.innerText == '0') {
                inputNumber.innerText = value;
            }
            else {
                inputNumber.innerText = parseInt(inputNumber.innerText) * 10 + value + "";
            }
        });
    });
});