//Init NotyF
var notyf = new Notyf({
  duration: 3000,
  position : {
    x: 'right',
    y: 'top'
  },
  dismissible: true
});

let existNotify = sessionStorage.getItem("noti");
if (existNotify) {
  existNotify = JSON.parse(existNotify);
  if (existNotify.code == 'error') {
    notyf.error(existNotify.message);
  }
  if (existNotify.code == 'success') {
    notyf.success(existNotify.message);
  }
  sessionStorage.removeItem("noti");
}

const notify = (code, message) => {
  sessionStorage.setItem('noti', JSON.stringify({
    code: code,
    message: message
  }))
}