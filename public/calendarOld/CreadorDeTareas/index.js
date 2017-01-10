

var p = new Promesa();

p.then(function(args){
	console.log('foo has happened ' + args);
}).error(function(args){
	console.log('error has happened');
}).always(function(args){
	console.log('something has happened, good or bad');
});

p.complete("claudio");
p.fail();




//
// var programacion = new FactoryTarea();
//     programacion.tarea("Rock");
//     programacion.tarea("Metal");
//     programacion.tarea("Jazz");
//     programacion.tarea("Cumbia");
//
//     console.log(programacion.programa.listaTareas);
//
//     console.log(programacion.programa.searchTarea("nombre","cumbia"));
