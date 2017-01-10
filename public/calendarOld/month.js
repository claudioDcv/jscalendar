var Calendar = function(id, destiny) {
    var destiny = destiny || 'calendar-destiny';
    if (document.getElementById(destiny)) {
        this.calendarDestiny = document.getElementById(destiny);
    }

    this.generalContainer = document.getElementById(id);

    this.container = document.createElement('DIV');
    this.table = document.createElement('TABLE');

    this.now = new Date();
    this.calendarContainer = {};
    this.calendarContainer.months = [];
    this.calendarContainer.year = this.now.getFullYear();
    this.calendarContainer.yearHistory = this.now.getFullYear();

    this.months = [];
    this.month = this.now.getMonth();

    this.monthHistory = this.now.getMonth();

    this.day = this.now.getDate();


    this.h = '';
    this.m = '';

    this.actionContainerClickButtonYears = 'cerrar';
    this.isOpenYearSelector = false;

    this.headMonth = document.createElement('TR');
    this.headDay = document.createElement('TR');


    this.actionContainerClickButtonMonth = 'cerrar';
    this.isOpenMonthSelector = false;

    this.icon = {
        next: '>',
        back: '<'
    }


    this.dayOfWeekAsString = function(dayIndex) {
        return ["Lunes", "Martes", "Miécoles", "Jueves", "Viernes", "Sábado", "Domingo"][dayIndex];
    }
    this.monthsAsString = function(monthIndex) {
        return ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ][monthIndex];
    }
    this.dayOfWeekAsStringMin = function(dayIndex) {
        return ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][dayIndex];
    }

}

Calendar.prototype.daysInMonth = function(iMonth) {
    return new Date(this.calendarContainer.year, iMonth, 0).getDate();
}

Calendar.prototype.getDate = function() {

    if (this.day) {

        if (this.h != 'undefined'&& this.m  != 'undefined') {
          console.log(1);
          return new Date(this.calendarContainer.yearHistory, this.monthHistory, this.day,this.h,this.m,0,0);
        }
        return new Date(this.calendarContainer.yearHistory, this.monthHistory, this.day);
    }
    return new Date(this.calendarContainer.year, this.month, 1);
}

Calendar.prototype.firstDayInMonth = function(month) {
    return new Date(this.calendarContainer.year, month, 1).getDay();
}

Calendar.prototype.headerMonth = function() {
    var header = [];
    for (var i = 0; i < 7; i++) {
        header.push(this.dayOfWeekAsString(i));
    }
};
Calendar.prototype.createMonth = function(semana, days) {
    var days = this.daysInMonth(this.month + 1);
    this.firstDay = this.firstDayInMonth(this.month);

    this.createDayInMonth(this.month, days);

}

