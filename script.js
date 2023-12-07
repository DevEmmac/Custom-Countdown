const timeElements = document.querySelectorAll('span');
let id = (id) => document.getElementById(id);

let inputContainer = id('input-container'),
    countdownForm = id('countdownForm'),
    countdownEl = id('countdown'),
    countdownElTitle = id('countdown-title'),
    countdownBtn = id('countdown-button'),
    completeEl = id('complete'),
    completeElInfo = id('complete-info'),
    completeBtn = id('complete-button'),
    dateEl = id('date-picker');

    let countdownTitle = '';
    let countdownDate = '';
    let countdownValue = new Date();
    let countdownActive;
    let savedCountdown;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Set Date Input Min with Today's Date
    const today = new Date().toISOString().split('T')[0];
    dateEl.setAttribute('min', today);

    // populate CountDown / Complete UI
    function updateDOM () {
        countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second); 

        // Hiden Input
        inputContainer.hidden = true;

        // if the countdownn has ended, show complete
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
        // Else, show the countdown in progress
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
       }, second);
    }

    // Take values from Form Input
    function updateCountdown (e) {
        e.preventDefault();
        countdownTitle = e.srcElement[0].value;
        countdownDate = e.srcElement[1].value;
        savedCountdown = {
            title: countdownTitle,
            date: countdownDate,
        };
        localStorage.setItem('countdown', JSON.stringify(savedCountdown));
        // Check if no date entered
        if (countdownDate === '') {
           alert('please select a date for the countdown.');
        } else {
            // Get number version of current Date, updateDOM.
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
        }
    }

    // Reset All Values
    function reset () {
        // Hide Countdowns, show input
        countdownEl.hidden = true;
        completeEl.hidden = true;
        inputContainer.hidden = false;
        // Stop the countdown
        clearInterval(countdownActive);
        // Reset values
        countdownTitle = '';
        countdownDate = '';
        localStorage.removeItem('countdown');
    }

    function restorePreviousCountdown () {
    //   Get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
    }

    // Event Listener
    countdownForm.addEventListener('submit', updateCountdown);
    countdownBtn.addEventListener('click', reset);
    completeBtn.addEventListener('click', reset);

    // On load, check localStorage
    restorePreviousCountdown ();