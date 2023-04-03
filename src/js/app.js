let cardElement = document.querySelector(".card");
let back = document.querySelector('.backcontainer')
let $window = document.querySelector('body');
let $month = document.querySelector('.js-month')
let $tbody = document.getElementById('js-calendar-body')
let $tag = document.querySelector('.banner')
let $tag_today = document.querySelector('.banner .banner-day')
let pre = document.querySelector('.pre')
let next = document.querySelector('.next')

back.addEventListener("click", function(){
  cardElement.classList.remove("flipped")
  $tag.classList.remove("slide")
  pre.classList.remove('active')
  next.classList.remove('active')
})

let weekday = new Array()
weekday[0] =  "Chủ Nhật"
weekday[1] = "Thứ Hai"
weekday[2] = "Thứ Ba"
weekday[3] = "Thứ Tư"
weekday[4] = "Thứ Năm"
weekday[5] = "Thứ Sáu"
weekday[6] = "Thứ bảy"

let month = new Array()
month[0] = "THÁNG MỘT"
month[1] = "THÁNG HAI"
month[2] = "THÁNG BA"
month[3] = "THÁNG TƯ"
month[4] = "THÁNG NĂM"
month[5] = "THÁNG SÁU"
month[6] = "THÁNG BẢY"
month[7] = "THÁNG TÁM"
month[8] = "THÁNG CHÍN"
month[9] = "THÁNG MƯỜI"
month[10] = "THÁNG MƯỜI MỘT"
month[11] = "THÁNG MƯỜI HAI"

let today = new Date()
let currentYear = today.getFullYear(),
    currentMonth = today.getMonth()
    let thisMonth = currentMonth

next.addEventListener("click",() => {
    currentMonth++
    if(currentMonth > 11){
        currentMonth = 0;
        currentYear++
    }
    calendar()
    if(thisMonth!=currentMonth)
    highLight(0)
})

pre.addEventListener("click",() => {
    currentMonth--
    if(currentMonth < 0){
        currentMonth = 11;
        currentYear--
    }
    calendar()
    if(thisMonth!=currentMonth)
    highLight(0)
})

function calendar(){
  calendarHeading(currentYear, currentMonth)
  calendarBody(currentYear, currentMonth, today)
  highLight(today.getDate())
  getTableTime()
}
function calendarHeading(year, num){
    $month.innerHTML = month[num] +  '</br>' + year
  }

function calendarBody(year, month, today){
  let todayYMFlag = today.getFullYear() === year && today.getMonth() === month ? true : false
  let startDate = new Date(year, month, 1)
  let endDate  = new Date(year, month + 1 , 0)
  let startDay = startDate.getDay()
  let endDay = endDate.getDate()
  let textSkip = true
  let textDate = 1
  let tableBody =''
  
  for (let row = 0; row < 6; row++){
    let tr = '<tr class="whiteTr">'
    for (let col = 0; col < 7; col++){
      if (row === 0 && startDay === col){
        textSkip = false
      }
      if (textDate > endDay) {
        textSkip = true
      }
      let addClass = todayYMFlag && textDate === today.getDate() && !textSkip ? 'is-today' : ''
      let textTh = textSkip ? '&nbsp;' : textDate++
      let th = '<th class="'+addClass+'" style="cursor: pointer">'+textTh+'</th>'
      tr += th
    }
    tr += '</tr>'
    tableBody += tr
  }
  let wd = weekday[today.getDay()]
  let d  = (today.getDate())
  document.getElementById('day').innerHTML = wd
  document.getElementById('date').innerHTML = d
  $tag_today.innerHTML = d
  $tbody.innerHTML = tableBody
}

function highLight(value) {
    let days = document.querySelectorAll(".whiteTr th")
    for (const day of days) {
        day.classList.remove('active')
        if(day.innerHTML == value) {
            day.classList.add('active')
        }
     }
}

