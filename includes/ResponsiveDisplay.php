<?php

namespace Blockparty\PostSharing;

class ResponsiveDisplay {

	/**
	 * Default responsive breakpoint in pixels.
	 */
	public const DEFAULT_BREAKPOINT = 600;

	/**
	 * Default display settings per viewport.
	 *
	 * @return array{desktop: array{copy: bool, share: bool}, mobile: array{copy: bool, share: bool}}
	 */
	public static function get_default_display_settings(): array {
		return [
			'desktop' => [
				'copy'  => true,
				'share' => true,
			],
			'mobile'  => [
				'copy'  => true,
				'share' => true,
			],
		];
	}

	/**
	 * Normalize display settings from block attributes.
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return array{desktop: array{copy: bool, share: bool}, mobile: array{copy: bool, share: bool}}
	 */
	public static function get_display_settings( array $attributes ): array {
		$defaults = self::get_default_display_settings();
		$settings = isset( $attributes['displaySettings'] ) && is_array( $attributes['displaySettings'] )
			? $attributes['displaySettings']
			: [];

		foreach ( [ 'desktop', 'mobile' ] as $viewport ) {
			$settings[ $viewport ] = wp_parse_args(
				$settings[ $viewport ] ?? [],
				$defaults[ $viewport ]
			);
		}

		return [
			'desktop' => [
				'copy'  => (bool) $settings['desktop']['copy'],
				'share' => (bool) $settings['desktop']['share'],
			],
			'mobile'  => [
				'copy'  => (bool) $settings['mobile']['copy'],
				'share' => (bool) $settings['mobile']['share'],
			],
		];
	}

	/**
	 * Get the responsive breakpoint value.
	 *
	 * @return int
	 */
	public static function get_breakpoint(): int {
		/**
		 * Filter the responsive breakpoint used to toggle button visibility.
		 *
		 * @param int $breakpoint Breakpoint width in pixels.
		 */
		$breakpoint = (int) apply_filters(
			'blockparty_post_sharing_breakpoint',
			self::DEFAULT_BREAKPOINT
		);

		return max( 1, $breakpoint );
	}

	/**
	 * Build wrapper classes for responsive button visibility.
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string[]
	 */
	public static function get_wrapper_classes( array $attributes ): array {
		$settings = self::get_display_settings( $attributes );
		$classes  = [];

		if ( ! $settings['desktop']['copy'] ) {
			$classes[] = 'hide-copy-on-desktop';
		}

		if ( ! $settings['desktop']['share'] ) {
			$classes[] = 'hide-share-on-desktop';
		}

		if ( ! $settings['mobile']['copy'] ) {
			$classes[] = 'hide-copy-on-mobile';
		}

		if ( ! $settings['mobile']['share'] ) {
			$classes[] = 'hide-share-on-mobile';
		}

		return $classes;
	}

	/**
	 * Enqueue responsive display rules for the block stylesheet.
	 */
	public static function enqueue_styles(): void {
		$handle = 'blockparty-post-sharing-button-style';

		if ( ! wp_style_is( $handle, 'registered' ) ) {
			return;
		}

		$breakpoint       = self::get_breakpoint();
		$mobile_max_width = $breakpoint - 1;

		$css = sprintf(
			'@media (min-width: %1$dpx) {
				.wp-block-blockparty-post-sharing-button.hide-copy-on-desktop .wp-block-blockparty-post-sharing-button__copy {
					display: none !important;
				}
				.wp-block-blockparty-post-sharing-button.hide-share-on-desktop .wp-block-blockparty-post-sharing-button__share {
					display: none !important;
				}
			}
			@media (max-width: %2$dpx) {
				.wp-block-blockparty-post-sharing-button.hide-copy-on-mobile .wp-block-blockparty-post-sharing-button__copy {
					display: none !important;
				}
				.wp-block-blockparty-post-sharing-button.hide-share-on-mobile .wp-block-blockparty-post-sharing-button__share {
					display: none !important;
				}
			}',
			$breakpoint,
			$mobile_max_width
		);

		wp_add_inline_style( $handle, $css );
	}
}
