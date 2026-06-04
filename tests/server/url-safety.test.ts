import { describe, expect, it } from "vitest";
import { assertPublicHttpUrl } from "../../server/services/url-safety";

const resolveTo = (addresses: string[]) => async () => addresses;

describe("url safety", () => {
  it("allows public http and https URLs", async () => {
    await expect(
      assertPublicHttpUrl("https://example.com/path", {
        resolveHost: resolveTo(["93.184.216.34"])
      })
    ).resolves.toEqual(new URL("https://example.com/path"));

    await expect(
      assertPublicHttpUrl("http://example.com/", {
        resolveHost: resolveTo(["93.184.216.34"])
      })
    ).resolves.toEqual(new URL("http://example.com/"));
  });

  it("rejects non-http protocols", async () => {
    await expect(
      assertPublicHttpUrl("file:///etc/passwd", {
        resolveHost: resolveTo(["93.184.216.34"])
      })
    ).rejects.toMatchObject({ code: "UNSUPPORTED_PROTOCOL" });
  });

  it("rejects localhost and loopback targets before fetching", async () => {
    await expect(
      assertPublicHttpUrl("http://localhost:3000", {
        resolveHost: resolveTo(["127.0.0.1"])
      })
    ).rejects.toMatchObject({ code: "UNSAFE_HOST" });

    await expect(
      assertPublicHttpUrl("http://127.0.0.1:3000", {
        resolveHost: resolveTo(["127.0.0.1"])
      })
    ).rejects.toMatchObject({ code: "UNSAFE_IP" });

    await expect(
      assertPublicHttpUrl("http://[::1]:3000", {
        resolveHost: resolveTo(["::1"])
      })
    ).rejects.toMatchObject({ code: "UNSAFE_IP" });
  });

  it("rejects private and link-local DNS resolutions", async () => {
    const targets = ["10.0.0.1", "172.16.0.1", "192.168.1.8", "169.254.10.10", "fc00::1", "fe80::1"];

    for (const target of targets) {
      await expect(
        assertPublicHttpUrl("https://example.test", {
          resolveHost: resolveTo([target])
        })
      ).rejects.toMatchObject({ code: "UNSAFE_IP" });
    }
  });
});
