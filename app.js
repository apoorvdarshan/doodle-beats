// ========================================
// DOODLE BEATS - Music Player Logic
// ========================================

// Track data - 21 songs with their metadata (matched to actual files)
const tracks = [
    { src: 'assets/music/505.mp3', title: '505', artist: 'Arctic Monkeys', thumb: 'assets/thumbnails/505.jpg' },
    { src: 'assets/music/Billie Eilish - WILDFLOWER (Official Lyric Video) - BillieEilishVEVO (youtube).mp3', title: 'WILDFLOWER', artist: 'Billie Eilish', thumb: 'assets/thumbnails/WILDFLOWER.jpg' },
    { src: 'assets/music/Diet Mountain Dew - Lana Del Rey (youtube).mp3', title: 'Diet Mountain Dew', artist: 'Lana Del Rey', thumb: 'assets/thumbnails/Diet Mountain Dew.jpg' },
    { src: 'assets/music/Dream, Ivory - Welcome and Goodbye - David Dean Burkhart (youtube).mp3', title: 'Welcome and Goodbye', artist: 'Dream, Ivory', thumb: 'assets/thumbnails/welcome and goodbye.jpg' },
    { src: 'assets/music/Elvis Presley - Can\'t Help Falling in Love (Lyrics) - 7clouds (youtube).mp3', title: 'Can\'t Help Falling in Love', artist: 'Elvis Presley', thumb: 'assets/thumbnails/Can\'t Help Falling in Love.jpg' },
    { src: 'assets/music/Eyedress & Dent May - Something About You - David Dean Burkhart (youtube).mp3', title: 'Something About You', artist: 'Eyedress & Dent May', thumb: 'assets/thumbnails/Something About You.jpg' },
    { src: 'assets/music/Golden Brown - The Stranglers - Μουσικές Περιηγήσεις (youtube).mp3', title: 'Golden Brown', artist: 'The Stranglers', thumb: 'assets/thumbnails/Golden Brown.jpg' },
    { src: 'assets/music/Goo Goo Dolls – Iris [Official Music Video] [4K Remaster] - Goo Goo Dolls (youtube) (1).mp3', title: 'Iris', artist: 'Goo Goo Dolls', thumb: 'assets/thumbnails/Iris.jpg' },
    { src: 'assets/music/I Think They Call This Love (Cover) - Matthew Ifield (youtube).mp3', title: 'I Think They Call This Love', artist: 'Matthew Ifield (Cover)', thumb: 'assets/thumbnails/I Think They Call This Love - Cover.jpg' },
    { src: 'assets/music/I Wanna Be Yours - Arctic Monkeys (youtube).mp3', title: 'I Wanna Be Yours', artist: 'Arctic Monkeys', thumb: 'assets/thumbnails/I Wanna Be Yours.jpg' },
    { src: 'assets/music/Indila - Love Story (Lyrics) - Pizza Music (youtube).mp3', title: 'Love Story', artist: 'Indila', thumb: 'assets/thumbnails/Love Story.jpg' },
    { src: 'assets/music/New West - Those Eyes (Lyrics) - Dan Music (youtube).mp3', title: 'Those Eyes', artist: 'New West', thumb: 'assets/thumbnails/Those Eyes.jpg' },
    { src: 'assets/music/No. 1 Party Anthem - Arctic Monkeys (youtube).mp3', title: 'No. 1 Party Anthem', artist: 'Arctic Monkeys', thumb: 'assets/thumbnails/No. 1 Party Anthem.jpg' },
    { src: 'assets/music/Ravyn Lenae - Love Me Not - Minimal Sounds (youtube).mp3', title: 'Love Me Not', artist: 'Ravyn Lenae', thumb: 'assets/thumbnails/Love Me Not (feat. Rex Orange County).jpg' },
    { src: 'assets/music/Ricky Montgomery - Line Without a Hook (Official Lyric Video) - Ricky Montgomery (youtube).mp3', title: 'Line Without a Hook', artist: 'Ricky Montgomery', thumb: 'assets/thumbnails/Line Without a Hook.jpg' },
    { src: 'assets/music/The Marías - No One Noticed (Visualizer) - The Marías (youtube).mp3', title: 'No One Noticed', artist: 'The Marías', thumb: 'assets/thumbnails/No One Noticed.jpg' },
    { src: 'assets/music/The Police - Every Breath You Take (Visualiser) - ThePoliceVEVO (youtube).mp3', title: 'Every Breath You Take', artist: 'The Police', thumb: 'assets/thumbnails/Every Breath You Take.jpg' },
    { src: 'assets/music/There Is a Light That Never Goes Out (2011 Remaster) - The Smiths (youtube).mp3', title: 'There Is a Light That Never Goes Out', artist: 'The Smiths', thumb: 'assets/thumbnails/There Is a Light That Never Goes Out - 2017 Master.jpg' },
    { src: 'assets/music/adore - did i tell u that i miss u (lyric video) - adore (youtube).mp3', title: 'did i tell u that i miss u', artist: 'adore', thumb: 'assets/thumbnails/did i tell u that i miss u.jpg' },
    { src: 'assets/music/blue (slowed down) - yung kai (youtube).mp3', title: 'blue (slowed down)', artist: 'yung kai', thumb: 'assets/thumbnails/blue - slowed down.jpg' },
    { src: 'assets/music/sombr - back to friends (official video) - sombr (youtube).mp3', title: 'back to friends', artist: 'sombr', thumb: 'assets/thumbnails/back to friends.jpg' }
];

