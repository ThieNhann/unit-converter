// 1. Giữ lại import. Dữ liệu của bạn nằm trong biến 'conversionData' này.
import { conversionData } from './conversions.js';

document.addEventListener('DOMContentLoaded', () => {
    // 2. Lấy các element
    const categorySelect = document.getElementById('category-select');
    const fromSelect = document.getElementById('from-select');
    const toSelect = document.getElementById('to-select');

    const inputNumberEl = document.getElementById('input-number');
    const resultNumberEl = document.getElementById('result-number');
    const buttons = document.querySelectorAll('.number-button');

    // 3. XÓA 'let conversionData = null;'
    let rawInputString = '0';
    const displayLocale = 'de-DE';

    // 4. CÁC HÀM CỦA BẠN (giữ nguyên)
    // Các hàm này sẽ tự động dùng 'conversionData' đã được import
    function getConversionResult(numericValue) {
        if (!conversionData) return 0; // Kiểm tra an toàn

        const category = categorySelect.value;
        const fromUnit = fromSelect.value;
        const toUnit = toSelect.value;

        if (category === 'temperature') {
            if (fromUnit === toUnit) return numericValue;

            let valueInCelsius = numericValue;
            if (fromUnit === 'fahrenheit') {
                valueInCelsius = (numericValue - 32) * 5/9;
            } else if (fromUnit === 'kelvin') {
                valueInCelsius = numericValue - 273.15;
            }

            if (toUnit === 'fahrenheit') {
                return (valueInCelsius * 9/5) + 32;
            } else if (toUnit === 'kelvin') {
                return valueInCelsius + 273.15;
            } else {
                return valueInCelsius;
            }
        }

        const fromFactor = conversionData[category].units[fromUnit].factor;
        const toFactor = conversionData[category].units[toUnit].factor;

        if (toFactor === 0) return 0;
        
        return (numericValue * fromFactor) / toFactor;
    }

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
        
        let resultValue = getConversionResult(numericValue); 

        let displayResult = resultValue.toLocaleString(displayLocale, { 
            maximumFractionDigits: 6 
        });

        inputNumberEl.innerText = displayInput;
        resultNumberEl.innerText = displayResult;
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const buttonText = button.innerText;

            if (buttonText == 'AC') {
                rawInputString = '0';
            } 
            else if (buttonText == 'B') {
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
    
    // Các hàm này (không có tham số) sẽ tự động dùng
    // 'conversionData' từ import
    function loadCategories() {
        const categories = Object.keys(conversionData);
        categories.forEach(key => {
            let categoryOption = document.createElement('option');
            categoryOption.text = conversionData[key].name;
            categoryOption.value = key;
            categorySelect.appendChild(categoryOption);
        });
    }

    function updateUnitSelectors() {
        const selectedCategory = categorySelect.value;
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';

        const unitKeys = Object.keys(conversionData[selectedCategory].units);

        unitKeys.forEach(unitKey => {
            const unitData = conversionData[selectedCategory].units[unitKey];
            const fromOption = document.createElement('option');
            fromOption.value = unitKey;
            fromOption.text = unitData.name;
            const toOption = document.createElement('option');
            toOption.value = unitKey;
            toOption.text = unitData.name;
            fromSelect.appendChild(fromOption);
            toSelect.appendChild(toOption);
        });
        
        if(toSelect.options.length > 1) {
            toSelect.selectedIndex = 1;
        }
    }

    // 5. KHỞI CHẠY ỨNG DỤNG (KHÔNG CẦN 'initApp' hay 'fetch')
    // Gói trong try/catch để phòng trường hợp data bị lỗi
    try {
        loadCategories();
        updateUnitSelectors();
        updateDisplay(); 

        categorySelect.addEventListener('change', () => {
            updateUnitSelectors();
            updateDisplay();
        });
        fromSelect.addEventListener('change', updateDisplay);
        toSelect.addEventListener('change', updateDisplay);

    } catch (error) {
        console.error('Lỗi khi khởi tạo từ data:', error);
        inputNumberEl.innerText = "Error!";
        resultNumberEl.innerText = "Error loading data.";
    }

    // 6. XÓA 'async function initApp()' và 'initApp()'
});

// 7. XÓA DẤU '}' THỪA