'use strict'
var request = require('urllib-sync').request;
var PropertiesReader = require('properties-reader');

exports.parseCalendar = function() {

}

exports.resolveUrlCalendar = function() {
  // http://cache.media.education.gouv.fr/ics/Calendrier_Scolaire_Zones_A_B_C.ics

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

function getUrl() {
  var properties = PropertiesReader('./lib/config.properties');
  var property = properties.get('url.dataGouv');
  return property;
}
