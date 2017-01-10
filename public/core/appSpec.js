fs = require('fs')

var read = function(file){
_promesa = fs.readFileSync(file,'utf-8') // depends on the file encoding
return _promesa;
}


eval(read('./public/core/Promesa.js'));
eval(read('./public/core/Tarea.js'));
eval(read('./public/core/Programa.js'));
eval(read('./public/core/TareaFactory.js'));


var p = null;
var tf = null;

describe("Instanciar Promesa:", function() {

    beforeEach(function() {
      p = new Promesa();
      tf = new TareaFactory();
    });
    it("Lista de programacion debe estar vacia:", function() {
      expect(tf.programa.listaTareas.length).toBe(0);
    });

    describe("Cuando se añade una tarea", function() {

        beforeEach(function() {
            tf.tarea("Rock");
            tf.tarea("Cumbia");
            tf.tarea("Metal");
        });

        it("no debe estar vacía", function() {
          expect(tf.printTareas()).toBe(3);
        });

        it("debe poder contener más de una tarea", function() {

        });

        it("debe estar sin completar nada más añadirse a la lista de tareas", function() {

        });

        it("se debe poder completar", function() {

        });

        it("debe quedar vacía al borrar la última tarea", function() {

        });
    });
});
