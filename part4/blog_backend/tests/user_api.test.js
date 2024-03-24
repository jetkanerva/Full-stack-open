const { test, beforeEach } = require('node:test')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const assert = require('assert').strict;
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
})

test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
})

test('creation fails with a username shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
        username: 'ml',
        name: 'Matti Luukkainen',
        password: 'salainen',
    };

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

    assert.strictEqual(result.body.error, 'Both username and password must be at least 3 characters long');

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length, 'The number of users should not increase');

});

test('creation fails with a password shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
        username: 'newuser',
        name: 'Test User',
        password: 'pw',
    };

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

    assert.strictEqual(result.body.error, 'Both username and password must be at least 3 characters long');

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length, 'The number of users should not increase');
});