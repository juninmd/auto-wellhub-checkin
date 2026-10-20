import { SANDBOX_URL, loadWellhubConfig } from "./wellhub.config";

describe("loadWellhubConfig", () => {
  const env = { WELLHUB_API_TOKEN: "token", WELLHUB_GYM_ID: "123" };

  it("should apply defaults (sandbox URL, 5s timeout)", () => {
    expect(loadWellhubConfig(env)).toEqual({
      baseUrl: SANDBOX_URL,
      apiToken: "token",
      gymId: "123",
      timeoutMs: 5000,
    });
  });

  it("should use overrides and strip trailing slashes", () => {
    const config = loadWellhubConfig({
      ...env,
      WELLHUB_BASE_URL: "https://api.partners.gympass.com/access/v1/",
      WELLHUB_TIMEOUT_MS: "2000",
    });
    expect(config.baseUrl).toBe("https://api.partners.gympass.com/access/v1");
    expect(config.timeoutMs).toBe(2000);
  });

  it.each([
    [{ WELLHUB_GYM_ID: "123" }],
    [{ WELLHUB_API_TOKEN: "token" }],
    [{ WELLHUB_API_TOKEN: "  ", WELLHUB_GYM_ID: "123" }],
  ])("should throw when credentials are missing (%j)", (partial) => {
    expect(() => loadWellhubConfig(partial)).toThrow("obrigatórios");
  });

  it.each(["abc", "0", "-5"])("should reject invalid timeout %s", (timeout) => {
    expect(() => loadWellhubConfig({ ...env, WELLHUB_TIMEOUT_MS: timeout })).toThrow("WELLHUB_TIMEOUT_MS");
  });
});
