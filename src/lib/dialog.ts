import { writable } from 'svelte/store';
import type { Component } from 'svelte';
import { playUISound } from '$lib/sfx';

export type DialogAction = {
    label: string;
    action: () => void;
};

export type DialogState = {
    dialogPresent: boolean;
    severity: 'MESSAGE' | 'WARNING' | 'ERROR';
    title?: string;
    message?: string;

    component?: Component<any>;
    componentProps?: Record<string, any>;

    actions?: DialogAction[];
};

export const currentDialog = writable<DialogState>({
    dialogPresent: false,
    severity: 'MESSAGE',
    actions: [],
});

export function showDialog({
    severity = 'MESSAGE',
    title = '',
    message = '',
    component,
    componentProps = {},
    actions = [],
}: {
    severity?: DialogState['severity'];
    title?: string;
    message?: string;
    component?: Component<any>;
    componentProps?: Record<string, any>;
    actions?: DialogAction[];
}) {
    playUISound(severity);

    currentDialog.set({
        dialogPresent: true,
        severity,
        title,
        message,
        component,
        componentProps,
        actions,
    });
}

export function closeDialog() {
    currentDialog.set({
        dialogPresent: false,
        severity: 'MESSAGE',
        title: '',
        message: '',
        component: undefined,
        componentProps: {},
        actions: [],
    });
}