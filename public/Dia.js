'use strict';

(function(window) {

    /*
    function doble(e) {
      return e * 2;
    }
    
    var arreglo = [1, 2, 3, 4, 5];
    var resultado = arreglo.map(doble);
    console.log(resultado); // [2, 4, 6, 8, 10];
    var resultado = arreglo.map(e => e * 2);
    
    var nombres = ["John", "Jane", "Matt"];
    var edades = [23, 45, 31];
    
    var personas = nombres.map(function (n, i) {
    	return { nombre: n, edad: edades[i] };
    });
    console.log(personas);
    
    Equivalente usando la sintaxis arrow:
    
    var personas = nombres.map((n, i) => { return { nombre: n, edad: edades[i] } });
    
    */

    var Dia = function Dia(data, fechaInicial, opts) {
        //Formato 05/24/2016 00:00:00
        this.BLOQUES_TOTALES = 96;
        //3300px //1680px
        this.bloqueMinimo = this.BLOQUES_TOTALES === 48 ? 30 : 15;
        this.errores = [];
        this.data = [];
        this.fecha = new Fecha(fechaInicial);
        this.fechaInicial = fechaInicial;
        this.fecha.imprime();
        this.bloqueHorario = [];
        this.bloqueHTML;

        this.idActual = 1;

        this.dia = document.getElementById('dia-calendario');
        this.wrapp = document.createElement('div');
        this.wrapp.id = "dia";
        this.dia.appendChild(this.wrapp);

        this.controladorHTML = new ControladorHTML(this);
        this.initActionModalEdit();
        this.setData(data);
    };
    Dia.prototype.time = function(date) {
        return new Fecha(date).getTime();
    };
    Dia.prototype.tamanioDivCont = function(id) {
        id.style.height = (this.BLOQUES_TOTALES === 48 ? 1680 : 3300) + 'px';
    };

    Dia.prototype.addChild = function(obj, child) {
        if (child instanceof Array) {
            for (var i = 0; i < child.length; i++) {
                obj.appendChild(child[i]);
            }
        } else {
            obj.appendChild(child);
        }
        return obj;
    };
    Dia.prototype.addData = function(elm, name, value) {

        if (name instanceof Array) {
            name.forEach(function(data) {
                elm.dataset[data[0]] = data[1];
            });
            return elm;
        }
        return elm.dataset[name] = value;
    };

    Dia.prototype.setData = function(data) {
        this.data = data;
        this.crearDiaCompleto();
        this._crearHorarioDelDia();
    };

    Dia.prototype.crearDiaCompleto = function() {
        //restamos media hora para que en el for se aumente
        //media hora y comience a las 00:00:00
        this.fecha.setMinutes(this.fecha.getMinutes() - this.bloqueMinimo);
        for (var i = 0; i < this.BLOQUES_TOTALES; i++) {
            this.bloqueHorario.push(this.fecha.setMinutes(this.fecha.getMinutes() + this.bloqueMinimo));
        }
    };

    /**
     * Si existe algun evento dentro del rango start end retornar false
     * si no existe algun evento retornar true quiere decir que se puede crear un
     * evento
     */
    Dia.prototype.isVacio = function(start, end) {
        var _this = this;

        var start = this.time(start);
        var end = this.time(end);
        var isVacio = true;
        //for para comprobar los blques
        this.bloqueHorario.forEach(function(bloque) {
            var _start = _this.time(bloque.start);
            var _end = _this.time(bloque.end);

            var v = bloque instanceof Vacio ? 'Vacio' : '';
            v = bloque instanceof Evento ? 'Evento' : v;
            v = bloque instanceof EventoCont ? 'EventoCont' : v;

            //comprobar si _start esta dentro de start - end
            if ((start <= _start && _start <= end || start <= _end && _end <= end) && v !== 'Vacio') {
                //entra aqui cada vez que encuentra un bloque con Evento
                isVacio = false;
            }
        });
        return isVacio;
    };
    Dia.prototype.isVacioOmitirBloqueActual = function(start, end, id) {
        var _this2 = this;

        var start = this.time(start);
        var end = this.time(end);
        var isVacio = true;
        //for para comprobar los blques
        var encontroBloqueOcupado = true;

        this.bloqueHorario.forEach(function(bloque) {
            var _start = _this2.time(bloque.start);
            var _end = _this2.time(bloque.end);

            var v = bloque instanceof Vacio ? 'Vacio' : '';
            v = bloque instanceof Evento ? 'Evento' : v;
            v = bloque instanceof EventoCont ? 'EventoCont' : v;

            //comprobar si _start esta dentro de start - end

            if ((start <= _start && _start <= end || start <= _end && _end <= end) && v !== 'Vacio') {
                //entra aqui cada vez que encuentra un bloque con Evento
                isVacio = false;
                if (bloque.id === id && encontroBloqueOcupado) {
                    isVacio = true;
                } else {
                    //si encuentra un bloque ocupado que no es el mismo bloque entra aqui
                    encontroBloqueOcupado = false;
                }
            }
        });
        return isVacio;
    };
    /**
     * evalua que start sea menor a end y que ademas sean fechas reales
     */
    Dia.prototype.isFechaCorrecta = function(start, end) {
        try {
            return this.time(start) < this.time(end) ? true : false;
        } catch (e) {
            return false;
        }
    };
    /* Metodo publico que se llama desde afuera */
    Dia.prototype.agregarHorario = function(start, end, data) {

        var start = this.time(start);
        var end = this.time(end);
        var seAgrego = false;

        if (!this.isFechaCorrecta(start, end)) {
            this.errores.push("start no puede ser mayor a end");
            return false;
        }

        //Ingresa al bloque si existe algun Evento dentro del bloque
        if (this.isVacio(start, end)) {

            var agregarDesdeEstePunto = this.calculaDesdeInicio(start);
            var evento = new Evento(this.idActual, start, end, this.calcularDiferenciaStartEnd(start, end).bloques, data);

            this.idActual++;
            var datos = this.data;
            this.agregarEventoDesdeUnPunto(agregarDesdeEstePunto, evento);
            seAgrego = true;
        }
        return seAgrego;
    };

    Dia.prototype.agregarHorarioMod = function(evento) {
        this.editEventoBloqueAntes = evento.bloques;
        var start = this.time(evento.start);
        var end = this.time(evento.end);

        if (!this.isFechaCorrecta(start, end)) {
            this.errores.push("start no puede ser mayor a end");
            return false;
        }

        var seAgrego = false;
        //Ingresa al bloque si existe algun Evento dentro del bloque
        if (this.isVacioOmitirBloqueActual(start, end, evento.id)) {

            var agregarDesdeEstePunto = this.calculaDesdeInicio(start);
            var evento = new Evento(evento.id, start, end, this.calcularDiferenciaStartEnd(start, end).bloques, evento.data);

            var datos = this.data;

            this.agregarEventoDesdeUnPunto(agregarDesdeEstePunto, evento, true);
            seAgrego = true;
        } else {
            this.errores.push("no se puede cambiar el evento, un bloque ya esta utilizado");
        }
        return seAgrego;
    };

    Dia.prototype.agregarEventoDesdeUnPunto = function(punto, evento, oldInit) {
        var _this3 = this;

        var bloques = this.bloqueHorario;
        var _evento = Clonador(evento);
        var indice = 0;
        var self = this;

        var fecha = new Fecha(this.fechaInicial);
        var ingresoEnPrimerLoop = true;
        var fechaBloque;
        var fechaBloqueEnd;

        self.bloqueHorario.forEach(function(bloque) {

            if (self.bloqueHorario[indice].id === evento.id) {

                fechaBloque = new Fecha(fecha).setMinutes(new Fecha(fecha).getMinutes() + indice * 15);
                var f = fechaBloque;
                fechaBloqueEnd = new Fecha(f).setMinutes(new Fecha(f).getMinutes() + 14);

                self.bloqueHorario[indice] = new Vacio(i, 1, fechaBloque, fechaBloqueEnd);
            }
            indice++;
        });

        var i = 0;
        var e = 1;
        var entrar = false;
        var isPrimero = true;
        self.bloqueHorario.forEach(function(bloque) {
            var data = self.bloqueHorario[i];

            //Entra aqui para crear los eventos cont
            if (entrar && e < evento.bloques) {
                self.bloqueHorario[i] = new EventoCont(evento.id, evento.start, evento.end, evento.bloques);
                e++;
                isPrimero = false;
            }

            if (isPrimero && _this3.time(self.bloqueHorario[i].start) === _this3.time(_evento.start)) {
                self.bloqueHorario[i] = evento;
                entrar = true;
            }

            i++;
        });

        this.crearHTML();

        return true;
    };

    Dia.prototype.decimalToHours = function(numero) {
        var sign = numero < 0 ? '-' : '';
        var min = Math.floor(Math.abs(numero));
        var sec = Math.floor(Math.abs(numero) * 60 % 60);
        var stringDeRetorno = sign + (min < 10 ? 0 : "") + min + ':' + (sec < 10 ? '0' + sec : sec);

        switch (sec) {
            case 45:
                sec = 3;
                break;
            case 30:
                sec = 2;
                break;
            case 15:
                sec = 1;
                break;
            default:
                sec = 0;
        }

        var numeroDeBoques = (min > 0 ? min * 4 : 0) + sec;

        return {
            bloques: numeroDeBoques,
            text: stringDeRetorno
        };
    };

    Dia.prototype.calculaDesdeInicio = function(start) {
        this.fecha = new Fecha(this.fechaInicial);
        var bloquesDesdeInicio = 0;
        for (var i = 0; i < this.BLOQUES_TOTALES; i++) {
            //TODO get minutos cambiar de 15 a 30 segun corresponda
            this.fecha.setMinutes(this.fecha.getMinutes() + this.bloqueMinimo);
            if (this.time(start) === this.time(this.fecha)) {
                bloquesDesdeInicio = i + 1;
                break;
            }
        }
        return bloquesDesdeInicio;
    };

    Dia.prototype.calcularDiferenciaStartEnd = function(start, end) {
        var obj = this.decimalToHours((this.time(end) + 100000 - this.time(start)) / 3600000);
        return obj;
    };

    Dia.prototype.agregarNuevo = function(evento) {
        for (var i = 0; i < this.BLOQUES_TOTALES; i++) {
            var a = this.bloqueHorario[i];
            var evt = evento;
            if (new Fecha(evt.end).getTime() === a) {
                var evento = new EventoCont(this.idActual, evt.start, evt.end, this.calcularDiferenciaStartEnd(evt.start, evt.end).bloques);
                this.bloqueHorario[i] = evento;
            } else if (new Fecha(evt.end).getTime() > a && new Fecha(evt.start).getTime() < a) {
                var evento = new EventoCont(this.idActual, evt.start, evt.end, this.calcularDiferenciaStartEnd(evt.start, evt.end).bloques);
                this.bloqueHorario[i] = evento;
            } else if (new Fecha(evt.start).getTime() === a) {
                var evento = new Evento(this.idActual, evt.start, evt.end, this.calcularDiferenciaStartEnd(evt.start, evt.end).bloques, evt.data);
                this.bloqueHorario[i] = evento;
            }
        }

        this.idActual++;
    };

    Dia.prototype._crearHorarioDelDia = function() {
        var idEventoCont = 0;
        for (var i = 0; i < this.BLOQUES_TOTALES; i++) {
            var a = this.bloqueHorario[i];
            //Todo parece que vacio esta mal el ingreso de parametros
            var fechaCalculada = new Fecha(this.bloqueHorario[i]).setMinutes(new Fecha(this.bloqueHorario[i]).getMinutes() + 14);
            this.bloqueHorario[i] = new Vacio(i, 1, this.bloqueHorario[i], fechaCalculada);
            for (var j = 0; j < this.data.length; j++) {
                var evt = this.data[j];
                evt.start = new Fecha(evt.start).getTime();
                evt.end = new Fecha(evt.end).getTime();

                if (new Fecha(evt.end).getTime() === a) {
                    var evento = new EventoCont(idEventoCont, evt.start, evt.end, this.calcularDiferenciaStartEnd(evt.start, evt.end).bloques);
                    this.bloqueHorario[i] = evento;
                } else if (new Fecha(evt.end).getTime() > a && new Fecha(evt.start).getTime() < a) {
                    var evento = new EventoCont(idEventoCont, evt.start, evt.end, this.calcularDiferenciaStartEnd(evt.start, evt.end).bloques);
                    this.bloqueHorario[i] = evento;
                } else if (new Fecha(evt.start).getTime() === a) {
                    var evento = new Evento(this.idActual, evt.start, evt.end, this.calcularDiferenciaStartEnd(evt.start, evt.end).bloques, evt.data);
                    this.bloqueHorario[i] = evento;

                    idEventoCont = this.idActual;
                    this.idActual++;
                }
            }
        }

        this.crearHTML();
    };

    Dia.prototype.deleteChild = function(obj) {
        while (obj.firstChild) {
            obj.removeChild(obj.firstChild);
        }
        return obj;
    };

    Dia.prototype.clicYEliminarEvento = function(event) {
        event.stopPropagation();
        var s = this;
        var elemento = event.target;
        //Metodo de busqueda recursivo
        function _buscar(elemento) {
            if (elemento.dataset.bloque) {
                s.eliminarBloqueAccion(elemento);
                return;
            } else {
                //if de salida
                if (elemento !== null) {
                    elemento = elemento.parentElement;
                    //se autollama
                    _buscar(elemento);
                }
            }
        }
        //function que inicia la recursividad
        function buscar(elemento) {
            _buscar(elemento);
        }
        buscar(elemento);
    };

    Dia.prototype.eliminarBloqueAccion = function(elm) {
        var elm = this.deleteChild(elm);
        var isPrimero = true;
        var elmStart = parseInt(elm.dataset.start);
        for (var i = 0; i < this.bloqueHorario.length; i++) {
            var start = this.bloqueHorario[i].start;
            if (start === elmStart) {

                var finHoraVacio = new Fecha(elmStart).setMinutes(new Fecha(elmStart).getMinutes() + 14);
                this.bloqueHorario[i] = new Vacio(i, 1, elmStart, finHoraVacio);

                this.bloqueHorario[i].id = i;
                isPrimero = false;
                var horaEvento = elmStart;

                for (var j = i + 1; j < parseInt(elm.dataset.bloque) + i; j++) {
                    horaEvento = new Fecha(horaEvento).setMinutes(new Fecha(horaEvento).getMinutes() + 15);
                    finHoraVacio = new Fecha(horaEvento).setMinutes(new Fecha(horaEvento).getMinutes() + 14);
                    //El (1) quiere decir que por defecto el bloque vacio mide un solo bloque
                    this.bloqueHorario[j] = new Vacio(i, 1, horaEvento, finHoraVacio);
                    this.bloqueHorario[j].id = j;
                }
                break;
            }
        }

        this.crearHTML();
    };

    Dia.prototype.initActionModalEdit = function() {
        function closeModalEdit() {
            this.controladorHTML.modalEdit.container.className = 'dia-hide dia dia-nuevo-evento-container dia-defecto-container';
        }

        function saveModalEdit(event) {
            event.stopPropagation();
            this.controladorHTML.modalEdit.container.className = 'dia-hide dia dia-nuevo-evento-container dia-defecto-container';
            this.bloqueEdit.data.title = this.controladorHTML.modalEdit.title.value;
            this.bloqueEdit.start = new Fecha(this.controladorHTML.modalEdit.start.value).getTime();
            this.bloqueEdit.end = new Fecha(this.controladorHTML.modalEdit.end.value).getTime();

            if (this.agregarHorarioMod(this.bloqueEdit)) {
                this.crearHTML();
            }
        }

        this.controladorHTML.modalEdit.ok.addEventListener('click', saveModalEdit.bind(this), false);
        this.controladorHTML.modalEdit.nok.addEventListener('click', closeModalEdit.bind(this), false);
    };

    Dia.prototype.clicYEditarEvento = function(event) {
        //Abrir Modal Editar Evento
        var self = this;
        var data = event.srcElement.parentNode.childNodes[0].dataset;
        this._controladorHTML = {};
        this._controladorHTML.modalEdit = {};
        this.bloqueEdit = this.bloqueHorario[data.numero];

        /*Abrir modal e incluir info del bloque */
        function openModal(self) {

            self.controladorHTML.modalEdit.container.className = 'dia-show dia dia-nuevo-evento-container dia-defecto-container';
            self.controladorHTML.modalEdit.title.value = self.bloqueEdit.data.title;
            self.controladorHTML.modalEdit.id.value = self.bloqueEdit.id;

            function returnHoraFormat(hh) {
                var hh = new Fecha(hh);
                var anio = hh.getFullYear();
                var dia = hh.getDate();
                var mes = hh.getMonth() < 9 ? "0" + (hh.getMonth() + 1) : hh.getMonth() + 1;
                var fullAnio = mes + '/' + dia + '/' + anio;
                var startMinute = hh.getMinutes();
                startMinute = startMinute <= 9 ? "0" + startMinute : startMinute;
                var startHour = hh.getHours();
                startHour = startHour <= 9 ? "0" + startHour : startHour;
                return fullAnio + ' ' + startHour + ':' + startMinute;
            }
            self.controladorHTML.modalEdit.start.value = returnHoraFormat(self.bloqueEdit.start);
            self.controladorHTML.modalEdit.end.value = returnHoraFormat(self.bloqueEdit.end);
        }

        openModal(self);
    };
    Dia.prototype.crearHTML = function() {

        this.wrapp.innerHTML = "";
        var arregloBLoque = [];
        var sumaPorcentajes = 0;
        var i = 0;
        for (i; i < this.BLOQUES_TOTALES;) {
            var bloque = new SL('div', 'evento').elm;
            var objeto = this.bloqueHorario[i];
            var botonContenedor = new SL("div", "dia-btn-evento-contenedor").elm;
            var botonEliminar = new SL("button", 'dia-btn dia-btn-del', 'Eliminar').elm;
            var botonEditar = new SL('button', 'dia-btn dia-btn-editar', 'Editar').elm;
            var a = this.bloqueHorario[i].bloques;

            sumaPorcentajes += a;
            if (typeof a !== 'undefined') {
                var c = a;
                if (this.BLOQUES_TOTALES === 48) {
                    c = a * 2;
                }

                bloque.style.height = c * 100 / this.BLOQUES_TOTALES + '%';

                var hora = new SL('p').elm;
                if (objeto.evento) {

                    //Pintar data
                    var horaTxt = document.createTextNode(new Fecha(objeto.start).imprime() + ' - ' + new Fecha(objeto.end).imprime() + ' ' + objeto.data.title + ' | ' + (objeto.data.text ? objeto.data.text : ''));

                    this.addChild(hora, horaTxt);
                    this.addChild(bloque, hora);

                    this.addData(botonEliminar, [
                        ['bloque', a],
                        ['numero', i],
                        ['start', new Fecha(objeto.start).getTime()]
                    ]);
                    botonEliminar.addEventListener('click', this.clicYEliminarEvento.bind(this), false);
                    botonEditar.addEventListener('click', this.clicYEditarEvento.bind(this), false);

                    this.addChild(botonContenedor, [botonEliminar, botonEditar]);
                    this.addChild(bloque, botonContenedor);

                    i += a;
                } else {
                    var horaTxt = document.createTextNode(new Fecha(objeto.start).imprime());

                    this.addChild(hora, horaTxt);
                    this.addChild(bloque, hora);

                    bloque.className = "vacio";
                    i++;
                }
                this.addChild(this.wrapp, bloque);
                this.tamanioDivCont(this.wrapp);
                arregloBLoque.push(a);
            }
        }
    };
    Dia.prototype.getEventos = function() {
        return this.bloqueHorario.filter(function(b) {
            return b instanceof Evento;
        });
    };

    window.Dia = Dia;
})(window);