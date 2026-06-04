/* ==========================================================================
   PROPOSAL WEBSITE SCRIPT LOGIC
   Features: Dynamic Slides, Particles, Web Audio Synth, Playful Buttons, Shareable Links
   ========================================================================== */

// 1. Initial State & Configuration Merger
let localConfig = { ...CONFIG };

// Check if configuration exists in URL Hash (Base64)
function loadHashConfig() {
  try {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#config=')) {
      const base64Data = hash.substring(8);
      const decodedData = atob(base64Data);
      const parsedConfig = JSON.parse(decodedData);
      
      // Merge with CONFIG
      localConfig = { ...localConfig, ...parsedConfig };
      console.log("Loaded custom configuration from URL hash!", localConfig);
      return true;
    }
  } catch (e) {
    console.error("Failed to parse config from URL hash", e);
  }
  return false;
}

// Check if configuration exists in localStorage
function loadLocalConfig() {
  try {
    const saved = localStorage.getItem('proposal_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      localConfig = { ...localConfig, ...parsed };
      console.log("Loaded config from local storage", localConfig);
    }
  } catch (e) {
    console.error("Failed to load local storage config", e);
  }
}

// Initialize Configuration
const hasHash = loadHashConfig();
if (!hasHash) {
  loadLocalConfig();
}

// ==========================================================================
// 2. STARRY SKY & FLOATING HEARTS PARTICLES
// ==========================================================================
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

let stars = [];
let hearts = [];
let confetti = [];
let isCelebrating = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  const starCount = Math.floor((canvas.width * canvas.height) / 8000);
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      twinkleSpeed: 0.01 + Math.random() * 0.02,
      opacity: Math.random()
    });
  }
}

class FloatingHeart {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height; // Spread initially
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20;
    this.size = 5 + Math.random() * 15;
    this.speed = 0.5 + Math.random() * 1.5;
    this.opacity = 0.1 + Math.random() * 0.4;
    this.angle = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.01 + Math.random() * 0.02;
    this.wobbleRange = 1 + Math.random() * 3;
  }

  update() {
    this.y -= this.speed;
    this.angle += this.wobbleSpeed;
    this.x += Math.sin(this.angle) * 0.5;

    if (this.y < -20 || this.opacity <= 0) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#ff4d79';
    ctx.beginPath();
    
    const x = this.x;
    const y = this.y;
    const size = this.size;

    // Draw Heart shape
    ctx.moveTo(x, y + size / 4);
    ctx.quadraticCurveTo(x, y, x + size / 2, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
    ctx.quadraticCurveTo(x + size, y + size * 2/3, x + size / 2, y + size);
    ctx.quadraticCurveTo(x, y + size * 2/3, x, y + size / 4);
    
    // Mirror side
    ctx.moveTo(x, y + size / 4);
    ctx.quadraticCurveTo(x, y, x - size / 2, y);
    ctx.quadraticCurveTo(x - size, y, x - size, y + size / 3);
    ctx.quadraticCurveTo(x - size, y + size * 2/3, x - size / 2, y + size);
    ctx.quadraticCurveTo(x, y + size * 2/3, x, y + size / 4);

    ctx.fill();
    ctx.restore();
  }
}

// Confetti Particle System
class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 6 + Math.random() * 12;
    this.color = ['#ff4d79', '#ffb3c6', '#7052ff', '#ffd700', '#ff1a53'][Math.floor(Math.random() * 5)];
    this.speedX = (Math.random() - 0.5) * 12;
    this.speedY = -10 - Math.random() * 15;
    this.gravity = 0.4 + Math.random() * 0.3;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
    this.opacity = 1;
    this.type = Math.random() > 0.5 ? 'heart' : 'circle';
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.01;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const size = this.size;
    if (this.type === 'heart') {
      ctx.beginPath();
      ctx.moveTo(0, -size/2);
      ctx.bezierCurveTo(size/2, -size, size, -size/2, size, 0);
      ctx.bezierCurveTo(size, size/2, 0, size, 0, size*1.3);
      ctx.bezierCurveTo(0, size, -size, size/2, -size, 0);
      ctx.bezierCurveTo(-size, -size/2, -size/2, -size, 0, -size/2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.rect(-size/2, -size/2, size, size);
      ctx.fill();
    }
    ctx.restore();
  }
}