// Player State
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: off, 1: repeat all, 2: repeat one
let originalPlaylist = [...tracks];
let currentPlaylist = [...tracks];

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeIcon = document.getElementById('volumeIcon');
const mutedIcon = document.getElementById('mutedIcon');
const volumeSlider = document.getElementById('volumeSlider');
const downloadBtn = document.getElementById('downloadBtn');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.getElementById('progressFill');
const progressKnob = document.getElementById('progressKnob');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const albumArt = document.getElementById('albumArt');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const playlist = document.getElementById('playlist');
const searchInput = document.getElementById('searchInput');
const helpModal = document.getElementById('helpModal');
const closeModal = document.getElementById('closeModal');

// Initialize Player
function init() {
    loadFromLocalStorage();
    renderPlaylist();
    loadTrack(currentTrackIndex);
    setVolume(volumeSlider.value);

    // Add event listeners
    attachEventListeners();
}

// Load settings from localStorage
function loadFromLocalStorage() {
    const savedVolume = localStorage.getItem('playerVolume');
    const savedShuffle = localStorage.getItem('playerShuffle');
    const savedRepeat = localStorage.getItem('playerRepeat');
    const savedTrack = localStorage.getItem('playerLastTrack');

    if (savedVolume !== null) {
        volumeSlider.value = savedVolume;
    }

    if (savedShuffle === 'true') {
        toggleShuffle();
    }

    if (savedRepeat !== null) {
        repeatMode = parseInt(savedRepeat);
        updateRepeatUI();
    }

    if (savedTrack !== null) {
        currentTrackIndex = parseInt(savedTrack);
    }
}

// Save settings to localStorage
function saveToLocalStorage() {
    localStorage.setItem('playerVolume', volumeSlider.value);
    localStorage.setItem('playerShuffle', isShuffle);
    localStorage.setItem('playerRepeat', repeatMode);
    localStorage.setItem('playerLastTrack', currentTrackIndex);
}

// Render playlist
function renderPlaylist(filter = '') {
    playlist.innerHTML = '';

    currentPlaylist.forEach((track, index) => {
        const searchTerm = filter.toLowerCase();
        const matchesSearch = track.title.toLowerCase().includes(searchTerm) ||
                             track.artist.toLowerCase().includes(searchTerm);

        if (filter && !matchesSearch) return;

        const li = document.createElement('li');
        li.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', index === currentTrackIndex);
        li.setAttribute('tabindex', '0');
        li.dataset.index = index;

        li.innerHTML = `
            <span class="track-index">${String(index + 1).padStart(2, '0')}</span>
            <img src="${track.thumb}" alt="${track.title}" class="playlist-thumb" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22%3E♪%3C/text%3E%3C/svg%3E'">
            <div class="playlist-track-info">
                <div class="playlist-track-title">${track.title}</div>
                <div class="playlist-track-artist">${track.artist}</div>
            </div>
        `;

        li.addEventListener('click', () => playTrack(index));
        li.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playTrack(index);
            }
        });

        playlist.appendChild(li);
    });
}

