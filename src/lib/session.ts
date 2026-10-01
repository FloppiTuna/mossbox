export interface Session {
    id: number;
    name: string;
}

let currentSession: Session | null = null;

export function getSessionContext(): Session | null {
    return currentSession;
}

export function setSessionContext(session: Session | null): void {
    currentSession = session;
}