const getCoopangList = async () => fetch('/restful/get_coopang_list').then(res => res.json());
const getServerStatus = async () => fetch('/restful/server_status').then(res => res.json());

const getCrawlingList = _ => {
    getCoopangList().then(data => {
        const resultEl = $('.mask-result');
        resultEl.empty();
        if (data.length == 0) {
            resultEl.html(`<div class="align-center">😂 판매중인 마스크가 없습니다.</div>`)
        } else {
            window.open(data[0]);
            const code = data.map((item, i) =>{
                return `<li><span class="badge badge-primary">${i+1}</span><span><a href="${item}" target="_blank">${item}</a></span></li>`;
            }).reduce((a,b) => a+b);
            resultEl.html(`<ul>${code}</ul>`);
        }
    });
};
let startInterval;
let timerInterval;
const startCrawling = _ => {
    $('.mask-result').html(`<div class="align-center">프로세스 준비중입니다.</div>`);
    endCrawling();
    getCrawlingList();
    startInterval = setInterval(()=>{getCrawlingList();}, 3000);
    onTimer();
}

const endCrawling = _ => {
    $('.mask-result').html(`<div class="align-center">프로세스 준비중입니다.</div>`);
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
};

const closeTimer = _ => {
    $('#time-hour, #time-min, #time-sec').html('00');
    clearInterval(timerInterval);
};

const moveCoopang = _ => {
    window.open(`https://login.coupang.com/login/login.pang`);
};

$(document).ready(function(){
    getServerStatus().then(server => {
        const {power, create_date} = server;
        const isOn = power == 1 ? '작동' : '미작동';
        $('.text-server').text(isOn);
    });
});