function getWorkMark(value, content) {
  let days = document.querySelectorAll(".whiteTr th")

  value.forEach((element,index) => {
    days.forEach(day =>{
      if(day.innerHTML == Number(element)) {
        day.classList.add('dot')

        let affter = ''
        content[index].forEach(item => {
          item = `<li style="margin-bottom: 12px">${item}</li>`
          affter += item
        });

        day.setAttribute('value', affter)  
        day.addEventListener("click", () => {
            cardElement.classList.add("flipped")
            $tag.classList.add("slide")
            $tag_today.innerHTML = element
            back.innerHTML = day.getAttribute('value')
            pre.classList.add('active')
            next.classList.add('active')
        })
      }
    })
  })
}
calendar()

function getTableTime(){

let bigData = []

document.querySelector('.logout').addEventListener("click", () => {
    localStorage.removeItem('fileRaw')
    location.reload()
})

if(localStorage.getItem('fileRaw')){
    let fileRaw = localStorage.getItem('fileRaw')
    GetTableFromExcel(fileRaw)
}
else{
document.querySelector('.overlay').classList.add('show')
document.querySelector('.blockInsert').classList.add('show')
document.querySelector('#fileUpload').addEventListener('change',UploadProcess)

function UploadProcess() {
    document.querySelector('.blockInsert').classList.remove('show')
    document.querySelector('.overlay').classList.remove('show')
        //Reference the FileUpload element.
        let fileUpload = document.getElementById("fileUpload");
        
            if (typeof (FileReader) != "undefined") {
                let reader = new FileReader()

                if (reader.readAsBinaryString) {
                    reader.onload = function (e) {
                        localStorage.setItem('fileRaw', e.target.result)
                        GetTableFromExcel(e.target.result)
                    }
                    reader.readAsBinaryString(fileUpload.files[0]);
                } else {
                    //For IE Browser.
                    reader.onload = function (e) {
                        let data = "";
                        let bytes = new Uint8Array(e.target.result)
                        for (let i = 0; i < bytes.byteLength; i++) {
                            data += String.fromCharCode(bytes[i])
                        }
                        GetTableFromExcel(data);
                    };
                    reader.readAsArrayBuffer(fileUpload.files[0])
                }
            } else {
                alert("This browser does not support HTML5.");
            }
    };
}

function GetTableFromExcel(data) {
    let workbook = XLSX.read(data, {
        type: 'binary'
    });

    let Sheet = workbook.SheetNames[0];

    let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Sheet]);

    let rawObj = []
    excelRows.forEach((element,index) => {
        if(element['KHOA CÔNG NGHỆ THÔNG TIN - ĐHTN']/2){
            if(element.__EMPTY_2 == undefined){
                element.__EMPTY_2 = excelRows[index-1].__EMPTY_2
            }
            rawObj.push(element.__EMPTY_2 + ' - ' + element.__EMPTY_6)
        };
    });

    let obj = []

    rawObj.forEach(element_obj => {
        obj.push(element_obj.split('Từ '));
    });
    obj.forEach((element) => {
        let subData = {
            TenMonHoc:'',
            NgayBatDau:[],
            NgayKetThuc:[],
            CacNgay:[],
            Tiet:[],
            Thu:[],
            DiaDiem:[],
            LichHoc:[],
        }
        subData.TenMonHoc = element[0].replace(' - ', '');
        element.forEach((item) => {
            if(((item[0])+1)/2){
                subData.LichHoc.push(item);
            }
        })
        subData.LichHoc.forEach((item) => {
            let diaDiemTemp = []
            let tietTemp = []
            let thuTemp = []
            
            if (item.split(':')[1].length < 2) {
                subData.Thu.push(thuTemp)
                subData.DiaDiem.push(diaDiemTemp)
                subData.Tiet.push(tietTemp)
            }
            item.split(':')[1].split('Thứ ').forEach((item_con,index) => {
                if(item_con.length > 1 && item_con.search(' tiết')>0){ 
                    if(item_con.slice(0,1)/2){
                        thuTemp.push(item_con.slice(0,1))
                    }
                    else{
                        thuTemp.push('1')
                    }
                    tietTemp.push(item_con.split(' tiết')[1].split(' tại')[0])
                    diaDiemTemp.push(item_con.split(' tại')[1])
                }
            });
            if(thuTemp.length>0){subData.Thu.push(thuTemp)}
            if(diaDiemTemp.length>0){subData.DiaDiem.push(diaDiemTemp)}
            if(tietTemp.length>0){subData.Tiet.push(tietTemp)}

        });

        subData.LichHoc.forEach((element) => {     
            if(element.length < 28){
                let arr = element.split(':')
                arr.splice(0,2)
                element = ' '
            }
                let from = element.split(':')[0].slice(0,10)
                
                if((from.slice(0,2)+1)/2){
                    subData.NgayBatDau.push(from)
                }
                let to = element.split(':')[0].slice(15,25)           
                if((to.slice(0,2)+1)/2){
                    subData.NgayKetThuc.push(to)
                }
            });
        
        bigData.push(subData);
    })
    console.log(bigData);

    bigData.forEach((subBigData, indexBig) =>{
        subBigData.NgayBatDau.forEach((day,index) =>{
            fommatDate(day,subBigData.NgayKetThuc[index],subBigData.Thu[index],subBigData.TenMonHoc, indexBig, index, subBigData.Tiet[index],subBigData.DiaDiem[index])
        })
    });
    function getWorkDays(from,to, Thu, monHoc, iBig, i, tiet, diaDiem){
        let tietChuan = []
        let diaDiemChuan = []
        if(tiet.length > 0){
            tietChuan.push(tiet)
        }
        if(diaDiem.length != 0){
            diaDiemChuan.push(diaDiem)
        }

        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date(from);
        const secondDate = new Date(to);
        const diffDays = Math.round(Math.abs((firstDate - secondDate)/oneDay));
         
        for (let index = 1; index < diffDays+2; index++) {
            let dayTemp = {
                diffDaysTemp: [],
                checkHoc: []
            }
            let nextDay = (firstDate.getTime()/1000) + oneDay/1000*index - oneDay/1000;

            dayTemp.diffDaysTemp.push((new Date(nextDay*1000).toISOString().slice(0,10)))

            let thu = new Date(nextDay*1000).getDay()

            Thu.forEach((a,index)=>{
                if(thu == Number(a)-1){
                    dayTemp.checkHoc.push(monHoc + '</br> Tiết ' + tietChuan[0][index] + ' - ' + diaDiemChuan[0][index])
                }
            })
            bigData[iBig].CacNgay.push(dayTemp)
        }
    }
    function fommatDate(firstDate, secondDate, Thu, monHoc, indexBig, index, tiet, diaDiem) {
        let from = firstDate.split("/").reverse().join("-");
        let to = secondDate.split("/").reverse().join("-");
        
        getWorkDays(from,to, Thu, monHoc, indexBig,index,tiet, diaDiem)
    }
    let days = []
    bigData.forEach(data =>{
        data.CacNgay.forEach(item =>{
            if(item.checkHoc.length > 0){
                days.push(item)
            }
        })
    })
    let ngay = []
    let mon = []

    days.forEach(day =>{
        if(ngay.indexOf(day.diffDaysTemp.toString()) < 0){
            ngay.push(day.diffDaysTemp.toString())
        }
    })

    ngay.forEach(item => {
        let subMon = []
        days.forEach(day =>{
            if(day.diffDaysTemp.toString() == item.toString()){
                subMon.push(day.checkHoc)
            }
        })
        mon.push(subMon)
    })

    let monHocTrongThang = []
    ngay.forEach((date, index) =>{
        if (date.slice(5,7) == currentMonth+1) {
            monHocTrongThang.push({date: date, mon:mon[index]})
        }
    })
    let mark = []
    monHocTrongThang.forEach(a =>{
        mark.push(a.date.slice(8,10))
    })
    
    let text = []
    monHocTrongThang.forEach(a =>{
        text.push(a.mon)
    })

    getWorkMark(mark,text)
}
}