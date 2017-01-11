var data = [
  {
    start : "05/24/2016 00:00:00",
    end : "05/24/2016 01:59:00",
    data : {
      title : "Hola 2"
    }
  },
  {
    start : "05/24/2016 05:00:00",
    end : "05/24/2016 05:29:00",
    data : {
      title : "Hola",
      text : "esto es un texto..."
    }
  },
  {
    start : "05/24/2016 06:00:00",
    end : "05/24/2016 07:29:00",
    data : {
      title : "Hola que tal"
    }
  },
  {
    start : "05/24/2016 08:00:00",
    end : "05/24/2016 08:59:00",
    data : {
      title : "Hola que tal"
    }
  },
  {
    start : "05/24/2016 10:00:00",
    end : "05/24/2016 18:29:00",
    data : {
      title : "Esto es una prueba"
    }
  },
  {
    start : "05/24/2016 20:00:00",
    end : "05/24/2016 21:59:00",
    data : {
      title : "Asi es"
    }
  }
];

var Dia = function(data,fechaInicial,opts){
  //Formato 05/24/2016 00:00:00
  var self = this;
      self.BLOQUES_TOTALES = function(){
        return 48;
      }
      self.errores = [];
      this.data = [];
      self.fecha = new Fecha(fechaInicial);
      self.fechaInicial = fechaInicial;
      self.fecha.imprime();
      self.bloqueHorario = [];
      self.bloqueHTML;
      this.dia = document.getElementById('dia-calendario');
      this.wrapp = document.createElement('div');
      this.wrapp.id = "dia";
      this.dia.appendChild(this.wrapp);

  this.controladorHTML = new ControladorHTML(this);
  this.setData(data);

}


Dia.prototype.tag = function(obj,cssClass,text){
  var elm;
  if (obj.indexOf('input,') != -1) {
    var _obj = obj.split(',');
    obj = _obj[0];
    elm = document.createElement(obj);
    elm.name = _obj[1];
    if (text) {
      elm.value = text;
    }
  }else{
    elm = document.createElement(obj);
    if (text) {
      elm.appendChild(document.createTextNode(text));
    }
  }

    if(cssClass){elm.className = cssClass};

  return elm;
}
Dia.prototype.addChild = function (obj,child) {
  if (child instanceof Array) {
    for (var i = 0; i < child.length; i++) {
      obj.appendChild(child[i]);
    }
  }else{
    obj.appendChild(child);
  }
  return obj;
}
Dia.prototype.addData = function(elm,name,value){

  if (name instanceof Array) {
    name.forEach(function(data){
      elm.dataset[data[0]] = data[1];
    })
    return elm;
  }
  return elm.dataset[name] = value;
}

Dia.prototype.setData = function(data){
  this.data = data;
  this.crearDiaCompleto();
  this._crearHorarioDelDia();
}

Dia.prototype.crearDiaCompleto = function () {
  //restamos media hora para que en el for se aumente
  //media hora y comience a las 00:00:00
  this.fecha.setMinutes(this.fecha.getMinutes()-30);
  for (var i = 0; i < this.BLOQUES_TOTALES(); i++) {
    this.bloqueHorario.push(this.fecha.setMinutes(this.fecha.getMinutes()+30));
  }
}

/**
* Si existe algun evento dentro del rango start end retornar false
* si no existe algun evento retornar true quiere decir que se puede crear un
* evento
*/
Dia.prototype.isVacio = function (start,end) {
  var start = new Fecha(start).getTime();
  var end = new Fecha(end).getTime();
  var isVacio = true;
  //for para comprobar los blques
  this.bloqueHorario.forEach(function(bloque){
    var _start = new Fecha(bloque.start).getTime();
    var _end = new Fecha(bloque.end).getTime();

    var v = bloque instanceof Vacio ? 'Vacio':'';
        v = bloque instanceof Evento ? 'Evento':v;
        v = bloque instanceof EventoCont ? 'EventoCont':v;

    //comprobar si _start esta dentro de start - end
      if ((
          (start <= _start && _start <= end) ||
          (start <= _end && _end <= end)) &&
          (v != 'Vacio')
      ) {
        //entra aqui cada vez que encuentra un bloque con Evento
        isVacio = false;
      }
  });
  return isVacio;

}
/**
* evalua que start sea menor a end y que ademas sean fechas reales
*/
Dia.prototype.isFechaCorrecta = function (start,end) {
  try{
    if (new Fecha(start).getTime() < new Fecha(end).getTime()) {
      return true;
    }
    return false;
  }
  catch(e){
    return false;
  }
}
Dia.prototype.agregarHorario = function (start,end,data) {

  var start = new Fecha(start).getTime();
  var end = new Fecha(end).getTime();

  if (!this.isFechaCorrecta(start,end)) {
    this.errores.push("start no puede ser mayor a end");
    return false;
  }

  var seAgrego = false;
  //Ingresa al bloque si existe algun Evento dentro del bloque
  if (this.isVacio(start,end)) {

    var agregarDesdeEstePunto = this.calculaDesdeInicio(start);
    var evento = new Evento(
      this.id_actual,
      start,
      end,
      this.calcularDiferenciaStartEnd(start,end).bloques,
      data
    );

    this.id_actual++;
    var datos = this.data;
        this.agregarEventoDesdeUnPunto(agregarDesdeEstePunto,evento);
    seAgrego = true;
  }
  return seAgrego;
}

