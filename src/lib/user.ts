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
    await db.execute(
        "INSERT INTO users (name, pin) VALUES (?, ?)",
        [
            name,
            await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pin)).then((hashBuffer) => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                return hashHex;
            })
        ]
    );

    console.log(`User ${name} created successfully.`);
}

export async function getUserList(): Promise<{ id: number; name: string; }[]> {
    const db = await getDb();
    const result = await db.select("SELECT id, name FROM users");
    return result as { id: number; name: string; }[];
}

export async function authenticateUser(id: number, pin: string): Promise<boolean> {
    const db = await getDb();
    const hashedPin = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pin)).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    });

    const result = await db.select("SELECT id FROM users WHERE id = ? AND pin = ?", [id, hashedPin]) as { id: number }[];
    return result.length > 0;
}