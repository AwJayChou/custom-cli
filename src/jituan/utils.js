export function hexToRgba(hex){
    const rgba = [];
    hex = hex.replace('#', '').padEnd(8, 'F');
    for (let i = 0; i < hex.length; i+=2) {
        rgba.push(parseInt(hex.slice(i, i+2), 16))
    }
    return rgba;
}

export function rgbaToHex(rgba){
    let hex = '#';
    for (const i of rgba) {
        hex += i.toString(16).padStart(2, '0');
    }
    return hex;
}