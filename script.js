/* ============================================
   TypeFlow — script.js
   Complete application logic
   ============================================ */

(function () {
  'use strict';

  // ── Paragraph Samples ──
  const paragraphs = {
    easy: [
      "The sun was warm on her face as she walked through the park. Birds sang in the trees and a light breeze carried the scent of flowers. She smiled and kept walking along the path.",
      "He opened the book and began to read the first page. The story was about a boy who found a magic stone in his garden. It could grant three wishes to anyone who held it.",
      "The cat sat on the mat and looked out the window. Rain was falling and the sky was grey. She wished she could go outside but it was too cold and wet today.",
      "I like to cook dinner for my family on the weekends. My best dish is pasta with tomato sauce and fresh herbs from the garden. Everyone always asks for more.",
      "The dog ran across the field chasing a ball. His tail wagged with joy as he brought it back. He dropped it at my feet and barked for me to throw it once more.",
      "She packed her bag with care and checked her list twice. The trip would take three days and she did not want to forget anything. She locked the door and left.",
      "The market was full of people buying fresh food. There were apples and oranges stacked in neat rows. The smell of bread from the bakery filled the air around them.",
      "Music played softly in the background as they ate dinner. The candles on the table gave a warm glow to the room. It was a perfect evening with good friends.",
      "He learned to ride a bike when he was five years old. At first he fell many times but he never gave up. Now he rides every day to school and back home.",
      "The stars came out one by one as the sun went down. The sky turned from orange to deep blue and then to black. The moon was full and bright that night."
    ],
    medium: [
      "The evolution of technology has fundamentally transformed how we communicate and interact with one another. From the invention of the telephone to the rise of social media platforms, each advancement has brought people closer together while simultaneously creating new challenges for society to navigate.",
      "Programming is both an art and a science that requires creativity and logical thinking in equal measure. The best developers understand that writing clean and maintainable code is just as important as making the software function correctly for its intended users.",
      "Climate change represents one of the most pressing challenges facing humanity in the twenty-first century. Scientists around the world are working tirelessly to develop sustainable solutions that can help reduce carbon emissions while maintaining economic growth and prosperity for future generations.",
      "The art of effective communication extends far beyond simply choosing the right words to express your thoughts. It involves active listening, understanding body language, and being able to adapt your message to suit different audiences and contexts throughout your daily interactions.",
      "Artificial intelligence continues to reshape industries across the global economy, from healthcare diagnostics to autonomous vehicle navigation. While these advancements promise increased efficiency and new capabilities, they also raise important questions about privacy, employment, and ethical decision making.",
      "The history of exploration is filled with remarkable stories of courage and determination against overwhelming odds. From ancient seafarers navigating by the stars to modern astronauts venturing into the cosmos, humans have always been driven by an insatiable curiosity about the unknown.",
      "Education systems worldwide are undergoing significant transformation as digital tools become increasingly integrated into classroom learning. Teachers are adapting their methods to incorporate interactive technologies while maintaining the fundamental principles of critical thinking and creative problem solving.",
      "The global economy operates as a complex interconnected system where events in one region can have cascading effects across markets worldwide. Understanding these dynamics requires knowledge of trade policies, currency fluctuations, and the delicate balance between supply and demand.",
      "Photography has evolved from a purely technical craft into a powerful medium for artistic expression and social commentary. Modern photographers use digital tools to push creative boundaries while honoring the compositional principles established by pioneers of the medium decades ago.",
      "Physical exercise provides numerous benefits that extend well beyond simple weight management and cardiovascular health. Regular activity has been shown to improve mental clarity, reduce symptoms of anxiety and depression, and enhance overall quality of life for people of all ages."
    ],
    hard: [
      "The epistemological foundations of quantum mechanics challenge our conventional understanding of reality, suggesting that observation itself plays a fundamental role in determining the state of subatomic particles. Heisenberg's uncertainty principle and Schrodinger's wave equation have profound philosophical implications that continue to spark debate among physicists and philosophers alike.",
      "Cryptocurrency and blockchain technology represent a paradigmatic shift in how we conceptualize financial transactions, decentralized governance, and digital trust. The implementation of smart contracts on platforms like Ethereum has enabled unprecedented autonomy in executing complex agreements without intermediary oversight, fundamentally restructuring traditional institutional frameworks.",
      "The neuroplasticity of the human brain demonstrates remarkable adaptability, with synaptic connections continuously reorganizing in response to experiential stimuli and environmental pressures. Contemporary neuroscience research utilizing functional magnetic resonance imaging has revealed that meditation and mindfulness practices can measurably alter cortical thickness and amygdala responsivity.",
      "Biodiversity conservation requires multifaceted approaches that simultaneously address habitat fragmentation, anthropogenic climate disruption, and the socioeconomic pressures driving unsustainable resource extraction. Effective environmental stewardship necessitates collaborative international frameworks that balance ecological preservation with the developmental aspirations of communities dependent on natural resource utilization.",
      "The architectural philosophy of microservices emphasizes decomposing monolithic applications into independently deployable, loosely coupled services that communicate through well-defined application programming interfaces. This distributed systems approach facilitates horizontal scalability, technological heterogeneity, and organizational autonomy while introducing challenges in service orchestration and data consistency.",
      "Psycholinguistic research into bilingual cognition has revealed that managing multiple languages simultaneously engages executive function networks, potentially conferring cognitive advantages in task switching, attentional control, and metalinguistic awareness. The critical period hypothesis continues to generate scholarly discussion regarding the neurobiological constraints on second language acquisition.",
      "The thermodynamic principles governing entropy and energy transformation establish fundamental constraints on the efficiency of all physical and biological systems. The second law of thermodynamics, which describes the inexorable increase of disorder in closed systems, has profound implications for understanding everything from stellar evolution to the biochemical processes sustaining cellular metabolism.",
      "Contemporary discourse surrounding artificial general intelligence encompasses philosophical questions about consciousness, phenomenological experience, and the computational requirements for achieving human-equivalent cognitive capabilities. The alignment problem, which addresses ensuring that superintelligent systems remain compatible with human values, represents perhaps the most consequential engineering challenge of the twenty-first century.",
      "Geopolitical dynamics in the Indo-Pacific region reflect the complex interplay between established hegemonic structures and emerging multipolar power configurations. Strategic competition manifests through technological decoupling, infrastructure investment initiatives, and maritime territorial assertions, with significant implications for global supply chain resilience and international security architectures.",
      "The pharmacokinetic profiles of novel therapeutic compounds must be comprehensively characterized through rigorous preclinical and clinical evaluation methodologies, encompassing absorption, distribution, metabolism, and excretion parameters. Regulatory frameworks established by organizations such as the Food and Drug Administration mandate extensive documentation demonstrating both safety and efficacy before market authorization."
    ]
  };

  // ── State ──
  let state = {
    userName: localStorage.getItem('typeflow_username') || '',
    currentTheme: localStorage.getItem('typeflow_theme') || 'dark',
    soundEnabled: localStorage.getItem('typeflow_sound') === 'true',
    particlesEnabled: localStorage.getItem('typeflow_particles') !== 'false',
    timeMode: 30,
    difficulty: 'medium',
    testActive: false,
    testStarted: false,
    currentText: '',
    charIndex: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalTyped: 0,
    currentStreak: 0,
    bestStreak: 0,
    timer: null,
    timeLeft: 30,
    startTime: null,
    speedData: [],
    backspaceCount: 0,
    lastBackspaceTime: 0
  };

  // ── Sound Effects (Web Audio API) ──
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSound(type) {
    if (!state.soundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.value = 0.05;

    if (type === 'key') {
      osc.frequency.value = 600 + Math.random() * 200;
      osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start(); osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'error') {
      osc.frequency.value = 200;
      osc.type = 'square';
      gain.gain.value = 0.03;
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.start(); osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === 'complete') {
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }
  }

  // ── Particles ──
  let particlesAnimation = null;

  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const count = window.innerWidth < 768 ? 30 : 60;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    function draw() {
      if (!state.particlesEnabled) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesAnimation = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      });

      particlesAnimation = requestAnimationFrame(draw);
    }
    draw();
  }

  // ── Animated Counter ──
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          let current = 0;
          const increment = target / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString() + (target >= 1000 ? '+' : '');
          }, 16);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // ── Theme ──
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.currentTheme = theme;
    localStorage.setItem('typeflow_theme', theme);

    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.textContent = theme === 'light' ? '☀' : '🌙';
    }
  }

  // ── Navbar & Settings ──
  function initNavbar() {
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsPanel = document.getElementById('settingsPanel');
    const themeToggle = document.getElementById('themeToggle');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
      });
    }

    if (settingsToggle && settingsPanel) {
      settingsToggle.addEventListener('click', () => {
        settingsPanel.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!settingsPanel.contains(e.target) && e.target !== settingsToggle) {
          settingsPanel.classList.remove('open');
        }
      });
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const themes = ['dark', 'light', 'ocean', 'sunset'];
        const idx = themes.indexOf(state.currentTheme);
        applyTheme(themes[(idx + 1) % themes.length]);
      });
    }

    // Theme option buttons
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });

    // Sound toggle
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
      soundToggle.checked = state.soundEnabled;
      soundToggle.addEventListener('change', () => {
        state.soundEnabled = soundToggle.checked;
        localStorage.setItem('typeflow_sound', state.soundEnabled);
        if (state.soundEnabled) initAudio();
      });
    }

    // Particles toggle
    const particlesToggle = document.getElementById('particlesToggle');
    if (particlesToggle) {
      particlesToggle.checked = state.particlesEnabled;
      particlesToggle.addEventListener('change', () => {
        state.particlesEnabled = particlesToggle.checked;
        localStorage.setItem('typeflow_particles', state.particlesEnabled);
      });
    }
  }

  // ── Daily Challenge ──
  function getDailyChallenge() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('typeflow_daily');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) return data;
    }
    const target = 40 + Math.floor(Math.random() * 60);
    const challenge = { date: today, target, completed: false };
    localStorage.setItem('typeflow_daily', JSON.stringify(challenge));
    return challenge;
  }

  // ── Typing Test Logic ──
  function initTypingTest() {
    const userSetup = document.getElementById('userSetup');
    const userNameInput = document.getElementById('userName');
    const startSetupBtn = document.getElementById('startSetup');
    const testControls = document.getElementById('testControls');
    const testStats = document.getElementById('testStats');
    const progressContainer = document.getElementById('progressContainer');
    const typingArea = document.getElementById('typingArea');
    const testActions = document.getElementById('testActions');
    const analyticsPanel = document.getElementById('analyticsPanel');
    const keyboardViz = document.getElementById('keyboardViz');
    const typingText = document.getElementById('typingText');
    const typingInput = document.getElementById('typingInput');
    const typingOverlay = document.getElementById('typingOverlay');

    if (!userSetup) return; // Not on test page

    // Daily challenge
    const daily = getDailyChallenge();
    const dailyBadge = document.getElementById('dailyBadge');
    const dailyTarget = document.getElementById('dailyTarget');
    if (dailyBadge && dailyTarget && !daily.completed) {
      dailyBadge.style.display = 'inline-flex';
      dailyTarget.textContent = daily.target;
    }

    // Restore username
    if (state.userName) {
      userNameInput.value = state.userName;
    }

    // Setup continue
    startSetupBtn.addEventListener('click', startSetup);
    userNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') startSetup();
    });

    function startSetup() {
      const name = userNameInput.value.trim();
      if (!name) {
        userNameInput.style.borderColor = 'var(--accent-red)';
        userNameInput.focus();
        return;
      }
      state.userName = name;
      localStorage.setItem('typeflow_username', name);

      userSetup.style.display = 'none';
      testControls.style.display = 'flex';
      testStats.style.display = 'flex';
      progressContainer.style.display = 'block';
      typingArea.style.display = 'block';
      testActions.style.display = 'flex';
      analyticsPanel.style.display = 'block';
      keyboardViz.style.display = 'block';

      generateText();
      renderText();
    }

    // Time mode buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.timeMode = parseInt(btn.dataset.time);
        state.timeLeft = state.timeMode;
        document.getElementById('liveTimer').textContent = state.timeLeft;
        resetTest();
      });
    });

    // Difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.difficulty = btn.dataset.difficulty;
        resetTest();
      });
    });

    // Generate text
    function generateText() {
      const pool = paragraphs[state.difficulty] || paragraphs.medium;
      const idx = Math.floor(Math.random() * pool.length);
      let text = pool[idx];
      // For longer tests, combine paragraphs
      if (state.timeMode >= 60) {
        const idx2 = (idx + 1) % pool.length;
        text += ' ' + pool[idx2];
      }
      if (state.timeMode >= 120) {
        const idx3 = (idx + 2) % pool.length;
        text += ' ' + pool[idx3];
      }
      state.currentText = text;
    }

    // Render text with char spans
    function renderText() {
      typingText.innerHTML = '';
      state.currentText.split('').forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char' + (i === 0 ? ' current' : '');
        span.textContent = ch;
        typingText.appendChild(span);
      });
    }

    // Overlay click to start
    typingOverlay.addEventListener('click', () => {
      typingOverlay.classList.add('hidden');
      typingInput.focus();
    });

    typingArea.addEventListener('click', () => {
      if (!typingOverlay.classList.contains('hidden')) {
        typingOverlay.classList.add('hidden');
      }
      typingInput.focus();
    });

    // Anti-cheat: disable paste, context menu, selection
    typingInput.addEventListener('paste', (e) => e.preventDefault());
    typingInput.addEventListener('copy', (e) => e.preventDefault());
    typingInput.addEventListener('cut', (e) => e.preventDefault());
    typingArea.addEventListener('contextmenu', (e) => e.preventDefault());

    // Main input handler
    typingInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { e.preventDefault(); return; }

      // Start test on first real keypress
      if (!state.testStarted && !state.testActive && e.key.length === 1) {
        startTest();
      }

      if (!state.testActive) return;

      // Anti-cheat: backspace spam detection
      if (e.key === 'Backspace') {
        const now = Date.now();
        if (now - state.lastBackspaceTime < 50) {
          state.backspaceCount++;
        } else {
          state.backspaceCount = Math.max(0, state.backspaceCount - 1);
        }
        state.lastBackspaceTime = now;

        if (state.backspaceCount > 20) {
          // Suspicious behavior - just ignore excessive backspaces
          e.preventDefault();
          return;
        }

        // Allow backspace
        if (state.charIndex > 0) {
          state.charIndex--;
          state.totalTyped = Math.max(0, state.totalTyped - 1);
          const chars = typingText.querySelectorAll('.char');
          chars[state.charIndex].className = 'char current';
          if (state.charIndex + 1 < chars.length) {
            chars[state.charIndex + 1].className = 'char';
          }
          // Recalculate correct/incorrect from scratch
          recalculateStats();
          updateLiveStats();
        }
        e.preventDefault();
        return;
      }

      // Only process printable characters
      if (e.key.length !== 1) return;
      e.preventDefault();

      if (state.charIndex >= state.currentText.length) return;

      const chars = typingText.querySelectorAll('.char');
      const expected = state.currentText[state.charIndex];
      const typed = e.key;

      state.totalTyped++;

      if (typed === expected) {
        chars[state.charIndex].className = 'char correct';
        state.correctChars++;
        state.currentStreak++;
        if (state.currentStreak > state.bestStreak) {
          state.bestStreak = state.currentStreak;
        }
        playSound('key');
      } else {
        chars[state.charIndex].className = 'char incorrect';
        state.incorrectChars++;
        state.currentStreak = 0;
        playSound('error');

        // Highlight error key on keyboard
        highlightKeyError(expected);
      }

      state.charIndex++;

      // Set next current char
      if (state.charIndex < chars.length) {
        chars[state.charIndex].classList.add('current');
      }

      // Highlight keyboard
      highlightKey(typed);

      updateLiveStats();
      updateProgress();

      // Check if text is completed
      if (state.charIndex >= state.currentText.length) {
        endTest();
      }
    });

    function recalculateStats() {
      const chars = typingText.querySelectorAll('.char');
      state.correctChars = 0;
      state.incorrectChars = 0;
      for (let i = 0; i < state.charIndex; i++) {
        if (chars[i].classList.contains('correct')) state.correctChars++;
        if (chars[i].classList.contains('incorrect')) state.incorrectChars++;
      }
    }

    function startTest() {
      state.testActive = true;
      state.testStarted = true;
      state.startTime = Date.now();
      state.timeLeft = state.timeMode;
      state.speedData = [];

      if (state.soundEnabled) initAudio();

      // Start timer
      state.timer = setInterval(() => {
        state.timeLeft--;
        document.getElementById('liveTimer').textContent = state.timeLeft;
        updateProgress();

        // Record speed data every 5 seconds
        const elapsed = state.timeMode - state.timeLeft;
        if (elapsed > 0 && elapsed % 5 === 0) {
          const wpm = calculateWPM();
          state.speedData.push({ time: elapsed, wpm });
        }

        if (state.timeLeft <= 0) {
          endTest();
        }
      }, 1000);
    }

    function calculateWPM() {
      const elapsed = (Date.now() - state.startTime) / 1000 / 60;
      if (elapsed === 0) return 0;
      return Math.round((state.correctChars / 5) / elapsed);
    }

    function calculateAccuracy() {
      if (state.totalTyped === 0) return 100;
      return Math.round((state.correctChars / state.totalTyped) * 100);
    }

    function updateLiveStats() {
      document.getElementById('liveWpm').textContent = calculateWPM();
      document.getElementById('liveAccuracy').textContent = calculateAccuracy() + '%';
      document.getElementById('liveErrors').textContent = state.incorrectChars;
      document.getElementById('liveChars').textContent = state.totalTyped;
      document.getElementById('bestStreak').textContent = state.bestStreak;
      document.getElementById('avgSpeed').textContent = calculateWPM();
    }

    function updateProgress() {
      const progress = ((state.timeMode - state.timeLeft) / state.timeMode) * 100;
      document.getElementById('progressBar').style.width = progress + '%';
    }

    function endTest() {
      state.testActive = false;
      if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
      }

      // Final speed data point
      const finalWpm = calculateWPM();
      const elapsed = state.timeMode - state.timeLeft;
      if (elapsed > 0) {
        state.speedData.push({ time: elapsed, wpm: finalWpm });
      }

      playSound('complete');
      drawSpeedChart();
      updateConsistency();
      showResults(finalWpm, calculateAccuracy());
    }

    function showResults(wpm, accuracy) {
      const modal = document.getElementById('resultsModal');
      const gradeEl = document.getElementById('resultGrade');

      document.getElementById('resultWpm').textContent = wpm;
      document.getElementById('resultAccuracy').textContent = accuracy + '%';
      document.getElementById('resultErrors').textContent = state.incorrectChars;
      document.getElementById('resultTime').textContent = (state.timeMode - state.timeLeft) + 's';

      // Grade
      let grade, gradeClass;
      if (wpm >= 80) { grade = 'Elite'; gradeClass = 'elite'; }
      else if (wpm >= 60) { grade = 'Pro'; gradeClass = 'pro'; }
      else if (wpm >= 35) { grade = 'Average'; gradeClass = 'average'; }
      else { grade = 'Beginner'; gradeClass = 'beginner'; }

      gradeEl.textContent = grade;
      gradeEl.className = 'result-grade ' + gradeClass;

      modal.classList.add('active');

      // Confetti for WPM > 60
      if (wpm > 60) {
        launchConfetti();
      }

      // Check daily challenge
      const daily = getDailyChallenge();
      if (!daily.completed && wpm >= daily.target) {
        daily.completed = true;
        localStorage.setItem('typeflow_daily', JSON.stringify(daily));
        const badge = document.getElementById('dailyBadge');
        if (badge) badge.style.display = 'none';
      }

      // Store best score
      const bestScore = parseInt(localStorage.getItem('typeflow_best_wpm') || '0');
      if (wpm > bestScore) {
        localStorage.setItem('typeflow_best_wpm', wpm);
      }
    }

    // Save score
    document.getElementById('saveScoreBtn')?.addEventListener('click', () => {
      const scores = JSON.parse(localStorage.getItem('typeflow_scores') || '[]');
      scores.push({
        name: state.userName,
        wpm: calculateWPM(),
        accuracy: calculateAccuracy(),
        timeMode: state.timeMode,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
      });
      localStorage.setItem('typeflow_scores', JSON.stringify(scores));

      const btn = document.getElementById('saveScoreBtn');
      btn.textContent = 'Saved!';
      btn.disabled = true;
      btn.style.opacity = '0.6';
    });

    // Retry
    document.getElementById('retryBtn')?.addEventListener('click', () => {
      document.getElementById('resultsModal').classList.remove('active');
      resetTest();
    });

    // Restart
    document.getElementById('restartBtn')?.addEventListener('click', resetTest);

    // Stop
    document.getElementById('stopBtn')?.addEventListener('click', () => {
      if (state.testActive) endTest();
    });

    function resetTest() {
      state.testActive = false;
      state.testStarted = false;
      state.charIndex = 0;
      state.correctChars = 0;
      state.incorrectChars = 0;
      state.totalTyped = 0;
      state.currentStreak = 0;
      state.bestStreak = 0;
      state.timeLeft = state.timeMode;
      state.speedData = [];
      state.backspaceCount = 0;

      if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
      }

      document.getElementById('liveWpm').textContent = '0';
      document.getElementById('liveAccuracy').textContent = '100%';
      document.getElementById('liveErrors').textContent = '0';
      document.getElementById('liveTimer').textContent = state.timeMode;
      document.getElementById('liveChars').textContent = '0';
      document.getElementById('progressBar').style.width = '0%';
      document.getElementById('bestStreak').textContent = '0';
      document.getElementById('avgSpeed').textContent = '0';
      document.getElementById('consistency').textContent = '0%';

      const saveBtn = document.getElementById('saveScoreBtn');
      if (saveBtn) {
        saveBtn.textContent = '💾 Save Score';
        saveBtn.disabled = false;
        saveBtn.style.opacity = '1';
      }

      typingInput.value = '';
      typingOverlay.classList.remove('hidden');

      generateText();
      renderText();
      clearSpeedChart();
    }

    // Keyboard Visualizer
    function highlightKey(key) {
      const kbKey = document.querySelector(`.kb-key[data-key="${key.toLowerCase()}"]`);
      if (kbKey) {
        kbKey.classList.add('pressed');
        setTimeout(() => kbKey.classList.remove('pressed'), 150);
      }
    }

    function highlightKeyError(expected) {
      const kbKey = document.querySelector(`.kb-key[data-key="${expected.toLowerCase()}"]`);
      if (kbKey) {
        kbKey.classList.add('error-key');
        setTimeout(() => kbKey.classList.remove('error-key'), 300);
      }
    }

    // Speed Chart (Canvas)
    function drawSpeedChart() {
      const canvas = document.getElementById('speedChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const data = state.speedData;
      if (data.length < 2) return;

      const maxWpm = Math.max(...data.map(d => d.wpm), 10);
      const padding = { top: 20, right: 20, bottom: 30, left: 50 };
      const w = canvas.width - padding.left - padding.right;
      const h = canvas.height - padding.top - padding.bottom;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(maxWpm * (1 - i / 4)), padding.left - 8, y + 4);
      }

      // X axis labels
      ctx.textAlign = 'center';
      data.forEach((d, i) => {
        const x = padding.left + (w / (data.length - 1)) * i;
        ctx.fillText(d.time + 's', x, canvas.height - 8);
      });

      // Gradient fill
      const gradient = ctx.createLinearGradient(0, padding.top, 0, canvas.height - padding.bottom);
      gradient.addColorStop(0, 'rgba(0, 229, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(padding.left, canvas.height - padding.bottom);
      data.forEach((d, i) => {
        const x = padding.left + (w / (data.length - 1)) * i;
        const y = padding.top + h - (d.wpm / maxWpm) * h;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(padding.left + w, canvas.height - padding.bottom);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Line
      ctx.beginPath();
      data.forEach((d, i) => {
        const x = padding.left + (w / (data.length - 1)) * i;
        const y = padding.top + h - (d.wpm / maxWpm) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Dots
      data.forEach((d, i) => {
        const x = padding.left + (w / (data.length - 1)) * i;
        const y = padding.top + h - (d.wpm / maxWpm) * h;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00e5ff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    function clearSpeedChart() {
      const canvas = document.getElementById('speedChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function updateConsistency() {
      if (state.speedData.length < 2) {
        document.getElementById('consistency').textContent = '0%';
        return;
      }
      const wpms = state.speedData.map(d => d.wpm);
      const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      const variance = wpms.reduce((sum, w) => sum + Math.pow(w - avg, 2), 0) / wpms.length;
      const stdDev = Math.sqrt(variance);
      const consistency = avg > 0 ? Math.max(0, Math.round(100 - (stdDev / avg) * 100)) : 0;
      document.getElementById('consistency').textContent = consistency + '%';
    }

    // Initialize with default state
    state.timeLeft = state.timeMode;
    document.getElementById('liveTimer').textContent = state.timeLeft;
  }

  // ── Confetti ──
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#00e5ff', '#b44aff', '#00ff88', '#ff3d5a', '#ffcc00', '#3d7aff'];

    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: -Math.random() * 15 - 5,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.3
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      pieces.forEach(p => {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.vx *= 0.99;

        if (p.y < canvas.height + 50) alive = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / 120);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frame++;
      if (alive && frame < 120) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animate();
  }

  // ── Leaderboard ──
  function initLeaderboard() {
    const body = document.getElementById('leaderboardBody');
    const empty = document.getElementById('leaderboardEmpty');
    if (!body) return;

    let currentFilter = 'all';

    function render() {
      const scores = JSON.parse(localStorage.getItem('typeflow_scores') || '[]');
      let filtered = currentFilter === 'all'
        ? scores
        : scores.filter(s => s.timeMode === parseInt(currentFilter));

      filtered.sort((a, b) => b.wpm - a.wpm);

      if (filtered.length === 0) {
        body.innerHTML = '';
        empty.style.display = 'block';
        body.closest('.leaderboard-table-wrap').style.display = 'none';
        return;
      }

      empty.style.display = 'none';
      body.closest('.leaderboard-table-wrap').style.display = 'block';

      body.innerHTML = filtered.map((s, i) => {
        const rank = i + 1;
        let rankClass = 'default';
        if (rank === 1) rankClass = 'gold';
        else if (rank === 2) rankClass = 'silver';
        else if (rank === 3) rankClass = 'bronze';

        return `<tr>
          <td><span class="rank-badge ${rankClass}">${rank}</span></td>
          <td><strong>${escapeHtml(s.name)}</strong></td>
          <td class="wpm-cell">${s.wpm}</td>
          <td class="accuracy-cell">${s.accuracy}%</td>
          <td>${s.timeMode}s</td>
          <td>${s.date}</td>
        </tr>`;
      }).join('');
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
      });
    });

    // Clear button
    document.getElementById('clearLeaderboard')?.addEventListener('click', () => {
      if (confirm('Clear all leaderboard data?')) {
        localStorage.removeItem('typeflow_scores');
        render();
      }
    });

    render();
  }

  // ── Utility ──
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Scroll Animations ──
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-in').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // ── Init ──
  function init() {
    applyTheme(state.currentTheme);
    initNavbar();
    initParticles();
    animateCounters();
    initTypingTest();
    initLeaderboard();
    initScrollAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
