import { ClientFunction, Selector } from "testcafe";

const timer = 3;
const invalidActions = [
  {
    name: `invalid action with invalid provider`,
    page: `http://localhost:5000/?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fapi-vaccine.storage.staging.notarise.io%2Fdocument%2F6cfbbcbf-85a1-4644-b61a-952c12376502%22%2C%22permittedActions%22%3A%5B%22VIEW%22%2C%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fexample.com%22%7D%7D#%7B%22key%22%3A%222b1236683c3a842ed4a0bb032c1cf668e24bcaf8ce599aeef502c93cb628152c%22%7D`,
    message: `https://example.com\nis not an authorized platform.`
  },
  {
    name: `invalid action with missing provider`,
    page: `http://localhost:5000/?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fapi-vaccine.storage.staging.notarise.io%2Fdocument%2F6cfbbcbf-85a1-4644-b61a-952c12376502%22%2C%22permittedActions%22%3A%5B%22VIEW%22%2C%22STORE%22%5D%7D%7D#%7B%22key%22%3A%222b1236683c3a842ed4a0bb032c1cf668e24bcaf8ce599aeef502c93cb628152c%22%7D`,
    message: `No platform specified`
  }
];

for (const { name, page, message } of invalidActions) {
  fixture(name).page(page);
  test("should not redirect", async t => {
    const { innerText } = Selector(".text");
    const getLocation = ClientFunction(() => window.document.location.href);

    await t.expect(innerText).eql(message);
    await t.expect(getLocation()).eql(page, { timeout: timer * 1000 });
  });
}
