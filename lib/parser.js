'use strict'
var request = require('urllib-sync').request;
var PropertiesReader = require('properties-reader');

// Parse le calendrier
exports.parseCalendar = function() {

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