function initHearts() {
  hearts = [];
  for (let i = 0; i < 20; i++) {
    hearts.push(new FloatingHeart());
  }
}

function triggerConfettiBurst() {
  for (let i = 0; i < 150; i++) {
    confetti.push(new ConfettiParticle(canvas.width / 4, canvas.height + 20));
    confetti.push(new ConfettiParticle((canvas.width / 4) * 3, canvas.height + 20));
  }
}

// Loop Animation
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw & Twinkle Stars
  stars.forEach(star => {
    star.opacity += star.twinkleSpeed;
    if (star.opacity > 1 || star.opacity < 0.1) {
      star.twinkleSpeed = -star.twinkleSpeed;
    }
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Floating Hearts
  hearts.forEach(heart => {
    heart.update();
    heart.draw();
  });

  // Confetti
  if (isCelebrating) {
    for (let i = confetti.length - 1; i >= 0; i--) {
      confetti[i].update();
      confetti[i].draw();
      if (confetti[i].opacity <= 0 || confetti[i].y > canvas.height + 50) {
        confetti.splice(i, 1);
      }
    }
    
    // Continuously add a few floating celebratory hearts
    if (Math.random() < 0.15 && confetti.length < 250) {
      confetti.push(new ConfettiParticle(Math.random() * canvas.width, canvas.height + 20));
    }
  }

  requestAnimationFrame(animate);
}

// Start Particle System
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initHearts();
requestAnimationFrame(animate);


// ==========================================================================
// 3. AMBIENT SYNTHESIZER MUSIC ENGINE (Web Audio API)
// ==========================================================================
let audioCtx = null;
let synthInterval = null;
let isMusicPlaying = false;
let currentChordIndex = 0;
let noteIndex = 0;

// Ethereal/Dreamy chord progression
// Roman numerals: IVmaj7 - Imaj7 - vi7 - V6
const chords = [
  // Fmaj7: F, A, C, E
  [174.61, 220.00, 261.63, 329.63, 440.00], // F3, A3, C4, E4, A4
  // Cmaj7: C, E, G, B
  [130.81, 196.00, 246.94, 329.63, 493.88], // C3, G3, B3, E4, B4
  // Am7: A, C, E, G
  [110.00, 220.00, 261.63, 329.63, 392.00], // A2, A3, C4, E4, G4
  // G6: G, B, D, E
  [98.00, 196.00, 246.94, 293.66, 392.00]    // G2, G3, B3, D4, G4
];

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSynthNote(frequency, time, duration = 1.5) {
  if (!audioCtx || audioCtx.state === 'suspended') return;

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  const delay = audioCtx.createDelay();
  const delayGain = audioCtx.createGain();

  // Gentle wave combination: Sine + Triangle for soft warmth
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, time);

  // Filter out harsh highs for dreaminess
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, time);
  filter.Q.setValueAtTime(1, time);

  // Smooth volume envelope: soft attack, slow decay
  gainNode.gain.setValueAtTime(0, time);
  gainNode.gain.linearRampToValueAtTime(0.08, time + 0.1); // Keep it quiet and ambient
  gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  // Dreamy delay / echo effect
  delay.delayTime.setValueAtTime(0.4, time);
  delayGain.gain.setValueAtTime(0.03, time);

  // Routing nodes
  osc.connect(filter);
  filter.connect(gainNode);
  
  // Feedback delay routing
  gainNode.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(delay); // Loop feedback
  delayGain.connect(audioCtx.destination);

  gainNode.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + duration + 0.5);
}

