var Programa = function(){
  var self = this;
  self.listaTareas = [];

  self.setTarea = function(tarea){
    if (tarea.id != null) {
        self.listaTareas.push(tarea);
    }else{
      console.error("id no puede ser nulo");
      return false;
    }

  };

  self.searchTarea = function(campo,dato,sensibilidad){
    for(var i = 0; i < self.listaTareas.length; i++)
    {
      var valor = self.listaTareas[i][campo];
      if (sensibilidad) {
        if(valor == dato)
        {
          return self.listaTareas[i][campo];
        }
      }else{
        if(valor.toLowerCase() == dato.toLowerCase())
        {
          return self.listaTareas[i][campo];
        }
      }
    }
    return false;
  }
};
