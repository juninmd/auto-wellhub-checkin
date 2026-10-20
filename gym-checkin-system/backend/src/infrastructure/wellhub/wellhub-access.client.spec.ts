import { WellhubAccessClient } from "./wellhub-access.client";

describe("WellhubAccessClient", () => {
  const config = {
    baseUrl: "https://sandbox.example/access/v1",
    apiToken: "secret-token",
    gymId: "42",
    timeoutMs: 1000,
  };
  const gympassId = "1234567890123";
  let client: WellhubAccessClient;
  let fetchMock: jest.SpyInstance;

  const respondWith = (status: number) =>
    fetchMock.mockResolvedValueOnce({ status, ok: status >= 200 && status < 300 } as Response);

  beforeEach(() => {
    client = new WellhubAccessClient(config);
    fetchMock = jest.spyOn(global, "fetch");
  });

  afterEach(() => jest.restoreAllMocks());

  it("should POST to /validate with auth headers and gympass_id", async () => {
    respondWith(200);

    await client.validate(gympassId);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://sandbox.example/access/v1/validate");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ Authorization: "Bearer secret-token", "X-Gym-Id": "42" });
    expect(JSON.parse(init.body)).toEqual({ gympass_id: gympassId });
  });

  it("should send custom_code when provided", async () => {
    respondWith(200);

    await client.validate(gympassId, "ABC");

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ gympass_id: gympassId, custom_code: "ABC" });
  });

  it("should approve on 2xx", async () => {
    respondWith(200);
    await expect(client.validate(gympassId)).resolves.toEqual({ approved: true, httpStatus: 200 });
  });

  it.each([400, 404, 422])("should deny on %i", async (status) => {
    respondWith(status);
    await expect(client.validate(gympassId)).resolves.toEqual({ approved: false, httpStatus: status });
  });

  it.each([401, 403, 500, 503])("should throw on unreliable status %i", async (status) => {
    respondWith(status);
    await expect(client.validate(gympassId)).rejects.toThrow(String(status));
  });

  it("should propagate network errors without leaking the token", async () => {
    fetchMock.mockRejectedValueOnce(new Error("socket hang up"));
    const error = await client.validate(gympassId).catch((e) => e);
    expect(error.message).toBe("socket hang up");
    expect(error.message).not.toContain("secret-token");
  });

  it.each(["123", "abcdefghijklmn", "12345678901234", ""])(
    "should deny invalid gympassId %p without calling the API",
    async (id) => {
      await expect(client.validate(id)).resolves.toEqual({ approved: false });
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
});
