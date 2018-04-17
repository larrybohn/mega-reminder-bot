import moment from 'moment';

export function formatTimeInterval(timeInterval, shorten=false) {
    const units = breakIntoUnits(timeInterval);
    shorten = shorten && units.length>1;
    return units
        .map(u => formatTimeUnit(u.value, u.unit, shorten))
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

export function convertToLowestUnit(timeInterval) {
    const units = breakIntoUnits(timeInterval);
    return {
        unit: units[units.length-1].unit,
        value: moment.duration(timeInterval, 'seconds').as(units[units.length-1].unit)
    }
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

function formatTimeUnit(value, unit, shorten=false) {
    if (value === 0) {
        return ''
    }else if (value === 1) {
        return `${value}${shorten ? unit[0] : ' '+unit}`
    }else{
        return `${value}${shorten ? unit[0] : ' '+unit+'s'}`
    }
}