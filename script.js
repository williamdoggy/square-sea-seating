const API_URL = 'https://script.google.com/macros/s/AKfycbxMD9rFNGxQ5Bh7n9Mw09y0dThEXFW9Ux-nFAiSLitXeOgYXDmfd3K-YjJ2uk5PcN_LaA/exec';

const seatingChart = [
  ["A1", "A2", "A3", "stair", "A4", "A5", "A6", "A7", "A8", "A9", "stair", "A10", "A11", "A12", "A13", "A14", "A15", "stair", "A16", "A17", "A18", "A19"],
  ["B1", "B2", "B3", "stair", "B4", "B5", "B6", "B7", "B8", "B9", "stair", "B10", "B11", "B12", "B13", "B14", "B15", "stair", "B16", "B17", "B18", "B19"],
  ["C1", "C2", "C3", "stair", "C4", "C5", "C6", "C7", "C8", "C9", "stair", "C10", "C11", "C12", "C13", "C14", "C15", "stair", "C16", "C17", "C18", "C19"],
  ["empty", "empty", "empty", "stair", "D4", "D5", "D6", "D7", "D8", "D9", "stair", "D10", "D11", "D12", "D13", "D14", "D15", "stair", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "stair", "E4", "E5", "E6", "E7", "E8", "E9", "stair", "E10", "E11", "E12", "E13", "E14", "E15", "stair", "empty", "empty", "empty", "empty"]
];

const reservedSeats = [];

function renderSeats() {
  const seatMap = document.getElementById('seatMap');
  seatMap.innerHTML = '';
  seatingChart.forEach(row => {
    row.forEach(seat => {
      const div = document.createElement('div');
      if (seat === "stair" || seat === "empty") {
        div.className = 'seat stair';
      } else {
        div.className = 'seat';
        div.innerText = seat;
        if (reservedSeats.includes(seat)) {
          div.classList.add('reserved');
        } else {
          div.addEventListener('click', () => selectSeat(seat, div));
        }
      }
      seatMap.appendChild(div);
    });
    seatMap.appendChild(document.createElement('br'));
  });
}

let currentSelected = null;

function selectSeat(seat, div) {
  if (currentSelected) currentSelected.classList.remove('selected');
  div.classList.add('selected');
  currentSelected = div;
  document.getElementById('selectedSeat').value = seat;
}

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    data.forEach(entry => reservedSeats.push(entry.seat));
    renderSeats();
  });

const form = document.getElementById('seatingForm');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const params = new URLSearchParams(formData);
  fetch(API_URL, {
    method: 'POST',
    body: params // 不用 JSON，直接送 form data
  }).then(response => response.json())
    .then(result => {
      if (result.result === 'success') {
        form.style.display = 'none';
        document.getElementById('confirmation').style.display = 'block';
        document.getElementById('seatInfo').innerText = formData.get('seat') + ' (' + formData.get('date') + ')';
      }
    });
});