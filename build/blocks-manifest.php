<?php
// This file is generated. Do not modify it manually.
return array(
	'blockparty-post-sharing' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'blockparty/post-sharing-button',
		'version' => '1.0.0',
		'title' => 'Post Sharing Button',
		'category' => 'widgets',
		'description' => 'Give users the opportunity to share your post with a single click.',
		'example' => array(
			
		),
		'attributes' => array(
			'copyLabel' => array(
				'type' => 'string',
				'default' => ''
			),
			'copiedLabel' => array(
				'type' => 'string',
				'default' => ''
			),
			'shareLabel' => array(
				'type' => 'string',
				'default' => ''
			),
			'showIcon' => array(
				'type' => 'boolean',
				'default' => true
			),
			'iconPosition' => array(
				'type' => 'string',
				'default' => 'left',
				'enum' => array(
					'left',
					'right'
				)
			),
			'displaySettings' => array(
				'type' => 'object',
				'default' => array(
					'desktop' => array(
						'copy' => true,
						'share' => true
					),
					'mobile' => array(
						'copy' => true,
						'share' => true
					)
				)
			)
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'blockparty-post-sharing',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
