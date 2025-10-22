document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const fromSelect = document.getElementById('from-select');
    const toSelect = document.getElementById('to-select');

    loadConversionData();

    async function loadConversionData() {
        try {
            const response = await fetch('json/conversions.json');

            if (!response.ok) {
                throw new Error('Network problem! Status: ' + response.status);
            }

            const data = await response.json();

            loadCategories(data);
            updateSelectors(data);
            categorySelect.addEventListener('change', () => {updateSelectors(data)});
        }

        catch (error) {
            console.error('Không thể tải dữ liệu:', error);
        }
    }

    function loadCategories(data) {
        const categories = Object.keys(data);
        categories.forEach(key => {

            let categoryOption = document.createElement('option');
            categoryOption.text = data[key].name;
            categoryOption.value = key;
            categorySelect.appendChild(categoryOption);
        })
    }


    function updateSelectors(data) {
        const selectedCategory = categorySelect.value;

        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';

        const unitKeys = Object.keys(data[selectedCategory].units);

        unitKeys.forEach(unitKey => {
            const unitData = data[selectedCategory].units[unitKey];

            const fromOption = document.createElement('option');
            fromOption.value = unitKey;
            fromOption.text = unitData.name;

            const toOption = document.createElement('option');
            toOption.value = unitKey;
            toOption.text = unitData.name;

            fromSelect.appendChild(fromOption);
            toSelect.appendChild(toOption);
        })
    }

})