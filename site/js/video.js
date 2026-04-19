const video = document.getElementById('introduction-video');
const controlBtn = document.getElementById('control');
const iconPlay = document.getElementsByClassName('icon-play')[0];
const iconPause = document.getElementsByClassName('icon-pause')[0];
const iconReplay = document.getElementsByClassName('icon-replay')[0];
const timeEl = document.getElementById('time');
const volumeRange = document.getElementById('volume');
const iconVolume = document.getElementsByClassName('icon-volume')[0];
const iconMute = document.getElementsByClassName('icon-mute')[0];
const muteBtn = document.getElementById('mute');
const playbackSlider = document.getElementById('playback');
const playbackValue = document.getElementById('playback-value');
const fullscreenBtn = document.getElementById('fullscreen');
const iconFullscreen = document.getElementsByClassName('icon-fullscreen')[0];
const timeline = document.getElementById('timeline');

video.volume = 1;
video.playbackRate = 1;
let isFullscreen = false;

function formatTime(seconds) {
    const s = Math.floor(seconds % 60);
    const m = Math.floor(seconds / 60);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function updateTime() {
    const cur = formatTime(video.currentTime);
    const dur = formatTime(video.duration);
    timeEl.textContent = `${cur} / ${dur}`;
}

function updateControlIcons() {
    if (video.ended) {
        iconPlay.classList.add('hide');
        iconPause.classList.add('hide');
        iconReplay.classList.remove('hide');
        controlBtn.setAttribute('aria-label', 'Replay');
    }
    else if (video.paused) {
        iconPlay.classList.remove('hide');
        iconPause.classList.add('hide');
        iconReplay.classList.add('hide');
        controlBtn.setAttribute('aria-label', 'Play');
    }
    else {
        iconPlay.classList.add('hide');
        iconPause.classList.remove('hide');
        iconReplay.classList.add('hide');
        controlBtn.setAttribute('aria-label', 'Pause');
    }
}

controlBtn.addEventListener('click', () => {
    if (video.ended) {
        video.currentTime = 0;
        video.play();
    } else if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    updateControlIcons();
});

video.addEventListener('play', updateControlIcons);
video.addEventListener('pause', updateControlIcons);
video.addEventListener('ended', updateControlIcons);
video.addEventListener('timeupdate', () => {
    updateTime();
    if (video.duration) {
        timeline.value = (video.currentTime / video.duration) * 100;
    }
});
video.addEventListener('loadedmetadata', () => {
    updateTime();
    updateControlIcons();
    timeline.value = 0;
});

function updateVolumeIcons() {
    if (video.volume === 0) {
        iconVolume.classList.add('hide');
        iconMute.classList.remove('hide');
    } else {
        iconVolume.classList.remove('hide');
        iconMute.classList.add('hide');
    }
}

volumeRange.addEventListener('input', e => {
    const vol = Number(e.target.value) / 100;
    video.volume = vol;
    muteBtn.setAttribute('aria-pressed', vol === 0 ? 'true' : 'false');
    updateVolumeIcons();
});

muteBtn.addEventListener('click', () => {
    if (video.volume > 0) {
        volumeRange.dataset.prev = volumeRange.value;
        volumeRange.value = 0;
        video.volume = 0;
    } else {
        const prev = volumeRange.dataset.prev ? Number(volumeRange.dataset.prev) : 100;
        volumeRange.value = prev;
        video.volume = prev / 100;
    }
    muteBtn.setAttribute('aria-pressed', video.volume === 0 ? 'true' : 'false');
    updateVolumeIcons();
});

playbackSlider.addEventListener('input', e => {
    const rate = parseFloat(e.target.value);
    video.playbackRate = rate;
    playbackValue.textContent = rate + 'x';
});

fullscreenBtn.addEventListener('click', async () => {
    if (!document.fullscreenElement) {
        await video.requestFullscreen();
        isFullscreen = true;
    }
    else {
        await document.exitFullscreen();
        isFullscreen = false;
    }
});

timeline.addEventListener('input', e => {
    if (video.duration) {
        const percent = Number(e.target.value);
        video.currentTime = (percent / 100) * video.duration;
    }
});

$(document).ready(() => {
    let starsAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !starsAnimated) {
                starsAnimated = true;
                if ($(window).width() >= 1200) {
                    $("#design-star-left").animate(
                        { left: "-160px" },
                        { duration: 750, easing: "swing" }
                    );
                    $("#design-star-right").animate(
                        { right: "-160px" },
                        { duration: 750, easing: "swing" }
                    );
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.8
    });

    const target = document.getElementById("video");
    if (target) observer.observe(target);

    updateTime();
    updateControlIcons();
});
