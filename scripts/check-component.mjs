import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

// Verifica la lógica real del bundle. El deploy y la prueba en Salesforce
// comprueban por separado compilación, Flow runtime y persistencia.
const file = fileURLToPath(new URL('../force-app/main/default/lwc/vacationRequestFlowScreen/vacationRequestFlowScreen.js', import.meta.url));
const source = readFileSync(file, 'utf8')
    .replace(/^import .*;\n/gm, '')
    .replace(/@api\s*/g, '')
    .replace('export default class VacationRequestFlowScreen', 'class VacationRequestFlowScreen');
class LightningElement {
    events = [];
    template = { querySelectorAll: () => [], querySelector: () => null };
    dispatchEvent(event) { this.events.push(event); }
}
class FlowAttributeChangeEvent {
    constructor(name, value) { this.detail = { name, value }; }
}
const Component = new Function('LightningElement', 'FlowAttributeChangeEvent', `${source}\nreturn VacationRequestFlowScreen;`)(LightningElement, FlowAttributeChangeEvent);
const c = new Component();
Object.defineProperty(c, 'today', { get: () => '2026-09-30' });
assert.equal(c.summaryAlternativeText, 'Selecciona las fechas');
c.connectedCallback();
assert.ok(c.events.some((e) => e.detail.name === 'requestType' && e.detail.value === 'Vacaciones'));
for (const [start, end, expected] of [
    ['2026-10-05', '2026-10-09', 5],
    ['2026-10-10', '2026-10-11', 0],
    ['2026-10-09', '2026-10-12', 2],
    ['2026-10-05', '2026-10-23', 15],
    ['2026-10-05', '2026-10-26', 16],
    ['2026-10-09', '2026-10-05', 0]
]) {
    assert.equal(c.calculateBusinessDays(start, end), expected, `${start} a ${end}`);
}
c.startDate = '2026-10-05';
c.endDate = '2026-10-09';
assert.equal(c.daysRequested, 5);
assert.equal(c.validate().isValid, true);
c.endDate = '2026-10-26';
assert.equal(c.validate().isValid, false);
assert.match(c.validate().errorMessage, /15/);
c.startDate = '2026-10-10';
c.endDate = '2026-10-11';
assert.equal(c.validate().isValid, false);
c.startDate = '2026-09-29';
assert.equal(c.validate().isValid, false);
c.maxDays = 20;
assert.equal(c.effectiveMaxDays, 15);
c.handleFieldChange({ target: { name: 'startDate', value: '2026-10-05' } });
c.handleFieldChange({ target: { name: 'endDate', value: '2026-10-09' } });
assert.equal(c.validate().isValid, true);
assert.ok(c.events.some((e) => e.detail.name === 'daysRequested' && e.detail.value === 5));
c.reportValidity();
assert.equal(c.hasRenderedError, false);
c.setCustomValidity('Error externo de prueba');
c.reportValidity();
assert.match(c.renderedErrorMessage, /Error externo de prueba/);
c.setCustomValidity('');
c.reportValidity();
assert.equal(c.hasRenderedError, false);
console.log('OK: cálculo, validación, recuperación, defaults y eventos de Flow.');
