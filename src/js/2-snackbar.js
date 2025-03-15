import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const elements = {
  form: document.querySelector('.form'),
  submitButton: document.querySelector('.form button'),
};

function checkFormValidity() {
  const { delay, state } = elements.form.elements;
  return delay.value.trim() !== "" && state.value.trim() !== "";
}

function updateButtonStatus() {
  elements.submitButton.disabled = !checkFormValidity();
}

updateButtonStatus();
elements.form.addEventListener('input', updateButtonStatus);

elements.form.addEventListener('submit', (event) => {
  event.preventDefault();

  const delay = Number(elements.form.elements.delay.value);
  const state = elements.form.elements.state.value;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      state === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  })
    .then((delay) => {
      console.log(`✅ Fulfilled promise in ${delay}ms`);
      iziToast.success({
        title: 'Success',
        message: `Fulfilled promise in ${delay}ms`,
        position: 'bottomCenter',
      });
    })
    .catch((delay) => {
      console.log(`❌ Rejected promise in ${delay}ms`);
      iziToast.error({
        title: 'Error',
        message: `Rejected promise in ${delay}ms`,
        position: 'bottomCenter',
      });
    });
});
