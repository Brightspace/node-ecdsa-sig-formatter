'use strict';

var assert = require('assert'),
	crypto = require('crypto'),
	jwkToPem = require('jwk-to-pem'),
	nCrypto = require('native-crypto');

var conv = require('../');

var sslalgs = {
	'ES256': 'RSA-SHA256',
	'ES384': 'RSA-SHA384',
	'ES512': 'RSA-SHA512'
};

var crvs = {
	ES256: 'P-256',
	ES384: 'P-384',
	ES512: 'P-521'
};

['ES256', 'ES384', 'ES512'].forEach(function(alg) {
	for (var i = 0; i < 10; ++i) {
		nCrypto
			.generate(crvs[alg])
			.then(function(keypair) {
				return jwkToPem(keypair.privateKey, { private: true });
			})
			.then(function(pem) {
				for (var j = 0; j < 10000; ++j) {
					var der = crypto
						.createSign(sslalgs[alg])
						.update(crypto.randomBytes((Math.random() * (256 - 1) | 0) + 1))
						.sign(pem);

					assert(conv.joseToDer(conv.derToJose(der, alg), alg).equals(der));
				}
			});
	}
});