Calendar.prototype.createDayInMonth = function(i, days) {


    //  this.day = 1;


    this.firstDay = this.firstDay == 0 ? 7 : this.firstDay;

    this.calendarContainer.months = [];
    var month = {
            "month": (this.month + 1),
            "monthName": this.monthsAsString(this.month),
            "days": [],
            "daysInMonth": days,
            "firstDay": this.firstDay,
            "beforeDay": (this.firstDay - 1)
        }
        //EDMC
        //CAPA LIBRERIA DE DATOS
        //DOS CAPAS DE NEGOCIO
        //agregar

    //for de dias
    var semana = 0;
    var day = (2 - this.firstDay);

    for (var j = 1; j < 43; j++) {

        var date = new Date(this.calendarContainer.year, this.month, day);

        if (this.firstDay <= j && day <= days) {
            var isCurrent = '';
            var setDay = '';
            if (
                date.getDate() == this.now.getDate() &&
                date.getFullYear() == this.now.getFullYear() &&
                date.getMonth() == this.now.getMonth()
            ) {
                isCurrent = 'calendar-current-day';

            }

            if (
              this.day == day &&
              date.getMonth() == this.monthHistory &&
              date.getFullYear() == this.calendarContainer.yearHistory) {
                setDay = ' set-day';
            }

            month.days.push({
                "number": (j + 1),
                "name": this.dayOfWeekAsString(semana + 1),
                "dayMonth": date.getDate(),
                "date": date,
                "dayWeek": semana,
                "cssClass": "month-actual " + isCurrent + setDay
            });

        } else if (j > 1 && this.firstDay <= j) {
            //mes siguiente
            month.days.push({
                "number": "",
                "name": "" /*this.dayOfWeekAsString(semana+1)*/ ,
                "dayMonth": date.getDate(),
                "date": date,
                "dayWeek": "",
                "cssClass": "month-next"
            });
            //day++;
        } else {
            //todo hacer mes anterior
            month.days.push({
                "number": "",
                "name": "",
                "dayMonth": date.getDate(),
                "date": date,
                "dayWeek": "",
                "cssClass": "month-before"
            });
        }
        day++;
        semana++;
        if (semana > 6) {
            semana = 0;
        }
    }
    this.calendarContainer.months.push(month);

    this.recreate();
};
Calendar.prototype.recreate = function() {
    var diaSemana = 0;

    var date = new Date(this.calendarContainer.year, this.month, 1);

    var appendElement = [];
    var n = 0;

    this.calendarContainer.months[0].month = this.month;

//itera dias
    for (var v in this.calendarContainer.months[0].days) {
        if (this.calendarContainer.months[0].days.hasOwnProperty(v)) {
            var tr;
            if (diaSemana == 0) {
                tr = document.createElement('TR');
                tr.className = "calendar-content-week";
                appendElement[n] = tr;
                n++;
            }
            var d = this.calendarContainer.months[0].days[v];
            var txt = document.createTextNode(d.dayMonth);
            var td = document.createElement('TD');

            var txtBtn = document.createTextNode('_');
            var btn = document.createElement('button');
                btn.appendChild(txtBtn);

            td.dataset.date = d.date;

            td.className = d.cssClass;
            td.appendChild(txt);

            td.style.cursor = 'pointer';
            //td.appendChild(btn);
            this.addEventDay('click', td);

            tr.appendChild(td);

            if (diaSemana > 5) {
                diaSemana = 0;
            } else {
                diaSemana++;
            }
        }
    }

    for (var i = 0; i < appendElement.length; i++) {
        this.table.appendChild(appendElement[i]);
    }

    this.container.appendChild(this.table);
    this.generalContainer.appendChild(this.container);

};
//event click button day
Calendar.prototype.addEventDay = function(event, elm) {
    var action = function(e) {

        var date = new Date(e.srcElement.dataset.date);

        this.day = date.getDate();
        this.month = date.getMonth();
        this.monthHistory = date.getMonth();
        this.calendarContainer.year = date.getFullYear();
        this.calendarContainer.yearHistory = date.getFullYear();

        this.createMonthSchema();
        this.toggleContainerMonth('cerrar');
        this.toggleContainerYears('cerrar');


    }
    elm.addEventListener(event, action.bind(this), true);
    return elm;
};

Calendar.prototype.nextMonth = function(elm) {
    var action = function(e) {

        this.month++;
        if (this.month > 11) {
            this.calendarContainer.year++;
            this.month = 0;
        }

        this.toggleContainerDay('cerrar');
        this.createMonthSchema();
    }
    elm.addEventListener('click', action.bind(this), false);
    return elm
};
Calendar.prototype.prevMonth = function(elm) {
    var action = function(e) {

        this.month--;
        if (this.month < 0) {
            this.calendarContainer.year--;
            this.month = 11;
        }

        this.createMonthSchema();
        this.toggleContainerDay('cerrar');
        this.toggleContainerMonth('cerrar');
        this.toggleContainerYears('cerrar');
    }
    elm.addEventListener('click', action.bind(this), false);
    return elm
};

Calendar.prototype.setYear = function(elm) {
    var action = function(e) {

        this.calendarContainer.year = e.srcElement.dataset.year;
        this.createMonthSchema();
        this.toggleContainerYears(this.actionContainerClickButtonYears);
    }
    elm.addEventListener('click', action.bind(this), false);
    return elm;
}

