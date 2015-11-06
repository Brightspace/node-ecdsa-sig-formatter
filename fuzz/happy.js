'use strict';

var assert = require('assert'),
	crypto = require('crypto');

var keygen = require('./keygen');

var conv = require('../');

var sslalgs = {
	'ES256': 'RSA-SHA256',
	'ES384': 'RSA-SHA384',
	'ES512': 'RSA-SHA512'
};

['ES256', 'ES384', 'ES512'].forEach(function (alg) {
	for (var i = 0; i < 10; ++i) {
		var pem = keygen(alg);

		for (var j = 0; j < 10000; ++j) {
			var der = crypto
				.createSign(sslalgs[alg])
				.update(crypto.randomBytes((Math.random() * (256 - 1) | 0) + 1))
				.sign(pem);

			assert(conv.joseToDer(conv.derToJose(der, alg), alg).equals(der));
		}
	}
});
