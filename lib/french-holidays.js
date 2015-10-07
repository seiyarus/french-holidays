(function() {
  var FrHolidays, moment, Parser;

  moment = require('moment');
  Parser = require('parser');

  Holidays = {
    // Retourne l'ensemble des vacances de l'année passée en parametre
    // Le champ zone correspond a une zone A, B, ou C, ou les 3 si non renseignée.
    by_year: function(year, zone) {
      return Parser.getHolidaysByYear(year, zone);
    },

    all :function(year, zone) {
      return [

      ];
    },

    // Un tableau de boolean si les dates passées en parametre est dans une période de vacances scolaire dans la zone fournie en parametre.
    // Le format est le format attendu de la date
    // Si la zone n'est pas renseigné, la recherche se fait sur les zone A B et C
    isDatesInHolidays: function(dates, format, zone) {
      return Parser.isDatesInHolidays(dates, format, zone)[0];
    },

    // True si la date passée en parametre est dans une période de vacances scolaire dans la zone fournie en parametre.
    // Le format est le format attendu de la date
    // Si la zone n'est pas renseigné, la recherche se fait sur les zone A B et C
    isDateInHolidays: function(date, format, zone) {
      var dates = new Array();
      dates[0] = date;
      return Parser.isDatesInHolidays(dates, format, zone)[0];
    }
  };

  module.exports = Holidays;

}).call(this);
