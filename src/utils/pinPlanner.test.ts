import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePinPlannerSummary,
  ESP32_DEVKIT_PINS,
  generateFirmwarePinHeader,
  runElectricalRuleCheck,
} from './pinPlanner';

test('ESP32 DevKit spec contains 38 physical pins (19 left, 19 right)', () => {
  assert.equal(ESP32_DEVKIT_PINS.length, 38);
  assert.equal(ESP32_DEVKIT_PINS.filter((p) => p.side === 'left').length, 19);
  assert.equal(ESP32_DEVKIT_PINS.filter((p) => p.side === 'right').length, 19);
});

test('ERC detects input-only GPIO34 configured as PWM output', () => {
  const diagnostics = runElectricalRuleCheck(
    {
      5: {
        physicalPin: 5, // GPIO34
        signalName: 'BAD_PWM',
        functionType: 'pwm',
        currentMa: 10,
      },
    },
    false
  );
  assert.ok(diagnostics.some((d) => d.id === 'erc-input-only-5' && d.severity === 'error'));
});

test('ERC detects ADC2 conflict when Wi-Fi is enabled', () => {
  const diagnosticsWifiOn = runElectricalRuleCheck(
    {
      9: {
        physicalPin: 9, // GPIO25 (ADC2_CH8)
        signalName: 'BATTERY_ADC',
        functionType: 'adc',
        currentMa: 1,
      },
    },
    true
  );
  assert.ok(diagnosticsWifiOn.some((d) => d.id === 'erc-adc2-wifi-9' && d.severity === 'error'));

  const diagnosticsWifiOff = runElectricalRuleCheck(
    {
      9: {
        physicalPin: 9,
        signalName: 'BATTERY_ADC',
        functionType: 'adc',
        currentMa: 1,
      },
    },
    false
  );
  assert.equal(diagnosticsWifiOff.some((d) => d.id === 'erc-adc2-wifi-9'), false);
});

test('ERC detects flash pin violation and per-pin overcurrent', () => {
  const diagnostics = runElectricalRuleCheck(
    {
      16: {
        physicalPin: 16, // GPIO9 Flash
        signalName: 'RELAY',
        functionType: 'gpio_out',
        currentMa: 50,
      },
    },
    true
  );
  assert.ok(diagnostics.some((d) => d.id === 'erc-flash-16' && d.severity === 'error'));
  assert.ok(diagnostics.some((d) => d.id === 'erc-overcurrent-16' && d.severity === 'error'));
});

test('Summary and firmware header generator output valid C++ and MicroPython constants', () => {
  const assignments = {
    25: { physicalPin: 25, signalName: 'I2C SDA', functionType: 'i2c' as const, currentMa: 3 },
    22: { physicalPin: 22, signalName: 'I2C SCL', functionType: 'i2c' as const, currentMa: 3 },
  };
  const summary = calculatePinPlannerSummary(assignments);
  assert.equal(summary.assignedCount, 2);
  assert.equal(summary.totalGpioCurrentMa, 6);
  assert.equal(summary.busCounts.i2c, 2);

  const cpp = generateFirmwarePinHeader('WeatherNode', assignments, 'cpp');
  assert.match(cpp, /constexpr uint8_t PIN_I2C_SDA = 21;/);
  assert.match(cpp, /constexpr uint8_t PIN_I2C_SCL = 22;/);

  const py = generateFirmwarePinHeader('WeatherNode', assignments, 'micropython');
  assert.match(py, /I2C_SDA_GPIO = 21/);
});
