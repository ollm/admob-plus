// @vitest-environment jsdom
import { expect, test, vi } from "vitest";

vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

test("export admob", async () => {
  const admob = await import("../src/www/index.ts");
  expect(admob).toMatchObject({
    default: expect.any(Function),
    BannerAd: expect.any(Function),
  });
});
