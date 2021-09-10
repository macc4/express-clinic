// /* eslint-disable */

// const hideAlert = () => {
//   const el = document.querySelector('.alert');
//   if (el) el.parentElement.removeChild(el);
// };

// // type is 'success' or 'error'
// export const showAlert = (type, msg) => {
//   hideAlert();
//   let alertType;
//   if (type === 'error') alertType = 'danger';
//   if (type === 'success') alertType = 'success';

//   const markup = `<div class="alert alert-${alertType}" role="alert">${msg}</div>`;

//   document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

//   window.setTimeout(hideAlert, 5000);
// };
