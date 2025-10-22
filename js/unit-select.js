document.addEventListener('DOMContentLoaded', () => {

    async function loadConversionData() {
        try {
            const response = await fetch('json/conversions.json');

            if (!response.ok) {
                throw new Error('Network problem! Status: ' + response.status);
            }

            const data = await response.json();

            init(data);
        }

        catch (error) {
            console.error('Không thể tải dữ liệu:', error);
        }
    }

    function init(data) {
        const categorySelect = document.getElementById('category-select');
        const fromSelect = document.getElementById('from-select');
        const toSelect = document.getElementById('to-select');

        const categories = Object.keys(data);
        categories.forEach(key => {
            let option = document.createElement('option');
            option.text = data[key].name;
            option.value = key;
            categorySelect.appendChild(option);
        })
    }

    loadConversionData();
})