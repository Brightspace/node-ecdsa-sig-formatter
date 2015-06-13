'use strict';

var asn1 = require('asn1.js'),
	base64Url = require('base64-url').escape;

var ECDSASigValue = asn1.define('ECDSASigValue', function () {
	this.seq().obj(
		this.key('r').int(),
		this.key('s').int()
	);
});

var MAX_OCTET = 0x80,
	CLASS_UNIVERSAL = 0,
	PRIMITIVE_BIT = 0x20,
	TAG_SEQ = 0x10,
	TAG_INT = 0x02,
	ENCODED_TAG_SEQ = (TAG_SEQ | PRIMITIVE_BIT) | (CLASS_UNIVERSAL << 6),
	ENCODED_TAG_INT = TAG_INT | (CLASS_UNIVERSAL << 6);

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

function bignumToBuf (bn, numBytes) {
	var buf = new Buffer(bn.toString('hex', numBytes), 'hex');
	return buf;
}

function signatureAsBuffer (signature) {
	if (Buffer.isBuffer(signature)) {
		return signature;
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

function reduceBuffer (buf) {
	var padding = 0;
	for (var n = buf.length; padding < n && buf[padding] === 0;) {
		++padding;
	}

	var needsSign = buf[padding] >= MAX_OCTET;
	if (needsSign) {
		--padding;

		if (padding < 0) {
			var old = buf;
			buf = new Buffer(1 + buf.length);
			buf[0] = 0;
			old.copy(buf, 1);

			return buf;
		}
	}

	if (padding === 0) {
		return buf;
	}

	buf = buf.slice(padding);
	return buf;
}

function joseToDer(signature, alg) {
	signature = signatureAsBuffer(signature);
	var paramBytes = getParamBytesForAlg(alg);

	var signatureBytes = signature.length;
	if (signatureBytes !== paramBytes * 2) {
		throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
	}

	var r = reduceBuffer(signature.slice(0, paramBytes));
	var s = reduceBuffer(signature.slice(paramBytes));

	var rsBytes = 1 + 1 + r.length + 1 + 1 + s.length;

	var shortLength = rsBytes < MAX_OCTET;

	signature = new Buffer((shortLength ? 2 : 3) + rsBytes);

	var offset = 0;
	signature[offset++] = ENCODED_TAG_SEQ;
	if (shortLength) {
		// Bit 8 has value "0"
		// bits 7-1 give the length.
		signature[offset++] = rsBytes;
	} else {
		// Bit 8 of first octet has value "1"
		// bits 7-1 give the number of additional length octets.
		signature[offset++] = MAX_OCTET	| 1;
		// length, base 256
		signature[offset++] = rsBytes & 0xff;
	}
	signature[offset++] = ENCODED_TAG_INT;
	signature[offset++] = r.length;
	r.copy(signature, offset);
	offset += r.length;
	signature[offset++] = ENCODED_TAG_INT;
	signature[offset++] = s.length;
	s.copy(signature, offset);

	return signature;
}

module.exports = {
	derToJose: derToJose,
	joseToDer: joseToDer
};