// Sequencer that plays arpeggiated ambient notes
function startMusicSequence() {
  if (!localConfig.enableSynthMusic) return;
  initAudio();
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const notePattern = [0, 2, 1, 3, 4, 2, 3, 1]; // Arpeggiation pattern
  const tempo = 450; // Speed of notes in ms

  synthInterval = setInterval(() => {
    if (!isMusicPlaying) return;

    const chord = chords[currentChordIndex];
    const notePos = notePattern[noteIndex];
    const freq = chord[notePos];
    
    // Play the note
    playSynthNote(freq, audioCtx.currentTime);

    noteIndex++;
    if (noteIndex >= notePattern.length) {
      noteIndex = 0;
      // Go to next chord
      currentChordIndex = (currentChordIndex + 1) % chords.length;
    }
  }, tempo);
}

function toggleMusic() {
  const btn = document.getElementById('musicToggle');
  
  if (!isMusicPlaying) {
    isMusicPlaying = true;
    btn.classList.add('playing');
    if (!synthInterval) {
      startMusicSequence();
    } else if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } else {
    isMusicPlaying = false;
    btn.classList.remove('playing');
  }
}

document.getElementById('musicToggle').addEventListener('click', () => {
  initAudio();
  toggleMusic();
});


// ==========================================================================
// 4. STAGE 1: ENVELOPE OPENING LOGIC
// ==========================================================================
const envelope = document.getElementById('envelope');
const stageEnvelope = document.getElementById('stage-envelope');
const stageLetter = document.getElementById('stage-letter');

// Set recipient text in envelope
document.getElementById('env-crush-name').innerText = localConfig.crushName;

envelope.addEventListener('click', () => {
  // Start audio on envelope interaction
  initAudio();
  if (localConfig.enableSynthMusic && !isMusicPlaying) {
    toggleMusic();
  }

  // Animate envelope opening
  envelope.classList.add('open');
  
  // Transition to Slide Deck after envelope animations complete
  setTimeout(() => {
    stageEnvelope.classList.remove('active');
    setTimeout(() => {
      stageLetter.classList.add('active');
      renderSlides();
    }, 300);
  }, 1400); // Wait for flap opening and letter slide animation
});


// ==========================================================================
// 5. STAGE 2: ROMANTIC CARD SLIDER & THE QUESTION
// ==========================================================================
let currentSlide = 0;

