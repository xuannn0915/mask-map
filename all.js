// 選擇現在日期
var today = new Date();
var yy = today.getFullYear();
var mm = today.getMonth() + 1;
var dd = today.getDate();

// 顯示星期
function renderWeek() {
    var week = today.getDay();
    var day = document.querySelector('.day');
    var chineseWeek = chooseWeek(week);
    chooseOddEven(week)
    day.textContent = chineseWeek;
}

// 判斷星期
function chooseWeek(week) {
    if (week == 0) {
        return '日';
    }
    else if (week == 6) {
        return '六';
    }
    else if (week == 5) {
        return '五';
    }
    else if (week == 4) {
        return '四';
    }
    else if (week == 3) {
        return '三';
    }
    else if (week == 2) {
        return '二';
    }
    else if (week == 1) {
        return '一';
    }
}

// 判斷單雙號可買
function chooseOddEven(week) {
    if (week == 1 || week == 3 || week == 5) {
        document.querySelector('.odd').style.display = 'block';
    }
    else if (week == 2 || week == 4 || week == 6) {
        document.querySelector('.even').style.display = 'block';
    }
    else if (week == 0) {
        document.querySelector('.sun').style.display = 'block';
    }
}

// 判斷年月日
function renderYMD() {
    var date = document.querySelector('.date');
    var str = ""
    dd = chooseDate(dd)
    mm = chooseMonth(mm);
    str += `${yy}-${mm}-${dd}`
    date.innerHTML = str;
}

// 日期選擇
function chooseDate(dd) {
    if (dd < 10) {
        var dd = `0${dd}`
        return dd;
    }
    else {
        return dd;
    }
}

// 月份選擇
function chooseMonth(mm) {
    if (mm < 10) {
        var mm = `0${mm}`
        return mm;
    }
    else {
        return mm;
    }
}

// 預設顯示日期狀態
function renderDefault() {
    renderWeek();
    renderYMD();
    getData();
}
renderDefault();


// 取得API資料
var data;
function getData() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json', true);
    xhr.send(null);
    xhr.onload = function () {
        data = JSON.parse(xhr.responseText);
        dataAry = data.features;
        renderCounty();
        renderMarker()
    }
}

// 顯示藥局清單
var county = document.getElementById('county');
var district = document.getElementById('district');
var list = document.querySelector('.list');

county.addEventListener('change', renderDis);
district.addEventListener('change', renderList);

// 顯示縣市的選單
function renderCounty() {
    var countySel = [];
    var countyStr = "";
    for (var i = 0; i < dataAry.length; i++) {
        if (!countySel.includes(dataAry[i].properties.county)) {
            countySel.push(dataAry[i].properties.county);
        }
    }

    countySel.splice(1, 1);
    countySel.unshift('請選擇縣市');

    for (var j = 0; j < countySel.length; j++) {
        countyStr += `<option>${countySel[j]}</option>`;
        county.innerHTML = countyStr;
    }
}

// 顯示行政區的選單
function renderDis(e) {
    e.preventDefault();
    var disStr = "";
    var disAry = [];
    var disSel = [];

    // 將選擇到的縣市所有行政區域取出成陣列
    for (var k = 0; k < dataAry.length; k++) {
        if (e.target.value == dataAry[k].properties.county) {
            disAry.push(dataAry[k].properties.town);
        }
        else if (e.target.value == '請選擇縣市') {
            alert('請重新選擇縣市');
            district.innerHTML = `<option>請選擇行政區域</option>`;
            break;
        }
    }

    // 篩選重複出現的行政區域
    for (var l = 0; l < disAry.length; l++) {
        if (!disSel.includes(disAry[l])) {
            disSel.push(disAry[l]);
        }
    }

    disSel.unshift('請選擇行政區域');

    // 將篩選過的行政區顯示在下拉選單中
    for (var m = 0; m < disSel.length; m++) {
        disStr += `<option>${disSel[m]}</option>`;
        district.innerHTML = disStr;
    }
}

// 顯示藥局清單
function renderList(e) {
    e.preventDefault();
    var listStr = "";

    for (var m = 0; m < dataAry.length; m++) {
        if (e.target.value == dataAry[m].properties.town) {
            listStr += `
            <li class="list-item">
                <h3 class="item-title">${dataAry[m].properties.name}</h3>
                <p class="item-place">${dataAry[m].properties.address}</p>
                <p class="item-phone">${dataAry[m].properties.phone}</p>
                <div class="mask">
                    <div class="adult-mask">
                        成人：<span class="adult-num">${dataAry[m].properties.mask_adult}個</span>
                    </div>
                    <div class="child-mask">
                        兒童：<span class="child-num">${dataAry[m].properties.mask_child}個</span>
                    </div>
                </div>
                </li>
            `
        }
        list.innerHTML = listStr;
    }
    maskNumColor();
}

// 判斷口罩數量及顯示顏色
function maskNumColor() {
    var adultNum = document.querySelectorAll('.adult-num');
    var childNum = document.querySelectorAll('.child-num');
    var adultMask = document.querySelectorAll('.adult-mask');
    var childMask = document.querySelectorAll('.child-mask');
    console.log(adultNum);

    // 計算大人口罩是否為0
    for (var n = 0; n < adultNum.length; n++) {
        if (adultNum[n].innerText == "0個") {
            adultMask[n].setAttribute('class', 'mask-button none');
            adultNum[n].textContent = '已售完';
        }
        else {
            adultMask[n].setAttribute('class', 'mask-button own');
        }
    }

    // 計算小孩口罩是否為0
    for (var o = 0; o < childNum.length; o++) {
        if (childNum[o].innerText == "0個") {
            childMask[o].setAttribute('class', 'mask-button none');
            childNum[o].textContent = '已售完';
        }
        else {
            childMask[o].setAttribute('class', 'mask-button own');
        }
    }
}



// 顯示地圖
var map = L.map('map', {
    center: [24.9847937, 121.5378535],
    zoom: 16
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


function renderMarker(e) {

    for (var p = 0; p < dataAry.length; p++) {
        var WE = dataAry[p].geometry.coordinates[0];
        var NS = dataAry[p].geometry.coordinates[1];
        
        if(e.target.value == dataAry[p].properties.town){
        
            var markers = L.marker([NS, WE]).addTo(map);
        }
    }
}