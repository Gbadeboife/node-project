// Canvas setup and initialization module
export const initCanvas = () => {
    const canvas = new fabric.Canvas('canvas', {
        width: 800,
        height: 400
    });
    return canvas;
};

// Default color palette
export const colors = [
    '#FF9AA2', // Soft red
    '#FFB7B2', // Salmon
    '#FFDAC1', // Peach
    '#E2F0CB', // Light green
    '#B5EAD7', // Mint
    '#C7CEEA', // Light blue
    '#9BB7D4', // Steel blue
    '#F2E2FF', // Light purple
    '#F7D794', // Light orange
    '#957DAD'  // Purple
];
