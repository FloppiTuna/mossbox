<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  const WITTY_QUIPS = [
    "Hello, IT. Have you tried turning it off and on again?",
    "Just so you know, it's probably DNS.",
    "I hope we get to use the iPXE server today.",
    "P.E.B.K.A.C.",
    "Put in a ticket.",
    "Please don't be Polycom, please don't be Polycom...\nDear god... it's Polycom.",
    "I hope you aren't working in High Trust. I don't do that whole logging thing.",
    "Unknown Return Code: (some code nobody on the internet has ever seen before)",
    "...for Windows Server 2008",
    "Time to unstoppage some work stoppage.",
    "Ooh, eeh, ooh-ah-ah, ting, tang, walla-walla bing-bang.",
    "Now with more frustration!",
    "As hard as a rock and as dumb as a brick.",
    "This is my domain now.",
    "NEEEEEEEEEEEEEERRRRRRRDDDDDDDDDD!!!!",
    "PC LOAD LETTER? What the #### does that mean?",
    "Where's the 'Any' key?",
    "All this computer hacking is making me thirsty. I think I'll order a Tab!",
  ]

  const NEXT_ROUTE = "/moss";
  const quip = WITTY_QUIPS[Math.floor(Math.random() * WITTY_QUIPS.length)];
  let mounted = false;

  onMount(() => {
    requestAnimationFrame(() => {
      mounted = true;
    });

    // play startup sound
    new Audio("/sounds/boot-default.wav").play().catch((err) => {
      console.error("Failed to play startup sound:", err);
    });


    const timer = window.setTimeout(() => {
      void goto(NEXT_ROUTE, { replaceState: true });
    }, 1800);

    return () => window.clearTimeout(timer);
  });
</script>

<main class="splash" aria-label="Splash screen">
  {#if mounted}
    <span class="title" in:fade={{ duration: 150, delay: 200 }} out:fade={{ duration: 100 }}>mossbox</span>
    <span class="quip" in:fade={{ duration: 150, delay: 400 }} out:fade={{ duration: 100 }}>{quip}</span>
  {/if}
</main>

<style>
  .splash {
    min-height: 100dvh;
    display: flex;
    place-content: center;
    gap: 0.5rem;
    text-align: center;
    letter-spacing: 0.08em;
    flex-direction: column;
  }

  .title {
    font-size: 2.5rem;
    font-weight: bold;
  }

  .quip {
    font-size: 1.2rem;
    opacity: 0.75;
    font-style: italic;
  }
</style>
