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