Calendar.prototype.setMonth = function(elm) {
    var action = function(e) {

        this.month = e.srcElement.dataset.month;
        this.createMonthSchema();
        //this.toggleContainerYears();
        this.toggleContainerYears('cerrar');
        this.toggleContainerMonth('cerrar');
    }
    elm.addEventListener('click', action.bind(this), false);
    return elm;
}

Calendar.prototype.toggleYearSelector = function(elm) {
    var action = function(e) {

        this.toggleContainerYears('', e.srcElement);
        this.toggleContainerDay('cerrar');
        this.toggleContainerMonth('cerrar');
    }
    elm.addEventListener('click', action.bind(this), false);
    return elm
};
/***************************** toggleMonthSelector ****************************/
Calendar.prototype.toggleMonthSelector = function(elm) {
    var action = function() {
        this.toggleContainerMonth();
        this.toggleContainerDay('cerrar');
        this.toggleContainerYears('cerrar');

    }
    elm.addEventListener('click', action.bind(this), false);
    return elm
};

Calendar.prototype.openViewDay = function(elm) {
    var action = function(e) {

        console.log(e);
        this.toggleContainerDay();
        this.toggleContainerMonth('cerrar');
        this.toggleContainerYears('cerrar');

    }
    elm.addEventListener('click', action.bind(this), false);
    return elm
};
/******************************************************************************/
Calendar.prototype.toggleContainerDay = function(ctrl, e) {

    if (ctrl == 'cerrar') {
        this.headDay.style.display = "none";
        this.isOpenDaySelector = true;
        return this.isOpenDaySelector;
    } else if (ctrl == 'abrir') {
        this.headDay.style.display = "block";
        this.isOpenDaySelector = false;
        return this.isOpenDaySelector;
    }
    if (this.isOpenDaySelector) {
        this.headDay.style.display = "block";
    } else {
        this.headDay.style.display = "none";
    }
    this.isOpenDaySelector = this.isOpenDaySelector == false ? true : false;
    return this.isOpenDaySelector;
};

Calendar.prototype.toggleContainerMonth = function(ctrl, e) {

    if (ctrl == 'cerrar') {
        this.headMonth.style.display = "none";
        this.isOpenMonthSelector = true;
        return this.isOpenMonthSelector;
    } else if (ctrl == 'abrir') {
        this.headMonth.style.display = "block";
        this.isOpenMonthSelector = false;
        return this.isOpenMonthSelector;
    }
    if (this.isOpenMonthSelector) {
        this.headMonth.style.display = "block";
    } else {
        this.headMonth.style.display = "none";
    }
    this.isOpenMonthSelector = this.isOpenMonthSelector == false ? true : false;
    return this.isOpenMonthSelector;
};

Calendar.prototype.toggleContainerYears = function(ctrl, e) {

    if (ctrl == 'cerrar') {
        this.head.style.display = "none";
        this.isOpenYearSelector = true;
        return this.isOpenYearSelector;
    } else if (ctrl == 'abrir') {
        this.head.style.display = "block";
        this.isOpenYearSelector = false;
        return this.isOpenYearSelector;
    }
    if (this.isOpenYearSelector) {
        this.head.style.display = "block";
    } else {
        this.head.style.display = "none";
    }
    this.isOpenYearSelector = this.isOpenYearSelector == false ? true : false;
    return this.isOpenYearSelector;
};

Calendar.prototype.createHeaderDay = function() {
    var trSubHead = document.createElement('TR');
    trSubHead.className = "calendar-header-day";
    for (var j = 0; j < 7; j++) {
        var day = document.createElement('TD');
        var dayNames = document.createTextNode(this.dayOfWeekAsStringMin(j));
        day.appendChild(dayNames);
        day.className = "calendar-header-day-" + this.dayOfWeekAsStringMin(j).toLowerCase();
        trSubHead.appendChild(day);
    }
    return trSubHead
};
Calendar.prototype.createHeaderMonth = function() {
    var mes = this.calendarContainer.months[this.month];

    //this.calendarContainer.year + ' ' +
    var mes = document.createTextNode(mes.monthName + ' ' + mes.daysInMonth);

    var trHead = document.createElement('TR');
    trHead.appendChild(mes);
    return trHead;
}