// Load and play specific track
function loadTrack(index) {
    if (index < 0 || index >= currentPlaylist.length) return;

    currentTrackIndex = index;
    const track = currentPlaylist[index];

    audioPlayer.src = track.src;
    albumArt.src = track.thumb;
    albumArt.alt = `${track.title} Album Art`;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;

    // Update playlist UI
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
            item.setAttribute('aria-selected', 'true');
            // Scroll into view
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            item.classList.remove('active');
            item.setAttribute('aria-selected', 'false');
        }
    });

    saveToLocalStorage();
}

// Play specific track
function playTrack(index) {
    loadTrack(index);
    play();
}

// Play/Pause toggle
function togglePlayPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

// Play
function play() {
    audioPlayer.play();
    isPlaying = true;
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    playPauseBtn.classList.add('playing');
    playPauseBtn.setAttribute('aria-label', 'Pause');
}

// Pause
function pause() {
    audioPlayer.pause();
    isPlaying = false;
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    playPauseBtn.classList.remove('playing');
    playPauseBtn.setAttribute('aria-label', 'Play');
}

// Previous track
function previousTrack() {
    if (currentTrackIndex > 0) {
        playTrack(currentTrackIndex - 1);
    } else if (repeatMode === 1) {
        playTrack(currentPlaylist.length - 1);
    }
}

// Next track
function nextTrack() {
    if (currentTrackIndex < currentPlaylist.length - 1) {
        playTrack(currentTrackIndex + 1);
    } else if (repeatMode === 1) {
        playTrack(0);
    }
}

// Shuffle toggle
function toggleShuffle() {
    isShuffle = !isShuffle;

    if (isShuffle) {
        // Save current track
        const currentTrack = currentPlaylist[currentTrackIndex];

        // Shuffle playlist (Fisher-Yates algorithm)
        currentPlaylist = [...originalPlaylist];
        for (let i = currentPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentPlaylist[i], currentPlaylist[j]] = [currentPlaylist[j], currentPlaylist[i]];
        }

        // Find new index of current track
        currentTrackIndex = currentPlaylist.findIndex(track => track.src === currentTrack.src);

        shuffleBtn.classList.add('active');
        shuffleBtn.setAttribute('aria-label', 'Shuffle on');
    } else {
        // Restore original playlist
        const currentTrack = currentPlaylist[currentTrackIndex];
        currentPlaylist = [...originalPlaylist];
        currentTrackIndex = originalPlaylist.findIndex(track => track.src === currentTrack.src);

        shuffleBtn.classList.remove('active');
        shuffleBtn.setAttribute('aria-label', 'Shuffle off');
    }

    renderPlaylist();
    saveToLocalStorage();
}

// Repeat toggle
function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    updateRepeatUI();
    saveToLocalStorage();
}

function updateRepeatUI() {
    const repeatIndicator = repeatBtn.querySelector('.repeat-indicator');

    switch (repeatMode) {
        case 0: // Off
            repeatBtn.classList.remove('active');
            repeatIndicator.classList.add('hidden');
            repeatBtn.setAttribute('aria-label', 'Repeat off');
            break;
        case 1: // Repeat all
            repeatBtn.classList.add('active');
            repeatIndicator.classList.add('hidden');
            repeatBtn.setAttribute('aria-label', 'Repeat all');
            break;
        case 2: // Repeat one
            repeatBtn.classList.add('active');
            repeatIndicator.classList.remove('hidden');
            repeatBtn.setAttribute('aria-label', 'Repeat one');
            break;
    }
}

