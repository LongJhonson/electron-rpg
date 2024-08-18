// AudioManager.js

class AudioManager {
    constructor() {
        // this.volume = 0.4;  // Volumen global
        this.volume = 0;  // Volumen global
        this.music = {
            "main_menu": new Audio('../assets/audio/main_menu.mp3'),
            "house": new Audio('../assets/audio/house.mp3'),
            "town": new Audio('../assets/audio/town.mp3'),
            "forest": new Audio('../assets/audio/3.mp3'),
            "battle": new Audio("../assets/audio/battle.mp3")
        };
        this.currentAudio = null;
    }

    getVolume(){
        return this.volume;
    }

    setVolume(newVolume) {
        this.volume = newVolume;
        this.updateAllVolumes();
    }

    updateAllVolumes() {
        for (let key in this.music) {
            this.music[key].volume = this.volume;
        }
    }

    play(audioName) {
        // Si el audio actual ya se está reproduciendo, no hacer nada
        if (this.currentAudio === audioName) {
            return;
        }
        if (this.currentAudio) {
            this.music[this.currentAudio].volume = this.volume;
            this.music[this.currentAudio].pause();
            this.music[this.currentAudio].currentTime = 0;
        }
        this.currentAudio = audioName;
        this.music[audioName].volume = this.volume;
        this.music[audioName].play();
    }

    stop() {
        if (this.currentAudio) {
            this.music[this.currentAudio].pause();
            this.music[this.currentAudio].currentTime = 0;
        }
        this.currentAudio = null;
    }
}

// Exporta una instancia única de AudioManager
const audioManagerInstance = new AudioManager();
export default audioManagerInstance;
