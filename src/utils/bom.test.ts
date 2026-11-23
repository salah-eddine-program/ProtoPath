import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMPONENT_CATALOG,
  createBomItemFromCatalog,
  exportBomToCsv,
  filterCatalog,
  summarizeBom,
} from './bom';

test('BOM summary computes cost, rail currents, and I2C address collisions', () => {
  const bme = createBomItemFromCatalog(COMPONENT_CATALOG.find((c) => c.id === 'comp-bme280')!, 'in_stock');
  const oled = createBomItemFromCatalog(COMPONENT_CATALOG.find((c) => c.id === 'comp-ssd1306')!, 'needed');
  const bmeDup = { ...bme, id: 'dup-bme', name: 'BME280 Second' };

  const summary = summarizeBom([bme, oled, bmeDup]);
  assert.equal(summary.totalUniqueParts, 3);
  assert.equal(summary.totalUnitCount, 3);
  assert.ok(Math.abs(summary.totalCostUsd - (4.2 + 3.8 + 4.2)) < 0.01);
  assert.ok(summary.rail3v3CurrentMa > 15);
  const addr76 = summary.i2cAddresses.find((a) => a.address === '0x76');
  assert.equal(addr76?.conflict, true);
});

test('Catalog filtering matches protocol, part number, and category', () => {
  const i2cParts = filterCatalog(COMPONENT_CATALOG, 'I2C', 'sensors');
  assert.ok(i2cParts.length >= 3);
  assert.ok(i2cParts.every((c) => c.category === 'sensors'));
});

test('BOM CSV export includes header and escapes fields', () => {
  const oled = createBomItemFromCatalog(COMPONENT_CATALOG.find((c) => c.id === 'comp-ssd1306')!, 'in_stock');
  const csv = exportBomToCsv([oled]);
  const lines = csv.split('\n');
  assert.equal(lines.length, 2);
  assert.match(lines[0], /^Part Number,Component Name,/);
  assert.match(lines[1], /SSD1306-I2C-12864/);
});
