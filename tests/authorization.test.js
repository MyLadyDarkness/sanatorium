// example.spec.js
const { test, expect } = require('@playwright/test');

test('Проверка заголовка страницы', async ({ page }) => {
    // Открываем страницу
    await page.goto('http://localhost:3000')
    
    // Получаем заголовок страницы
    const title = await page.title();
    
    // Проверяем, что заголовок соответствует ожидаемому значению
    expect(title).toBe('Login Page')
});

test('Проверка заголовка формы авторизации', async ({ page }) => {
    
    await page.goto('http://localhost:3000')    
    const formHeader = page.locator('.login-form h2')    
    await expect(formHeader).toHaveText('Login');

});

test('Проверка кнопки Login', async ({ page }) => {
    
    await page.goto('http://localhost:3000')    
    const buttonLogin = page.locator('button[type=submit]')    
    await expect(buttonLogin).toBeVisible()
    await expect(buttonLogin).toHaveText('Login');

});

test('Проверка palceholder для логина', async ({ page }) => {
    
    await page.goto('http://localhost:3000')    
    const userHolderText = await page.getAttribute('#username', 'placeholder');
    expect(userHolderText).toBe('Username');

});

test('Проверка palceholder для пароля', async ({ page }) => {
    
    await page.goto('http://localhost:3000')    
    const userHolderText = await page.getAttribute('#password', 'placeholder');
    expect(userHolderText).toBe('Password');

});

test('Проверка авторизации с пустыми логином и паролем', async ({ page }) => {
    
    await page.goto('http://localhost:3000')    
    await page.click('button[type=submit]')
    
    const okMessage = page.locator('.welcome-message')    
    await expect(okMessage).toHaveText('Вы авторизовались'); // БАГ!!!, нельзя позволять авторизацию с пустыми логином и паролем

});

test('Проверка авторизации с верными логином и паролем', async ({ page }) => {
    
    await page.goto('http://localhost:3000')    
    await page.locator('#username').fill('test');
    await page.locator('#password').fill('test123');
    await page.click('button[type=submit]')
    
    const okMessage = page.locator('.welcome-message')    
    await expect(okMessage).toHaveText('Вы авторизовались');

});


//Параметризация для различных комбинаций логина и пароля
const testCases = [
    { username: '', password: '1', expectedError: 'User not found' },
    { username: 'incorrectUser', password: '', expectedError: 'User not found' },
    { username: 'test', password: '', expectedError: 'Incorrect password' },
];


test.describe('Проверка авторизации с параметризацией', () => {
    testCases.forEach(({ username, password, expectedError }) => {
        test(`Проверка авторизации: логин="${username}", пароль="${password}"`, async ({ page }) => {
            await page.goto('http://localhost:3000');
            
            // Вводим логин и пароль
            await page.fill('#username', username);
            await page.fill('#password', password);
            
            // Нажимаем кнопку авторизации
            await page.click('button[type=submit]');
            
            // Проверяем наличие сообщения об ошибке
            const errorMessage = page.locator('#message');
            await expect(errorMessage).toHaveText(expectedError);
        });
    });
});