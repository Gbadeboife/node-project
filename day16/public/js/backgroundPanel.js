// Background panel functionality
export const setupBackgroundPanel = (sidebar, canvas, colors) => {
    sidebar.innerHTML = '<div class="colors-container">' +
        colors.map(color => 
            `<div class="color-swatch" style="background-color: ${color}"></div>`
        ).join('') +
        '</div>';

    document.querySelectorAll('.color-swatch').forEach((swatch, i) => {
        swatch.addEventListener('click', () => {
            canvas.setBackgroundColor(colors[i], canvas.renderAll.bind(canvas));
        });
    });
};
