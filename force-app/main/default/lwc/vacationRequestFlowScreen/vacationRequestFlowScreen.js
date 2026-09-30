import { LightningElement, api } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

const DEFAULT_TYPE = 'Vacaciones';
const DEFAULT_MAX_DAYS = 15;
const MILLISECONDS_PER_DAY = 86_400_000;

export default class VacationRequestFlowScreen extends LightningElement {
    @api headline = 'Tu próxima solicitud';
    @api maxDays = DEFAULT_MAX_DAYS;

    _requestType = DEFAULT_TYPE;
    _startDate = null;
    _endDate = null;
    _comments = '';
    _daysRequested = 0;

    _cachedExternalErrorMessage = '';
    _externalErrorToRender = '';
    _internalErrorToRender = '';
    _shouldRenderErrors = false;

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
        this.recalculateDays();
    }

    @api
    get endDate() {
        return this._endDate;
    }

    set endDate(value) {
        this._endDate = value || null;
        this.recalculateDays();
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

    connectedCallback() {
        this._daysRequested = this.calculateBusinessDays(
            this._startDate,
            this._endDate
        );

        // También notificamos los defaults. Así Flow conoce los valores aunque la
        // persona deje "Vacaciones" seleccionado y no toque el combobox.
        this.notifyFlow('requestType', this._requestType);
        this.notifyFlow('daysRequested', this._daysRequested);
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

    get effectiveMaxDays() {
        const configuredMaximum = Number(this.maxDays);
        return configuredMaximum >= 1
            ? Math.min(Math.floor(configuredMaximum), DEFAULT_MAX_DAYS)
            : DEFAULT_MAX_DAYS;
    }

    get hasDateRange() {
        return Boolean(this._startDate && this._endDate);
    }

    get hasRangeError() {
        return this.hasDateRange && Boolean(this.getDateRangeError());
    }

    get summaryClass() {
        if (!this.hasDateRange) {
            return 'summary summary_pending';
        }
        return this.hasRangeError
            ? 'summary summary_error'
            : 'summary summary_ready';
    }

    get summaryIcon() {
        if (!this.hasDateRange) {
            return 'utility:date_input';
        }
        return this.hasRangeError ? 'utility:warning' : 'utility:success';
    }

    get summaryAlternativeText() {
        if (!this.hasDateRange) {
            return 'Selecciona las fechas';
        }
        return this.hasRangeError ? 'Rango por corregir' : 'Rango válido';
    }

    get summaryMessage() {
        if (!this.hasDateRange) {
            return 'Selecciona un rango para ver el cálculo.';
        }

        return this.getDateRangeError() || 'Rango válido. Puedes revisar la solicitud antes de enviarla.';
    }

    get renderedErrorMessage() {
        return [this._internalErrorToRender, this._externalErrorToRender]
            .filter(Boolean)
            .join(' ');
    }

    get hasRenderedError() {
        return Boolean(this.renderedErrorMessage);
    }

    handleFieldChange(event) {
        const attributeName = event.target.name;
        const value = event.detail?.value ?? event.target.value;

        switch (attributeName) {
            case 'requestType':
                this._requestType = value;
                break;
            case 'startDate':
                this._startDate = value || null;
                break;
            case 'endDate':
                this._endDate = value || null;
                break;
            case 'comments':
                this._comments = value || '';
                break;
            default:
                return;
        }

        this.notifyFlow(attributeName, value || null);

        if (attributeName === 'startDate' || attributeName === 'endDate') {
            this.recalculateDays();
        }

        if (this._shouldRenderErrors) {
            this.reportValidity();
        }
    }

    recalculateDays() {
        const nextValue = this.calculateBusinessDays(
            this._startDate,
            this._endDate
        );

        this._daysRequested = nextValue;
        this.notifyFlow('daysRequested', nextValue);
    }

    calculateBusinessDays(startValue, endValue) {
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

    getDateRangeError() {
        if (!this._startDate || !this._endDate) {
            return '';
        }

        if (this._startDate < this.today) {
            return 'La fecha inicial no puede estar en el pasado.';
        }

        if (this._endDate < this._startDate) {
            return 'La fecha final debe ser igual o posterior a la inicial.';
        }

        if (this._daysRequested === 0) {
            return 'El rango debe incluir al menos un día de lunes a viernes.';
        }

        if (this._daysRequested > this.effectiveMaxDays) {
            return `Para este ejercicio, el máximo es de ${this.effectiveMaxDays} días hábiles.`;
        }

        return '';
    }

    getValidationMessage() {
        if (!this._requestType) {
            return 'Selecciona el tipo de ausencia.';
        }
        if (!this._startDate) {
            return 'Selecciona el primer día de la solicitud.';
        }
        if (!this._endDate) {
            return 'Selecciona el último día de la solicitud.';
        }

        const nativeErrorFlags = [
            'badInput', 'typeMismatch', 'rangeUnderflow', 'rangeOverflow',
            'stepMismatch', 'tooLong', 'tooShort', 'patternMismatch', 'valueMissing'
        ];
        const invalidInput = [...this.template.querySelectorAll('[data-input]')]
            .some((input) => nativeErrorFlags.some((flag) => input.validity?.[flag]));
        if (invalidInput) {
            return 'Revisa los campos marcados antes de continuar.';
        }

        return this.getDateRangeError();
    }

    notifyFlow(attributeName, value) {
        this.dispatchEvent(new FlowAttributeChangeEvent(attributeName, value));
    }

    // Flow llama validate() cuando la persona selecciona Siguiente.
    @api
    validate() {
        const errorMessage = this.getValidationMessage();
        return {
            isValid: !errorMessage,
            errorMessage: errorMessage || null
        };
    }

    // Flow puede aportar errores externos, por ejemplo una regla configurada
    // por el administrador en la pantalla.
    @api
    setCustomValidity(externalErrorMessage) {
        this._cachedExternalErrorMessage = externalErrorMessage || '';
    }

    // Flow llama reportValidity() para pedir que los errores se hagan visibles.
    @api
    reportValidity() {
        this._shouldRenderErrors = true;
        this._internalErrorToRender = this.getValidationMessage();
        this._externalErrorToRender = this._cachedExternalErrorMessage;
        this.reportFieldValidity();
    }

    reportFieldValidity() {
        const inputs = [
            ...this.template.querySelectorAll('[data-input]')
        ];
        inputs.forEach((input) => input.setCustomValidity(''));

        const startInput = this.template.querySelector(
            '[data-field="startDate"]'
        );
        const endInput = this.template.querySelector('[data-field="endDate"]');

        if (startInput && this._startDate && this._startDate < this.today) {
            startInput.setCustomValidity(
                'La fecha inicial no puede estar en el pasado.'
            );
        }

        if (endInput && this._startDate && this._endDate) {
            if (this._endDate < this._startDate) {
                endInput.setCustomValidity(
                    'La fecha final debe ser igual o posterior a la inicial.'
                );
            } else if (this._daysRequested === 0) {
                endInput.setCustomValidity(
                    'El rango debe incluir al menos un día de lunes a viernes.'
                );
            } else if (this._daysRequested > this.effectiveMaxDays) {
                endInput.setCustomValidity(
                    `El máximo didáctico es de ${this.effectiveMaxDays} días hábiles.`
                );
            }
        }

        inputs.forEach((input) => input.reportValidity());
    }
}
