# Taller práctico LWC + Screen Flow: Centro de Vacaciones

## Demo del instructor, lista para esta instancia

Esta copia corresponde al usuario `luis.sandoval@wise-raccoon-quz74n.com`.
Alias local: `taller-lwc-flow-wise-raccoon`. La org predeterminada se configura
solo para esta carpeta. Los comandos de VS Code también indican la org explícita.

### Estado verificado el 29 de septiembre de 2026

- Paquete principal: **21/21 componentes desplegados**, sin errores. El Flow
  activo es la versión 2, con la navegación corregida; Permission Set asignado
  al usuario indicado arriba.
- Prueba real en Lightning: un fin de semana bloquea avanzar; corregir las
  fechas permite continuar; **Editar solicitud** conserva fechas y comentario.
- Enviar del **5 al 9 de octubre de 2026** creó el folio **SV-0000**,
  Id `a00g800002Ms4TyAAJ`, con **5 días hábiles** calculados en servidor y estado
  `Pendiente de aprobación`. Es un registro de demostración, no una solicitud laboral real.
- El borrador de falla controlada también está instalado por separado, sin activar.
  Probado en Debug: `INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST` para
  `ESTADO_INVALIDO_TALLER` llega al fault connector y a la pantalla de error
  manejado; no crea una solicitud.
- Pruebas locales: `node scripts/check-component.mjs` pasó cálculo, validación,
  recuperación de errores, defaults y eventos de Flow.

Accesos directos:

