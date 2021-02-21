import _ from 'lodash';
import './style.css';

var regexHeure = new RegExp("^[0-9]{8}.([0-9]{2})[0-9]{4}");
var regexMinute = new RegExp("^[0-9]{8}.[0-9]{2}([0-9]{2})[0-9]{2}");
var regexSeconde = new RegExp("^[0-9]{8}.[0-9]{4}([0-9]{2})");

var codeinseedep="";
var codeinseearr="";
var nomvilledep="";
var nomvillearr="";

var datetimehoraire="";
var truedatetimehoraire="";

let request1 = new XMLHttpRequest();
let request2 = new XMLHttpRequest();
let request3 = new XMLHttpRequest();

function onclicksncf(){

    nomvilledep = document.getElementById('idVilleDep').value;
    nomvillearr = document.getElementById('idVilleArr').value;
    var regexHoraire = new RegExp("([0-9]{4}).([0-9]{2}).([0-9]{2}.[0-9]{2}).([0-9]{2}).([0-9]{2})");
    var horaire = regexHoraire.exec(document.getElementById('horaire').value);
    datetimehoraire = horaire[1]+horaire[2]+horaire[3]+horaire[4]+horaire[5];
    console.log(datetimehoraire);
    var urlsncf = "https://api.sncf.com/v1/coverage/sncf/journeys?"+codeinseedep+codeinseearr+truedatetimehoraire;
    var urlinseed = "https://geo.api.gouv.fr/communes?nom="+nomvilledep;
    var urlinseea = "https://geo.api.gouv.fr/communes?nom="+nomvillearr;
    if (datetimehoraire!=""){

        truedatetimehoraire = "";
    }else{
        truedatetimehoraire = "&departure_date_time=" + datetimehoraire;
    }

    request1.open('GET',urlinseed,true);

    request1.onload = function(){
        let data = JSON.parse(this.response);

        let donneesville =null;

        donneesville = data[0];

        if (nomvilledep ==""){
            codeinseedep="";
        }else{
            codeinseedep = "from=admin:fr:"+donneesville.code;
        }

        request2.open('GET',urlinseea,true);

        request2.onload = function(){
            data = JSON.parse(this.response);

            donneesville = data[0];

            if (nomvillearr ==""){
                codeinseearr="";
            }else{
                codeinseearr = "&to=admin:fr:"+ donneesville.code;
            }

            urlsncf = "https://api.sncf.com/v1/coverage/sncf/journeys?"+codeinseedep+codeinseearr+truedatetimehoraire;
            request3.open('GET',urlsncf,true);

            request3.onload = function () {
                if (this.status === 200 & request3.readyState === request3.DONE ) {
                    let data = JSON.parse(this.response);
                    let trajetDepart = document.createElement('div');
                    let trajetArrivee = document.createElement('div');
                    for (let i=0;i<Object.keys(data.journeys).length;i++){
                        let train = data.journeys[i];
                        console.log(train.from.administrative_region.name);
                        trajetDepart = document.createElement('div');
                        trajetArrivee = document.createElement('div');
                        trajetDepart.setAttribute('id',"idTrajetDepart");
                        trajetArrivee.setAttribute('id',"idTrajetArrivee");
                        trajetDepart.classList.add('divTrajetDepart');
                        trajetArrivee.classList.add('divTrajetArrivee');
                        let Depart=regexHeure.exec(train.departure_date_time)[1]+":"+regexMinute.exec(train.departure_date_time)[1]+":"+regexSeconde.exec(train.departure_date_time)[1];
                        let Arrivee=regexHeure.exec(train.arrival_date_time)[1]+":"+regexMinute.exec(train.arrival_date_time)[1]+":"+regexSeconde.exec(train.arrival_date_time)[1];
                        trajetDepart.innerHTML = '<u>DÉPART</u> ' +"<strong>"+ train.from.administrative_region.name +"</strong>" +' : ' + Depart ;
                        trajetArrivee.innerHTML = '<u>ARRIVÉE</u> '+"<strong>"+ train.to.stop_point.name +"</strong>" +" : "+ Arrivee ;
                        document.body.removeChild(document.getElementById("idTrajetDepart"));
                        document.body.removeChild(document.getElementById("idTrajetArrivee"));

                        document.body.appendChild(trajetDepart);
                        document.body.appendChild(trajetArrivee);
                    }
                }
            };
            request3.setRequestHeader("Authorization", "Basic " + btoa('893d8979-8820-4160-8b49-fb86761f9d58' + ":" + ''));
            request3.send();
        };
        request2.send();
    }
    request1.send();
}

let header = document.createElement('div');
header.classList.add('header');
header.innerHTML = '<h1>'+'SNCF '+'<font color="#ff00ff">'+'Pa'+'</color>'+'<font color="#9932cc">'+'th'+'</font>'+'<font color="red">'+'Finder'+'</color>'+'</h1>';
document.body.appendChild(header);
  
let informations = document.createElement('div');
informations.classList.add('parametres');
informations.innerHTML = '<label>'+'Ville de départ : '+'</label>'+'<input type="text" id="idVilleDep" name="villeDep">'
    +'<label>'+' Ville d\'arrivée : '+'</label>'+'<input type="text" id="idVilleArr" name="villeArr">'
    +'<label>'+' Choisissez un jour : '+'</label>'
    +'<input type="datetime-local" id="horaire"\n' + 'name="meeting-time" value="2021-01-01T09:00:00"\n' + 'min="2021-01-01T00:00:00" max="2023-12-31T23:59:59">'
    +'<input id="idonclick"type="submit" value="En voiture !">';
let trajetDepart = document.createElement('div');
let trajetArrivee = document.createElement('div');
trajetDepart.setAttribute('id',"idTrajetDepart");
trajetArrivee.setAttribute('id',"idTrajetArrivee");
document.body.appendChild(trajetDepart);
document.body.appendChild(trajetArrivee);

document.body.appendChild(informations);
document.getElementById("idonclick").addEventListener("click",function (){onclicksncf()})


