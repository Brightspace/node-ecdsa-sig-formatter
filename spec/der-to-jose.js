'use strict';

var expect = require('chai').expect,
	mocha = require('mocha');

var describe = mocha.describe,
	it = mocha.it;

var format = require('..');

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
	});
});
