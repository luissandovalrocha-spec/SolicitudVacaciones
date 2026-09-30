import { LightningElement, api } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

const DEFAULT_TYPE = 'Vacaciones';
const MILLISECONDS_PER_DAY = 86_400_000;

export default class VacationRequestFlowScreen extends LightningElement {
    @api headline = 'Planea tu descanso';
    @api maxDays = 15;

    _requestType = DEFAULT_TYPE;
    _startDate = null;
    _endDate = null;
    _comments = '';
    _daysRequested = 0;

    @api
    get requestType() {
        return this._requestType;
    }
    set requestType(value) {
        this._requestType = value || DEFAULT_TYPE;
    }

    @api
    get startDate() {
        return this._startDate;
    }
    set startDate(value) {
        this._startDate = value || null;
    }

    @api
    get endDate() {
        return this._endDate;
    }
    set endDate(value) {
        this._endDate = value || null;
    }

    @api
    get comments() {
        return this._comments;
    }
    set comments(value) {
        this._comments = value || '';
    }

    @api
    get daysRequested() {
        return this._daysRequested;
    }
    set daysRequested(value) {
        this._daysRequested = Number(value) || 0;
    }

    get typeOptions() {
        return [
            { label: 'Vacaciones', value: 'Vacaciones' },
            { label: 'Día personal', value: 'Día personal' },
            { label: 'Asunto familiar', value: 'Asunto familiar' }
        ];
    }

    get today() {
        const now = new Date();
        const localTime = new Date(
            now.getTime() - now.getTimezoneOffset() * 60_000
        );
        return localTime.toISOString().slice(0, 10);
    }

    handleFieldChange(event) {
        const attributeName = event.target.name;
        const value = event.detail?.value ?? event.target.value;

        // TODO 1: actualiza la propiedad privada correcta sin modificar @api.
        // TODO 2: notifica a Flow con notifyFlow(attributeName, value).
        // TODO 3: si cambió una fecha, recalcula daysRequested y notifícalo.
        void attributeName;
        void value;
    }

    recalculateDays() {
        // TODO 3: llama al helper con las fechas privadas, actualiza
        // _daysRequested y notifica daysRequested a Flow.
        // Pista: invoca recalculateDays() desde el handler, los setters
        // startDate/endDate y connectedCallback() para restaurar el resumen
        // al volver desde Revisar solicitud.
    }

    calculateBusinessDays(startValue, endValue) {
        // Helper incluido: comprueba los casos de la slide.
        if (!startValue || !endValue) {
            return 0;
        }

        const start = new Date(`${startValue}T00:00:00Z`);
        const end = new Date(`${endValue}T00:00:00Z`);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return 0;
        }

        if (end.getTime() < start.getTime()) {
            return 0;
        }

        let businessDays = 0;
        const cursor = new Date(start.getTime());

        while (cursor.getTime() <= end.getTime()) {
            const dayOfWeek = cursor.getUTCDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                businessDays += 1;
            }
            cursor.setTime(cursor.getTime() + MILLISECONDS_PER_DAY);
        }

        return businessDays;
    }

    notifyFlow(attributeName, value) {
        // TODO 2: crea y despacha FlowAttributeChangeEvent.
        void FlowAttributeChangeEvent;
        void attributeName;
        void value;
    }

    @api
    validate() {
        // TODO 5: valida requeridos, fechas, rango con al menos un día hábil
        // y el máximo didáctico. Devuelve { isValid, errorMessage }.
        return { isValid: true, errorMessage: null };
    }
}
