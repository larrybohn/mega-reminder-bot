export function formatTimeInterval(timeInterval) {
    return breakIntoUnits(timeInterval)
        .map(u => formatTimeUnit(u.value, u.unit))
        .join(' ')
        .trim();
}

export function breakIntoUnits(timeInterval) {
    const days = Math.floor(timeInterval / 24 / 3600);
    const hours = Math.floor(timeInterval % (24*3600) / 3600);
    const minutes = Math.floor(timeInterval % 3600 / 60);
    const seconds = Math.floor(timeInterval % 60);

    return [
        { value: days, unit: 'day' },
        { value: hours, unit: 'hour' },
        { value: minutes, unit: 'minute' },
        { value: seconds, unit: 'second' }
    ].filter(t => t.value !== 0);
}

export function valueWithUnitToSeconds(value, unit) {
    let multiplier;
    switch (unit) {
        case 'minute':
            multiplier = 60;
            break;
        case 'hour':
            multiplier = 3600;
            break;
        case 'day':
            multiplier = 24*3600;
            break;
        default:
            multiplier = 1;
    }
    return value*multiplier;
}

function formatTimeUnit(value, unit) {
    if (value === 0) {
        return ''
    }else if (value === 1) {
        return `${value} ${unit}`
    }else{
        return `${value} ${unit}s`
    }
}