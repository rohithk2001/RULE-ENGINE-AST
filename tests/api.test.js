const request = require('supertest');
const app = require('../index');  // Assuming your express app is in index.js
const mongoose = require('mongoose');

afterAll(async () => {
    // Close the MongoDB connection after all tests
    await mongoose.connection.close();
});

describe('API Route Tests', () => {

    test('POST /create-rule should create a new rule', async () => {
        const response = await request(app)
            .post('/create-rule')
            .send({ ruleString: 'age > 30' });

        expect(response.statusCode).toBe(200);
        expect(response.body.rule.ruleString).toBe('age > 30');
    });

    test('POST /evaluate-rule should evaluate rule and return true', async () => {
        const response = await request(app)
            .post('/evaluate-rule')
            .send({
                ast: { type: 'operand', value: 'age > 30' },
                data: { age: 35 }
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.result).toBe(true);
    });

    test('GET /rules should return all saved rules', async () => {
        const response = await request(app).get('/rules');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Add more API tests for modification and sub-expression
});
