const axios = require('axios');
const { getCountryFromIP } = require('../middlewares/session'); // Adjust the path


describe('getCountryFromIP', () => {

  describe('Localhost and invalid IP cases', () => {
    it('should return "Localhost" for ::1', async () => {
      const result = await getCountryFromIP('::1');
      expect(result).toBe('Localhost');
    });

    it('should return "Localhost" for 127.0.0.1', async () => {
      const result = await getCountryFromIP('127.0.0.1');
      expect(result).toBe('Localhost');
    });

    it('should return "Localhost" for empty IP', async () => {
      const result = await getCountryFromIP('');
      expect(result).toBe('Localhost');
    });

    it('should return "Localhost" for null IP', async () => {
      const result = await getCountryFromIP(null);
      expect(result).toBe('Localhost');
    });

    it('should return "Localhost" for undefined IP', async () => {
      const result = await getCountryFromIP();
      expect(result).toBe('Localhost');
    });
  });

  describe('Valid IP cases', () => {
    it('should return country name for valid IP', async () => {
      const result = await getCountryFromIP('217.197.97.246');
      expect(result).toBe('Canada');
    });

    it('should return country name for valid IP', async () => {
      const result = await getCountryFromIP('72.229.28.185');
      expect(result).toBe('United States');
    });    
  });
});

