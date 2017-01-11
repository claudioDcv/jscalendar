var ControladorHTML = function(dia){

  this.dia = dia;
  this.text = {
    btn_cancel : 'Cancelar',
    btn_add : 'Agregar',
    btn_add_event: 'Agregar Evento',
    btn_edit_event: 'Editar Evento'
  }
  this.contenedor = document.createElement('div');
  //this.title = document.createTextNode('Claudio heramientas');
  //this.contenedor.appendChild(this.title);
  this.default = {};
  this.default.title = "t";

  dia.dia.appendChild(this.contenedor);
  this.vetanaNuevoEvento();
  this.modalEditInit('hide');
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

  var openBtn = new SL('button','agregar-evento',this.text.btn_add_event).elm;
  var head = new SL('div','dia dia-nuevo-evento-head  dia-defecto-head',this.text.btn_add_event).elm;
  var body = new SL('div','dia dia-nuevo-evento-body dia-defecto-body').elm;
  var msg = new SL('input,msg','mensaje').elm;
      msg.readOnly = true;
  var title = new SL('input,title','title','Una actividad creada desde afuera').elm;
  var inicio = new SL('input,inicio','fecha',"09:00").elm;
  var termino = new SL('input,termino','fecha',"09:59").elm;
  var container = new SL('div','dia-hide dia dia-nuevo-evento-container dia-defecto-container').elm;
  var footer = new SL('div','dia dia-nuevo-evento-footer  dia-defecto-footer').elm;
  var ventana = new SL('div','dia dia-nuevo-evento-ventana dia-defecto-ventana').elm;
  var ok = new SL('button','dia-btn-ok',this.text.btn_add).elm;
  var nok = new SL('button','dia-btn-nok',this.text.btn_cancel).elm;

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

ControladorHTML.prototype.modalEditInit = function(toggle){
  this.modalEdit = {};

  var head = new SL('div','dia dia-edit-evento-head  dia-defecto-head',this.text.btn_edit_event).elm;
  var body = new SL('div','dia dia-edit-evento-body dia-defecto-body').elm;
  var msg = new SL('input,msg','mensaje').elm;
      msg.readOnly = true;
  this.modalEdit.title = new SL('input,title','title',arguments.title).elm;

  // var inicio = new SL('input,inicio','fecha',"09:00").elm;
  // var termino = new SL('input,termino','fecha',"09:59").elm;
  this.modalEdit.container = new SL('div','dia-'+toggle+' dia dia-nuevo-evento-container dia-defecto-container').elm;
  var footer = new SL('div','dia dia-edit-evento-footer  dia-defecto-footer').elm;
  var ventana = new SL('div','dia dia-edit-evento-ventana dia-defecto-ventana').elm;
  this.modalEdit.ok = new SL('button','dia-btn-ok',this.text.btn_add).elm;
  this.modalEdit.nok = new SL('button','dia-btn-nok',this.text.btn_cancel).elm;

  this.addChild(body,[msg,this.modalEdit.title]);
  this.addChild(footer,[this.modalEdit.ok,this.modalEdit.nok])
  this.addChild(ventana,[head,body,footer]);
  this.addChild(this.modalEdit.container,ventana);

  this.addChild(this.contenedor,[this.modalEdit.container]);

}

ControladorHTML.prototype.ModalEdicion = function (toggle) {
  this.modalEdit.container.className = 'dia-'+toggle+' dia dia-nuevo-evento-container dia-defecto-container';
};


ControladorHTML.prototype.openEdit = function () {
  this.ModalEdicion('show');
};

ControladorHTML.prototype.closeEdit = function () {
  this.ModalEdicion('hide');
};

var dia = new Dia(data,"05/24/2016 00:00:00");
