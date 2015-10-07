// Activation du mode strict, qui permet notamment d'éliminer les erreurs silencieuses javascript en véritables erreurs javascript.
'use strict';
// On fait la déclaration d'assert utilisé par Chai
var assert = require('chai').assert;
var Parser  = require('../lib/parser');

// Premier test de la suite
describe('Test getURL', function() {
        it('vérifier que l\'url de l\'open data est dispo', function(done) {
            assert.equal(true, Parser.resolveUrlCalendar()); // test de vérification que l'url existe toujours
            done();
        });
});

// Second test de la suite
describe('Test getContenu', function() {
        it('vérifier le contenu', function(done) {
            assert.notEqual('', Parser.getContent()); // test de vérification du contenu non vide
            done();
        });
});

// 3e test de la suite
describe('Test parse', function() {
        it('vérifier le parser', function(done) {
            assert.notEqual('', Parser.parseCalendar()); // test de vérification du contenu non vide
            done();
        });
});

// 4e test de la suite : une date dans les vacances scolaires toute zone
describe('Test date vacances scolaire toutes zone', function() {
        it('vérifier que le 17 octobre est une date de vacances toute zone', function(done) {
          var result = Parser.isDateInHolidays('20151017', 'YYYYMMDD');
            assert.isTrue(result); // La date du 17/10/2015 est dans les vacances toutes zone
            done();
        });

        it('vérifier que le 17 octobre est une date de vacances zone A', function(done) {
          var result = Parser.isDateInHolidays('20151017', 'YYYYMMDD', 'A');
            assert.isTrue(result); // La date du 17/10/2015 est dans les vacances toutes zone
            done();
        });

        it('vérifier que le 17 octobre est une date de vacances zone a', function(done) {
          // Test zone en minuscule
          var result = Parser.isDateInHolidays('20151017', 'YYYYMMDD', 'a');
            assert.isTrue(result); // La date du 17/10/2015 est dans les vacances toutes zone
            done();
        });

        it('vérifier que le 17 octobre est une date de vacances zone B', function(done) {
          var result = Parser.isDateInHolidays('20151017', 'YYYYMMDD', 'B');
            assert.isTrue(result); // La date du 17/10/2015 est dans les vacances toutes zone
            done();
        });

        it('vérifier que le 17 octobre est une date de vacances zone b', function(done) {
          // Test zone en minuscule
          var result = Parser.isDateInHolidays('20151017', 'YYYYMMDD', 'b');
            assert.isTrue(result); // La date du 17/10/2015 est dans les vacances toutes zone
            done();
        });

        it('vérifier que le 17 octobre est une date de vacances zone C', function(done) {
          var result = Parser.isDateInHolidays('20151017', 'YYYYMMDD', 'C');
            assert.isTrue(result); // La date du 17/10/2015 est dans les vacances toutes zone
            done();
        });

        it('vérifier que le 17 octobre est une date de vacances zone c', function(done) {
          // Test zone en minuscule
          var result = Parser.isDateInHolidays('20151017', 'YYYYMMDD', 'c');
            assert.isTrue(result); // La date du 17/10/2015 est dans les vacances toutes zone
            done();
        });

        it('vérifier que le 15 octobre n\'est pas une date de vacances toute zone', function(done) {
          var result = Parser.isDateInHolidays('20151015', 'YYYYMMDD');
            assert.isFalse(result); // La date du 15/10/2015 n'est pas dans les vacances toutes zone
            done();
        });

        it('vérifier que le 1 aout est une date de vacances toute zone', function(done) {
          var result = Parser.isDateInHolidays('20160801', 'YYYYMMDD');
            assert.isTrue(result); // La date du 01/08/2016 est dans les vacances toutes zone
            done();
        });
});

// 5e test de la suite : une date dans les vacances scolaires une zone spécifique
describe('Test date vacances scolaire zone spécifique', function() {
        it('vérifier que le 17 octobre est une date de vacances zone A', function(done) {
          var result = Parser.isDateInHolidays('20151017', 'YYYYMMDD', 'A');
            assert.isTrue(result); // La date du 17/10/2015 est dans les vacances toutes zone
            done();
        });

        it('vérifier que le 13 février est une date de vacances zone A', function(done) {
          var result = Parser.isDateInHolidays('20160213', 'YYYYMMDD', 'A');
            assert.isTrue(result); // La date du 13/02/2016 est dans les vacances Zone A
            done();
        });

        it('vérifier que le 6 février n\'est pas une date de vacances zone A', function(done) {
          var result = Parser.isDateInHolidays('20160206', 'YYYYMMDD', 'A');
            assert.isFalse(result); // La date du 06/02/2016 n'est pas dans les vacances zone A
            done();
        });

        it('vérifier que le 13 février n\'est pas une date de vacances toute zone', function(done) {
          var result = Parser.isDateInHolidays('20160213', 'YYYYMMDD');
            assert.isFalse(result); // La date du 13/02/2016 n'est pas dans les vacances zone A
            done();
        });
});


// 6e test de la suite : une liste de dates dans les vacances scolaires une zone spécifique
describe('Test liste de dates vacances scolaire zone spécifique', function() {
        it('vérifier un ensemble de dates', function(done) {
          var dates = new Array();;
          dates[0] = '20160206'; // pas dans la zone A
          dates[1] = '20160213'; // Dans la zone A
          dates[2] = '20151017'; // Toutes zone
          var results = Parser.isDatesInHolidays(dates, 'YYYYMMDD', 'A');
            assert.isFalse(results[0]);
            assert.isTrue(results[1]);
            assert.isTrue(results[2]);
            done();
        });
});

// 7e test de la suite : retourner toutes les dates d'une année
describe('Test liste de dates vacances scolaire par an', function() {
        it('toutes zones', function(done) {
        var year = 2016
          var results = Parser.getHolidaysByYear(year);
          assert.notEqual('', results); // test de vérification du contenu non vide
          // TODO vérifier le contenu.
          done();
        });
});

// TODO Rajouter un test de validation sur une date de vacances d'été
