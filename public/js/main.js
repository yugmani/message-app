const numberInput = document.getElementById("number");
const textInput = document.getElementById("msg");
const button = document.getElementById("button");
const response = document.querySelector(".response");

button.addEventListener("click", send, false);

const socket = io();
socket.on("smsStatus", function () {
  response.innerHTML = "<h5>Text message sent to " + data.number + "</h5>";
});

function send() {
  const number = numberInput.value.replace(/\D/g, "");
  console.log(number);
  const text = textInput.value;
  console.log(text);

  fetch("/", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ number: number, text: text }),
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
