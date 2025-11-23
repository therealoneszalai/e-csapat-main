const request = require('supertest');
const app = require('../server');
const Marka = require('../Models/model');
const mongoose = require('mongoose');

describe('POST /api/markak', () => {
    const validMarka = {
        marka_id: 100,
        marka_nev: 'Hyundai',
        orszag: 'Dél-Korea',
        alapitas_ev: 1967
    };
    beforeEach(async () => {
        await Marka.deleteMany({});
    });
    test('1. Sikeresen létrehoz egy új márkát érvényes adatokkal (201 Created)', async () => {
        const response = await request(app)
            .post('/api/markak')
            .send(validMarka);

        expect(response.statusCode).toBe(201);
        expect(response.body.marka_nev).toBe('Hyundai');
        expect(response.body).toHaveProperty('_id');
        const savedMarka = await Marka.findOne({ marka_nev: 'Hyundai' });
        expect(savedMarka).not.toBeNull();
    });
    test('2. Hiba (400 Bad Request), ha hiányzik a kötelező marka_nev mező', async () => {
        const invalidData = {
            marka_id: 101,
            orszag: 'Mexikó',
            alapitas_ev: 1980
        };
        const response = await request(app)
            .post('/api/markak')
            .send(invalidData);

        expect(response.statusCode).toBe(400);

        expect(response.body.message).toContain('Marka validation failed: marka_nev: Path `marka_nev` is required.');
    });
    test('3. Hiba (400 Bad Request), ha az alapitas_ev nem szám', async () => {
        const invalidData = {
            marka_id: 102,
            marka_nev: 'FakeCar',
            orszag: 'Nincs',
            alapitas_ev: 'kétezer'
        };
        const response = await request(app)
            .post('/api/markak')
            .send(invalidData);

        expect(response.statusCode).toBe(400);

        expect(response.body.message).toContain('Cast to Number failed for value "kétezer"');
    });
    test('4. A válasz testének tartalmaznia kell a beszúrt adatokat és a generált _id-t', async () => {
        const response = await request(app)
            .post('/api/markak')
            .send(validMarka);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('__v');
        expect(response.body.orszag).toBe(validMarka.orszag);
    });
    test('5. Hiba (400 Bad Request), ha üres a kérés body-ja', async () => {
        const response = await request(app)
            .post('/api/markak')
            .send({});

        expect(response.statusCode).toBe(400);

        expect(response.body.message).toContain('validation failed');
    });
});