// Dynamic Vector Illustration SVGs for standard proposal
const defaultSVGs = [
  // SVG 1: Floating Love Envelope with hearts
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="envelopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffb3c6" />
        <stop offset="100%" stop-color="#ff4d79" />
      </linearGradient>
    </defs>
    <!-- Envelope shadow -->
    <ellipse cx="100" cy="140" rx="60" ry="10" fill="black" opacity="0.2" />
    <!-- Floating Envelope -->
    <g transform="translate(0, -10)">
      <animateTransform attributeName="transform" type="translate" values="0 -10; 0 10; 0 -10" dur="4s" repeatCount="indefinite" />
      <rect x="40" y="70" width="120" height="80" rx="8" fill="url(#envelopeGrad)" />
      <path d="M40 70 L100 115 L160 70 Z" fill="#ffe6ec" />
      <path d="M40 150 L90 105 Z" stroke="#ffd0db" stroke-width="2" />
      <path d="M160 150 L110 105 Z" stroke="#ffd0db" stroke-width="2" />
      <circle cx="100" cy="115" r="15" fill="#ff1a53" />
      <text x="100" y="120" font-size="12" text-anchor="middle" fill="white">❤️</text>
      <!-- Sparkles & Tiny Hearts -->
      <path d="M30 40 Q25 30 35 25 Q45 30 40 40 Q35 48 30 40" fill="#7052ff" opacity="0.8" transform="scale(0.8) translate(10, 10)">
        <animate attributeName="opacity" values="0.2; 1; 0.2" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M160 40 Q155 30 165 25 Q175 30 170 40 Q165 48 160 40" fill="#ffb3c6" transform="scale(0.9) translate(10, -10)">
        <animate attributeName="opacity" values="0.8; 0.2; 0.8" dur="2.5s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>`,
  
  // SVG 2: Heart waves / music note/ cassette
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="140" rx="50" ry="8" fill="black" opacity="0.2" />
    <g transform="translate(0, 0)">
      <animateTransform attributeName="transform" type="translate" values="0 5; 0 -5; 0 5" dur="3s" repeatCount="indefinite" />
      <!-- Pulsing giant heart -->
      <path d="M100 50 Q85 30 70 45 Q55 60 75 80 L100 110 L125 80 Q145 60 130 45 Q115 30 100 50 Z" fill="#ff4d79">
        <animateTransform attributeName="transform" type="scale" values="1; 1.08; 1" dur="1.5s" repeatCount="indefinite" transform-origin="100 75" />
      </path>
      <!-- Love rays -->
      <circle cx="100" cy="75" r="50" fill="none" stroke="#ffb3c6" stroke-width="2" stroke-dasharray="8 8" opacity="0.5">
        <animate attributeName="r" values="45; 70; 45" dur="3s" repeatCount="indefinite" />
      </circle>
      <!-- Cute faces/decorations -->
      <circle cx="90" cy="65" r="3" fill="white" />
      <circle cx="110" cy="65" r="3" fill="white" />
      <path d="M96 73 Q100 78 104 73" stroke="white" stroke-width="2" fill="none" />
    </g>
  </svg>`,

  // SVG 3: Starry telescope / constellation mapping
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="#0f0c24" stroke="rgba(255,255,255,0.05)" stroke-width="2" />
    <!-- Constellation lines -->
    <path d="M70 60 L100 40 L130 60 L100 110 L70 60 Z M100 40 L100 110" stroke="rgba(255, 77, 121, 0.4)" stroke-width="1.5" stroke-dasharray="4 4" />
    <!-- Glowing Stars -->
    <circle cx="70" cy="60" r="4" fill="#ffd700"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/></circle>
    <circle cx="100" cy="40" r="5" fill="#ff4d79"><animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/></circle>
    <circle cx="130" cy="60" r="4" fill="#ffd700"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="0.5s"/></circle>
    <circle cx="100" cy="110" r="4" fill="#ffb3c6"><animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/></circle>
    
    <!-- Heart Constellation Title -->
    <text x="100" y="150" font-family="'Playfair Display', serif" font-size="12" text-anchor="middle" fill="#ffe6ec" letter-spacing="1">
      Written in the Stars
    </text>
  </svg>`
];

