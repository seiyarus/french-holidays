'use strict'
var request = require('urllib-sync').request;
var PropertiesReader = require('properties-reader');
var ICalParser = require('cozy-ical').ICalParser;
var ical2json = require("ical2json");
var moment = require('moment');

var ZONE_A_B_C = 'Zones A B C';
var ZONE_A = 'Zone A';
var ZONE_B = 'Zone B';
var ZONE_C = 'Zone C';
var ETE = 'Vacances d\'été - Zones A B C';
var RENTREE = 'Rentrée scolaire des élèves - Zones A B C';

// Parse le calendrier et retourne la liste des evenements
exports.parseCalendar = function() {
  var contenu = this.getContent();
  var output = ical2json.convert(contenu);
  var vcalendar = output.VCALENDAR;
  var calendar = vcalendar[0];
  var vevent = calendar.VEVENT;
  return vevent;
}

// s'assure que l'URL existe toujours.
exports.resolveUrlCalendar = function() {
  var res = request(getUrl());
  if(res.status==200) {
    return true;
  } else {
    console.error('Erreur sur l\'URL open Data de l\'éducation nationale');
    return false;
  }
  console.error('Erreur inconnue');
  return false;
}

// retourne l'url du gouvernement où est stocké le fichier des congés scolaires.
function getUrl() {
  var properties = PropertiesReader('./lib/config.properties');
  //var property = properties.get('url.dataGouv');
  var property = 'http://cache.media.education.gouv.fr/ics/Calendrier_Scolaire_Zones_A_B_C.ics';
  return property;
}


// retourne le contenu
exports.getContent = function() {
  var data = '';
  var res = request(getUrl());
  var textChunk = res.data.toString('utf8');
  return textChunk;
}

// Calcul de la zone de recherche.
function getZone(zone) {
  if(!zone) {
    zone = ZONE_A_B_C;
  } else if(zone.toLowerCase().indexOf('a')> -1) {
    zone = ZONE_A;
  }  else if(zone.toLowerCase().indexOf('b')> -1) {
    zone = ZONE_A;
  }  else if(zone.toLowerCase().indexOf('c')> -1) {
    zone = ZONE_A;
  }
  return zone;
}
// TODO faire le cas du début du fichier ou il n'y a que la date de rentré des vacances d'hiver.
// Recherche l'evenement 'Rentrée scolaire des élèves - Zones A B C' pour obtenir la fin des vacances d'été a partir de la position courante du parser.
function rechercherFinVacancesEte(contenu, dateDebut) {
  var  j;
  var encours;
  var result;
  for (j = 0; j < contenu.length; j++) {
      var summary = contenu[j].SUMMARY.toString();
      if(summary.indexOf(RENTREE)> -1){
        var item = contenu[j]['DTSTART;VALUE=DATE'];
        var dateAVerifier = moment(item, 'YYYYMMDD');
        if(dateAVerifier.isAfter(dateDebut) && (!encours || dateAVerifier.isBefore(encours))) {
          encours = dateAVerifier;
          result = item;
        }
      }
  }
  // TODO remonter une erreur si la date n'est pas trouvée.
  return result;
}

// l'ensemble des dates sur une année.
exports.getHolidaysByYear = function(year, zone) {
  zone = getZone(zone);
  var contenu = this.parseCalendar();
  var i;
  var chaine = '{"holidays":[';
  var firstAjout = true;
  for (i = 0; i < contenu.length; i++) {
      // Certaines dates concernent la reprise des profs : ce ne sont pas des vacances scolaires.
      var summary = contenu[i].SUMMARY.toString();
      var start = contenu[i]['DTSTART;VALUE=DATE'];
      var end = contenu[i]['DTEND;VALUE=DATE'];
      // On est sur une plage de vacances et dans la zone concernée
      if(summary.indexOf('Vacances')> -1 && (summary.indexOf(zone)> -1 || summary.indexOf(ZONE_A_B_C)> -1)) {
        var yearDebut = moment(start, 'YYYYMMDD').year();
        var yearFin = moment(end, 'YYYYMMDD').year();
        var start = contenu[i]['DTSTART;VALUE=DATE'];
        var end;
        // Cas des vacances d'été.
        if(summary.indexOf(ETE)> -1) {
          end = rechercherFinVacancesEte(contenu, moment(start, 'YYYYMMDD'));
        } else {
          end = contenu[i]['DTEND;VALUE=DATE'];
        }
        if(yearDebut==year || yearFin==year) {
          var dateDebut = moment(start, 'YYYYMMDD').toDate();
          var dateFin = moment(end, 'YYYYMMDD').toDate();
          if(!firstAjout) {
            chaine+=',\n';
          }
          chaine+= '{"begin" : "'+start+'", "end" : "'+end+'"}';
          firstAjout = false;
        }
      }
  }

  chaine+= ']}';
  return JSON.parse(chaine);
}


// True si la date passée en parametre est dans une période de vacances scolaire dans la zone fournie en parametre.
// Si la zone n'est pas renseigné, la recherche se fait sur les zone A B et C
exports.isDateInHolidays = function(date, format, zone) {

  var dateDemandee = moment(date, format);
  zone = getZone(zone);
  var contenu = this.parseCalendar();
  var result = exploreContenu(contenu, dateDemandee, zone);
  return result;
}

// un tableau de résultats si les dates passées en parametre est dans une période de vacances scolaire dans la zone fournie en parametre.
// Si la zone n'est pas renseigné, la recherche se fait sur les zone A B et C
exports.isDatesInHolidays = function(dates, format, zone) {
  var results = new Array();
  var i;
  zone = getZone(zone);
  for (i = 0; i < dates.length; i++) {
    var date = dates[i];
    var dateDemandee = moment(date, format);
    var contenu = this.parseCalendar();
    var result = exploreContenu(contenu, dateDemandee, zone);
    console.log(zone + '-' + date + '-' + result);
    results[i] = result;
  }
  return results;
}


// parcours le calendrier et regarde si la date est concernée dans une période de vacances pour la zone.
function exploreContenu(contenu, dateDemandee, zone) {
  var result = false;
  var i;
  for (i = 0; i < contenu.length; i++) {
      // Certaines dates concernent la reprise des profs : ce ne sont pas des vacances scolaires.
      var summary = contenu[i].SUMMARY.toString();
      var start = contenu[i]['DTSTART;VALUE=DATE'];
      var end;
      // On est sur une plage de vacances et dans la zone concernée
      if(summary.indexOf('Vacances')> -1 && (summary.indexOf(zone)> -1 || summary.indexOf(ZONE_A_B_C)> -1)) {
        var dateDebut = moment(start, 'YYYYMMDD');

        // Cas des vacances d'été.
        if(summary.indexOf(ETE)> -1) {
          end = rechercherFinVacancesEte(contenu, moment(start, 'YYYYMMDD'));
        } else {
          end = contenu[i]['DTEND;VALUE=DATE'];
        }

        var dateFin = moment(end, 'YYYYMMDD');
        // Test si la date demandée est inclue dans la plage de vacances.
        if((dateDebut.isSame(dateDemandee) || dateDebut.isBefore(dateDemandee)) && (dateFin.isAfter(dateDemandee) || dateFin.isSame(dateDemandee))) {
          return true;
        }
      }
  }
  return result;
}