Calendar.prototype.createButtonDay = function() {
  function fn(e){
    var date = e.srcElement.dataset.date;
    date = new Date(date);
    // this.calendarContainer.yearHistory = date.getFullYear();
    // this.monthHistory = date.getMonth();
    //this.day = date.getDate();
    this.h = date.getHours();
    this.m = date.getMinutes();


    this.createMonthSchema();
    this.toggleContainerDay('abrir');
    this.toggleContainerMonth('cerrar');
    this.toggleContainerYears('cerrar');


  }

  var count = 0;
  var day = this.day;
  var hour = new Date(this.calendarContainer.yearHistory, this.monthHistory, day,0,0,0,0);
  var hora = 0;
  var control = 0;
  for (var i = 0; i < 96; i++) {
    var btn = document.createElement('TD');
    var txt = document.createTextNode(hour.getHours() + ':' + hour.getMinutes() );
        btn.appendChild(txt);
        btn.dataset.date = new Date(hour.getTime());


        btn.addEventListener('click',fn.bind(this));
        this.headDay.appendChild(btn);

        count += 15;

        if (control == 3) {
          hora += 1;
          control = 0;
        }else{
          control ++;
        }

        hour.setMinutes(count);
        hour.setHours(hora);

  }
        this.headDay.className = 'calendar-header-day-action';
  return this.headDay;
}

Calendar.prototype.createButtonYear = function() {
    var initYear = this.calendarContainer.year - 17;
    this.head = document.createElement('TR');

    var btnPrevYear = document.createElement('BUTTON');
    var txtPrev = document.createTextNode(this.icon.back);
    btnPrevYear.appendChild(txtPrev);
    btnPrevYear.className = "calendar-year-container-button calendar-year-container-button-prev";

    var btnNextYear = document.createElement('BUTTON');
    var txtNext = document.createTextNode(this.icon.next);
    btnNextYear.appendChild(txtNext);
    btnNextYear.className = "calendar-year-container-button calendar-year-container-button-next";

    this.head.appendChild(btnPrevYear);
    this.head.appendChild(btnNextYear);

    function prevYear(event) {

        this.calendarContainer.year--;
        this.createMonthSchema();
        this.toggleContainerDay('cerrar');
        this.toggleContainerMonth('cerrar');
        this.toggleContainerYears('abrir');
    }
    btnPrevYear.addEventListener('click', prevYear.bind(this));

    function nextYear(event) {

        this.calendarContainer.year++;
        this.createMonthSchema();
        this.toggleContainerDay('cerrar');
        this.toggleContainerMonth('cerrar');
        this.toggleContainerYears('abrir');
    }
    btnNextYear.addEventListener('click', nextYear.bind(this));

    this.head.className = "calendar-year-container";
    for (var i = 0; i < 35; i++) {

        var elm = document.createElement('BUTTON');
        elm.dataset.year = initYear;
        if (initYear == this.now.getFullYear()) {
            elm.className = "calendar-button-year calendar-year-current calendar-year-actual";
        } else
        if (this.calendarContainer.year == initYear) {
            elm.className = "calendar-button-year calendar-year-current";
        } else {
            elm.className = "calendar-button-year";
        }
        var txt = document.createTextNode(initYear);
        this.setYear(elm);
        elm.appendChild(txt);
        this.head.appendChild(elm);
        initYear++;
    }
    return this.head;
};
/*************************************** HEADER MONTH *************************/

