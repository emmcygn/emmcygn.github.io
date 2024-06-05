document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const minutesInput = document.getElementById('minutes');
    const timeDisplay = document.getElementById('timeDisplay');
    let timer;

    startButton.addEventListener('click', () => {
        clearInterval(timer);
        const minutes = parseInt(minutesInput.value);
        if (isNaN(minutes) || minutes <= 0) {
            alert('Please enter a valid number of minutes.');
            return;
        }

        let remainingTime = minutes * 60;
        updateDisplay(remainingTime);

        timer = setInterval(() => {
            remainingTime -= 1;
            updateDisplay(remainingTime);

            if (remainingTime <= 0) {
                clearInterval(timer);
                alert('Time\'s up!');
            }
        }, 1000);
    });

    function updateDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
});
