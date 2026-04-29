# Parcial Jeffrey Diaz

Aplicación Angular que consume datos de usuarios y repositorios y presenta dos enfoques de patrón maestro-detalle:

- Usuarios: maestro-detalle con componentes (sin navegación por URL para el detalle).
- Repositorios: maestro-detalle con navegación por rutas (routerLink).

## 1. Requisitos de versión

### Angular

- Angular CLI: `21.2.8`
- Angular framework (`@angular/*`): `21.2.x`

### Node.js y npm

- Node.js requerido para Angular 21: `>= 20.19.0` (recomendado usar Node 22 LTS).
- npm en este proyecto: `11.12.1` (definido en `packageManager`: `npm@11.12.1`).

### Verificar versiones instaladas

```bash
node -v
npm -v
npx ng version
```

## 2. Instalación y ejecución del proyecto

### 2.1 Clonar y entrar al proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd parcial_jeffrey_diaz
```

### 2.2 Instalar dependencias

```bash
npm install
```

### 2.3 Levantar servidor de desarrollo

```bash
npm start
```

o equivalente:

```bash
npx ng serve
```

### 2.4 Abrir en navegador

- URL local: `http://localhost:4200/`

El proyecto recarga automáticamente al detectar cambios en archivos fuente.

## 3. Ejecución de pruebas unitarias

Este proyecto está configurado para pruebas unitarias con **Karma + Jasmine** (no con Vitest como runner activo).

### 3.1 Ejecutar toda la suite

```bash
npm test
```

o equivalente:

```bash
npx ng test
```

### 3.2 Ejecutar en modo no interactivo (útil para CI)

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

### 3.3 Ejecutar un spec puntual

```bash
npx ng test --include="src/app/repository/repository-list/repository-list.component.spec.ts" --watch=false --browsers=ChromeHeadless
```

También puedes aplicar ese mismo patrón para cualquier otro archivo `*.spec.ts`.

## 4. Scripts npm disponibles

```json
{
	"start": "ng serve",
	"build": "ng build",
	"watch": "ng build --watch --configuration development",
	"test": "ng test"
}
```

Comandos útiles:

- Build de producción:

```bash
npm run build
```

- Build en modo desarrollo observando cambios:

```bash
npm run watch
```

## 5. Estructura del proyecto

```text
.
├─ angular.json
├─ karma.conf.js
├─ package.json
├─ public/
├─ src/
│  ├─ index.html
│  ├─ main.ts
│  ├─ styles.css
│  ├─ app/
│  │  ├─ app-module.ts
│  │  ├─ app-routing-module.ts
│  │  ├─ app.ts
│  │  ├─ repository/
│  │  │  ├─ repository.model.ts
│  │  │  ├─ repository.module.ts
│  │  │  ├─ repository.routing.module.ts
│  │  │  ├─ repository.service.ts
│  │  │  ├─ repository-list/
│  │  │  └─ repository-detail/
│  │  └─ user/
│  │     ├─ user.model.ts
│  │     ├─ user.module.ts
│  │     ├─ user.service.ts
│  │     ├─ user-list/
│  │     └─ user-detail/
│  └─ environments/
│     ├─ environment.ts
│     └─ environment.development.ts
└─ tsconfig*.json
```

## 6. Patrón maestro-detalle implementado

### 6.1 Detalle de usuario: maestro-detalle con componentes (sin URL)

La vista de usuario sigue un enfoque de maestro-detalle **por composición de componentes**:

- El componente maestro (`user-list`) mantiene el usuario seleccionado.
- El detalle se renderiza en el mismo contexto visual usando `<app-user-detail>`.
- El dato viaja por `@Input()` (`[userDetail]="selectedUser!"`).
- **No fue necesario `@Output()`**, porque la interacción principal es selección desde la lista hacia el detalle, sin eventos de retorno obligatorios para resolver la funcionalidad solicitada.

Esto cumple la indicación de resolver el detalle de usuario con componentes y no mediante rutas URL.

### 6.2 Detalle de repositorio: maestro-detalle con URLs (ruteo)

La vista de repositorios implementa maestro-detalle **mediante navegación por rutas**:

- Desde la lista, cada repositorio navega con `routerLink` a `['/repositories', repo.id]`.
- El módulo de ruteo de repositorios define:
	- `path: ''` para la lista.
	- `path: ':id'` para el detalle.

Este enfoque usa URL para representar el recurso seleccionado y cumple la indicación de maestro-detalle por ruteo, no por comunicación directa de componentes para el detalle.

## 7. Referencias rápidas

- Documentación Angular CLI: https://angular.dev/tools/cli
- Comandos Angular disponibles:

```bash
npx ng --help
```
