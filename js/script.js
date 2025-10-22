document.addEventListener('DOMContentLoaded', () => {
    // --- 1. LẤY TẤT CẢ ELEMENT ---
    const categorySelect = document.getElementById('category-select');
    const fromSelect = document.getElementById('from-select');
    const toSelect = document.getElementById('to-select');

    const inputNumberEl = document.getElementById('input-number');
    const resultNumberEl = document.getElementById('result-number');
    const buttons = document.querySelectorAll('.number-button');

    // --- 2. BIẾN CHUNG ---
    let conversionData = null; // Biến này sẽ lưu data từ JSON
    let rawInputString = '0';
    const displayLocale = 'de-DE';

    // --- 3. LOGIC TÍNH TOÁN (ĐÃ SỬA) ---
    function getConversionResult(numericValue) {
        // Nếu data chưa tải xong, trả về 0
        if (!conversionData) return 0; 

        const category = categorySelect.value;
        const fromUnit = fromSelect.value;
        const toUnit = toSelect.value;

        // ** TRƯỜNG HỢP ĐẶC BIỆT: NHIỆT ĐỘ **
        // Nhiệt độ không dùng công thức (val * A) / B
        if (category === 'temperature') {
            if (fromUnit === toUnit) return numericValue;
            
            // Chuyển 'từ' về Celsius trước (đơn vị cơ sở của bạn)
            let valueInCelsius = numericValue;
            if (fromUnit === 'fahrenheit') {
                valueInCelsius = (numericValue - 32) * 5/9;
            } else if (fromUnit === 'kelvin') {
                valueInCelsius = numericValue - 273.15;
            }
            
            // Chuyển từ Celsius 'đến' đơn vị đích
            if (toUnit === 'fahrenheit') {
                return (valueInCelsius * 9/5) + 32;
            } else if (toUnit === 'kelvin') {
                return valueInCelsius + 273.15;
            } else {
                return valueInCelsius; // 'đến' là Celsius
            }
        }

        // ** CÔNG THỨC CHUẨN (CHO CÁC LOẠI CÒN LẠI) **
        const fromFactor = conversionData[category].units[fromUnit].factor;
        const toFactor = conversionData[category].units[toUnit].factor;

        if (toFactor === 0) return 0; // Tránh chia cho 0
        
        return (numericValue * fromFactor) / toFactor;
    }

    // --- 4. CẬP NHẬT HIỂN THỊ (SỬA LẠI factor) ---
    function updateDisplay() {
        let numericValue = parseFloat(rawInputString);
        if (isNaN(numericValue)) {
            numericValue = 0;
        }

        // Phần định dạng input giữ nguyên
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
        
        // --- THAY ĐỔI QUAN TRỌNG Ở ĐÂY ---
        // Bỏ: let resultValue = (numericValue * factor);
        // Thay bằng:
        let resultValue = getConversionResult(numericValue); 
        // ------------------------------------

        let displayResult = resultValue.toLocaleString(displayLocale, { 
            maximumFractionDigits: 6 
        });

        inputNumberEl.innerText = displayInput;
        resultNumberEl.innerText = displayResult;
    }

    // --- 5. LOGIC XỬ LÝ NÚT BẤM (GIỮ NGUYÊN) ---
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
            
            // Cập nhật hiển thị sau mỗi lần bấm
            updateDisplay(); 
        });
    });
    
    // --- 6. LOGIC TẢI VÀ ĐIỀN SELECT BOX ---
    // (Những hàm này giờ dùng biến 'conversionData' chung)
    
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
        
        // Cải tiến nhỏ: Tự động chọn đơn vị thứ 2 cho 'toSelect'
        if(toSelect.options.length > 1) {
            toSelect.selectedIndex = 1;
        }
    }

    // --- 7. HÀM KHỞI ĐỘNG (TẢI DATA VÀ GẮN EVENT) ---
    async function initApp() {
        try {
            const response = await fetch('json/conversions.json');
            if (!response.ok) {
                throw new Error('Network problem! Status: ' + response.status);
            }
            
            // Lưu data vào biến chung
            conversionData = await response.json(); 

            // Khởi tạo các select box
            loadCategories();
            updateUnitSelectors();
            
            // Khởi tạo hiển thị ban đầu
            updateDisplay(); 

            // Gắn event cho các Select Box
            categorySelect.addEventListener('change', () => {
                updateUnitSelectors();
                updateDisplay(); // Tính lại khi đổi category
            });
            fromSelect.addEventListener('change', updateDisplay); // Tính lại khi đổi from
            toSelect.addEventListener('change', updateDisplay); // Tính lại khi đổi to

        } catch (error) {
            console.error('Không thể tải dữ liệu:', error);
            inputNumberEl.innerText = "Lỗi!";
            resultNumberEl.innerText = "Lỗi tải data";
        }
    }

    initApp();
});