Dia.prototype.agregarEventoDesdeUnPunto = function (punto,evento) {
  var desde = punto;
  var hasta = punto + evento.bloques;
  for (var i = punto; i < hasta; i++) {
    //var bloqueVacio = this.bloqueHorario[i];
    if (desde == i) {
      this.bloqueHorario[i] = evento;
      var a = 1;
    }else{

      this.bloqueHorario[i] = new EventoCont(
        evento.id_actual,
        evento.start,
        evento.end,
        evento.bloques
      );
    }

  }
  var e = this;
  this.crearHTML();
}

Dia.prototype.decimalToHours = function (numero) {
  var sign = numero < 0 ?  '-':'';
  var min = Math.floor(Math.abs(numero));
  var sec = Math.floor((Math.abs(numero) * 60) % 60);
  var stringDeRetorno = sign + (min < 10 ? 0 : "")
                             + min + ':'
                             + (sec < 10 ? '0' + sec : sec);

  var numeroDeBoques = (min > 0 ? min * 2 : 0) + (sec == 30 ? 1 : 0);

  return {
    bloques : numeroDeBoques,
    text : stringDeRetorno
  };
}


Dia.prototype.calculaDesdeInicio = function (start) {

  this.fecha = new Fecha(this.fechaInicial);

  //this.fecha.setDate(this.fecha.getDate()-1);

  //this.fecha.setMinutes(this.fecha.getMinutes()-30);

  var bloquesDesdeInicio = 0;

  for (var i = 0; i < this.BLOQUES_TOTALES(); i++) {
    this.fecha.setMinutes(this.fecha.getMinutes()+30);

    //console.log(new Fecha(start) , new Fecha(this.fecha));
    //console.log(new Fecha(start).getTime() , new Fecha(this.fecha).getTime());

    if (new Fecha(start).getTime() == new Fecha(this.fecha).getTime()) {
      bloquesDesdeInicio = i+1;
      break;
    }

  }
  return bloquesDesdeInicio;
}

Dia.prototype.calcularDiferenciaStartEnd = function (start,end) {



  var obj = this.decimalToHours((
    (new Fecha(end).getTime()+100000) - (new Fecha(start).getTime())
  )/3600000);

  return obj;
}

Dia.prototype.agregarNuevo = function (evento) {

  for (var i = 0; i < this.BLOQUES_TOTALES(); i++) {
    var a = this.bloqueHorario[i];
    var evt = evento;

      if ( (new Fecha(evt.end)).getTime() === a) {

        var evento = new EventoCont(
                            this.id_actual,
                            evt.start,
                            evt.end,
                            this.calcularDiferenciaStartEnd(
                              evt.start,evt.end
                            ).bloques
                          );
          this.bloqueHorario[i] = evento;

      }else
      if ( (new Fecha(evt.end)).getTime() > a && (new Fecha(evt.start)).getTime() < a) {

        var evento = new EventoCont(
                            this.id_actual,
                            evt.start,
                            evt.end,
                            this.calcularDiferenciaStartEnd(evt.start,evt.end).bloques
                          );
          this.bloqueHorario[i] = evento;

      }else
      if ( (new Fecha(evt.start)).getTime() === a) {


          var evento = new Evento(
                              this.id_actual,
                              evt.start,
                              evt.end,
                              this.calcularDiferenciaStartEnd(evt.start,evt.end).bloques,
                              evt.data
                            );
          this.bloqueHorario[i] = evento;
          this.id_actual++;

      }

  }


  console.log(this.bloqueHorario);
  //this.crearHTML();
}



Dia.prototype._crearHorarioDelDia = function () {

  for (var i = 0; i < this.BLOQUES_TOTALES(); i++) {
    var a = this.bloqueHorario[i];
//Todo parece que vacio esta mal el ingreso de parametros

    this.bloqueHorario[i] = new Vacio(
                          i,
                          1,
                          this.bloqueHorario[i],
                          (new Fecha(this.bloqueHorario[i])
                            .setMinutes(new Fecha(this.bloqueHorario[i])
                              .getMinutes()+29)));

    for (var j = 0; j < this.data.length; j++) {
      var evt = this.data[j];
          evt.start = new Fecha(evt.start).getTime();
          evt.end = new Fecha(evt.end).getTime();

      if ( (new Fecha(evt.end)).getTime() === a) {

        var evento = new EventoCont(j,evt.start,evt.end,this.calcularDiferenciaStartEnd(evt.start,evt.end).bloques);
          this.bloqueHorario[i] = evento;

      }else
      if ( (new Fecha(evt.end)).getTime() > a && (new Fecha(evt.start)).getTime() < a) {

        var evento = new EventoCont(j,evt.start,evt.end,this.calcularDiferenciaStartEnd(evt.start,evt.end).bloques);
          this.bloqueHorario[i] = evento;

      }else
      if ( (new Fecha(evt.start)).getTime() === a) {

          this.id_actual = j;
          var evento = new Evento(j,evt.start,evt.end,this.calcularDiferenciaStartEnd(evt.start,evt.end).bloques,evt.data);
          this.bloqueHorario[i] = evento;

      }
    }
  }

  this.crearHTML();
}


