import iziToast from "izitoast";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";
import "izitoast/dist/css/iziToast.min.css";

const elements = {
  startButton: document.querySelector("button[data-start]"),
  daysDisplay: document.querySelector("span[data-days]"),
  hoursDisplay: document.querySelector("span[data-hours]"),
  minutesDisplay: document.querySelector("span[data-minutes]"),
  secondsDisplay: document.querySelector("span[data-seconds]"),
};

elements.startButton.disabled = true;
let selectedDateTime = null;
let countdownInterval = null;

const formatNumber = (value) => String(value).padStart(2, "0");

const datePickerOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (!selectedDates[0]) {
      selectedDateTime = null;
      elements.startButton.disabled = true;
      return;
    }
    selectedDateTime = selectedDates[0];
    if (selectedDateTime <= new Date()) {
      elements.startButton.disabled = true;
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "bottomCenter",
      });
    } else {
      elements.startButton.disabled = false;
    }
  },
};

flatpickr("#datetime-picker", datePickerOptions);

const calculateTimeRemaining = (ms) => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
};

const updateCountdownDisplay = () => {
  const currentTime = new Date();
  const timeRemaining = selectedDateTime - currentTime;

  if (timeRemaining <= 0) {
    clearInterval(countdownInterval);
    Object.values(elements).slice(1).forEach((el) => (el.textContent = "00"));
    return;
  }

  const { days, hours, minutes, seconds } = calculateTimeRemaining(timeRemaining);
  elements.daysDisplay.textContent = formatNumber(days);
  elements.hoursDisplay.textContent = formatNumber(hours);
  elements.minutesDisplay.textContent = formatNumber(minutes);
  elements.secondsDisplay.textContent = formatNumber(seconds);
};

elements.startButton.addEventListener("click", () => {
  if (!selectedDateTime || selectedDateTime <= new Date()) {
    iziToast.error({
      title: "Error",
      message: "Please choose a date in the future",
      position: "bottomCenter",
    });
    return;
  }
  elements.startButton.disabled = true;
  updateCountdownDisplay();
  countdownInterval = setInterval(updateCountdownDisplay, 1000);
});