function renderSlides() {
  const slides = localConfig.slides;
  const totalSlides = slides.length + 1; // +1 for the proposal question

  // Update progress bar
  const progressPercent = ((currentSlide + 1) / totalSlides) * 100;
  document.getElementById('progress-indicator').style.width = `${progressPercent}%`;

  // Render Dots
  const dotsContainer = document.getElementById('slide-dots');
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.className = `dot ${i === currentSlide ? 'active' : ''}`;
    dotsContainer.appendChild(dot);
  }

  // Update media and contents based on slide index
  const mediaContainer = document.getElementById('slide-media');
  const normalControls = document.getElementById('normal-controls');
  const proposalControls = document.getElementById('proposal-controls');

  if (currentSlide < slides.length) {
    // Stage 2.1: Normal Slide
    const slide = slides[currentSlide];
    
    document.getElementById('slide-title').innerText = slide.title;
    
    // Clear previous nextBtn state
    document.getElementById('nextBtn').style.display = 'flex';

    // If it's a quiz slide, render quiz interface instead of raw text
    if (slide.quiz) {
      document.getElementById('slide-text').innerHTML = `
        <span class="quiz-question-text">${slide.text}</span>
        <div class="quiz-options-container">
          ${slide.quiz.options.map((option, idx) => `
            <button class="quiz-option-btn font-sans" data-index="${idx}">
              <span>${option}</span>
              <span class="option-check"></span>
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback" id="quiz-feedback-el"></div>
      `;
      
      // Hide Next button until correct answer is chosen
      document.getElementById('nextBtn').style.display = 'none';

      // Attach choice event listeners
      const optionButtons = document.querySelectorAll('.quiz-option-btn');
      optionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const clickedBtn = e.currentTarget;
          const selectedIdx = parseInt(clickedBtn.getAttribute('data-index'));
          const feedbackEl = document.getElementById('quiz-feedback-el');
          
          if (selectedIdx === slide.quiz.correctIndex) {
            // Disable further choice clicks
            optionButtons.forEach(b => {
              b.disabled = true;
              b.classList.remove('wrong');
            });
            clickedBtn.classList.add('correct');
            feedbackEl.innerText = slide.quiz.successMessage;
            feedbackEl.className = "quiz-feedback success";
            
            // Show Next button
            document.getElementById('nextBtn').style.display = 'flex';
            
            // Play quick floating confetti particles at button
            const btnRect = clickedBtn.getBoundingClientRect();
            for (let i = 0; i < 40; i++) {
              confetti.push(new ConfettiParticle(btnRect.left + btnRect.width/2, btnRect.top + btnRect.height/2));
            }
          } else {
            clickedBtn.classList.add('wrong');
            feedbackEl.innerText = slide.quiz.errorMessage;
            feedbackEl.className = "quiz-feedback error";
            
            // Reset shake animation class
            setTimeout(() => clickedBtn.classList.remove('wrong'), 400);
          }
        });
      });
    } else {
      document.getElementById('slide-text').innerText = slide.text;
    }

    // Load custom image or default vector SVG
    if (slide.image) {
      mediaContainer.innerHTML = `<img src="${slide.image}" alt="${slide.title}">`;
    } else {
      // Use one of the preconfigured romantic SVGs
      const svgIndex = currentSlide % defaultSVGs.length;
      mediaContainer.innerHTML = defaultSVGs[svgIndex];
    }

    // Toggle controls
    normalControls.classList.remove('hidden');
    proposalControls.classList.add('hidden');
    
    // Enable/disable back button
    document.getElementById('prevBtn').disabled = currentSlide === 0;
  } else {
    // Stage 2.2: The Big Proposal Slide (Final Slide)
    document.getElementById('slide-title').innerText = localConfig.questionTitle;
    document.getElementById('slide-text').innerText = localConfig.questionText;
    
    // Proposal buttons customization
    document.getElementById('yes-btn-text').innerText = localConfig.yesButtonText;
    document.getElementById('no-btn-text').innerText = localConfig.noButtonText;

    // Large floating neon heart image or SVG
    mediaContainer.innerHTML = `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="neonHeartGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ff4d79" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#ff4d79" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <!-- Heart Glow -->
        <circle cx="100" cy="90" r="70" fill="url(#neonHeartGlow)" />
        <!-- Glowing heart path -->
        <path d="M100 60 Q85 35 65 55 Q45 75 75 105 L100 145 L125 105 Q155 75 135 55 Q115 35 100 60 Z" 
              fill="none" stroke="#ff4d79" stroke-width="4" filter="drop-shadow(0 0 10px #ff4d79)">
          <animate attributeName="stroke-width" values="4;6;4" dur="2s" repeatCount="indefinite" />
        </path>
        <!-- Inner glow heart -->
        <path d="M100 60 Q85 35 65 55 Q45 75 75 105 L100 145 L125 105 Q155 75 135 55 Q115 35 100 60 Z" 
              fill="#ff4d79" opacity="0.2">
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    `;

    // Swap controls to proposal buttons
    normalControls.classList.add('hidden');
    proposalControls.classList.remove('hidden');
  }
}

// Next/Back Button Triggers
document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentSlide < localConfig.slides.length) {
    currentSlide++;
    renderSlides();
  }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentSlide > 0) {
    currentSlide--;
    renderSlides();
  }
});


// ==========================================================================
// 6. PLAYFUL "NO" BUTTON DODGING ALGORITHM & PLEADING SYSTEM
// ==========================================================================
const noBtn = document.getElementById('noBtn');
let pleadingIndex = 0;

function dodgeNoButton(e) {
  // Prevent default events (especially on touchscreens)
  if (e) e.preventDefault();

  const container = document.querySelector('.proposal-buttons');
  const containerRect = container.getBoundingClientRect();
  const noBtnRect = noBtn.getBoundingClientRect();

  // Screen/Window dimensions safety
  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;

  // We want to move the button to a position that is reasonably far from the pointer,
  // but keeping it within comfortable bounds so it doesn't vanish entirely off-screen.
  // We will position it absolutely within the screen context.
  
  let newX, newY;
  
  // Choose coordinates that are at least 150px away from current cursor position
  let cursorX = e.clientX || (e.touches && e.touches[0].clientX) || containerRect.left + containerRect.width / 2;
  let cursorY = e.clientY || (e.touches && e.touches[0].clientY) || containerRect.top + containerRect.height / 2;

  // Generate coordinates safety loop
  let distance = 0;
  let iterations = 0;

  do {
    // Generate position anywhere on the screen with a 40px margin
    newX = 40 + Math.random() * (winWidth - noBtnRect.width - 80);
    newY = 40 + Math.random() * (winHeight - noBtnRect.height - 80);

    // Calculate distance from cursor
    let dx = newX + noBtnRect.width/2 - cursorX;
    let dy = newY + noBtnRect.height/2 - cursorY;
    distance = Math.sqrt(dx*dx + dy*dy);
    iterations++;
  } while (distance < 180 && iterations < 30);

  // Set position to absolute fixed on viewport
  noBtn.style.position = 'fixed';
  noBtn.style.left = `${newX}px`;
  noBtn.style.top = `${newY}px`;
  noBtn.style.zIndex = '9999';

  // Increment pleading messages
  const message = localConfig.pleadingMessages[pleadingIndex];
  document.getElementById('no-btn-text').innerText = message;

  // Increment pointer index with wrap-around
  pleadingIndex = (pleadingIndex + 1) % localConfig.pleadingMessages.length;

  // Make Yes button bigger on each dodge!
  const yesBtn = document.getElementById('yesBtn');
  let currentScale = parseFloat(yesBtn.style.transform.replace('scale(', '').replace(')', '')) || 1.0;
  if (currentScale < 1.6) {
    yesBtn.style.transform = `scale(${currentScale + 0.05})`;
  }
}

// Mouse and Touch Event Listeners for dodging
noBtn.addEventListener('mouseenter', dodgeNoButton);
noBtn.addEventListener('touchstart', dodgeNoButton);

// Fallback click/tap alert just in case they manage to click it
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  alert("Oops, incorrect click! Let's try that again. 😉");
  dodgeNoButton(e);
});


// ==========================================================================
// 7. YES BUTTON SUCCESS & CELEBRATION
// ==========================================================================
const yesBtn = document.getElementById('yesBtn');
const stageCelebration = document.getElementById('stage-celebration');

yesBtn.addEventListener('click', () => {
  isCelebrating = true;
  
  // 1. Trigger Confetti particles
  triggerConfettiBurst();
  
  // 2. Hide slider, show celebration stage
  stageLetter.classList.remove('active');
  setTimeout(() => {
    stageCelebration.classList.add('active');
    
    // Set customized celebration texts
    document.getElementById('celeb-title').innerText = localConfig.celebrationTitle;
    document.getElementById('celeb-text').innerText = localConfig.celebrationText;
    document.getElementById('celeb-your-name').innerText = localConfig.yourName;
    document.getElementById('celeb-img').src = localConfig.celebrationImage;

    // Render Coupon Book dynamically
    const couponsContainer = document.getElementById('coupons-section');
    if (couponsContainer && localConfig.coupons && localConfig.coupons.length > 0) {
      let couponsHTML = `
        <h3 class="font-romantic" style="font-size: 1.5rem; color: var(--color-accent); margin: 30px 0 5px 0; text-align: center;">🎫 Your Virtual Love Coupons</h3>
        <p class="font-sans" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px; text-align: center;">Click to redeem on WhatsApp instantly!</p>
        <div class="coupons-container">
      `;
      localConfig.coupons.forEach((coupon) => {
        couponsHTML += `
          <div class="coupon-card">
            <div>
              <div class="coupon-title">${coupon.title}</div>
              <div class="coupon-desc">${coupon.desc}</div>
            </div>
            <button class="redeem-btn" data-coupon-title="${coupon.title}">
              <span>Redeem 🎫</span>
            </button>
          </div>
        `;
      });
      couponsHTML += '</div>';
      couponsContainer.innerHTML = couponsHTML;

      // Attach redeem event handlers
      const redeemBtns = couponsContainer.querySelectorAll('.redeem-btn');
      redeemBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const couponTitle = e.currentTarget.getAttribute('data-coupon-title');
          const cleanPhone = localConfig.whatsappNumber.replace(/\D/g, ''); // Digits only
          const message = `Hey! I want to redeem my love coupon for: "${couponTitle}"! ❤️`;
          const encodedText = encodeURIComponent(message);
          const link = `https://wa.me/${cleanPhone}?text=${encodedText}`;
          window.open(link, '_blank');
        });
      });
    }
  }, 300);
});

