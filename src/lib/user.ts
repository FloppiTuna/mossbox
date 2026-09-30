import { getDb } from "$lib/db";

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

export async function createUser(name: string, pin: string): Promise<void> {
    const db = await getDb();
    db.execute(
        "INSERT INTO users (name, pin) VALUES (?, ?)",
        [
            name,
            crypto.subtle.digest("SHA-256", new TextEncoder().encode(pin)).then((hashBuffer) => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                return hashHex;
            })
        ]
    );
}