import Database from '@tauri-apps/plugin-sql';

let dbPromise: Promise<Database> | undefined;

export function getDb(): Promise<Database> {
  dbPromise ??= Database.load("sqlite:mossbox.db");
  return dbPromise;
}

export async function isDbConnected(): Promise<boolean> {
    try {
        const db = await getDb();
        await db.execute('SELECT 1');
        return true;
    } catch (error) {
        return false;
    }
}