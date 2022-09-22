
const orderId = new URL(window.location.href).searchParams.get("id");
document.querySelector('#orderId').innerHTML = orderId;