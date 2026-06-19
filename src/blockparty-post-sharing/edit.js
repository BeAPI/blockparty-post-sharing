/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { desktop, mobile } from '@wordpress/icons';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis -- ToggleGroupControl is the intended UI for display and icon position; allow until stable.
	__experimentalToggleGroupControl as ToggleGroupControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

const DEFAULT_DISPLAY_SETTINGS = {
	desktop: {
		copy: true,
		share: true,
	},
	mobile: {
		copy: true,
		share: true,
	},
};

/**
 * Normalize display settings from block attributes.
 *
 * @param {Object} displaySettings Display settings attribute.
 * @return {Object} Normalized display settings.
 */
function getDisplaySettings( displaySettings ) {
	return {
		desktop: {
			copy:
				displaySettings?.desktop?.copy ??
				DEFAULT_DISPLAY_SETTINGS.desktop.copy,
			share:
				displaySettings?.desktop?.share ??
				DEFAULT_DISPLAY_SETTINGS.desktop.share,
		},
		mobile: {
			copy:
				displaySettings?.mobile?.copy ??
				DEFAULT_DISPLAY_SETTINGS.mobile.copy,
			share:
				displaySettings?.mobile?.share ??
				DEFAULT_DISPLAY_SETTINGS.mobile.share,
		},
	};
}

/**
 * Build responsive display classes from display settings.
 *
 * @param {Object} displaySettings Display settings attribute.
 * @return {string[]} Display classes.
 */
function getDisplayClasses( displaySettings ) {
	const settings = getDisplaySettings( displaySettings );
	const classes = [];

	if ( ! settings.desktop.copy ) {
		classes.push( 'hide-copy-on-desktop' );
	}

	if ( ! settings.desktop.share ) {
		classes.push( 'hide-share-on-desktop' );
	}

	if ( ! settings.mobile.copy ) {
		classes.push( 'hide-copy-on-mobile' );
	}

	if ( ! settings.mobile.share ) {
		classes.push( 'hide-share-on-mobile' );
	}

	return classes;
}

/**
 * Update a single display setting value.
 *
 * @param {Function} setAttributes   Block attribute setter.
 * @param {Object}   displaySettings Current display settings.
 * @param {string}   viewport        Viewport key.
 * @param {string}   button          Button key.
 * @param {boolean}  value           New value.
 */
function updateDisplaySetting(
	setAttributes,
	displaySettings,
	viewport,
	button,
	value
) {
	setAttributes( {
		displaySettings: {
			...displaySettings,
			[ viewport ]: {
				...displaySettings?.[ viewport ],
				[ button ]: value,
			},
		},
	} );
}

/**
 * Render a single action button in the editor.
 *
 * @param {Object}   props             Component props.
 * @param {string}   props.className   Button CSS class.
 * @param {string}   props.label       Button label value.
 * @param {string}   props.placeholder Placeholder text.
 * @param {Function} props.onChange    Label change handler.
 * @param {boolean}  props.showIcon    Whether the icon is visible.
 * @param {string}   props.title       Button title attribute.
 * @return {Element} Element to render.
 */
