import { ClientFunction, Selector } from "testcafe";

const timer = 3;
const preText = "Redirecting to https://www.verify.gov.sg/verify in ";
const validActions = [
  {
    name: `valid action with key in anchor`,
    page: `http://localhost:5000/?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fapi-vaccine.storage.staging.notarise.io%2Fdocument%2F6cfbbcbf-85a1-4644-b61a-952c12376502%22%2C%22permittedActions%22%3A%5B%22VIEW%22%2C%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fwww.verify.gov.sg%2Fverify%22%7D%7D#%7B%22key%22%3A%222b1236683c3a842ed4a0bb032c1cf668e24bcaf8ce599aeef502c93cb628152c%22%7D`
  },
  {
    name: `valid action with key in query param`,
    page: `http://localhost:5000/?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fapi-vaccine.storage.staging.notarise.io%2Fdocument%2F6cfbbcbf-85a1-4644-b61a-952c12376502%22%2C%22key%22%3A%222b1236683c3a842ed4a0bb032c1cf668e24bcaf8ce599aeef502c93cb628152c%22%2C%22permittedActions%22%3A%5B%22VIEW%22%2C%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fwww.verify.gov.sg%2Fverify%22%7D%7D`
  }
];

for (const { name, page } of validActions) {
  fixture(name).page(page);

  test("should show redirect message", async t => {
    const { innerText } = Selector(".text");
    await t.expect(innerText).contains(preText);
  });

  test(`should countdown from ${timer} seconds`, async t => {
    const { innerText } = Selector(".text");
    for (let sec = 0; sec >= timer; sec++) {
      await t.expect(innerText).eql(`${preText}${Math.abs(sec - timer)}`, { timeout: sec * 1000 });
    }
  });

  test(`should redirect after ${timer} seconds`, async t => {
    const getLocation = ClientFunction(() => window.document.location.href);
    await t.expect(getLocation()).eql(`https://www.verify.gov.sg/verify${page.substr(22)}`, { timeout: timer * 1000 });
  });
}