// Date Invitation Action (WhatsApp CTA)
document.getElementById('dateInviteBtn').addEventListener('click', () => {
  if (localConfig.whatsappNumber) {
    // Format WhatsApp link
    const cleanPhone = localConfig.whatsappNumber.replace(/\D/g, ''); // Digits only
    const encodedText = encodeURIComponent(localConfig.whatsappMessage);
    const link = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(link, '_blank');
  } else {
    // Fallback: Copy calendar details or play celebration music
    alert(`Cheers to the beginning of something beautiful! 🥂✨ \n\nShare this moment with ${localConfig.yourName}!`);
  }
});


// ==========================================================================
// 8. LIVE CUSTOMIZATION DIALOG & URL STATE ENCODING
// ==========================================================================
const customizerToggle = document.getElementById('customizerToggle');
const customizerModal = document.getElementById('customizerModal');
const closeModal = document.getElementById('closeModal');
const customizerForm = document.getElementById('customizerForm');

// Open Modal & Populate fields
customizerToggle.addEventListener('click', () => {
  customizerModal.classList.add('active');
  
  // Populate text inputs
  document.getElementById('inputCrushName').value = localConfig.crushName;
  document.getElementById('inputYourName').value = localConfig.yourName;
  document.getElementById('inputQuestionTitle').value = localConfig.questionTitle;
  document.getElementById('inputQuestionText').value = localConfig.questionText;
  document.getElementById('inputYesBtn').value = localConfig.yesButtonText;
  document.getElementById('inputNoBtn').value = localConfig.noButtonText;
  document.getElementById('inputPhone').value = localConfig.whatsappNumber || '';

  // Dynamic slides configs
  const container = document.getElementById('slidesConfigContainer');
  container.innerHTML = '';
  
  localConfig.slides.forEach((slide, index) => {
    addSlideFormBlock(slide.title, slide.text, slide.image, index);
  });
});

