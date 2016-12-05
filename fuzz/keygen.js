'use strict';

var base64url = require('base64url').fromBase64,
	Buffer = require('safe-buffer').Buffer,
	EC = require('elliptic').ec,
	jwkToPem = require('jwk-to-pem');

var curves = {
		ES256: 'p256',
		ES384: 'p384',
		ES512: 'p521'
	},
	jwkCurves = {
		ES256: 'P-256',
		ES384: 'P-384',
		ES512: 'P-521'
	};

function b64(val) {
	val = val.toString('hex', 2);
	val = Buffer.from(val, 'hex');
	val = val.toString('base64');
	val = base64url(val);
	return val;
}

function keygen(alg) {
	var curve = new EC(curves[alg]);

	var keypair = curve.genKeyPair();
	var priv = keypair.getPrivate();
	var pub = keypair.getPublic();

	var jwk = {
		kty: 'EC',
		crv: jwkCurves[alg],
		x: b64(pub.getX()),
		y: b64(pub.getY()),
		d: b64(priv)
	};

	var pem = jwkToPem(jwk, { private: true });

	return pem;
}

module.exports = keygen;