// Mute/Unmute
function toggleMute() {
    if (audioPlayer.muted) {
        audioPlayer.muted = false;
        volumeIcon.classList.remove('hidden');
        mutedIcon.classList.add('hidden');
        muteBtn.setAttribute('aria-label', 'Mute');
    } else {
        audioPlayer.muted = true;
        volumeIcon.classList.add('hidden');
        mutedIcon.classList.remove('hidden');
        muteBtn.setAttribute('aria-label', 'Unmute');
    }
}

// Set volume
function setVolume(value) {
    audioPlayer.volume = value / 100;

    if (value == 0) {
        volumeIcon.classList.add('hidden');
        mutedIcon.classList.remove('hidden');
    } else {
        volumeIcon.classList.remove('hidden');
        mutedIcon.classList.add('hidden');
    }

    saveToLocalStorage();
}

// Download current track
function downloadTrack() {
    const track = currentPlaylist[currentTrackIndex];
    const link = document.createElement('a');
    link.href = track.src;
    link.download = `${track.artist} - ${track.title}.mp3`;
    link.click();
}

// Update progress bar
function updateProgress() {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = `${percent}%`;
        progressKnob.style.left = `${percent}%`;
        progressBar.setAttribute('aria-valuenow', Math.floor(percent));

        currentTime.textContent = formatTime(audioPlayer.currentTime);
        totalTime.textContent = formatTime(audioPlayer.duration);
    }
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Seek in track
function seek(e) {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * audioPlayer.duration;

    if (!isNaN(newTime)) {
        audioPlayer.currentTime = newTime;
    }
}

// Progress bar interactions
let isDragging = false;

progressBar.addEventListener('click', seek);

progressKnob.addEventListener('mousedown', () => {
    isDragging = true;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        seek(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Touch support for progress bar
progressBar.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    seek(touch);
});

document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        seek(touch);
    }
});

document.addEventListener('touchend', () => {
    isDragging = false;
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    renderPlaylist(e.target.value);
});

// Audio events
audioPlayer.addEventListener('loadedmetadata', () => {
    totalTime.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('timeupdate', updateProgress);

audioPlayer.addEventListener('ended', () => {
    if (repeatMode === 2) {
        // Repeat one
        audioPlayer.currentTime = 0;
        play();
    } else {
        nextTrack();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in search
    if (e.target === searchInput) return;

    // Don't trigger if modal is open and it's not a modal-related key
    if (!helpModal.classList.contains('hidden') && e.key !== 'Escape' && e.key !== '?') return;

    switch (e.key.toLowerCase()) {
        case ' ':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'arrowright':
            e.preventDefault();
            audioPlayer.currentTime += 5;
            break;
        case 'arrowleft':
            e.preventDefault();
            audioPlayer.currentTime -= 5;
            break;
        case 'arrowup':
            e.preventDefault();
            volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 5);
            setVolume(volumeSlider.value);
            break;
        case 'arrowdown':
            e.preventDefault();
            volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 5);
            setVolume(volumeSlider.value);
            break;
        case 'n':
            nextTrack();
            break;
        case 'p':
            previousTrack();
            break;
        case 's':
            toggleShuffle();
            break;
        case 'r':
            toggleRepeat();
            break;
        case 'm':
            toggleMute();
            break;
        case '?':
            e.preventDefault();
            helpModal.classList.toggle('hidden');
            break;
        case 'escape':
            helpModal.classList.add('hidden');
            break;
    }
});

// Help modal
closeModal.addEventListener('click', () => {
    helpModal.classList.add('hidden');
});

helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        helpModal.classList.add('hidden');
    }
});

// Attach all event listeners
function attachEventListeners() {
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', previousTrack);
    nextBtn.addEventListener('click', nextTrack);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    muteBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));
    downloadBtn.addEventListener('click', downloadTrack);

    // Keyboard accessibility for progress bar
    progressBar.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            audioPlayer.currentTime += 5;
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            audioPlayer.currentTime -= 5;
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
