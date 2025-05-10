document.addEventListener('DOMContentLoaded', () => {
    const colorBtn = document.getElementById('colorBtn');
    const colorValue = document.getElementById('colorValue');
    const body = document.body;

    function generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function updateColor() {
        const newColor = generateRandomColor();
        body.style.backgroundColor = newColor;
        colorValue.textContent = newColor;
    }

    colorBtn.addEventListener('click', updateColor);
}); 