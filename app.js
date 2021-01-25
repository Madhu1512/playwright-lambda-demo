const playwright = require("playwright-core");

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { url } = event.queryStringParameters;

  let browser = null;
  try {
    browser = await playwright.chromium.launch({
      headless: true,
      executablePath: "/usr/bin/chromium-browser",
      args: [
        "--autoplay-policy=user-gesture-required",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-domain-reliability",
        "--disable-extensions",
        "--disable-features=AudioServiceOutOfProcess",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-popup-blocking",
        "--disable-print-preview",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-speech-api",
        "--disable-sync",
        "--disk-cache-size=33554432",
        "--hide-scrollbars",
        "--ignore-gpu-blacklist",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-first-run",
        "--no-pings",
        "--no-sandbox",
        "--no-zygote",
        "--password-store=basic",
        "--use-gl=swiftshader",
        "--use-mock-keychain",
        "--single-process",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
    });
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    const pdf = await page.pdf({ format: "A4" });
    const response = {
      headers: { "Content-type": "application/pdf" },
      statusCode: 200,
      body: pdf.toString("base64"),
      isBase64Encoded: true,
    };
    context.succeed(response);
  } catch (error) {
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
