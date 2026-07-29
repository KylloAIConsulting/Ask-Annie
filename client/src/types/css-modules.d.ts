/**
 * Ambient type declaration for CSS Modules.
 *
 * Vite resolves *.module.css imports at build time and provides a typed
 * object of class-name strings. TypeScript needs this declaration to
 * recognise the default import without emitting any runtime code.
 *
 * The `Record<string, string>` shape means every key access returns
 * `string`, which matches the runtime behaviour of the CSS Modules
 * object (class names that have no match return `undefined` at runtime,
 * but in practice we only access keys that exist in the stylesheet).
 */
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
