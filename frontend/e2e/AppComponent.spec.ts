import {test, expect} from '@playwright/test';

test.describe('App', () => {
  test('should render a card with Facebook text after form submission', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000');
    const input = await page.getByRole('textbox');
    const button = await page.getByText('Submit');
    await input.fill('https://www.facebook.com/');
    await button.click();
    await page.waitForSelector('.MuiCard-root');
    const cards = await page.locator('.MuiCard-root');
    expect(cards).not.toBeNull();
    const cardTexts = await cards.allTextContents();
    const containsFacebook = cardTexts.some((text) =>
      text.includes(
        'פייסבוק - כניסה או הרשמההתחבר/י לפייסבוק והתחל/התחילי לשתף וליצור קשר עם החברים, בני המשפחה ואנשים שאת/ה מכיר/ה.'
      )
    );
    expect(containsFacebook).toBe(true);
  });
});
