function Promesa(){
	var self = this;
  var thenCallback = null;
	var failCallback = null;
	var alwaysCallback = null;

	self.then = function(callback){
		thenCallback = callback;
		return self;
	};

	self.error = function(callback){
		failCallback = callback;
		return self;
	};

	self.always = function(callback){
		alwaysCallback = callback;
		return self;
	};

	self.complete = function(args){
		runCallback(alwaysCallback, args);
		runCallback(thenCallback, args);
	};

	self.fail = function(args){
		runCallback(alwaysCallback, args);
		runCallback(failCallback, args);
	}

	function runCallback(callbackToRun, args){
		if (callbackToRun && typeof callbackToRun === 'function'){
			callbackToRun(args);
		}
	}
}
