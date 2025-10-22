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
        console.log(data);
    }

    loadConversionData();
})