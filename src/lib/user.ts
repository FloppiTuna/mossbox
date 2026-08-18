// todo: use db for this maybe? idk
export function oobeCompleted(): boolean {
    const oobe = localStorage.getItem('oobeCompleted');
    if (oobe === null) {
        return false;
    }
    return oobe === 'true';
}

export function setOobeCompleted(value: boolean): void {
    localStorage.setItem('oobeCompleted', value.toString());
}