var TareaFactory = function(){
  var self = this;
  self.contador = 0;
  self.programa = new Programa();
  self.tarea = function(nombre){
    var t = new Tarea();
        t.id = ++self.contador;
        t.nombre = nombre;
    self.programa.setTarea(t);
  }
  self.printTareas = function(){
    var size = 0;
    for (var i = 0; i < self.programa.listaTareas.length; i++) {
      console.log(self.programa.listaTareas[i].nombre);
      size++;
    }
    return size;
  }
}
