// The color palettes
const colorPalettes = {
    bluePalette1: ["#03045E","#03478f","#00B4D8","#90E0EF","#CAF0F8"],
    bluePalette2: ["#00a2ff", "#00d0ff", "#00feff", "#80ffff", "#f5ffff"],
    bluePalette3: ["#140f07", "#0f1e44", "#184e9c", "#407efb", "#78b8fd"],
    turquoisePalette: ["#0e3f5c", "#0e5268", "#0c707e", "#0a9c97", "#06d8ac"],

}

// List with all the palette names
const paletteNames = Object.keys(colorPalettes);

// Current color palette
let _currentPalette = colorPalettes.bluePalette1;
let _currentPaletteName = 'bluePalette1';

/**
 * Return the current palette name
 * @returns {string}
 */
const getCurrentPaletteName = () => {
    return _currentPaletteName;
}

/**
 * Select a color palette.
 * @param paletteName The palette name
 */
const usePalette = (paletteName) => {
    _currentPaletteName = paletteName;
    _currentPalette = colorPalettes[paletteName];
}

/**
 * Replaces the style color
 * @param style The original style
 * @param id The color ID in the palette
 * @returns {*} The new style
 */
const reColorStyle = (style, id) => {
    style.color = _currentPalette[id];
    return style
}

export {colorPalettes, paletteNames, usePalette, reColorStyle, getCurrentPaletteName}
