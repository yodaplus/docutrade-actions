import { ClientFunction, Selector } from "testcafe";

const timer = 3;
const preText = "Redirecting to https://www.verify.gov.sg/verify in ";
const key = "2b1236683c3a842ed4a0bb032c1cf668e24bcaf8ce599aeef502c93cb628152c";

fixture("valid redirect action");

test("should redirect when key is part of anchor", async t => {
  const { innerText } = Selector(".text");
  const anchor = { key };
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: "https://api-vaccine.storage.staging.notarise.io/document/6cfbbcbf-85a1-4644-b61a-952c12376502",
      permittedActions: ["VIEW", "STORE"],
      redirect: "https://www.verify.gov.sg/verify"
    }
  };
  const encodedUri = `${encodeURI(JSON.stringify(action))}#${encodeURI(JSON.stringify(anchor))}`;

  await t.navigateTo(`http://localhost:5000/?q=${encodedUri}`);

  // 1. show redirect message
  await t.expect(innerText).contains(preText);

  // 2. countdown from ${timer} seconds
  for (let sec = 0; sec >= timer; sec++) {
    await t.expect(innerText).eql(`${preText}${Math.abs(sec - timer)}`, { timeout: sec * 1000 });
  }

  // 3. redirect after ${timer} seconds
  const getLocation = ClientFunction(() => window.document.location.href);
  await t.expect(getLocation()).eql(`${action.payload.redirect}?q=${encodedUri}`, { timeout: timer * 1000 });
});

test("should redirect when key is part of action", async t => {
  const { innerText } = Selector(".text");
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: "https://api-vaccine.storage.staging.notarise.io/document/6cfbbcbf-85a1-4644-b61a-952c12376502",
      key,
      permittedActions: ["VIEW", "STORE"],
      redirect: "https://www.verify.gov.sg/verify"
    }
  };
  const encodedUri = `${encodeURI(JSON.stringify(action))}`;

  await t.navigateTo(`http://localhost:5000/?q=${encodedUri}`);

  // 1. show redirect message
  await t.expect(innerText).contains(preText);

  // 2. countdown from ${timer} seconds
  for (let sec = 0; sec >= timer; sec++) {
    await t.expect(innerText).eql(`${preText}${Math.abs(sec - timer)}`, { timeout: sec * 1000 });
  }

  // 3. redirect after ${timer} seconds
  const getLocation = ClientFunction(() => window.document.location.href);
  await t.expect(getLocation()).eql(`${action.payload.redirect}?q=${encodedUri}`, { timeout: timer * 1000 });
});
