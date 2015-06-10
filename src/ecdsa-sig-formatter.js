'use strict';

var asn1 = require('asn1.js'),
	BN = asn1.bignum,
	base64Url = require('base64-url').escape;

var ECDSASigValue = asn1.define('ECDSASigValue', function () {
	this.seq().obj(
		this.key('r').int(),
		this.key('s').int()
	);
});

function getParamSize (keySize) {
	var result = ((keySize / 8) | 0) + (keySize % 8 === 0 ? 0 : 1);
	return result;
}

var paramBytesForAlg = {
	ES256: getParamSize(256),
	ES384: getParamSize(384),
	ES512: getParamSize(521)
};

function getParamBytesForAlg (alg) {
	var paramBytes = paramBytesForAlg[alg];
	if (paramBytes) {
		return paramBytes;
	}

	throw new Error('Unknown algorithm "' + alg + '"');
}

function bufToBignum (buf) {
	var bn = new BN(buf, 10, 'be').iabs();
	return bn;
}

function bignumToBuf (bn, numBytes) {
	var buf = new Buffer(bn.toString('hex', numBytes), 'hex');
	return buf;
}

function signatureAsBuffer (signature) {
	if (Buffer.isBuffer(signature)) {
		return new Buffer(signature);
	} else if ('string' === typeof signature) {
		return new Buffer(signature, 'base64');
	}

	throw new TypeError('ECDSA signature must be a Base64 string or a Buffer');
}

function derToJose(signature, alg) {
	signature = signatureAsBuffer(signature);
	var paramBytes = getParamBytesForAlg(alg);

	signature = ECDSASigValue.decode(signature, 'der');

	var r = bignumToBuf(signature.r, paramBytes);
	var s = bignumToBuf(signature.s, paramBytes);

	signature = Buffer.concat([r, s], r.length + s.length);
	signature = signature.toString('base64');
	signature = base64Url(signature);

	return signature;
}

function joseToDer(signature, alg) {
	signature = signatureAsBuffer(signature);
	var paramBytes = getParamBytesForAlg(alg);

	var signatureBytes = signature.length;
	if (signatureBytes !== paramBytes * 2) {
		throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
	}

	var r = signature.slice(0, paramBytes);
	r = bufToBignum(r);
	var s = signature.slice(paramBytes);
	s = bufToBignum(s);

	signature = ECDSASigValue.encode({
		r: r,
		s: s
	}, 'der');

	return signature;
}

module.exports = {
	derToJose: derToJose,
	joseToDer: joseToDer
};
