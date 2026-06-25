import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import metadata from './block.json';
import './style.css';

registerBlockType( metadata.name, {
	edit: function Edit( { attributes, setAttributes } ) {
		const { accordionItems } = attributes;

		const updateAccordionItem = ( itemIndex, updates ) => {
			const updatedItems = [ ...accordionItems ];
			updatedItems[ itemIndex ] = { ...updatedItems[ itemIndex ], ...updates };
			setAttributes( { accordionItems: updatedItems } );
		};

		const addAccordionItem = () => {
			const newItem = {
				id: Date.now().toString( 36 ) + Math.random().toString( 36 ).slice( 2 ),
				heading: '',
				images: [],
			};
			setAttributes( { accordionItems: [ ...accordionItems, newItem ] } );
		};

		const removeAccordionItem = ( itemIndex ) => {
			const updatedItems = accordionItems.filter( ( _, i ) => i !== itemIndex );
			setAttributes( { accordionItems: updatedItems } );
		};

		const duplicateAccordionItem = ( itemIndex ) => {
			const itemToDuplicate = {
				...accordionItems[ itemIndex ],
				id: Date.now().toString( 36 ) + Math.random().toString( 36 ).slice( 2 ),
			};
			const updatedItems = [
				...accordionItems.slice( 0, itemIndex + 1 ),
				itemToDuplicate,
				...accordionItems.slice( itemIndex + 1 ),
			];
			setAttributes( { accordionItems: updatedItems } );
		};

		const addImage = ( itemIndex ) => {
			const updatedItems = [ ...accordionItems ];
			const newImage = {
				id: Date.now().toString( 36 ) + Math.random().toString( 36 ).slice( 2 ),
				imageUrl: '',
				imageId: 0,
			};
			updatedItems[ itemIndex ].images = [
				...( updatedItems[ itemIndex ].images || [] ),
				newImage,
			];
			setAttributes( { accordionItems: updatedItems } );
		};

		const updateImage = ( itemIndex, imageIndex, updates ) => {
			const updatedItems = [ ...accordionItems ];
			updatedItems[ itemIndex ].images[ imageIndex ] = {
				...updatedItems[ itemIndex ].images[ imageIndex ],
				...updates,
			};
			setAttributes( { accordionItems: updatedItems } );
		};

		const removeImage = ( itemIndex, imageIndex ) => {
			const updatedItems = [ ...accordionItems ];
			updatedItems[ itemIndex ].images = updatedItems[ itemIndex ].images.filter(
				( _, i ) => i !== imageIndex
			);
			setAttributes( { accordionItems: updatedItems } );
		};

		const duplicateImage = ( itemIndex, imageIndex ) => {
			const updatedItems = [ ...accordionItems ];
			const imageToDuplicate = {
				...updatedItems[ itemIndex ].images[ imageIndex ],
				id: Date.now().toString( 36 ) + Math.random().toString( 36 ).slice( 2 ),
			};
			updatedItems[ itemIndex ].images = [
				...updatedItems[ itemIndex ].images.slice( 0, imageIndex + 1 ),
				imageToDuplicate,
				...updatedItems[ itemIndex ].images.slice( imageIndex + 1 ),
			];
			setAttributes( { accordionItems: updatedItems } );
		};

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Accordion Items', 'mbn-theme' ) } initialOpen={ true }>
						{ accordionItems.length === 0 && (
							<p style={ { marginBottom: '15px', fontSize: '13px', color: '#666' } }>
								{ __( 'No accordion items yet. Click "Add Accordion Item" to begin.', 'mbn-theme' ) }
							</p>
						) }

						{ accordionItems.map( ( item, itemIndex ) => (
							<div
								key={ item.id }
								style={ {
									marginBottom: '20px',
									padding: '15px',
									border: '1px solid #ddd',
									borderRadius: '4px',
									backgroundColor: '#fff',
								} }
							>
								<div
									style={ {
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginBottom: '10px',
									} }
								>
									<strong>
										{ __( 'Accordion Item', 'mbn-theme' ) } { itemIndex + 1 }
									</strong>
									<div style={ { display: 'flex', gap: '8px' } }>
										<Button
											icon="admin-page"
											label={ __( 'Duplicate', 'mbn-theme' ) }
											onClick={ () => duplicateAccordionItem( itemIndex ) }
										/>
										<Button
											icon="trash"
											label={ __( 'Remove', 'mbn-theme' ) }
											onClick={ () => removeAccordionItem( itemIndex ) }
										/>
									</div>
								</div>

								<TextControl
									label={ __( 'Heading', 'mbn-theme' ) }
									value={ item.heading || '' }
									onChange={ ( value ) => updateAccordionItem( itemIndex, { heading: value } ) }
									placeholder={ __( 'e.g., March 2022', 'mbn-theme' ) }
								/>

								<hr style={ { margin: '15px 0', borderColor: '#ddd' } } />

								<div style={ { marginTop: '15px' } }>
									<strong style={ { display: 'block', marginBottom: '10px' } }>
										{ __( 'Images', 'mbn-theme' ) }
									</strong>

									{ ( item.images || [] ).length === 0 && (
										<p style={ { fontSize: '12px', color: '#666', marginBottom: '10px' } }>
											{ __( 'No images yet. Click "Add Image" below.', 'mbn-theme' ) }
										</p>
									) }

									{ ( item.images || [] ).map( ( image, imageIndex ) => (
										<div
											key={ image.id }
											style={ {
												marginBottom: '12px',
												padding: '10px',
												border: '1px solid #e2e8f0',
												borderRadius: '4px',
												backgroundColor: '#f9fafb',
											} }
										>
											<div
												style={ {
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													marginBottom: '8px',
												} }
											>
												<span style={ { fontSize: '12px', fontWeight: '500' } }>
													{ __( 'Image', 'mbn-theme' ) } { imageIndex + 1 }
												</span>
												<div style={ { display: 'flex', gap: '4px' } }>
													<Button
														icon="admin-page"
														label={ __( 'Duplicate', 'mbn-theme' ) }
														onClick={ () => duplicateImage( itemIndex, imageIndex ) }
														style={ { padding: '4px' } }
													/>
													<Button
														icon="trash"
														label={ __( 'Remove', 'mbn-theme' ) }
														onClick={ () => removeImage( itemIndex, imageIndex ) }
														style={ { padding: '4px' } }
													/>
												</div>
											</div>

											<MediaUploadCheck>
												<MediaUpload
													onSelect={ ( media ) =>
														updateImage( itemIndex, imageIndex, {
															imageUrl: media.url,
															imageId: media.id,
														} )
													}
													allowedTypes={ [ 'image' ] }
													value={ image.imageId }
													render={ ( { open } ) => (
														<div>
															<Button onClick={ open } variant="secondary" style={ { fontSize: '12px' } }>
																{ image.imageUrl
																	? __( 'Replace Image', 'mbn-theme' )
																	: __( 'Select Image', 'mbn-theme' ) }
															</Button>
															{ image.imageUrl && (
																<img
																	src={ image.imageUrl }
																	alt=""
																	style={ {
																		marginTop: '8px',
																		maxWidth: '100%',
																		height: 'auto',
																		borderRadius: '4px',
																	} }
																/>
															) }
														</div>
													) }
												/>
											</MediaUploadCheck>
										</div>
									) ) }

									<Button
										variant="secondary"
										onClick={ () => addImage( itemIndex ) }
										style={ { marginTop: '10px', fontSize: '12px' } }
									>
										{ __( '+ Add Image', 'mbn-theme' ) }
									</Button>
								</div>
							</div>
						) ) }

						<Button variant="primary" onClick={ addAccordionItem } style={ { marginTop: '15px' } }>
							{ __( '+ Add Accordion Item', 'mbn-theme' ) }
						</Button>
					</PanelBody>
				</InspectorControls>

				<div { ...useBlockProps() }>
					<div className="handwritten-reviews">
						<div className="handwritten-reviews__container">
							<div
								style={ {
									padding: '20px',
									background: '#f0f0f0',
									borderRadius: '4px',
									textAlign: 'center',
								} }
							>
								<p style={ { margin: 0, color: '#666' } }>
									<strong>{ __( 'Handwritten Reviews Block', 'mbn-theme' ) }</strong>
								</p>
								<p style={ { margin: '8px 0 0', fontSize: '14px', color: '#666' } }>
									{ accordionItems.length }{ ' ' }
									{ accordionItems.length === 1
										? __( 'accordion item', 'mbn-theme' )
										: __( 'accordion items', 'mbn-theme' ) }
								</p>
								<p style={ { margin: '4px 0 0', fontSize: '12px', color: '#999' } }>
									{ __( 'Configure items in the sidebar →', 'mbn-theme' ) }
								</p>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	},

	save: () => null,
} );
