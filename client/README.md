# Web Components

Custom web components built with Vue Reactivity and lit-html.

## Components

- `<my-switch>` - A toggle switch component
- `<my-input>` - An input field component with required attribute support
- `<my-form>` - A form component

## Installation

### Using as ES Module

```html
<script type="module">
  import './dist/web-components.js';
</script>
```

### Using UMD (Universal Module Definition)

```html
<script src="./dist/web-components.umd.js"></script>
```

## Usage

### my-switch

A toggle switch component that displays ON/OFF states.

```html
<my-switch></my-switch>
<my-switch checked></my-switch>
```

**Attributes:**
- `checked` - When present, the switch is in the ON state

### my-input

An input field with a label and optional required indicator.

```html
<my-input></my-input>
<my-input required></my-input>
```

**Attributes:**
- `required` - When present, displays a red asterisk (*) next to the label

## Build

The components are bundled using Rollup and available in multiple formats:

- **ESM** (ES Modules): `dist/web-components.js` (with source maps)
- **ESM Minified**: `dist/web-components.min.js` (with source maps)
- **UMD**: `dist/web-components.umd.js` (for script tags, with source maps)
- **UMD Minified**: `dist/web-components.umd.min.js` (with source maps)

### Building from source

```bash
npm run build
```

## Dependencies

The components use:
- [lit-html](https://lit.dev/docs/libraries/standalone-templates/) for templating
- [@vue/reactivity](https://www.npmjs.com/package/@vue/reactivity) for reactive state management

All dependencies are bundled in the distribution files.
