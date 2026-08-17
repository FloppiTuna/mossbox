const UI_SOUND_PACKS = {
    BUILTIN: {
        BOOT: "/sounds/ui/builtin/boot.wav",
    },
    // temporary ui sound pack
    TiVo: {
        SELECT: "/sounds/ui/tivo/select.mp3",
        NAVIGATE: "/sounds/ui/tivo/navigate.mp3",
        BACK: "/sounds/ui/tivo/back.mp3",

        MESSAGE: "/sounds/ui/tivo/message.mp3",
        WARNING: "/sounds/ui/tivo/warning.mp3",
        ERROR: "/sounds/ui/tivo/error.mp3",
    }
}

const UI_SOUND_ASSOCIATIONS = {
    BOOT: UI_SOUND_PACKS.BUILTIN.BOOT,

    NAVIGATE: UI_SOUND_PACKS.TiVo.NAVIGATE,
    SELECT: UI_SOUND_PACKS.TiVo.SELECT,
    BACK: UI_SOUND_PACKS.TiVo.BACK,

    MESSAGE: UI_SOUND_PACKS.TiVo.MESSAGE,
    WARNING: UI_SOUND_PACKS.TiVo.WARNING,
    ERROR: UI_SOUND_PACKS.TiVo.ERROR,
}

export function playUISound(sound: keyof typeof UI_SOUND_ASSOCIATIONS) {
    const soundPath = UI_SOUND_ASSOCIATIONS[sound];
    if (!soundPath) {
        console.warn(`No sound associated with ${sound}`);
        return;
    }

    const audio = new Audio(soundPath);
    audio.play().catch((error) => {
        console.error(`Failed to play sound ${soundPath}:`, error);
    });
}