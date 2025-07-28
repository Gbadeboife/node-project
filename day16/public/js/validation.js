// Validation utility functions
export const validateImageUrl = (url) => {
    const urlPattern = /^https:\/\/picsum\.photos\/id\/\d+\/\d+\/\d+$/;
    return urlPattern.test(url);
};

export const validateFontSize = (size) => {
    return Number.isInteger(size) && size > 0 && size <= 200;
};

export const validateColor = (color) => {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexPattern.test(color);
};
