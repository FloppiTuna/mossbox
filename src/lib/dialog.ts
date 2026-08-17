import { writable } from 'svelte/store';
import { playUISound } from '$lib/sfx';

type DialogState = {
    dialogPresent: boolean;
    severity: 'MESSAGE' | 'WARNING' | 'ERROR';
    title?: string;
    message?: string;
    actions?: { label: string; action: () => void }[];
};

export const currentDialog = writable<DialogState>({
    dialogPresent: false,
    severity: 'MESSAGE',
    title: '',
    message: '',
    actions: [],
});

export function openDialog(severity: 'MESSAGE' | 'WARNING' | 'ERROR' = 'MESSAGE', title: string = '', message: string = '', actions: { label: string; action: () => void }[] = []) {
    playUISound(severity);
    currentDialog.set({ dialogPresent: true, severity, title, message, actions });
}

export function closeDialog() {
    currentDialog.set({ dialogPresent: false, severity: 'MESSAGE', title: '', message: '', actions: [] });
}