Calendar.prototype.createButtonMonth = function() {

    // this.actionContainerClickButtonMonth = 'cerrar';
    // this.headMonth;




    var btnPrevYear = document.createElement('BUTTON');
    var txtPrev = document.createTextNode(this.icon.back);
    btnPrevYear.appendChild(txtPrev);
    btnPrevYear.className = "calendar-year-container-button calendar-year-container-button-prev";

    var btnNextYear = document.createElement('BUTTON');
    var txtNext = document.createTextNode(this.icon.next);
    btnNextYear.appendChild(txtNext);
    btnNextYear.className = "calendar-year-container-button calendar-year-container-button-next";

    this.headMonth.appendChild(btnPrevYear);
    this.headMonth.appendChild(btnNextYear);

    function prevYear(event) {

        this.month--
            if (this.month < 0) {
                this.month = 11;
                this.calendarContainer.year--;
            }

        this.createMonthSchema();
        this.toggleContainerMonth('abrir');
    }
    btnPrevYear.addEventListener('click', prevYear.bind(this));

    function nextYear(event) {

        this.month++;
        if (this.month > 11) {
            this.month = 0;
            this.calendarContainer.year++;
        }
        this.createMonthSchema();
        this.toggleContainerMonth('abrir');
    }
    btnNextYear.addEventListener('click', nextYear.bind(this));
    //this.calendarContainer.year

    this.headMonth.className = "calendar-year-container";
    for (var i = 0; i < 12; i++) {

        var elm = document.createElement('BUTTON');
        elm.dataset.month = i;

        if (i == this.now.getMonth() && this.now.getFullYear() == this.calendarContainer.year) {
            elm.className = "calendar-button-month calendar-button-month-current calendar-button-month-actual";
        } else
        if (this.month == i) {
            elm.className = "calendar-button-month calendar-button-month-current";
        } else {
            elm.className = "calendar-button-month";
        }

        var txt = document.createTextNode(this.monthsAsString(i));
        this.setMonth(elm);
        elm.appendChild(txt);
        this.headMonth.appendChild(elm);
        //initYear++;
    }
    return this.headMonth;
};


/******************************************************************************/

Calendar.prototype.createHeaderButtonMonth = function() {
    var nextMonth = document.createElement('BUTTON');
    var txtNext = document.createTextNode(this.icon.next);
    nextMonth.appendChild(txtNext);
    this.nextMonth(nextMonth);

    var year = document.createElement('BUTTON');
    var txtYear = document.createTextNode(this.calendarContainer.year);
    year.dataset.year = this.calendarContainer.year;
    year.appendChild(txtYear);
    this.toggleYearSelector(year);

    //Header mes
    var monthSelector = document.createElement('BUTTON');
    var txtMonth = document.createTextNode(this.monthsAsString(this.month));
    monthSelector.dataset.month = this.month;
    monthSelector.appendChild(txtMonth);
    this.toggleMonthSelector(monthSelector);

    var daySelector = document.createElement('BUTTON');
    var txtDay = document.createTextNode(this.day);
    daySelector.dataset.date = this.getDate();
    daySelector.appendChild(txtDay);
    this.openViewDay(daySelector);

    var prevMonth = document.createElement('BUTTON');
    var txtPrev = document.createTextNode(this.icon.back);
    prevMonth.appendChild(txtPrev);
    this.prevMonth(prevMonth);

    var head = document.createElement('TR');
    head.className = 'calendar-year-header';

    head.appendChild(prevMonth);
    head.appendChild(year);
    head.appendChild(monthSelector);
    head.appendChild(daySelector);
    head.appendChild(nextMonth);
    return head;
}



Calendar.prototype.removeAllChild = function(elm) {
    while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
    }
    return elm;
};

Calendar.prototype.createMonthSchema = function() {
    this.removeAllChild(this.table);
    this.removeAllChild(this.headMonth);
    this.removeAllChild(this.headDay);

    this.table.appendChild(this.createButtonYear());
    this.table.appendChild(this.createButtonMonth());
    this.table.appendChild(this.createButtonDay());

    this.table.appendChild(this.createHeaderButtonMonth());
    this.table.appendChild(this.createHeaderDay());
    this.createMonth();

    this.toggleContainerYears('cerrar');
    this.toggleContainerMonth('cerrar');

    if (this.calendarDestiny) {
        this.calendarDestiny.value = this.getDate();
    }

};

var c = new Calendar('calendar');
c.createMonthSchema();

// var year = function(){
//     return c.getDate();
// }