function ActionButton( {
	className,
	label,
	placeholder,
	onChange,
	showIcon,
	title,
} ) {
	return (
		<button
			type="button"
			className={ className }
			onClick={ ( event ) => event.preventDefault() }
			title={ title }
		>
			{ showIcon && (
				<span
					className="wp-block-blockparty-post-sharing-button__icon"
					aria-hidden="true"
				/>
			) }
			<RichText
				tagName="span"
				className="wp-block-blockparty-post-sharing-button__label"
				value={ label }
				onChange={ onChange }
				placeholder={ placeholder }
				allowedFormats={ [] }
				withoutInteractiveFormatting
			/>
		</button>
	);
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Setter for block attributes.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		copyLabel,
		copiedLabel,
		shareLabel,
		showIcon,
		iconPosition,
		displaySettings = DEFAULT_DISPLAY_SETTINGS,
	} = attributes;
	const resolvedDisplaySettings = getDisplaySettings( displaySettings );
	const resolvedIconPosition = iconPosition || 'left';
	const [ displayContext, setDisplayContext ] = useState( 'desktop' );
	const viewportSettings = resolvedDisplaySettings[ displayContext ];

	const blockClassName = [
		'wp-block-blockparty-post-sharing-button',
		`is-display-preview-${ displayContext }`,
		showIcon === false ? 'has-no-icons' : '',
		showIcon && resolvedIconPosition === 'right'
			? 'has-icon-position-right'
			: '',
		...getDisplayClasses( displaySettings ),
	]
		.filter( Boolean )
		.join( ' ' );

	const blockProps = useBlockProps( {
		className: blockClassName,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Display', 'blockparty-post-sharing' ) }>
					<ToggleGroupControl
						__next40pxDefaultSize
						label={ __( 'Viewport', 'blockparty-post-sharing' ) }
						value={ displayContext }
						isBlock
						onChange={ setDisplayContext }
					>
						<ToggleGroupControlOptionIcon
							icon={ desktop }
							value="desktop"
							label={ __( 'Desktop', 'blockparty-post-sharing' ) }
						/>
						<ToggleGroupControlOptionIcon
							icon={ mobile }
							value="mobile"
							label={ __( 'Mobile', 'blockparty-post-sharing' ) }
						/>
					</ToggleGroupControl>
					<ToggleControl
						label={ __(
							'Display copy button',
							'blockparty-post-sharing'
						) }
						checked={ viewportSettings.copy }
						onChange={ ( value ) =>
							updateDisplaySetting(
								setAttributes,
								displaySettings,
								displayContext,
								'copy',
								value
							)
						}
					/>
					<ToggleControl
						label={ __(
							'Display share button',
							'blockparty-post-sharing'
						) }
						checked={ viewportSettings.share }
						onChange={ ( value ) =>
							updateDisplaySetting(
								setAttributes,
								displaySettings,
								displayContext,
								'share',
								value
							)
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Copy Button', 'blockparty-post-sharing' ) }
				>
					<TextControl
						__next40pxDefaultSize
						label={ __(
							'Copied link label',
							'blockparty-post-sharing'
						) }
						help={ __(
							'Text displayed on the copy button after the link is copied.',
							'blockparty-post-sharing'
						) }
						value={ copiedLabel || '' }
						placeholder={ __(
							'Link copied',
							'blockparty-post-sharing'
						) }
						onChange={ ( value ) =>
							setAttributes( { copiedLabel: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Icon', 'blockparty-post-sharing' ) }>
					<ToggleControl
						label={ __( 'Show icon', 'blockparty-post-sharing' ) }
						checked={ showIcon !== false }
						onChange={ ( value ) =>
							setAttributes( { showIcon: value } )
						}
					/>
					{ showIcon && (
						<ToggleGroupControl
							__next40pxDefaultSize
							isBlock
							label={ __(
								'Icon position',
								'blockparty-post-sharing'
							) }
							value={ resolvedIconPosition }
							disabled={ showIcon === false }
							onChange={ ( value ) =>
								setAttributes( { iconPosition: value } )
							}
						>
							<ToggleGroupControlOption
								label={ __(
									'Left',
									'blockparty-post-sharing'
								) }
								value="left"
							/>
							<ToggleGroupControlOption
								label={ __(
									'Right',
									'blockparty-post-sharing'
								) }
								value="right"
							/>
						</ToggleGroupControl>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="wp-block-blockparty-post-sharing-button__actions">
					<ActionButton
						className="wp-block-blockparty-post-sharing-button__copy"
						label={ copyLabel }
						placeholder={ __(
							'Copy link',
							'blockparty-post-sharing'
						) }
						onChange={ ( value ) =>
							setAttributes( { copyLabel: value } )
						}
						showIcon={ showIcon !== false }
						title={ __(
							'Copy action is available on the front end only.',
							'blockparty-post-sharing'
						) }
					/>
					<ActionButton
						className="wp-block-blockparty-post-sharing-button__share"
						label={ shareLabel }
						placeholder={ __( 'Share', 'blockparty-post-sharing' ) }
						onChange={ ( value ) =>
							setAttributes( { shareLabel: value } )
						}
						showIcon={ showIcon !== false }
						title={ __(
							'Share action is available on the front end only.',
							'blockparty-post-sharing'
						) }
					/>
				</div>
				<p
					className="wp-block-blockparty-post-sharing-button__status sr-only"
					aria-live="polite"
					hidden
				/>
			</div>
		</>
	);
}
