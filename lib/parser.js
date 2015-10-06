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
  var property = properties.get('url.dataGouv');
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
      var end = contenu[i]['DTEND;VALUE=DATE'];

      // On est sur une plage de vacances et dans la zone concernée
      if(summary.indexOf('Vacances')> -1 && (summary.indexOf(zone)> -1 || summary.indexOf(ZONE_A_B_C)> -1)) {
        var dateDebut = moment(start, 'YYYYMMDD');
        var dateFin = moment(end, 'YYYYMMDD');
        // Test si la date demandée est inclue dans la plage de vacances.
        if((dateDebut.isSame(dateDemandee) || dateDebut.isBefore(dateDemandee)) && (dateFin.isAfter(dateDemandee) || dateFin.isSame(dateDemandee))) {
          return true;
        }
      }
  }
  return result;
}
