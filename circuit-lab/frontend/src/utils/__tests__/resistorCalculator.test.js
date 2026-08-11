import { calculateResistorValue, formatOhms } from "../resistorCalculator";

describe("resistorCalculator tests", () => {
  test("calculates 220 Ohm resistor (Red, Red, Brown, Gold)", () => {
    const res = calculateResistorValue("red", "red", "brown", "gold");
    expect(res.valueOhms).toBe(220);
    expect(res.tolerance).toBe(5);
    expect(res.formatted).toBe("220 Ω");
  });

  test("calculates 10 kOhm resistor (Brown, Black, Orange, Gold)", () => {
    const res = calculateResistorValue("brown", "black", "orange", "gold");
    expect(res.valueOhms).toBe(10000);
    expect(res.formatted).toBe("10.0 kΩ");
  });

  test("formats 1 MegaOhm correctly", () => {
    expect(formatOhms(1000000)).toBe("1.0 MΩ");
  });
});
