<?php
/**
 * Plugin Name:       Blockparty Post Sharing
 * Description:       Add a block to copy and share the current post URL.
 * Version:           1.0.0
 * Requires at least: 6.8
 * Requires PHP:      8.1
 * Author:            BeAPI
 * Author URI:        https://beapi.fr
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       blockparty-post-sharing
 * Domain Path:       /languages
 *
 * @package Blockparty\PostSharing
 */

namespace Blockparty\PostSharing;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( is_readable( __DIR__ . '/vendor/autoload.php' ) ) {
	include_once __DIR__ . '/vendor/autoload.php';
}

define( 'BLOCKPARTY_POST_SHARING_VERSION', '1.0.0' );
define( 'BLOCKPARTY_POST_SHARING_URL', plugin_dir_url( __FILE__ ) );
define( 'BLOCKPARTY_POST_SHARING_DIR', plugin_dir_path( __FILE__ ) );
define( 'BLOCKPARTY_POST_SHARING_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Bootstrap the plugin.
 */
function init() {
	load_plugin_textdomain(
		'blockparty-post-sharing',
		false,
		dirname( BLOCKPARTY_POST_SHARING_PLUGIN_BASENAME ) . '/languages'
	);

	register_block_type(
		BLOCKPARTY_POST_SHARING_DIR . 'build/blockparty-post-sharing',
		[
			'render_callback' => [ BlockRenderer::class, 'render' ],
		]
	);

	wp_set_script_translations(
		'blockparty-post-sharing-button-editor-script',
		'blockparty-post-sharing',
		BLOCKPARTY_POST_SHARING_DIR . 'languages'
	);

	wp_set_script_translations(
		'blockparty-post-sharing-button-view-script',
		'blockparty-post-sharing',
		BLOCKPARTY_POST_SHARING_DIR . 'languages'
	);
}

add_action( 'init', __NAMESPACE__ . '\\init', 0 );

/**
 * Enqueue responsive display styles in the editor and on the front end.
 */
function enqueue_responsive_display_styles() {
	ResponsiveDisplay::enqueue_styles();
}

add_action( 'enqueue_block_assets', __NAMESPACE__ . '\\enqueue_responsive_display_styles' );