// Close Modal
closeModal.addEventListener('click', () => {
  customizerModal.classList.remove('active');
});

// Close Modal clicking outside
window.addEventListener('click', (e) => {
  if (e.target === customizerModal) {
    customizerModal.classList.remove('active');
  }
});

// Helper: Add custom slide fields in modal
function addSlideFormBlock(title = '', text = '', image = '', index) {
  const container = document.getElementById('slidesConfigContainer');
  const div = document.createElement('div');
  div.className = 'slide-form-block';
  div.dataset.index = index;
  
  div.innerHTML = `
    <button type="button" class="remove-slide-btn">&times;</button>
    <div class="form-group">
      <label>Slide ${index + 1} Title</label>
      <input type="text" class="slide-input-title" value="${title}" placeholder="e.g. From the moment we met..." required>
    </div>
    <div class="form-group">
      <label>Slide ${index + 1} Body Description</label>
      <textarea class="slide-input-text" rows="2" placeholder="Write something romantic..." required>${text}</textarea>
    </div>
    <div class="form-group">
      <label>Photo URL (Optional - leave empty for default graphics)</label>
      <input type="text" class="slide-input-img" value="${image}" placeholder="e.g. https://domain.com/photo.jpg">
    </div>
  `;
  
  // Remove slide handler
  div.querySelector('.remove-slide-btn').addEventListener('click', () => {
    div.remove();
    reindexSlideBlocks();
  });

  container.appendChild(div);
}

