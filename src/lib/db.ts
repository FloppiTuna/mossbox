import Database from '@tauri-apps/plugin-sql';

export const db = new Database('mossbox.db');

export async function isDbConnected(): Promise<boolean> {
    try {
        await db.execute('SELECT 1');
        return true;
    } catch (error) {
        return false;
    }
}