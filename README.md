# Blockparty — Post Sharing

[![Test with WordPress Playground](https://img.shields.io/badge/Test%20with-WordPress%20Playground-0073aa?style=for-the-badge&logo=wordpress&logoColor=white)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/BeAPI/blockparty-post-sharing/refs/heads/develop/.wordpress-org/blueprints/blueprint.json)

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/gpl-2.0)
[![WordPress: 6.8+](https://img.shields.io/badge/WordPress-6.8+-green.svg)](https://wordpress.org/)
[![PHP: 8.1+](https://img.shields.io/badge/PHP-8.1+-purple.svg)](https://php.net/)

A WordPress plugin that adds a Gutenberg block to copy and share the current post URL in one click.

## 📋 Description

Blockparty Post Sharing is a WordPress plugin that lets editors add sharing actions to posts via the block editor. Visitors can copy the article link to the clipboard or open the native share sheet of their device when supported.

### ✨ Features

- **Native Gutenberg block**: Full integration with the WordPress block editor
- **Copy link**: Copies the current post permalink to the clipboard with visual and screen reader feedback
- **Native share**: Uses the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) when available
- **Editable labels**: Customize button text inline with `RichText`
- **Copied state label**: Configure the label shown after a successful copy
- **Icons**: Default icons rendered with CSS `mask-image`, overridable via CSS custom properties
- **Icon settings**: Show or hide icons and position them left or right
- **Responsive display**: Show or hide each button independently on desktop and mobile
- **Dynamic rendering**: Server-side output with post URL and title context
- **Internationalized**: Multilingual support with translation files
- **View script**: Frontend script handles copy, share, and copied-state UI

## 🔧 Requirements

- **WordPress**: Version 6.8 or higher
- **PHP**: Version 8.1 or higher
- **PHP Extension**: ext-json

## 📦 Installation

### Installation via Composer

```bash
composer require beapi/blockparty-post-sharing
```

### Manual Installation

1. Download the latest version of the plugin
2. Extract the archive to the `/wp-content/plugins/` folder
3. Activate the plugin from the WordPress "Plugins" menu

### Development Installation

```bash
# Clone the repository
git clone https://github.com/BeAPI/blockparty-post-sharing.git
cd blockparty-post-sharing

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Build the assets
npm run build
```

## 🚀 Usage

1. Open the Gutenberg block editor on a post
2. Add a **Post Sharing Button** block (search for "Post Sharing" in the Widgets category)
3. Customize the block:
   - **Copy link** and **Share** button labels directly in the editor
   - **Display**: choose desktop or mobile viewport and toggle each button visibility
   - **Copy Button**: set the label displayed after the link is copied
   - **Icon**: show or hide icons and choose left or right position
4. On the frontend:
   - **Copy link** copies the current post URL
   - **Share** opens the native share dialog when the browser supports it

### Responsive breakpoint

The desktop/mobile breakpoint defaults to `600px`. Themes and plugins can override it with:

```php
add_filter( 'blockparty_post_sharing_breakpoint', function () {
	return 782;
} );
```

- **Filter name:** `blockparty_post_sharing_breakpoint`
- **Parameters:** `int` — Breakpoint width in pixels.
- **Default:** `600`

### Icon customization

Default icons are exposed as CSS custom properties on `.wp-block-blockparty-post-sharing-button`:

```css
.wp-block-blockparty-post-sharing-button {
	--wp-block-blockparty-post-sharing-button-copy-icon: url( '/path/to/link.svg' );
	--wp-block-blockparty-post-sharing-button-share-icon: url( '/path/to/share.svg' );
	--wp-block-blockparty-post-sharing-button-check-icon: url( '/path/to/check.svg' );
	--wp-block-blockparty-post-sharing-button-icon-size: 1.25rem;
	--wp-block-blockparty-post-sharing-button-icon-color: currentColor;
}
```

## 🛠️ Development

### Project Structure

```
blockparty-post-sharing/
├── src/                              # Block sources
│   └── blockparty-post-sharing/
│       ├── block.json                # Block configuration
│       ├── edit.js                   # Edit component
│       ├── index.js                  # Entry point
│       ├── view.js                   # Frontend copy/share logic
│       ├── img/                      # Default SVG icons
│       ├── editor.scss               # Editor styles
│       └── style.scss                # Frontend and editor styles
├── includes/                         # PHP classes
│   ├── BlockRenderer.php             # Dynamic block rendering
│   └── ResponsiveDisplay.php         # Responsive visibility rules
├── build/                            # Compiled assets (blocks-manifest.php, etc.)
├── languages/                        # Translation files
├── .wordpress-org/blueprints/        # WordPress Playground blueprint
├── blockparty-post-sharing.php       # Main plugin file
├── composer.json                     # PHP dependencies
└── package.json                      # JavaScript dependencies
```

### Available Scripts

#### JavaScript

```bash
# Development with hot reload
npm start

# Production build
npm run build

# JavaScript linter
npm run lint:js

# CSS linter
npm run lint:css

# Code formatting
npm run format

# Generate POT file
npm run make-pot

# Generate JSON translation files
npm run make-json

# Create plugin ZIP archive
npm run plugin-zip

# Start local development environment
npm run start:env

# Stop local development environment
npm run stop:env
```

#### PHP

```bash
# Check code with PHP_CodeSniffer
composer cs

# Automatically fix code
composer cb

# Run unit tests
composer phpunit
```

### Coding Standards

The project follows WordPress coding standards:

- **WPCS** (WordPress Coding Standards) for PHP
- **ESLint** with WordPress rules for JavaScript
- **GrumPHP** to automate pre-commit checks

### Development Environment Setup

The plugin uses `@wordpress/env` to create a local WordPress development environment:

```bash
# Start the environment
npm run start:env

# Access WordPress
# URL: http://localhost:8888
# Default credentials: admin / password

# Stop the environment
npm run stop:env
```

## 🔍 Code Quality

The project integrates several quality tools:

- **PHP_CodeSniffer**: PHP coding standards verification
- **PHPCompatibility**: PHP compatibility verification
- **PHP Parallel Lint**: PHP syntax error detection
- **GrumPHP**: Pre-commit checks automation

## 🌍 Internationalization

The plugin is fully internationalized (text domain: `blockparty-post-sharing`). Translation files are available in the `languages/` folder.

### Available Languages

- English (default)
- French (when translation files are provided)

### Adding a Translation

1. Use the `languages/blockparty-post-sharing.pot` file as a base
2. Create your `.po` and `.mo` files
3. Place them in the `languages/` folder

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Make sure your code:

- Follows WordPress coding standards
- Passes all quality tests (PHPCS, ESLint)
- Is properly documented
- Includes translations if necessary

## 📄 License

This plugin is distributed under the GPL-2.0-or-later license.

## 👥 Authors

**Be API Technical Team**

- Email: <technical@beapi.fr>
- Website: [https://beapi.fr](https://beapi.fr)

## 🔗 Useful Links

- [WordPress Block Editor Documentation](https://developer.wordpress.org/block-editor/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [Web Share API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

## 📝 Changelog

See [readme.txt](readme.txt) for the full version history. Recent highlights:

- **1.0.0**
  - Initial release with copy and share buttons, editable labels, icons, responsive display settings, and WordPress Playground blueprint.

---

Developed with ❤️ by [Be API](https://beapi.fr)
