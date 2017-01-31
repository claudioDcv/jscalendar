var serviceFake = [
];

(function() {

var Calendar = function(id){
  this.id = id;
  this.wrapper = document.getElementById(id);

  this.container_table = this.tag('DIV',"calendar-container-table");
  this.container_reloj = this.tag('DIV','calendar-container-horario');
  this.table           = this.tag('TABLE');

  this.wrapper.appendChild(this.container_table);
  this.wrapper.appendChild(this.container_reloj);

  this.setInicioSemana;
  this.init("monday");
  this.actual       = {};

  this.createStyle();

}

Calendar.prototype.tag = function(obj,cssClass){
  var elm = document.createElement(obj);
    if(cssClass){elm.className = cssClass};
  return elm;
}

Calendar.prototype.init = function(diaInicioSemana){
  //Metodo que sobreescribe el calendario para que el primer dia sea otro dia
    var original = Fecha.prototype.getDay;
    var daysOfWeek = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    this.setInicioSemana = daysOfWeek[diaInicioSemana];

    Fecha.prototype.getDay = function(weekBegins) {
      weekBegins = (weekBegins || "monday").toLowerCase();
      return (original.apply(this) + 7 - daysOfWeek[weekBegins]) % 7;
    };

}
Calendar.prototype.create = function (date) {
  //console.table([this.actual]);
  //INIT
  this.setFechaMaestro(new Fecha(date));
  this.crearReloj();
};
Calendar.prototype.setFechaMaestro = function(date){
  this.actual.hoy               = (new Fecha()).setHours(0,0,0,0);
  this.actual.fecha             = date;
  this.actual.mes               = this.actual.fecha.getMonth();
  this.actual.anio              = this.actual.fecha.getFullYear();
  this.actual.diaMes            = this.actual.fecha.getDate();
  this.actual.diaSemana         = this.actual.fecha.getDay();
  this.actual.diaUltimo         = new Fecha(this.actual.anio,this.actual.fecha.getMonth() + 1,0);
  this.actual.diaUltimoNumero   = this.actual.diaUltimo.getDate();
  this.actual.diaPrimero        = new Fecha(this.actual.anio,this.actual.fecha.getMonth(),1);
  this.actual.diaPrimeroNumero  = this.actual.diaPrimero.getDate();
  this.actual.dia1Semana1       = this.actual.diaPrimero.getDay();
  this.actual.diaNombre         = this.getNombreDia(this.actual.diaSemana);
  this.actual.mesNombre         = this.getNombreMes(this.actual.mes);
  this.primerDiaSemana          = 1;//1 == Lunes;
  this.arregloDelMes            = [];
  this.list                     = {};
  this.list.mes                 = [];

  this.crearMesConDias();
}
Calendar.prototype.setFecha = function(date){
  this.actual.fecha = date;
}
Calendar.prototype.getNombreDia = function(n){
  this.setInicioSemana;
  return ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'][n];
}
Calendar.prototype.getNombreDiaMin = function(n){
  this.setInicioSemana;
  return ['Lu','Ma','Mi','Ju','Vi','Sa','Do'][n];
}
Calendar.prototype.getNombreMes = function(n){
  return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',][n];
}
Calendar.prototype.crearMesConDias = function (date) {
  var diaMes = 1-this.actual.dia1Semana1;
  var diasEnCalendarioVisual = 1;
  var maximoDiasEnCalendarioVisual = 35;
  //Iterar sobre el mas anterior
  for (var i = 0; i < this.actual.dia1Semana1; i++) {
    var dia = {
      isMesActual : false,
      contador : diasEnCalendarioVisual,
      diaMes : "",
      date : "",
      isHoy : false
    };
    this.arregloDelMes.push(dia);
    diasEnCalendarioVisual++;
  }
  //Iterar sobre el mes actual
  for (var i = this.actual.diaPrimeroNumero; i <= this.actual.diaUltimoNumero; i++) {

    var diaVisual = this.fntoStr(diasEnCalendarioVisual);
    var diaContadorDelMesActual = this.fntoStr(i);
    var fechaCurrent = new Fecha(this.actual.anio,this.actual.mes,diaContadorDelMesActual,0,0,0,0);
    var dia = {
      isMesActual : true,
      contador : diasEnCalendarioVisual,
      diaMes : diaContadorDelMesActual,
      date : fechaCurrent,
      isHoy : ((new Fecha()).setHours(0,0,0,0) == fechaCurrent.getTime()) ? true : false,
			diaDefaultCalendar : this.actual.diaMes
    };
    this.arregloDelMes.push(dia);
    diasEnCalendarioVisual++;
  }
  //Iterar sobre el mes siguiente
  for (var i = diasEnCalendarioVisual; i <= maximoDiasEnCalendarioVisual; i++) {
    var dia = {
      isMesActual : false,
      contador : diasEnCalendarioVisual,
      diaMes : "",
      date : "",
      isHoy : false
    };
    this.arregloDelMes.push(dia);
    diasEnCalendarioVisual++
  }
  this.crearTagDelMes();
};


Calendar.prototype.createStyle = function(){
  var cssTxt = document.createTextNode("#"+this.id+"{width: 100%;height: auto;font-family:arial;}"+
                                       "#"+this.id+" .calendar-container-table{top: 0px;position: absolute;display: block;vertical-align: top;width: 170px;padding-left: 0;left: 0px;}"+
                                       "#"+this.id+" .calendar-container-horario{display: block;padding-left: 180px;width: 100%;}"+
                                       "#"+this.id+" .calendar-container-horario table{width: 100%;}"+
                                          "#"+this.id+" .calendar-container-horario table > tr{padding: 10px;display: block;}"+
                                          "#"+this.id+" .calendar-container-horario table tr.hora-completa{background: hsl(0, 0%, 95%);}"+
                                          "#"+this.id+" .calendar-container-horario table tr.hora-media{}"+
                                            "#"+this.id+" .calendar-container-horario table tr.red{background:red;}"+
                                            "#"+this.id+" .calendar-container-horario table tr.green{background:green;}"+
                                       "#"+this.id+" td.mes-actual:hover{background:grey;}"+
                                       "#"+this.id+" td.calendar-hoy{background: #b8c8d2;}"+
                                       "#"+this.id+" td.mes-distinto{background: #cccccc;}"+
																			 "#"+this.id+" td.dia-mes-init{background: hsl(0, 0%, 15%);color: hsl(0, 0%, 83%);}"+
                                       ""
                                      );
  var styleCss = document.createElement('STYLE');
      styleCss.appendChild(cssTxt);
      this.wrapper.appendChild(styleCss);
}
Calendar.prototype.crearTagDelMes = function(){

		var fn_show_day = function(event){

      var fechaSeleccionada = new Fecha(this.actual.fecha).setDate(parseInt(event.srcElement.innerText));

			//console.log(fechaSeleccionada,event.srcElement.innerText,this.actual);
      var dia = new Dia(data,fechaSeleccionada,{bloque_minimo:15});
    }

        this.removerLosHijos(this.table);
        this.table.className = "calendar-container";
    var cont = 0;

    var tr_head_y= document.createElement('TR');

      var txt_y = document.createTextNode(this.actual.anio);
      var td_y= document.createElement('TH');
          td_y.colSpan = 2;
          td_y.appendChild(txt_y);
          tr_head_y.appendChild(td_y);

      var txt_m = document.createTextNode(this.getNombreMes(this.actual.mes));
      var td_m= document.createElement('TH');
          td_m.colSpan = 5;
          td_m.appendChild(txt_m);
          tr_head_y.appendChild(td_m);

    this.table.appendChild(tr_head_y);
    //tag head
    var tr_head= document.createElement('TR');
    for (var i = 0; i < 7; i++) {
      var txt = document.createTextNode(this.getNombreDiaMin(i));
      var td= document.createElement('TH');
          td.appendChild(txt);
          tr_head.appendChild(td);
    }
    this.table.appendChild(tr_head);

    for (var i = 0; i < 5; i++) {
      var arregloParaPintar = [];
      var stringParaPintarEnConsola = "";

      var tr= document.createElement('TR');
      for (var j = 0; j < 7; j++) {
        //console.log();
        var txt = document.createTextNode(this.arregloDelMes[cont].diaMes);
        var td= document.createElement('TD');
            td.appendChild(txt);



						if (this.arregloDelMes[cont].isMesActual) {

              td.style.cursor = "pointer";
              td.addEventListener('click',fn_show_day.bind(this),false);

							if (this.arregloDelMes[cont].diaMes == this.actual.diaMes) {
								td.className = "dia-mes-init"
							}

              if (this.arregloDelMes[cont].isHoy) {
                td.className = td.className + " mes-actual calendar-hoy";
              }else{
                td.className = td.className + " mes-actual";
              }
            }else{
              td.className = td.className + " mes-distinto";
            }
            tr.appendChild(td);
        cont++;
      }
      this.table.appendChild(tr);
      //console.log(stringParaPintarEnConsola);
    }
    this.container_table.appendChild(this.table);
}
Calendar.prototype.removerLosHijos = function(nodo){
  var myNode = nodo;
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
  return nodo;
}
Calendar.prototype.horaEnVivo = function(){
  setInterval(function () {
    setTimeout(function () {
      console.clear();
    }, 1);
    setTimeout(function () {
      console.log(new Fecha());
    }, 1);
  }, 1000);
}

Calendar.prototype.crearReloj = function(){

  this.horasServicio = serviceFake;

  this.removerLosHijos(this.container_reloj);
}
// //fntoStr == formateo numero a string : los convierte en String
// //formatea numeros sin cero como 1 y los deja 01
Calendar.prototype.fntoStr = function(n){
  return ((n+"").length==1)?"0"+n:""+n;
}

var a = new Calendar("calendario");
     a.create('05/24/2016');

})();
