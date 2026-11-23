import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBatteryLife,
  calculateLedResistor,
  calculateRcFilter,
  calculateTraceWidth,
  calculateVoltageDivider,
  findNearestE24,
} from './calculators';

test('findNearestE24 snaps upward to standard E24 values', () => {
  assert.equal(findNearestE24(150), 150);
  assert.equal(findNearestE24(142), 150);
  assert.equal(findNearestE24(4500), 4700);
});

test('LED current-limiting resistor calculation handles valid and low-supply cases', () => {
  const res = calculateLedResistor(5.0, 2.0, 20, 1);
  assert.equal(res.valid, true);
  assert.equal(res.exactResistanceOhm, 150);
  assert.equal(res.nearestE24Ohm, 150);
  assert.ok(Math.abs(res.actualCurrentMa - 20) < 0.01);
  assert.ok(Math.abs(res.powerMw - 60) < 0.01);
  assert.equal(res.colorBands.length, 4);

  const invalid = calculateLedResistor(3.3, 3.6, 20, 1);
  assert.equal(invalid.valid, false);
  assert.equal(invalid.error, 'SUPPLY_TOO_LOW');
});

test('Voltage divider calculates Vout, 12-bit ESP32 ADC count, and 3.3V safety flag', () => {
  const safe = calculateVoltageDivider(5.0, 10000, 10000);
  assert.equal(safe.valid, true);
  assert.ok(Math.abs(safe.vOut - 2.5) < 0.001);
  assert.equal(safe.safeFor3v3Gpio, true);
  assert.ok(safe.esp32Adc12Bit > 3000 && safe.esp32Adc12Bit < 3150);

  const unsafe = calculateVoltageDivider(12.0, 1000, 10000);
  assert.equal(unsafe.valid, true);
  assert.equal(unsafe.safeFor3v3Gpio, false);
  assert.ok(unsafe.suggestedR2For3v3 !== undefined && unsafe.suggestedR2For3v3 < 400);
});

test('RC low-pass filter computes cutoff frequency and 25 Bode points', () => {
  // R = 10k, C = 0.1uF => fc ~ 159.15 Hz, tau = 1ms
  const rc = calculateRcFilter(10000, 0.1);
  assert.equal(rc.valid, true);
  assert.ok(Math.abs(rc.cutoffHz - 159.15) < 0.2);
  assert.ok(Math.abs(rc.timeConstantMs - 1.0) < 0.01);
  assert.equal(rc.bodePoints.length, 25);
});

test('Battery life duty-cycle model computes average current and runtime', () => {
  const bat = calculateBatteryLife(2000, 100, 100, 6, 60, 100);
  assert.equal(bat.valid, true);
  assert.ok(Math.abs(bat.dutyCyclePercent - 10) < 0.01);
  // avg = 100*0.1 + 0.1*0.9 = 10.09 mA
  assert.ok(Math.abs(bat.averageCurrentMa - 10.09) < 0.01);
  assert.ok(bat.runtimeHours > 195 && bat.runtimeHours < 200);
});

test('IPC-2221 trace width increases with current and decreases with copper weight', () => {
  const t1 = calculateTraceWidth(2.0, 1, 10, true);
  const t2 = calculateTraceWidth(4.0, 1, 10, true);
  const tHeavy = calculateTraceWidth(2.0, 2, 10, true);
  assert.equal(t1.valid, true);
  assert.ok(t2.widthMm > t1.widthMm);
  assert.ok(tHeavy.widthMm < t1.widthMm);
});
