# Terminol

Extensión de Raycast (TypeScript + React) que se publicará en la Raycast Store.

## Comandos

- `npm run dev` — abre la extensión en Raycast en modo desarrollo con recarga automática
- `npm run build` — compila y valida la extensión
- `npm run lint` / `npm run fix-lint` — valida `package.json`, iconos, ESLint y Prettier
- `npm run publish` — publica en la Raycast Store (abre un PR en `raycast/extensions`)

Ejecuta `npm run build` y `npm run lint` antes de dar un cambio por terminado.

## Estructura

- `package.json` — manifiesto de la extensión. Cada comando en `commands` necesita un archivo `src/<name>.tsx` con un `export default`.
- `src/` — un archivo por comando.
- `assets/extension-icon.png` — icono de 512×512 (ahora es provisional).
- `CHANGELOG.md` — obligatorio para la Store; añade una entrada en cada cambio visible para el usuario.
- `raycast-env.d.ts` — se genera automáticamente; no lo edites ni lo subas al repo.

## Convenciones

- Los textos visibles para el usuario van en español.
- Usa los componentes de `@raycast/api` (`Detail`, `List`, `Form`, `ActionPanel`…) y los hooks de `@raycast/utils` en lugar de reimplementarlos.
- `typescript` debe quedarse por debajo de 6.1 (lo exige `@raycast/eslint-config`), y `@types/react`/`@types/node` deben coincidir con las peerDependencies de `@raycast/api`.
- Antes de publicar, `author` en `package.json` tiene que ser el usuario real de raycast.com.

## Git

- No añadas nunca la línea `Co-Authored-By: Claude ...` ni ninguna otra atribución a Claude en los mensajes de commit ni en las descripciones de PR.
- Escribe los mensajes de commit en español.
