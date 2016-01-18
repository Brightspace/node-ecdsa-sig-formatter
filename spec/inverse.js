'use strict';

var expect = require('chai').expect,
	mocha = require('mocha');

var describe = mocha.describe,
	it = mocha.it;

var format = require('..');

describe('inverse', function() {
	describe('ES256', function() {
		it('should jose -> der -> jose', function() {
			// Made with WebCrypto
			var expected = 'yA4WNemRpUreSh9qgMh_ePGqhgn328ghJ_HG7WOBKQV98eFNm3FIvweoiSzHvl49Z6YTdV4Up7NDD7UcZ-52cw';
			var der = format.joseToDer(expected, 'ES256');
			var actual = format.derToJose(der, 'ES256');

			expect(actual).to.equal(expected);
		});

		it('should der -> jose -> der', function() {
			// Made with OpenSSL
			var expected = 'MEUCIQD0nDQE4uBS6JuklnyACfPQRB/LMEh5Stq6sAfp38k6ewIgHvhX59iuruBiFpVkg3dQKJ3+Wk29lJmXfxp6ciRdj+Q=';
			var jose = format.derToJose(expected, 'ES256');
			var actual = format.joseToDer(jose, 'ES256');

			expect(actual.toString('base64')).to.equal(expected);
		});
	});

	describe('ES384', function() {
		it('should jose -> der -> jose', function() {
			// Made with WebCrypto
			var expected = 'TsS1fXqgq5S2lpjO-Tz5w6ZAKqNFuQ6PufvXRN2NRY2DEsQ3iUXdEcAzcMXNqVehkZ-NwUxdIvDqwKTGLYQYVhjBxkdnwm1T5VKG2v1BYFeDQ91sgBlVhHFzvFty5wCI';
			var der = format.joseToDer(expected, 'ES384');
			var actual = format.derToJose(der, 'ES384');

			expect(actual).to.equal(expected);
		});

		it('should der -> jose -> der', function() {
			// Made with OpenSSL
			var expected = 'MGUCMADcY5icKo+sLF0YCh5eVzju55Elt3Dfu4geMMDnUlLNaEO8NiCFzCHeqMx7mW5GMwIxAI6sp8ihHjRJ0sn/WV6mZCxN6/5lEg1QZJ5eiUHYv2kBgmiJ/Yv1pnqqFY3gVDBp/g==';
			var jose = format.derToJose(expected, 'ES384');
			var actual = format.joseToDer(jose, 'ES384');

			expect(actual.toString('base64')).to.equal(expected);
		});
	});

	describe('ES512', function() {
		it('should jose -> der -> jose', function() {
			// Made with WebCrypto
			var expected = 'AFKapY_5gq60n8NZ_C2iOQFov7sXgcMyDzCrnGsbvE7OlSBKbgj95aZ7GtdSdbw6joK2jjWJio8IgKNB9o11GdMTADfLUsv9oAJvmIApsmsPBAIe1vH8oeHYiDMBEz9OQcwS5eL-r1iO2v7oxzl9zZb1rA5kzBqS93ARCPKbjgcr602r';
			var der = format.joseToDer(expected, 'ES512');
			var actual = format.derToJose(der, 'ES512');

			expect(actual).to.equal(expected);
		});

		it('should der -> jose -> der', function() {
			// Made with OpenSSL
			var expected = 'MIGHAkFgiYpVsYxx6XiQp2OXscRW/PrbEcoime/FftP+B7x4QVa+M3KZzXlfP66zKqjo7O3nwK2s8GbTftW8H4HwojzimwJCAYQNsozTpCo5nwIkBgelcfIQ0y/U/60TbNH1+rlKpFDCFs6Q1ro7R1tjtXoAUb9aPIOVyXGiSQX/+fcmmWs1rkJU';
			var jose = format.derToJose(expected, 'ES512');
			var actual = format.joseToDer(jose, 'ES512');

			expect(actual.toString('base64')).to.equal(expected);
		});
	});
});
