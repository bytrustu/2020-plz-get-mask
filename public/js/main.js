const getMaskList = async () => fetch('/restful/get_mask_list').then(res => res.json());
const getPlzMaskList = async () => fetch('/restful/plz_get_mask').then(res => res.json());

const maskList = _ => {
  getMaskList().then(data => {
    const code = data.map((v, i) =>`<li>
                                          <span class="badge badge-primary">${i+1}</span><span><a href="${v.url}" target="_blank">${v.url}</a></span><span>${v.name}</span>
                                        </li>`)
                              .reduce((a,b) => a+b);

    $('#mask-list').html(`
      <h1 class="mb-3">🔥 마스크 크롤링 목록</h1>
      <ul>
        ${code}
      </ul>
    `);
  });
}

const getCrawlingList = _ => {
  getPlzMaskList().then(data => {
    const resultEl = $('.mask-result');
    resultEl.empty();
    const maskArr = Object.entries(data).map(v => v);
    if (data.state == false) {
      resultEl.html(`<div class="align-center">😂 판매중인 마스크가 없습니다.</div>`)
    } else {
      const code = maskArr.map((v, i) =>`<li>
                                                <span class="badge badge-primary">${i+1}</span><span><a href="${v.url}" target="_blank">${v.url}</a></span><span>${v.name}</span>
                                              </li>`)
        .reduce((a,b) => a+b);
      resultEl.html(`<ul>${code}</ul>`);
    }
  });
}
let startInterval;
let timerInterval;
const startCrawling = _ => {
  let i = 0;
  getCrawlingList();
  startInterval = setInterval(()=>{getCrawlingList(); console.log(i++)}, 3000);
  onTimer();
}

const endCrawling = _ => {
  clearInterval(startInterval);
  closeTimer();
}


const onTimer  = () => {
  let timer = 1;
  let hours, minutes, seconds;

  timerInterval = setInterval( () => {
    hours = parseInt(timer / 3600, 10);
    minutes = parseInt(timer / 60 % 60, 10);
    seconds = parseInt(timer % 60, 10);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    $('#time-hour').text(hours);
    $('#time-min').text(minutes);
    $('#time-sec').text(seconds);
    timer++;
  }, 1000);
}

const closeTimer = _ => {
  $('#time-hour, #time-min, #time-sec').html('00');
  clearInterval(timerInterval);
}


$(document).ready(function(){
  maskList();
});