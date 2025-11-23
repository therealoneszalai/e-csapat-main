const request = require('supertest');
const app = require('../server'); 
const Marka = require('../Models/model'); 
const mongoose = require('mongoose');
describe('GET /api/markak/:id', () => {
    let testMarka; 
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.DATABASE_URL); 
        }
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });
    beforeEach(async () => {
        await Marka.deleteMany({});
        const markaData = {
            marka_id: 99,
            marka_nev: 'TestMarka',
            orszag: 'Tesztország',
            alapitas_ev: 2000
        };
       
        testMarka = await Marka.create(markaData);
    });
    test('1. Sikeresen lekérdez egy márkát a létező ID alapján (200 OK)', async () => {
        const response = await request(app).get(`/api/markak/${testMarka._id}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.marka_nev).toBe('TestMarka');
        expect(response.body._id).toBe(testMarka._id.toString()); 
    });
    test('2. 404-es hibát ad, ha az ID nem található (nem létező ID)', async () => {
     
        const nonExistentId = new mongoose.Types.ObjectId(); 
        const response = await request(app).get(`/api/markak/${nonExistentId}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Document not found');
    });
    test('3. 400-as hibát ad, ha az ID formátuma érvénytelen (pl. túl rövid string)', async () => {
        const invalidId = '12345'; 
        const response = await request(app).get(`/api/markak/${invalidId}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch(/Cast to ObjectId failed/); 
    });
    test('4. A válasz struktúrájának helyesnek kell lennie', async () => {
        const response = await request(app).get(`/api/markak/${testMarka._id}`);
        const marka = response.body;

        expect(typeof marka.marka_id).toBe('number');
        expect(typeof marka.marka_nev).toBe('string');
        expect(typeof marka.orszag).toBe('string');
        expect(typeof marka.alapitas_ev).toBe('number');
        expect(marka).toHaveProperty('_id');
    });
    test('5. A lekérdezett dokumentum adatainak meg kell egyezniük a beszúrt adatokkal', async () => {
        const response = await request(app).get(`/api/markak/${testMarka._id}`);
        
        expect(response.body.marka_nev).toBe('TestMarka');
        expect(response.body.alapitas_ev).toBe(2000);
    });
});