function reindexSlideBlocks() {
  const blocks = document.querySelectorAll('.slide-form-block');
  blocks.forEach((block, index) => {
    block.dataset.index = index;
    block.querySelector('label').innerText = `Slide ${index + 1} Title`;
    block.querySelectorAll('label')[1].innerText = `Slide ${index + 1} Body Description`;
  });
}

// Add empty slide block trigger
document.getElementById('addSlideBtn').addEventListener('click', () => {
  const index = document.querySelectorAll('.slide-form-block').length;
  addSlideFormBlock('', '', '', index);
});

// Save locally to browser
document.getElementById('saveLocalBtn').addEventListener('click', () => {
  saveFormConfig();
  localStorage.setItem('proposal_config', JSON.stringify(localConfig));
  showToast("Saved settings in browser! 💖");
  
  // Reload page to reflect config reset variables
  setTimeout(() => window.location.reload(), 1000);
});

// Reset configuration back to config.js defaults
document.getElementById('resetConfigBtn').addEventListener('click', () => {
  localStorage.removeItem('proposal_config');
  window.location.hash = ''; // Clear share link config
  showToast("Reset back to default config! 🔄");
  setTimeout(() => window.location.reload(), 1000);
});

// Generate share link
document.getElementById('shareBtn').addEventListener('click', () => {
  saveFormConfig();
  
  // Convert config to base64 string
  const configString = JSON.stringify(localConfig);
  const base64Config = btoa(unescape(encodeURIComponent(configString)));
  
  // Update browser hash and copy URL to clipboard
  const shareURL = `${window.location.origin}${window.location.pathname}#config=${base64Config}`;
  
  navigator.clipboard.writeText(shareURL)
    .then(() => {
      showToast("Shareable link copied to clipboard! 📋💖");
      customizerModal.classList.remove('active');
    })
    .catch((err) => {
      console.error('Could not copy link: ', err);
      // Fallback: prompt copy link
      prompt("Copy this customized proposal link to send to your crush:", shareURL);
    });
});

// Helper: Save form fields to localConfig object
function saveFormConfig() {
  localConfig.crushName = document.getElementById('inputCrushName').value;
  localConfig.yourName = document.getElementById('inputYourName').value;
  localConfig.questionTitle = document.getElementById('inputQuestionTitle').value;
  localConfig.questionText = document.getElementById('inputQuestionText').value;
  localConfig.yesButtonText = document.getElementById('inputYesBtn').value;
  localConfig.noButtonText = document.getElementById('inputNoBtn').value;
  localConfig.whatsappNumber = document.getElementById('inputPhone').value;

  // Extract slides
  const blocks = document.querySelectorAll('.slide-form-block');
  const slides = [];
  
  blocks.forEach(block => {
    slides.push({
      title: block.querySelector('.slide-input-title').value,
      text: block.querySelector('.slide-input-text').value,
      image: block.querySelector('.slide-input-img').value
    });
  });

  if (slides.length > 0) {
    localConfig.slides = slides;
  }
}

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
