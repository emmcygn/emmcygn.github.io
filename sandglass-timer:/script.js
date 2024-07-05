// script.js
document.addEventListener('DOMContentLoaded', () => {
    const startPauseButton = document.getElementById('startPauseButton');
    const resetButton = document.getElementById('resetButton');
    const minutesInput = document.getElementById('minutes');
    const timeDisplay = document.getElementById('timeDisplay');
    const sandTop = document.querySelector('.sand-top');
    const sandBottom = document.querySelector('.sand-bottom');
    let timer;
    let remainingTime;
    let isPaused = false;
    let isRunning = false;
    let startTime;
    let pauseStartTime;
    let duration;
    let animationTimeline;

    startPauseButton.addEventListener('click', () => {
        if (isRunning) {
            isPaused = !isPaused;
            if (isPaused) {
                pauseStartTime = Date.now();
                animationTimeline.pause();
                startPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                const pausedDuration = Date.now() - pauseStartTime;
                startTime += pausedDuration;
                animationTimeline.resume();
                startPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
            }
        } else {
            const minutes = parseInt(minutesInput.value);
            if (isNaN(minutes) || minutes <= 0) {
                alert('Please enter a valid number of minutes.');
                return;
            }

            remainingTime = minutes * 60;
            duration = remainingTime;
            startTime = Date.now();
            updateDisplay(remainingTime);
            startAnimations(duration);
            isRunning = true;
            startPauseButton.innerHTML = '<i class="fas fa-pause"></i>';

            if (timer) clearInterval(timer);

            timer = setInterval(() => {
                if (!isPaused) {
                    remainingTime -= 1;
                    updateDisplay(remainingTime);

                    if (remainingTime <= 0) {
                        clearInterval(timer);
                        alert('Time\'s up!');
                        resetAnimations();
                        isRunning = false;
                        startPauseButton.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }
            }, 1000);
        }
    });

    resetButton.addEventListener('click', () => {
        clearInterval(timer);
        remainingTime = duration;
        updateDisplay(remainingTime);
        resetAnimations();
        startPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        isPaused = false;
        isRunning = false;
    });

    function updateDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function startAnimations(duration) {
        animationTimeline = gsap.timeline();
        gsap.set(sandTop, { height: '50%', top: '0%' }); // Initial state of sandTop
        gsap.set(sandBottom, { height: '0%' }); // Initial state of sandBottom
        animationTimeline.to(sandTop, { height: '0%', top: '50%', duration: duration, ease: 'linear' });
        animationTimeline.to(sandBottom, { height: '50%', duration: duration, ease: 'linear' }, 0);
    }
    

    function resetAnimations() {
        if (animationTimeline) {
            animationTimeline.kill();
        }
        gsap.set(sandTop, { height: '50%', top: '0%' });
        gsap.set(sandBottom, { height: '0%' });
    }
});
