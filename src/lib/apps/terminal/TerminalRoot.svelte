<script lang="ts">
    import { invoke } from '@tauri-apps/api/core';
    import { listen, type UnlistenFn } from '@tauri-apps/api/event';
    import { FitAddon } from '@xterm/addon-fit';
    import { Terminal } from '@xterm/xterm';
    import { onMount } from 'svelte';
    import '@xterm/xterm/css/xterm.css';

    type TerminalOutputEvent = {
        sessionId: string;
        data: string;
    };

    let container: HTMLDivElement;

    onMount(() => {
        const terminal = new Terminal({
            cursorBlink: true,
            convertEol: true,
        });
        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);

        terminal.open(container);
        fitAddon.fit();
        terminal.writeln('Starting host shell...');

        let sessionId: string | null = null;
        let disposed = false;
        let unlistenOutput: UnlistenFn | null = null;

        const outputPromise = listen<TerminalOutputEvent>(
            'terminal-output',
            (event) => {
                if (!sessionId || event.payload.sessionId !== sessionId) {
                    return;
                }
                terminal.write(event.payload.data);
            }
        );

        const inputDisposable = terminal.onData((data) => {
            if (!sessionId) {
                return;
            }
            void invoke('write_terminal_input', { sessionId, data }).catch((error) => {
                terminal.writeln(`\r\n[input error: ${String(error)}]`);
            });
        });

        const resizeDisposable = terminal.onResize(({ cols, rows }) => {
            if (!sessionId) {
                return;
            }
            void invoke('resize_terminal_session', { sessionId, cols, rows }).catch((error) => {
                terminal.writeln(`\r\n[resize error: ${String(error)}]`);
            });
        });

        void (async () => {
            try {
                unlistenOutput = await outputPromise;
                sessionId = await invoke<string>('start_terminal_session', {
                    cols: terminal.cols,
                    rows: terminal.rows,
                });
                terminal.writeln('Host shell connected.');
            } catch (error) {
                terminal.writeln(`\r\n[failed to start host shell: ${String(error)}]`);
            }
        })();

        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit();
        });
        resizeObserver.observe(container);

        return () => {
            disposed = true;
            resizeObserver.disconnect();
            inputDisposable.dispose();
            resizeDisposable.dispose();
            unlistenOutput?.();
            if (sessionId) {
                void invoke('stop_terminal_session', { sessionId });
            }
            terminal.dispose();
        };
    });
</script>

<main class="terminal-root">
    <div class="terminal-container" bind:this={container}></div>
</main>

<style>
    .terminal-root {
        width: 100%;
        height: 100%;
        /* padding: 1rem; */
        display: flex;
        box-sizing: border-box;
        min-width: 0;
    }

    .terminal-container {
        width: 100%;
        height: 100%;
        min-width: 0;
    }

    .terminal-container :global(.xterm) {
        width: 100%;
        height: 100%;
    }

    .terminal-container :global(.xterm-screen) {
        width: 100% !important;
    }
</style>