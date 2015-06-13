'use strict';

var expect = require('chai').expect,
	mocha = require('mocha');

var describe = mocha.describe,
	it = mocha.it;

var format = require('..');

var MAX_LENGTH_OCTET = 0x80,
	CLASS_UNIVERSAL = 0,
	PRIMITIVE_BIT = 0x20,
	TAG_SEQ = (0x10 | PRIMITIVE_BIT) | (CLASS_UNIVERSAL << 6),
	TAG_INT = 0x02 | (CLASS_UNIVERSAL << 6);

describe('#derToJose', function () {
	describe('should throw for', function () {
		it('no signature', function () {
			function fn () {
				return format.derToJose();
			}

			expect(fn).to.throw(TypeError);
		});

		it('non buffer or base64 signature', function () {
			function fn () {
				return format.derToJose(123);
			}

			expect(fn).to.throw(TypeError);
		});

		it('unknown algorithm', function () {
			function fn () {
				return format.derToJose('Zm9vLmJhci5iYXo=', 'foozleberries');
			}

			expect(fn).to.throw(/"foozleberries"/);
		});

		it('no seq', function () {
			var input = new Buffer(10);
			input[0] = TAG_SEQ + 1; // not seq

			function fn () {
				format.derToJose(input, 'ES256');
			}

			expect(fn).to.throw(Error, /expected "seq"/);
		});

		it('seq length exceeding input', function () {
			var input = new Buffer(10);
			input[0] = TAG_SEQ;
			input[1] = 10;

			function fn () {
				format.derToJose(input, 'ES256');
			}

			expect(fn).to.throw(Error, /length/);
		});

		it('r is not marked as int', function () {
			var input = new Buffer(10);
			input[0] = TAG_SEQ;
			input[1] = 8;
			input[2] = TAG_INT + 1; // not int

			function fn () {
				format.derToJose(input, 'ES256');
			}

			expect(fn).to.throw(Error, /expected "int".+"r"/);
		});

		it('r length exceeds available input', function () {
			var input = new Buffer(10);
			input[0] = TAG_SEQ;
			input[1] = 8;
			input[2] = TAG_INT;
			input[3] = 5;

			function fn () {
				format.derToJose(input, 'ES256');
			}

			expect(fn).to.throw(Error, /"r".+length/);
		});

		it('s is not marked as int', function () {
			var input = new Buffer(10);
			input[0] = TAG_SEQ;
			input[1] = 8;
			input[2] = TAG_INT;
			input[3] = 2;
			input[4] = 0;
			input[5] = 0;
			input[6] = TAG_INT + 1; // not int

			function fn () {
				format.derToJose(input, 'ES256');
			}

			expect(fn).to.throw(Error, /expected "int".+"s"/);
		});

		it('s length exceeds available input', function () {
			var input = new Buffer(10);
			input[0] = TAG_SEQ;
			input[1] = 8;
			input[2] = TAG_INT;
			input[3] = 2;
			input[4] = 0;
			input[5] = 0;
			input[6] = TAG_INT;
			input[7] = 3;

			function fn () {
				format.derToJose(input, 'ES256');
			}

			expect(fn).to.throw(Error, /"s".+length/);
		});

		it('s length does not consume available input', function () {
			var input = new Buffer(10);
			input[0] = TAG_SEQ;
			input[1] = 8;
			input[2] = TAG_INT;
			input[3] = 2;
			input[4] = 0;
			input[5] = 0;
			input[6] = TAG_INT;
			input[7] = 1;

			function fn () {
				format.derToJose(input, 'ES256');
			}

			expect(fn).to.throw(Error, /"s".+length/);
		});
	});
});
