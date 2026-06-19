/**
 * Front-end behavior for the post sharing block.
 */
import { __ } from '@wordpress/i18n';

/**
 * Copy text to the clipboard with a fallback for older browsers.
 *
 * @param {string} text Text to copy.
 */
async function copyToClipboard( text ) {
	if ( navigator.clipboard?.writeText ) {
		await navigator.clipboard.writeText( text );
		return;
	}

	const textarea = document.createElement( 'textarea' );
	textarea.value = text;
	textarea.setAttribute( 'readonly', '' );
	textarea.style.position = 'absolute';
	textarea.style.left = '-9999px';
	document.body.appendChild( textarea );
	textarea.select();
	const copied = document.execCommand( 'copy' );
	document.body.removeChild( textarea );

	if ( ! copied ) {
		throw new Error( 'Unable to copy to clipboard.' );
	}
}

/**
 * Temporarily update the copy button and screen reader status after success.
 *
 * @param {HTMLElement} copyButton  Copy button element.
 * @param {HTMLElement} statusEl    Screen reader status element.
 * @param {string}      copiedLabel Label to display after copy.
 */
function showCopySuccess( copyButton, statusEl, copiedLabel ) {
	const labelEl = copyButton.querySelector(
		'.wp-block-blockparty-post-sharing-button__label'
	);

	if ( ! labelEl ) {
		return;
	}

	const originalLabel = labelEl.textContent;

	labelEl.textContent = copiedLabel;
	copyButton.classList.add( 'is-copied' );
	statusEl.textContent = copiedLabel;
	statusEl.hidden = false;

	window.setTimeout( () => {
		labelEl.textContent = originalLabel;
		copyButton.classList.remove( 'is-copied' );
		statusEl.textContent = '';
		statusEl.hidden = true;
	}, 3000 );
}

/**
 * Show a temporary status message.
 *
 * @param {HTMLElement} statusEl Status element.
 * @param {string}      message  Message to display.
 */
function showStatus( statusEl, message ) {
	statusEl.textContent = message;
	statusEl.hidden = false;

	window.setTimeout( () => {
		statusEl.textContent = '';
		statusEl.hidden = true;
	}, 3000 );
}

/**
 * Initialize a single post sharing block instance.
 *
 * @param {HTMLElement} block Block wrapper element.
 */
function initBlock( block ) {
	const url = block.dataset.url;
	const title = block.dataset.title;
	const copyButton = block.querySelector( '[data-action="copy"]' );
	const status = block.querySelector( '[data-role="status"]' );

	if ( ! url || ! copyButton || ! status ) {
		return;
	}

	const shareButton = block.querySelector( '[data-action="share"]' );
	const copiedLabel =
		block.dataset.copiedLabel ||
		__( 'Link copied', 'blockparty-post-sharing' );

	if ( ! navigator.share && shareButton ) {
		shareButton.hidden = true;
	}

	copyButton.addEventListener( 'click', async () => {
		try {
			await copyToClipboard( url );
			showCopySuccess( copyButton, status, copiedLabel );
		} catch {
			showStatus(
				status,
				__( 'Unable to copy link', 'blockparty-post-sharing' )
			);
		}
	} );

	if ( shareButton && navigator.share ) {
		shareButton.addEventListener( 'click', async () => {
			try {
				const shareData = { url };

				if ( title ) {
					shareData.title = title;
				}

				if ( navigator.canShare && ! navigator.canShare( shareData ) ) {
					showStatus(
						status,
						__( 'Unable to share', 'blockparty-post-sharing' )
					);
					return;
				}

				await navigator.share( shareData );
			} catch ( error ) {
				if ( error?.name === 'AbortError' ) {
					return;
				}

				showStatus(
					status,
					__( 'Unable to share', 'blockparty-post-sharing' )
				);
			}
		} );
	}
}

document
	.querySelectorAll( '.wp-block-blockparty-post-sharing-button' )
	.forEach( initBlock );
