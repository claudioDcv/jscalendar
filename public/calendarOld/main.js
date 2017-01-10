
document.addEventListener("DOMContentLoaded", function(event) {
var Obj = function(){
	this.year = 2016;
	this.lastMonth = new Date().getMonth();
	this.firstTime = true;

	this.removeChild = function(obj){
		while (obj.firstChild) {
			obj.removeChild(obj.firstChild);
		}
		return obj;
	}
}
var obj = new Obj();



//MODAL
var Modal = function(){
	this.obj = document.getElementById('modal-create-activity');
	this.objClose = document.getElementById('modal-close');
	this.objAgendar = document.getElementById('modal-agendar');
	this.title = document.getElementById('modal-create-activity-title');
	this.obj.style.display = 'none';
	this.modelo = {
		'inicio' : '',
		'fin' : ''
	};

	this.dayOfWeekAsString = function(dayIndex) {
		return ["Domingo", "Lunes", "Martes", "Miecoles", "Jueves", "Viernes", "Sabado"][dayIndex];
	}

	this.monthsAsString = function(monthIndex) {
		return ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Augosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][monthIndex];
	}
	this.dayOfWeekAsStringMin = function(dayIndex) {
		return ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"][dayIndex];
	}
	//metodos privados
	function action_cerrar(event){
		this.hide();
	}

	function action_agendar(event){
		this.gridObj.srcElement.className = 'quince-minuto quince-minuto-now quince-minuto-actividad';
		console.log(this.modelo);
		//this.hide();
	}
	this.objClose.addEventListener('click',action_cerrar.bind(this));
	this.objAgendar.addEventListener('click',action_agendar.bind(this));
}

Modal.prototype.removeChild = function(obj){
	while (obj.firstChild) {
		obj.removeChild(obj.firstChild);
	}
	return obj;
}

Modal.prototype.show = function () {
	this.obj.style.display = 'block';
};

Modal.prototype.hide = function () {
	this.obj.style.display = 'none';
};

Modal.prototype.setModel = function (dtInit) {

	this.modelo = {
		'inicio' : dtInit,
		'fin' : ''
	};
};

Modal.prototype.setModal = function (elm,txt) {

	this.gridObj = elm;
	this.setModel(txt);
	var txt = document.createTextNode(this.formatDate(txt));
	this.removeChild(this.title).appendChild(txt);
};

Modal.prototype.formatDate = function (dt) {
	return new Date(parseInt(dt));
};
Modal.prototype.formatHour = function(dt,ddot){
	return (dt.getHours().toString().length < 2 ? '0' +
		dt.getHours() : dt.getHours() ) +
		ddot +
		(dt.getMinutes().toString().length < 2 ? dt.getMinutes() +
		'0' : dt.getMinutes() );
}

	var modal = new Modal();

var date = new Date();
		date.setDate(1);

var objAgendaDia = [
	{
    //1464130800000 - 1464133500000
		inicio : '1464130800000',
		fin :'1464133500000',
		data : {
			title : 'agendado'
		}
	},
  {
		inicio : '1464138900000',
		fin :'1464139800000',
		data : {
			title : 'agendado'
		}
	},
	{
    //1464139800000 1464142500000
		inicio : '1464139800000',
		fin :'1464142500000',
		data : {
			title : 'agendado'
		}
	},
	{
    //1464130800000 - 1464150600000
		inicio : '1464137100000',
		fin :'1464140700000',
		data : {
			title : 'agendado'
		}
	}
];




var objAgenda = {
	'24 5 1988' : 'agendado',
	'24 5 2016' : 'agendado',
	'22 2 2016' : 'agendado',
	'23 2 2016' : 'agendado',
	'24 2 2016' : 'agendado',
	'24 4 2016' : 'agendado',
	'26 5 1988' : 'agendado',
	'26 4 1989' : 'agendado',
	'26 5 1990' : 'agendado'
};

var objAgendaMes = {
	'5 1988' : 'agendado',
	'2 2016' : 'agendado',
	'4 2016' : 'agendado',
	'5 2016' : 'agendado',
	'4 1989' : 'agendado',
	'5 1990' : 'agendado'
};

var objAgendaAnio = {
	'1988' : 'agendado',
	'2016' : 'agendado',
	'1989' : 'agendado',
	'1990' : 'agendado'
};

///window.onload = function() {
	createMonth(date.getMonth(),modal);
////};


function monthsAsString(monthIndex) {
	return ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Augosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][monthIndex];
}
function colorSelect(i) {
	return ['green','red','orange','blue','brown','purple','cian','magenta'][i];
}

