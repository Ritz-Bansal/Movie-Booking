interface ILocalTime {
    utc: Date | null | undefined;
    timeZone: string;
}

export function localTime({utc, timeZone}: ILocalTime){
    if(utc == null || utc == undefined){
        return;
    }

    const local = utc.toLocaleString("sv-VE", {timeZone: timeZone}).replace("T", "").slice(0, 16);
    return local;
}
