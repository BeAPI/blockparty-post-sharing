<?php

namespace Blockparty\PostSharing;

class BlockRenderer {

	/**
	 * Render post sharing block.
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string
	 */
	public static function render( $attributes ) {
		$post_id = get_the_ID();

		if ( ! $post_id ) {
			return '<!-- blockparty/post-sharing-button: no post context -->';
		}

		$url   = get_permalink( $post_id );
		$title = get_the_title( $post_id );

		if ( ! $url ) {
			return '<!-- blockparty/post-sharing-button: missing permalink -->';
		}

		$copy_label   = self::get_button_label(
			$attributes,
			'copyLabel',
			__( 'Copy link', 'blockparty-post-sharing' )
		);
		$share_label  = self::get_button_label(
			$attributes,
			'shareLabel',
			__( 'Share', 'blockparty-post-sharing' )
		);
		$copied_label = self::get_button_label(
			$attributes,
			'copiedLabel',
			__( 'Link copied', 'blockparty-post-sharing' )
		);

		$show_icon     = ! isset( $attributes['showIcon'] ) || $attributes['showIcon'];
		$icon_position = isset( $attributes['iconPosition'] ) ? (string) $attributes['iconPosition'] : 'left';

		$wrapper_classes = [];

		if ( ! $show_icon ) {
			$wrapper_classes[] = 'has-no-icons';
		}

		if ( $show_icon && 'right' === $icon_position ) {
			$wrapper_classes[] = 'has-icon-position-right';
		}

		$wrapper_classes = array_merge(
			$wrapper_classes,
			ResponsiveDisplay::get_wrapper_classes( $attributes )
		);

		$wrapper_attributes = [
			'data-url'          => esc_url( $url ),
			'data-title'        => esc_attr( $title ),
			'data-copied-label' => esc_attr( $copied_label ),
		];

		if ( ! empty( $wrapper_classes ) ) {
			$wrapper_attributes['class'] = implode( ' ', $wrapper_classes );
		}

		$html = '';

		$html .= sprintf(
			'<div %s>',
			get_block_wrapper_attributes( $wrapper_attributes )
		);

		$html .= '<div class="wp-block-blockparty-post-sharing-button__actions">';

		$html .= self::render_button( 'copy', 'copy', $copy_label, $show_icon );
		$html .= self::render_button( 'share', 'share', $share_label, $show_icon );

		$html .= '</div>';

		$html .= '<p class="wp-block-blockparty-post-sharing-button__status sr-only" data-role="status" aria-live="polite" hidden></p>';

		$html .= '</div>';

		return $html;
	}

	/**
	 * Resolve a button label from block attributes with a translated fallback.
	 *
	 * @param array  $attributes    Block attributes.
	 * @param string $attribute_key Attribute key.
	 * @param string $fallback      Translated fallback label.
	 *
	 * @return string
	 */
	private static function get_button_label( array $attributes, string $attribute_key, string $fallback ): string {
		$label = isset( $attributes[ $attribute_key ] ) ? trim( (string) $attributes[ $attribute_key ] ) : '';

		if ( '' !== $label ) {
			return $label;
		}

		return $fallback;
	}

	/**
	 * Render a single action button.
	 *
	 * @param string $modifier  Button modifier (copy or share).
	 * @param string $action    Data action attribute value.
	 * @param string $label     Button label.
	 * @param bool   $show_icon Whether to render the icon.
	 *
	 * @return string
	 */
	private static function render_button( string $modifier, string $action, string $label, bool $show_icon ): string {
		$icon_html = $show_icon
			? '<span class="wp-block-blockparty-post-sharing-button__icon" aria-hidden="true"></span>'
			: '';

		return sprintf(
			'<button type="button" class="wp-block-blockparty-post-sharing-button__%1$s" data-action="%2$s">%3$s<span class="wp-block-blockparty-post-sharing-button__label">%4$s</span></button>',
			esc_attr( $modifier ),
			esc_attr( $action ),
			$icon_html,
			wp_kses_post( $label )
		);
	}
}