function createHour(numDia,modal){
	// 0	1	2	 3	 4
	// dd m yyyy hh mm
	//'24 5 2016 22 00'
	var dt = new Date();
	var _now = new Date();
	dt.setHours(0,0,0);

	var tag = document.createElement("div");
			tag.className = "container-hours";
			var control = true;
      var contadorActividad = 0;
			for (var i = 0; i < 96; i++) {
				var quince = document.createElement("div");



				var t = document.createTextNode(modal.formatHour(dt,':'));

						if (obj.firstTime) {
								quince.appendChild(t);
						}
						if (
							(_now.getHours()) == dt.getHours() &&
							control &&
							(_now.getMinutes() - dt.getMinutes()) < 15
						) {
							control = false;
							quince.className = 'quince-minuto quince-minuto-now';
						}else{
							quince.className = 'quince-minuto';
						}
						quince.dataset.fecha = new Date(obj.year,obj.lastMonth,numDia,dt.getHours(),dt.getMinutes(),0).getTime();

						//evalua si existe alguna evento agendado
						for (var k = 0; k < objAgendaDia.length; k++) {
							//console.log(objAgendaDia[k]);
							if (

                objAgendaDia[k].inicio < quince.dataset.fecha &&
                objAgendaDia[k].fin > quince.dataset.fecha
							) {

								quince.className = 'quince-minuto quince-minuto-now quince-minuto-actividad';
                quince.style.backgroundColor = colorSelect(Math.floor((Math.random() * 7) + 0));;
                quince.dataset.idActividad = contadorActividad++;

                quince.addEventListener('click',function(e){
									//console.log(this);

								modal.setModal(e,e.srcElement.dataset.fecha);
								modal.show();
								});
								break;
							}else{
								quince.addEventListener('click',function(e){

								modal.setModal(e,e.srcElement.dataset.fecha);
								modal.show();
								});
								//break;
							}
						}
						tag.appendChild(quince);
						dt.setMinutes(dt.getMinutes()+15);
			}
			obj.firstTime = false;
	return tag;
}

function createCalendarDay(y,num, day, month,modal) {

	var currentCalendar = document.getElementById("calendar");
	var newDay = document.createElement("div");
	var date = document.createElement("div");
			date.className = "label";
	date.innerHTML = num + ' | ' + day;

	if (objAgenda[num+' '+(month+1)+' '+y]) {
			newDay.className = "calendar-day calendar-day-agendado";
	}else{
		newDay.className = "calendar-day";
	}

	var dateActual = new Date();
	if (
			num == dateActual.getDate() &&
			month == dateActual.getMonth() &&
			y == dateActual.getFullYear()
		) {
		var specialElement = document.createElement("div");
		specialElement.className = "specialElement";
		newDay.appendChild(specialElement);
		newDay.className = "calendar-day special";
	}

	newDay.appendChild(date);
	newDay.appendChild(createHour(num,modal));

	currentCalendar.appendChild(newDay);

}

function clearCalendar() {
	var currentCalendar = document.getElementById("calendar");
	currentCalendar.innerHTML = "";
}

function monthCreate(i) {

	//console.log(i);
	obj.firstTime = true;
	var y = obj.year
	obj.lastMonth = i;
	clearCalendar();
	date.setFullYear(y);
	date.setMonth(i);
	document.getElementById('id')
	createMonth(date.getMonth(),modal);
}


//generate buton year
function gotoYear(e,d){

	obj.year = e.srcElement.dataset.year;
	console.log(obj.year);
	monthCreate(obj.lastMonth);
	generateMonthButton();

	//console.log(e.srcElement.dataset.year);
}
function generateYearButton(){
	var wrap = document.getElementById('select-year');
	var yearList = [];
	for (var i = 0; i < 35; i++) {
		yearList.push(1988+i);
	}
	for (var i = 0; i < yearList.length; i++) {
			var e = document.createElement("button");

			if(objAgendaAnio[yearList[i]])
				e.className = 'calendar-year-agendado';

			e.dataset.year = yearList[i];
			var t = document.createTextNode(yearList[i]);
			e.appendChild(t );
			e.addEventListener('click',gotoYear);
			wrap.appendChild(e);
	}
}
generateYearButton();



function gotoMonth(e,d){
	obj.lastMonth = e.srcElement.dataset.month;
	monthCreate(obj.lastMonth);
}



function generateMonthButton(){
	var wrap = document.getElementById('select-month');

	obj.removeChild(wrap);
	for (var i = 0; i < 12; i++) {
			var e = document.createElement("button");

			if(objAgendaMes[i+1+' '+obj.year])
				e.className = 'calendar-month-agendado';

			e.dataset.month = i;
			var t = document.createTextNode(monthsAsString(i));
			e.appendChild(t );
			e.addEventListener('click',gotoMonth);
			wrap.appendChild(e);
	}
}
generateMonthButton();



// Generate month
function createMonth(month,modal) {
	var currentCalendar = document.getElementById("calendar");
	console.log(date);
	document.getElementById("month").innerHTML = modal.monthsAsString(month);



	var dateObject = new Date();
	dateObject.setDate(date.getDate());
	dateObject.setMonth(month);
	dateObject.setYear(date.getFullYear());

	createCalendarDay(date.getFullYear(),dateObject.getDate(), modal.dayOfWeekAsStringMin(dateObject.getDay()), dateObject.getMonth(),modal);
	dateObject.setDate(dateObject.getDate() + 1);

	while (dateObject.getDate() != 1) {
		createCalendarDay(date.getFullYear(),dateObject.getDate(), modal.dayOfWeekAsStringMin(dateObject.getDay()), dateObject.getMonth(),modal);
		dateObject.setDate(dateObject.getDate() + 1);
	}

}
});