Dia.prototype.deleteChild = function (obj) {
    while (obj.firstChild) {
        obj.removeChild(obj.firstChild);
    }
    return obj;
}

Dia.prototype.clicYEliminarEvento = function (event) {
  event.stopPropagation();

  var s = this;
  var elemento = event.target;
  //Metodo de busqueda recursivo
  function _buscar(elemento){
    if (elemento.dataset.bloque) {
      s.eliminarBloqueAccion(elemento);
      return;
    }else{

      //if de salida
      if (elemento !== null) {
        elemento = elemento.parentElement;
        //se autollama
        _buscar(elemento);
      }else{
        console.log('end');
      }
    }

  }

  //function que inicia la recursividad
  function buscar(elemento){
    _buscar(elemento);
  }

  buscar(elemento);

}

Dia.prototype.eliminarBloqueAccion = function (elm) {
  var elm = this.deleteChild(elm);

  var isPrimero = true;
  var elmStart = parseInt(elm.dataset.start);
  for (var i = 0; i < this.bloqueHorario.length; i++) {
    var start = this.bloqueHorario[i].start;
    if (start == elmStart) {

        //var Vacio = function(id,bloques,start,end){
        var finHoraVacio = (new Fecha(elmStart).setMinutes(new Fecha(elmStart).getMinutes()+29));
        this.bloqueHorario[i] = new Vacio(
                              i,
                              1,
                              elmStart,
                              finHoraVacio);

            this.bloqueHorario[i].id = i;
        isPrimero = false;
        var horaEvento = elmStart;

        for (var j = i+1; j < parseInt(elm.dataset.bloque)+i; j++) {
          horaEvento = new Fecha(horaEvento).setMinutes(new Fecha(horaEvento).getMinutes()+30);

          finHoraVacio = (new Fecha(horaEvento).setMinutes(new Fecha(horaEvento).getMinutes()+29));
          //El (1) quiere decir que por defecto el bloque vacio mide un solo bloque
          this.bloqueHorario[j] = new Vacio(i,1,horaEvento,finHoraVacio);
          this.bloqueHorario[j].id = j;

        }
        this.id_actual--;
        break;

    }

  }

  this.crearHTML();

}


Dia.prototype.clicYEditarEvento = function (event) {

  //Abrir Modal Editar Evento
  var data = event.srcElement.parentNode.childNodes[0].dataset;
  var bloque = this.bloqueHorario[data.numero];

  this.controladorHTML.openEdit({
    title: bloque.data.title,
    node : event.srcElement.parentNode.childNodes[0]
  },this);

}
Dia.prototype.crearHTML = function () {

  this.wrapp.innerHTML = "";
  var arregloBLoque = [];
  var sumaPorcentajes = 0;
  var i = 0;
  for ( i ; i < this.BLOQUES_TOTALES();) {
    var bloque = new SL('div','evento').elm;
    var objeto = this.bloqueHorario[i];
    var botonContenedor = new SL("div","dia-btn-evento-contenedor").elm;
    var botonEliminar = new SL("button",'dia-btn dia-btn-del','Eliminar').elm;
    var botonEditar = new SL('button','dia-btn dia-btn-editar','Editar').elm;
    var a = this.bloqueHorario[i].bloques;

        sumaPorcentajes += a;
        if (typeof a !== 'undefined') {

            bloque.style.height = (a*100)/48 + '%';

              var hora = this.tag('p');
              if(objeto.evento){
                var hora_txt = document.createTextNode(
                                (new Fecha(objeto.start)).imprime()
                                + ' - ' + (new Fecha(objeto.end)).imprime()
                                + ' ' + objeto.data.title);

                this.addChild(hora,hora_txt);
                this.addChild(bloque,hora);

                this.addData(botonEliminar,[
                  ['bloque',a],
                  ['numero',i],
                  ['start',new Fecha(objeto.start).getTime()]
                ]);
                botonEliminar.addEventListener('click',this.clicYEliminarEvento.bind(this),false);
                botonEditar.addEventListener('click',this.clicYEditarEvento.bind(this),false);

                this.addChild(botonContenedor,[botonEliminar,botonEditar]);
                this.addChild(bloque,botonContenedor);

                i += a;

              }else{
                var hora_txt = document.createTextNode((new Fecha(objeto.start)).imprime());

                this.addChild(hora,hora_txt);
                this.addChild(bloque,hora);

                bloque.className = "vacio";
                i++;
              }

            this.addChild(this.wrapp,bloque)
            arregloBLoque.push(a);
        }


  }

}
