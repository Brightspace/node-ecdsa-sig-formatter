'use strict';

var expect = require('chai').expect,
	mocha = require('mocha');

var describe = mocha.describe,
	it = mocha.it;

var format = require('..');

describe('#joseToDer', function() {
	describe('should throw for', function() {
		it('no signature', function() {
			function fn() {
				return format.joseToDer();
			}

			expect(fn).to.throw(TypeError);
		});

		it('non buffer or base64 signature', function() {
			function fn() {
				return format.joseToDer(123);
			}

			expect(fn).to.throw(TypeError);
		});

		it('unknown algorithm', function() {
			function fn() {
				return format.joseToDer('Zm9vLmJhci5iYXo=', 'foozleberries');
			}

			expect(fn).to.throw(/"foozleberries"/);
		});

		it('incorrect signature length (ES256)', function() {
			function fn() {
				return format.joseToDer('Zm9vLmJhci5iYXo', 'ES256');
			}

			expect(fn).to.throw(/"64"/);
		});

		it('incorrect signature length (ES384)', function() {
			function fn() {
				return format.joseToDer('Zm9vLmJhci5iYXo', 'ES384');
			}

			expect(fn).to.throw(/"96"/);
		});

		it('incorrect signature length (ES512)', function() {
			function fn() {
				return format.joseToDer('Zm9vLmJhci5iYXo', 'ES512');
			}

			expect(fn).to.throw(/"132"/);
		});
	});
});
