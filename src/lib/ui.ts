import { showDialog } from "./dialog";
import PowerPrompt from "$lib/components/sys_dialogs/PowerPrompt.svelte";

export function triggerPowerPrompt(): void {
    showDialog({
        severity: 'MESSAGE',
        title: 'Power',
        component: PowerPrompt,
        actions: [
            {
                label: 'Cancel',
                action: () => {
                    console.log('Power prompt canceled');
                }
            }
        ]
    });
}