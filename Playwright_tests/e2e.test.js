const {
  test,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  expect,
} = require("@playwright/test");
const { chromium } = require("playwright");

const host = "http://localhost:3000"; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
  email: "",
  password: "123456",
  confirmPass: "123456",
};

let albumName = "";

function random() {
  return Math.floor(Math.random() * 10000);
}

describe("e2e tests", () => {
  beforeAll(async () => {
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  afterEach(async () => {
    await page.close();
    await context.close();
  });

  describe("authentication", () => {
    test("Registration with Valid Data", async () => {
      // Arrange
      await page.goto(host);
      await page.locator("nav >> text=Register").click();
      await page.waitForSelector("form");

      user.email = `abv${random()}@abv.bg`;

      // Act
      await page.locator("#email").fill(user.email);
      await page.locator("#password").fill(user.password);
      await page.locator("#conf-pass").fill(user.confirmPass);

      let [response] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes("/users/register") &&
            response.status() === 200
        ),
        page.click('[type="submit"]'),
      ]);
      let userData = await response.json();

      // Assert
      expect(response.ok()).toBeTruthy();

      expect(userData.email).toBe(user.email);
      expect(userData.password).toEqual(user.password);
    });

    test("Login with Valid Data", async () => {
      // Arrange
      await page.goto(host);
      await page.locator("nav >> text=Login").click();
      await page.waitForSelector("form");

      // Act
      await page.locator("#email").fill(user.email);
      await page.locator("#password").fill(user.password);

      let [response] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes("/users/login") && response.status() === 200
        ),
        page.click('[type="submit"]'),
      ]);
      let userData = await response.json();

      // Assert
      expect(response.ok()).toBeTruthy();

      expect(userData.email).toBe(user.email);
      expect(userData.password).toEqual(user.password);
    });

    test("Logout from the Application", async () => {
      // Arrange
      await page.goto(host);
      await page.locator("nav >> text=Login").click();
      await page.waitForSelector("form");

      await page.locator("#email").fill(user.email);
      await page.locator("#password").fill(user.password);
      await page.locator('[type="submit"]').click();

      // Act
      let [response] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes("/users/logout") &&
            response.status() === 204
        ),
        page.click("nav >> text=Logout"),
      ]);

      await page.waitForSelector("nav >> text=Login");

      // Assert
      expect(response.ok()).toBeTruthy();
      expect(page.url()).toBe(host + "/");
    });
  });

  describe("navbar", () => {
    test("Navigation for Logged-In User", async () => {
      // Arrange
      await page.goto(host);
      await page.locator("nav >> text=Login").click();
      await page.waitForSelector("form");

      // Act
      await page.locator("#email").fill(user.email);
      await page.locator("#password").fill(user.password);
      await page.locator('[type="submit"]').click();

      // Assert
      await expect(page.locator("nav >> text=Home")).toBeVisible();
      await expect(page.locator("nav >> text=Catalog")).toBeVisible();
      await expect(page.locator("nav >> text=Search")).toBeVisible();
      await expect(page.locator("nav >> text=Create Album")).toBeVisible();
      await expect(page.locator("nav >> text=Logout")).toBeVisible();
      await expect(page.locator("nav >> text=Login")).toBeHidden();
      await expect(page.locator("nav >> text=Register")).toBeHidden();
    });

    test("Navigation for Guest User", async () => {
      // Arrange
      await page.goto(host);

      // Assert
      await expect(page.locator("nav >> text=Home")).toBeVisible();
      await expect(page.locator("nav >> text=Catalog")).toBeVisible();
      await expect(page.locator("nav >> text=Search")).toBeVisible();
      await expect(page.locator("nav >> text=Create Album")).toBeHidden();
      await expect(page.locator("nav >> text=Logout")).toBeHidden();
      await expect(page.locator("nav >> text=Login")).toBeVisible();
      await expect(page.locator("nav >> text=Register")).toBeVisible();
    });
  });

  describe("CRUD", () => {
    beforeEach(async () => {
      await page.goto(host);
      await page.locator("nav >> text=Login").click();
      await page.waitForSelector("form");

      await page.locator("#email").fill(user.email);
      await page.locator("#password").fill(user.password);
      await page.locator('[type="submit"]').click();
    });
    test("Create an Album", async () => {
      // Arrange
      albumName = `Random name ${random()}`;
      await page.locator("nav >> text=Create Album").click();
      await page.waitForSelector("form");

      // Act
      await page.locator("#name").fill(albumName);
      await page.locator("#imgUrl").fill("../../images/pinkFloyd.jpg");
      await page.locator("#price").fill("19.14");
      await page.locator("#releaseDate").fill("20.07.2024");
      await page.locator("#artist").fill("Random artist");
      await page.locator("#genre").fill("Random genre");
      await page.locator('[name="description"]').fill("Random description");

      let [response] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes("/data/albums") && response.status() === 200
        ),
        page.click('[type="submit"]'),
      ]);

      let albumData = await response.json();

      // Assert
      expect(response.ok()).toBeTruthy();

      expect(albumData.name).toEqual(albumName);
      expect(albumData.imgUrl).toEqual("../../images/pinkFloyd.jpg");
      expect(albumData.price).toEqual("19.14");
      expect(albumData.releaseDate).toEqual("20.07.2024");
      expect(albumData.artist).toEqual("Random artist");
      expect(albumData.genre).toEqual("Random genre");
      expect(albumData.description).toEqual("Random description");
    });

    test("Edit an Album", async () => {
      // Arrange
      await page.locator("nav >> text=Search").click();

      // Act
      await page.locator("#search-input").fill(albumName);
      await page.locator(".button-list").click();

      await page.locator("text=Details").first().click();
      await page.locator("text=Edit").click();
      await page.waitForSelector("form");

      await page.locator("#artist").fill("Random edited artist");

      let [response] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes("/data/albums") && response.status() === 200
        ),
        page.click('[type="submit"]'),
      ]);

      let albumData = await response.json();

      // Assert
      expect(response.ok()).toBeTruthy();

      expect(albumData.name).toEqual(albumName);
      expect(albumData.imgUrl).toEqual("../../images/pinkFloyd.jpg");
      expect(albumData.price).toEqual("19.14");
      expect(albumData.releaseDate).toEqual("20.07.2024");
      expect(albumData.artist).toEqual("Random edited artist");
      expect(albumData.genre).toEqual("Random genre");
      expect(albumData.description).toEqual("Random description");
    });

    test("Delete an Album", async () => {
      // Arrange
      await page.locator("nav >> text=Search").click();

      await page.locator("#search-input").fill(albumName);
      await page.locator(".button-list").click();

      await page.locator("text=Details").first().click();

      let [response] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes("/data/albums") && response.status() === 200
        ),
        page.on("dialog", (dialog) => dialog.accept()),
        page.click("text=Delete"),
      ]);

      // Assert
      expect(response.ok()).toBeTruthy();
    });
  });
});
