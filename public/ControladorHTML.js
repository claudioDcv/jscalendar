var ControladorHTML = function(dia){

  this.dia = dia;
  this.text = {
    btn_cancel : 'Cancelar',
    btn_add : 'Agregar',
    btn_add_event: 'Agregar Evento'
  }
  this.contenedor = document.createElement('div');
  //this.title = document.createTextNode('Claudio heramientas');
  //this.contenedor.appendChild(this.title);
  dia.dia.appendChild(this.contenedor);
  this.vetanaNuevoEvento();

}

ControladorHTML.prototype.tag = function(obj,cssClass,text){
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

ControladorHTML.prototype.addChild = function (obj,child) {
  if (child instanceof Array) {
    for (var i = 0; i < child.length; i++) {
      obj.appendChild(child[i]);
    }
  }else{
    obj.appendChild(child);
  }
  return obj;
}

ControladorHTML.prototype.addData = function(elm,name,value){

  if (name instanceof Array) {
    name.forEach(function(data){
      elm.dataset[data[0]] = data[1];
    })
    return elm;
  }
  return elm.dataset[name] = value;
}

ControladorHTML.prototype.vetanaNuevoEvento = function (arguments) {

  console.log(this);
  var openBtn = this.tag('button','agregar-evento',this.text.btn_add_event);
  var head = this.tag('div','dia dia-nuevo-evento-head  dia-defecto-head',this.text.btn_add_event);
  var body = this.tag('div','dia dia-nuevo-evento-body dia-defecto-body');
  var msg = this.tag('input,msg','mensaje');
      msg.readOnly = true;
  var title = this.tag('input,title','title','Una actividad creada desde afuera');
  var inicio = this.tag('input,inicio','fecha',"09:00");
  var termino = this.tag('input,termino','fecha',"09:59");
  var container = this.tag('div','dia-hide dia dia-nuevo-evento-container dia-defecto-container');
  var footer = this.tag('div','dia dia-nuevo-evento-footer  dia-defecto-footer');
  var ventana = this.tag('div','dia dia-nuevo-evento-ventana dia-defecto-ventana');
  var ok = this.tag('button','dia-btn-ok',this.text.btn_add);
  var nok = this.tag('button','dia-btn-nok',this.text.btn_cancel);

  this.addChild(body,[msg,title,inicio,termino]);
  this.addChild(footer,[ok,nok])
  this.addChild(ventana,[head,body,footer]);
  this.addChild(container,ventana);

  //BOTONES
  function fn_add(){

    var fecha = this.dia.fecha;

    var anio = fecha.getFullYear();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() < 9 ? "0"+(fecha.getMonth()+1):fecha.getMonth()+1;

    var fullAnio = mes +"/"+ dia +"/"+ anio;

    var i = fullAnio + " " + inicio.value + ":00";
    var t = fullAnio + " " + termino.value + ":00";
    var control = this.dia.agregarHorario(i,t,{title : title.value});

    if (control) {
      container.className = 'dia-hide dia dia-nuevo-evento-container dia-defecto-container';
    }else{
      msg.value = "No se puede crear evento";
    }

  }
  function fn_close(){
    msg.value = "";
    container.className = 'dia-hide dia dia-nuevo-evento-container dia-defecto-container';
  }
  function fn_open(){
    container.className = 'dia-show dia dia-nuevo-evento-container dia-defecto-container';
  }
  function inicio_change(){
    mask(inicio, '00:00', event);
  }
  //inicio.addEventListener('change',inicio_change.bind(this),false);
  //inicio.addEventListener('paste',inicio_change.bind(this),false);
  inicio.addEventListener('keyup',inicio_change.bind(this),false);

  function termino_change(){
    //mask(termino, '00/00/0000 00:00:00', event);
    mask(termino, '00:00', event);
  }
  //termino.addEventListener('change',termino_change.bind(this),false);
  //termino.addEventListener('paste',termino_change.bind(this),false);
  termino.addEventListener('keyup',termino_change.bind(this),false);
  openBtn.addEventListener('click',fn_open.bind(this),false);
  ok.addEventListener('click',fn_add.bind(this),false);
  nok.addEventListener('click',fn_close.bind(this),false);

  this.addChild(this.contenedor,[container,openBtn]);

}


var dia = new Dia(data,"05/24/2016 00:00:00",{debug_mode : false});
