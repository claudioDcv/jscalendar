// function httpGetAsync(theUrl, callback)
// {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() {
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//             //console.log(JSON.parse(xmlHttp.responseText));
//             callback(JSON.parse(xmlHttp.responseText));
//     }
//     xmlHttp.open("GET", theUrl, true); // true for asynchronous
//     xmlHttp.setRequestHeader('Content-Type', 'application/json')
//     xmlHttp.send(null);
// }
//
//
// var serviceFake = function(){
//
//   this.horas = function(){
//
//     var horas = [];
//     httpGetAsync("http://localhost:3000/data.json",function(d){
//       horas = d;
//       console.log(d);
//     });
//     return {
//       horas : horas
//     };
//   };
//
//
// };
