const UI_SOUND_PACKS = {
    BUILTIN: {
        BOOT: "/sounds/ui/builtin/boot.wav",
    },
    // temporary ui sound pack
    TiVo: {
        BACK: "/sounds/ui/tivo/TiVo-Back.wav",
        BLOOP: "/sounds/ui/tivo/TiVo-Bloop.wav",
        BONG: "/sounds/ui/tivo/TiVo-Bong.wav",
        DING: "/sounds/ui/tivo/TiVo-Ding.wav",
        ERROR: "/sounds/ui/tivo/TiVo-Error.wav",
        FAILED: "/sounds/ui/tivo/TiVo-Failed.wav",
        SELECT: "/sounds/ui/tivo/TiVo-Select.wav",
    }
}

const UI_SOUND_ASSOCIATIONS = {
    BOOT: UI_SOUND_PACKS.BUILTIN.BOOT,
    
    NAVIGATE: UI_SOUND_PACKS.TiVo.BLOOP,
    SELECT: UI_SOUND_PACKS.TiVo.SELECT,
    BACK: UI_SOUND_PACKS.TiVo.BACK,
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