- [Aplicación del taller](https://wise-raccoon-quz74n-dev-ed.trailblaze.lightning.force.com/lightning/n/Taller_LWC_Flow)
- [Flow Builder, versión activa](https://wise-raccoon-quz74n-dev-ed.trailblaze.lightning.force.com/builder_platform_interaction/flowBuilder.app?flowId=301g800000uaHoUAAU)
- [Registro de demostración](https://wise-raccoon-quz74n-dev-ed.trailblaze.lightning.force.com/lightning/r/Solicitud_Vacaciones__c/a00g800002Ms4TyAAJ/view)

Las capturas de la prueba están en `evidencia/`. La presentación de Google Slides
fue actualizada el 29 de septiembre de 2026, conservando sus 24 diapositivas y
el diseño original. El recorrido y las notas coinciden con esta demo resuelta.

```bash
sf project deploy start --manifest manifest/package.xml --target-org taller-lwc-flow-wise-raccoon --wait 10
sf org assign permset --name Vacaciones_LWC_Flow_Taller --target-org taller-lwc-flow-wise-raccoon
sf org open --target-org taller-lwc-flow-wise-raccoon --path /flow/Solicitar_Vacaciones_LWC_Flow
```

En VS Code, `Terminal > Run Task` incluye las acciones de desplegar, abrir demo,
abrir Flow Builder y consultar las solicitudes guardadas.

Nota técnica de navegación: en la prueba real de esta instancia, la definición
anterior con `allowFinish=false` ocultó también el botón **Next or Finish** en
las pantallas intermedias. Ambos Flows ahora usan `allowFinish=true` en
**Capturar** y **Revisar**. Sus conectores mantienen el avance a la pantalla
siguiente; las etiquetas siguen siendo **Revisar solicitud** y **Enviar
solicitud** (o **Provocar falla de guardado** en el borrador). Capturar no permite
volver; Revisar sí permite editar. La confirmación sigue sin permitir Atrás.

### Recorrido de la demo en 90 segundos

1. Abre el formulario. Todavía no existe una solicitud nueva.
2. Captura del **10 al 11 de octubre de 2026**: el rango de fin de semana muestra
   cero días y bloquea avanzar.
3. Corrige al **5–9 de octubre**. El resumen muestra cinco días hábiles.
4. Pulsa **Revisar solicitud**. Flow muestra tipo, fechas, días y comentario,
   antes de guardar. **Editar** regresa al formulario conservando los datos.
5. Pulsa **Enviar solicitud**. Flow ejecuta Create Records una vez en ese recorrido.
6. La confirmación muestra el Id y el enlace al registro. Ábrelo y comprueba
   fechas, cinco días calculados por Salesforce y estado pendiente.

El estado `Pendiente de aprobación` describe el registro guardado. Esta versión
no dispara un proceso de aprobación ni envía correos.

### Preparar la demo de falla controlada (opcional, solo instructor)

El borrador `demo-fallos/flows/Solicitar_Vacaciones_Fallo_Demo.flow-meta.xml`
está fuera de `force-app` y del manifest principal. El despliegue de la solución
no lo instala. Para prepararlo explícitamente en esta instancia:

```bash
sf project deploy start --source-dir demo-fallos/flows/Solicitar_Vacaciones_Fallo_Demo.flow-meta.xml --target-org taller-lwc-flow-wise-raccoon --wait 10
sf org open --target-org taller-lwc-flow-wise-raccoon --path /lightning/setup/Flows/home
```

En Setup, abre **DEMO FALLO - LWC + Flow** y selecciona **Debug**. El Flow se
mantiene **Draft**: no se ejecuta mediante `/flow/Solicitar_Vacaciones_Fallo_Demo`
ni necesita activarse. Si Debug ofrece rollback, habilítalo para esta prueba.

1. Captura fechas válidas, por ejemplo **5–9 de octubre de 2026**, y un comentario.
2. Avanza a la revisión y pulsa **Provocar falla de guardado**.
3. La pantalla de error debe mostrar la falla del picklist restringido: Create
   Records intenta asignar `ESTADO_INVALIDO_TALLER` a `Estado__c`. No debe crearse
   ningún registro.
4. **Volver a revisar** y **Editar solicitud** permiten comprobar que los datos
   permanecen. Cambiar las fechas no resuelve esta falla: el estado inválido está
   fijado intencionalmente en Create Records.
5. Para demostrar la corrección, cambia la asignación de `Estado__c` a
   `Pendiente de aprobación`, guarda el Flow como borrador y ejecuta Debug otra
   vez. También puedes abrir el Flow normal
   con la tarea **Taller: abrir demo** y repetir el caso feliz.

Con rollback, un intento correcto en Debug no deja un registro persistente. Para
mostrar el registro guardado y su enlace utiliza el Flow normal activo.

### Recorrido actualizado de la presentación

Los siguientes cambios ya están aplicados en la
[presentación del taller](https://docs.google.com/presentation/d/1WjDJuAoh97UrU5oAuIFL856mGDDTA3t8eVmCVkTiCm8/edit).
Se revisaron las 24 diapositivas renderizadas y las notas del instructor:

- **6 y 11:** apertura con una demo guiada de 90 segundos y una captura real
  del LWC en Salesforce como referencia del resultado del primer checkpoint.
- **5, 8 y 9:** explica dónde se trabaja. Editar `starter/` no despliega cambios.
  Cada participante trabaja en una copia con el bundle dentro de `force-app`.
  A las 6:10, quien no tenga ambiente listo se integra a una pareja.
- **12–15:** sigue primero una sola fecha desde el input, el estado privado,
  `FlowAttributeChangeEvent`, la variable de Flow y el campo del objeto. Entrega
  el cálculo de días como helper y dedica la práctica a conectarlo y probarlo.
- **17–19:** diagrama nativo de Capturar → Revisar → Guardar → Resultado,
  mapeo de ida y vuelta y guardado solo al confirmar. Se contrasta el cálculo
  local con la fórmula del registro y se conserva el Id en `createdRequestId`.
- **20 y 22:** usa el borrador de falla controlada en `demo-fallos/`. El error
  tiene un cambio concreto y una salida clara. No cambies reglas o permisos
  generales durante la sesión.
- **21–24:** prueba en pareja con cambio de roles, explicación del patrón y
  extensiones de aprobación/notificaciones claramente marcadas como opcionales.

Las fechas de octubre son casos del taller de septiembre de 2026. Para repetir
el taller después, elige fechas futuras equivalentes.

Paquete didáctico para un taller práctico del Salesforce Developer Group,
San Luis Potosí. No necesitas haber asistido a sesiones anteriores. Empezaremos
con un repaso y tendrás proyecto inicial y apoyo para avanzar paso a paso.

Un Lightning Web Component construye una experiencia visual y reactiva dentro
de una pantalla; **Screen Flow es el único responsable de crear el registro**
`Solicitud_Vacaciones__c`. El proyecto incluye el objeto y los campos necesarios
para completar el ejercicio principal en una org nueva. También conserva
compatibilidad con el caso de vacaciones de encuentros anteriores.

No hay Apex en el ejercicio principal y el LWC no usa `createRecord`. Esa frontera
evita DML duplicado y hace visible la responsabilidad de cada herramienta:

```text
Persona
  │
  ▼
vacationRequestFlowScreen (UI, cálculo y validación)
  │ FlowAttributeChangeEvent
  ▼
Variables del Screen Flow
  │ Create Records
  ▼
Solicitud_Vacaciones__c
  │
  └── Bonus: Flows de aprobación/notificación del taller anterior
```

## Continuidad con el workshop anterior

Se reutilizan el objeto y los API names originales siempre que corresponde:

| Concepto | API name de esta solución |
|---|---|
| Objeto | `Solicitud_Vacaciones__c` |
| Tipo | `Tipo__c` |
| Fecha inicial | `Fecha_Inicio__c` |
| Fecha final | `Fecha_Fin__c` |
| Días hábiles | `Dias_Solicitados__c` |
| Comentario | `Comentario_Empleado__c` |
| Estado | `Estado__c` |
| Solicitante | `Empleado__c` |
| Gerente | `Gerente__c` |

`Dias_Solicitados__c` conserva el cálculo de lunes a viernes del taller anterior.
No descuenta días festivos. El máximo de **15 días hábiles** es una regla
didáctica para practicar validación en dos capas; **no representa una política
laboral ni una interpretación legal**.

## Qué contiene el proyecto

```text
force-app/main/default/
├── flows/
│   └── Solicitar_Vacaciones_LWC_Flow.flow-meta.xml
├── lwc/
│   └── vacationRequestFlowScreen/
├── objects/
│   └── Solicitud_Vacaciones__c/
│       ├── fields/
│       └── validationRules/
└── permissionsets/
    └── Vacaciones_LWC_Flow_Taller.permissionset-meta.xml

manifest/package.xml
starter/vacationRequestFlowScreen/  # versión sintácticamente válida con TODOs
```

La solución final está en `force-app`. La carpeta `starter` queda fuera del
package directory y no se despliega accidentalmente.

## Prerrequisitos

- Trailhead Playground, Developer Edition o sandbox con Lightning Experience.
- Usuario administrador para el montaje del taller.
- Visual Studio Code con Salesforce Extension Pack.
- Salesforce CLI. Verifica con `sf --version`.
- Git es recomendable para conservar checkpoints, pero no es obligatorio.
- Si reutilizas la org del workshop anterior, no vuelvas a crear manualmente el
  objeto ni los campos: revisa primero los API names.

La versión de metadata del proyecto es `65.0`. Si la org del evento requiere otra,
actualiza de forma consistente `sfdx-project.json`, `package.xml`, el Flow y el
archivo `js-meta.xml`; no mezcles versiones al azar.

## Desplegar la solución final

Los siguientes comandos sirven para preparar otra org, por ejemplo el Playground
de una persona participante. Para la instancia del instructor ya conectada, usa
el alias `taller-lwc-flow-wise-raccoon` y los comandos del inicio de este README.

Desde la copia correspondiente a esa otra org:

```bash
sf org login web --alias lwc-flow-vacaciones --set-default
sf org display --target-org lwc-flow-vacaciones
sf project deploy start \
  --manifest manifest/package.xml \
  --target-org lwc-flow-vacaciones
sf org assign permset \
  --name Vacaciones_LWC_Flow_Taller \
  --target-org lwc-flow-vacaciones
```

Abrir el Flow activo:

```bash
sf org open \
  --path /flow/Solicitar_Vacaciones_LWC_Flow \
  --target-org lwc-flow-vacaciones
```

### Por qué el Flow está `Active`

Se entrega activo de forma intencional para una Developer Edition, Playground o
sandbox desechable del taller: después del deploy, la URL anterior funciona sin
un paso manual en Setup. En una org compartida o productiva conviene cambiar
`<status>Active</status>` a `Draft`, desplegar, probar con Debug y activar siguiendo
el proceso de gobierno de esa org. Un deploy activo también puede fallar si la
configuración de Process Automation de la org no permite desplegar Flows activos
o si existe una versión/automatización incompatible. El `deploy preview` ayuda a
detectar dependencias, pero no sustituye una validación contra la org destino.

Este repositorio no realiza ningún despliegue por sí solo. Antes de usar una org
compartida, resulta útil ejecutar un preview:

```bash
sf project deploy preview \
  --manifest manifest/package.xml \
  --target-org lwc-flow-vacaciones
```

## Contrato LWC → Flow

Los nombres y tipos deben coincidir en JavaScript, `js-meta.xml` y Flow:

| Propiedad | Tipo de Flow | Dirección | Variable de Flow | Campo de destino |
|---|---|---|---|---|
| `requestType` | String | entrada/salida | `vRequestType` | `Tipo__c` |
| `startDate` | Date | entrada/salida | `vStartDate` | `Fecha_Inicio__c` |
| `endDate` | Date | entrada/salida | `vEndDate` | `Fecha_Fin__c` |
| `comments` | String | entrada/salida | `vComments` | `Comentario_Empleado__c` |
| `daysRequested` | Integer | salida | `vDaysRequested` | Solo resumen; el campo es fórmula |
| `maxDays` | Integer | entrada | — | Configuración didáctica |
| `headline` | String | entrada | — | Configuración visual |

El componente mantiene valores privados y solicita los cambios al runtime con:

```js
this.dispatchEvent(
    new FlowAttributeChangeEvent('startDate', '2026-10-05')
);
```

Las fechas viajan como `YYYY-MM-DD`, no como objetos JavaScript `Date`.
`validate()` devuelve `{ isValid, errorMessage }`; Flow lo llama antes de avanzar.
La solución también implementa `setCustomValidity()` y `reportValidity()` para
mostrar errores internos y externos sin recibir a la persona con un error en la
primera carga.

## Qué hace el Flow incluido

1. Muestra `vacationRequestFlowScreen`.
2. Mapea explícitamente sus salidas a variables de Flow.
3. Muestra una pantalla de revisión. La persona puede volver y corregir.
4. Crea un registro `Solicitud_Vacaciones__c` con Create Records al enviar.
5. Asigna `Empleado__c = $User.Id`.
6. Asigna `Estado__c = "Pendiente de aprobación"`.
7. Deja que `Dias_Solicitados__c` se calcule como fórmula; nunca intenta escribirlo.
8. Muestra confirmación con el Id, el resumen y un enlace al registro.
9. Si el DML falla, usa un fault connector y muestra `$Flow.FaultMessage`.

## Agenda por checkpoints (6:00–8:00 pm)

Miércoles 30 de septiembre de 2026, presencial en The Meeting Room, 4.º piso de
The View Hotel, Plaza Covalia. Evento gratuito, con crepas y estacionamiento
gratuito.

### 6:00–6:10 · Registro, Wi-Fi y setup

- Abrir la org y el proyecto.
- Confirmar `sf org display`.
- Presentar el objeto incluido en el proyecto; no se requiere haber asistido a
  encuentros anteriores.
- Quien tenga un problema de ambiente trabaja en pareja; no se consume el taller
  reinstalando herramientas.

**Checkpoint 0:** todos pueden abrir la org y localizar el proyecto.

### 6:10–6:25 · Demo y arquitectura

- Recorrer la solución terminada sin enseñar todavía el código.
- Distinguir responsabilidades: LWC captura/valida; Flow orquesta/crea.
- Seguir una fecha desde el input hasta `Fecha_Inicio__c`.

**Checkpoint conceptual:** nadie agrega LDS, Apex ni DML al componente.

### 6:25–6:50 · Checkpoint 1: componente para Screen Flow

- Completar el handler genérico sin modificar propiedades `@api` directamente.
- Exponer con `lightning__FlowScreen`.
- Revisar el formulario y el layout responsive.

### 6:50–7:05 · Reactividad, outputs y validación

- Calcular lunes a viernes de manera reactiva.
- Emitir `FlowAttributeChangeEvent` para cada cambio y para el valor derivado.
- Implementar `validate()` para requeridos, pasado, orden, fin de semana y máximo.
- Revisar el estado visual válido/error.

**Prueba:** lunes a viernes devuelve 5; sábado y domingo no suman; un rango de
solo fin de semana no permite avanzar.

### 7:05–7:20 · Crepas, coffee break y networking

- Quien terminó prueba un rango que cruza dos fines de semana.
- Quien se quedó atrás copia únicamente la solución del TODO pendiente o trabaja
  desde el bundle final; no pierde el bloque de Flow.

### 7:20–7:45 · Checkpoint 2: Screen Flow, registro y manejo de fallas

- Revisar `inputOnly`, `outputOnly` y propiedades bidireccionales.
- Agregar el LWC a una pantalla.
- Mapear outputs a `vRequestType`, `vStartDate`, `vEndDate`, `vComments` y
  `vDaysRequested`.
- Configurar Create Records y el fault connector.

**Prueba:** Debug muestra valores en las variables y crea un único registro.

### 7:45–8:00 · Checkpoint 3: prueba final, bonus y preguntas

- Caso feliz.
- Inicio en el pasado.
- Fin anterior al inicio.
- Rango sin lunes–viernes.
- Más de 15 días hábiles.
- Falla controlada de permisos/validación y pantalla de error.
- Confirmar que el registro usa Estado = Pendiente de aprobación.
- Demo de una persona participante.
- Mostrar la conexión bonus con los Flows anteriores.
- Compartir starter, solución y checklist.

## Usar el starter

La carpeta `starter/vacationRequestFlowScreen` contiene una versión incompleta con
cinco TODOs, pero su HTML, XML y JavaScript tienen sintaxis válida. Para el evento:

1. Conserva este repositorio como solución del instructor.
2. Prepara una copia por asistente y conéctala a su propio Playground. Ajusta el
   alias de `.vscode/tasks.json`: las tareas de esta copia apuntan expresamente
   a la org del instructor y no deben reutilizarse sin ese cambio.
3. **Antes de sustituir el LWC**, despliega la solución completa con
   `manifest/package.xml` y asigna `Vacaciones_LWC_Flow_Taller` en ese Playground.
   El Permission Set depende también del Flow, la app y las pestañas: desplegar
   únicamente objeto y Permission Set no prepara todas sus dependencias.
4. Después, reemplaza solamente el bundle
   `force-app/main/default/lwc/vacationRequestFlowScreen` por los archivos de
   `starter/vacationRequestFlowScreen` en la copia del asistente. Allí se editan
   y despliegan los TODOs; editar directamente `starter/` no despliega cambios.
5. Construye un Flow propio en la UI durante el segundo checkpoint, con un API
   name distinto al de la solución final. Para recuperar un checkpoint, restaura
   el bundle final desde la copia del instructor, despliégalo en el Playground
   del asistente y usa el Flow final ya instalado.

Para dedicar la práctica a la integración, este starter ya incluye el helper
`calculateBusinessDays()` y la constante `MILLISECONDS_PER_DAY` de la solución.
Comprueba los casos de la slide: 5–9 de octubre de 2026 devuelve 5; 10–11 devuelve
0; un fin anterior al inicio devuelve 0; 5–26 devuelve 16. El TODO 3 continúa en
`recalculateDays()`: conectar las fechas privadas, actualizar `_daysRequested`
y notificar el resultado a Flow. Además del handler, llama a `recalculateDays()`
desde los setters de `startDate` y `endDate` y durante `connectedCallback()`:
así el resumen se restaura al volver desde Revisar solicitud. El límite didáctico
de 15 días se valida en el TODO 5; el helper cuenta los días, no aplica ese límite.

Evita que las carpetas `starter` y `force-app` tengan el mismo bundle dentro de un
mismo package directory: Flow Builder puede mostrar componentes duplicados con
labels confusos.

## Recuperación rápida

| Síntoma | Revisión / salida rápida |
|---|---|
| El LWC no aparece en Flow Builder | Despliega el bundle, confirma `lightning__FlowScreen` y refresca Builder. |
| “Invalid output attribute” | Compara nombre y tipo en JS, `js-meta.xml` y output mapping. Son sensibles a mayúsculas. |
| Variables llegan vacías | Confirma que cada handler emite `FlowAttributeChangeEvent` y que los outputs están mapeados. |
| Next avanza con fechas inválidas | `validate()` debe ser un método `@api`, no una arrow function. |
| Create Records falla | Revisa Permission Set, API names, valor exacto del picklist y `$Flow.FaultMessage`. |
| El cálculo difiere por un día | Usa fechas ISO a medianoche UTC; no conviertas Date de Salesforce a hora local. |
| El objeto ya existía | No lo recrees. Compara campos con el material anterior y despliega solo lo que falte. |
| Al volver se borran valores | Usa `UseStoredValues` y conserva el mapeo de outputs. |

El bundle final es el punto de rescate: si alguien no termina el JavaScript, puede
desplegarlo y continuar con la integración de Flow.

## Checklist de aceptación

- [ ] El componente aparece en una Screen Flow.
- [ ] El tipo por default es Vacaciones aunque el usuario no toque el combobox.
- [ ] El cálculo coincide con `Dias_Solicitados__c` para rangos de prueba.
- [ ] No cuenta sábados ni domingos.
- [ ] Bloquea inicio pasado, fin anterior y rango sin día hábil.
- [ ] Bloquea más de 15 días hábiles y lo identifica como regla didáctica.
- [ ] Flow recibe las cinco salidas.
- [ ] Se crea exactamente un registro.
- [ ] `Empleado__c` contiene al usuario actual.
- [ ] `Estado__c` queda Pendiente de aprobación.
- [ ] La pantalla final muestra Id y días.
- [ ] El fault connector presenta un error comprensible.

## Bonus: reconectar aprobación y notificación

La extensión natural es reutilizar lo construido en el workshop anterior:

1. Antes de Create Records, agrega Get Records sobre User con `Id = $User.Id`.
2. Si aquella org conserva `User.Gerente__c`, mapea ese valor a
   `Solicitud_Vacaciones__c.Gerente__c`.
3. Activa o adapta el record-triggered Flow que escucha solicitudes con Estado
   “Pendiente de aprobación” y notifica al gerente.
4. Reutiliza el Flow que, al cambiar a “Aprobado”, actualiza los días consumidos
   del empleado y envía la confirmación.

Ese bonus no forma parte del camino crítico. Requiere los campos personalizados
de User, el Custom Notification Type y la configuración de correo del taller
anterior. Mantenerlo fuera del núcleo permite que una org nueva complete el
ejercicio sin dependencias ocultas.

## Límites conscientes de la demo

- Los días hábiles excluyen sábado y domingo, no festivos.
- No se consulta saldo disponible en el núcleo.
- No se detectan solicitudes traslapadas.
- No se sustituye una política real de vacaciones.
- En producción, valida seguridad, sharing, calendario laboral, concurrencia,
  localización y reglas de RH con el área responsable.

Estas decisiones mantienen el caso entendible y permiten practicar LWC + Flow en
dos horas sin fingir que el ejemplo es un sistema completo de recursos humanos.
# SolicitudVacaciones
