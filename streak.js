// Description: This script is used to track the number of days a user has pressed a button in a row.
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('streak-button');
    const streakCountElement = document.getElementById('streak-count');
    const progressBar = document.getElementById('progress-bar');
    const messages = [
        "Great job! Keep going!",
        "You're doing amazing!",
        "Keep up the good work!",
        "Fantastic! Don't stop now!",
        "You're on fire!"
    ];

    let streak = parseInt(localStorage.getItem('streak')) || 0;

    // Update UI initially
    updateUI();

    // Simplified button click handler
    button.addEventListener('click', async () => {
        streak++;
        localStorage.setItem('streak', streak);
        updateUI();
        showMotivationalMessage();
        animateButton();
        await sendDiscordNotification(`🎯 Current streak: ${streak} days`);
    });

    function updateUI() {
        streakCountElement.textContent = `Streak: ${streak} days`;
        updateBackgroundColor(streak);
        updateProgressBar(streak);
    }

    async function sendDiscordNotification(message) {
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: message
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log('Discord notification sent successfully');
        } catch (error) {
            console.error('Failed to send Discord notification:', error);
        }
    }

    function showMotivationalMessage() {
        const message = messages[Math.floor(Math.random() * messages.length)];
        alert(message);
    }

    function animateButton() {
        button.classList.add('animate');
        setTimeout(() => {
            button.classList.remove('animate');
        }, 500);
    }

    function updateBackgroundColor(streak) {
        const brightness = Math.min(100, streak * 10);
        document.body.style.backgroundColor = `hsl(200, 100%, ${brightness}%)`;
    }

    function updateProgressBar(streak) {
        const maxStreak = 90;
        const progress = (streak / maxStreak) * 1000;
        progressBar.style.width = `${Math.min(100, progress)}%`;
    }

    // Add to existing DOMContentLoaded event listener
    const settingsButton = document.getElementById('settings-button');
    const modal = document.getElementById('settings-modal');

    settingsButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const resetProgress = document.getElementById('reset-progress');

    // Load dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.body.style.backgroundImage = "url('black.png')";
        darkModeToggle.checked = true;
    } else {
        document.body.style.backgroundImage = "url('white.png')";
    }

    // Settings button click handler
    settingsButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        if (darkModeToggle.checked) {
            document.body.style.backgroundImage = "url('black.png')";
        } else {
            document.body.style.backgroundImage = "url('white.png')";
        }
        localStorage.setItem('darkMode', darkModeToggle.checked);
    });

    // Reset progress
    resetProgress.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
            localStorage.removeItem('streak');
            localStorage.removeItem('lastPressDate');
            streak = 0;
            updateUI();
            modal.style.display = 'none';
        }
    });
});