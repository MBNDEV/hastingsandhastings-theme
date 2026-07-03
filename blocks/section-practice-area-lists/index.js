import { registerBlockType } from '@wordpress/blocks';
import { 
	useBlockProps, 
	InspectorControls, 
	MediaUpload 
} from '@wordpress/block-editor';
import { 
	PanelBody, 
	TextControl, 
	TextareaControl, 
	Button,
	Icon 
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n'
import { Fragment, useState } from '@wordpress/element';
import metadata from './block.json';

/**
 * Generate a unique ID for new items
 */
function generateUniqueId() {
	return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * Editor component for Section - Practice Area Lists block
 */
function Edit( { attributes, setAttributes } ) {
	const { categories } = attributes;
	const [ activeSection, setActiveSection ] = useState( null );

	const blockProps = useBlockProps( {
		className: 'pal-practice-area-editor',
	} );

	/**
	 * Update a specific category
	 */
	const updateCategory = ( index, updates ) => {
		const updatedCategories = [ ...categories ];
		updatedCategories[ index ] = { 
			...updatedCategories[ index ], 
			...updates 
		};
		setAttributes( { categories: updatedCategories } );
	};

	/**
	 * Add a new category
	 */
	const addCategory = () => {
		setAttributes( {
			categories: [
				...categories,
				{
					id: generateUniqueId(),
					title: '',
					description: '',
					imageUrl: '',
					imageId: 0,
					links: []
				}
			]
		} );
	};

	/**
	 * Remove a category
	 */
	const removeCategory = ( index ) => {
		const updatedCategories = categories.filter( ( _, i ) => i !== index );
		setAttributes( { categories: updatedCategories } );
	};

	/**
	 * Duplicate a category
	 */
	const duplicateCategory = ( index ) => {
		const categoryToDuplicate = { 
			...categories[ index ], 
			id: generateUniqueId() 
		};
		const updatedCategories = [
			...categories.slice( 0, index + 1 ),
			categoryToDuplicate,
			...categories.slice( index + 1 )
		];
		setAttributes( { categories: updatedCategories } );
	};

	/**
	 * Update a specific link within a category
	 */
	const updateLink = ( categoryIndex, linkIndex, updates ) => {
		const updatedCategories = [ ...categories ];
		const updatedLinks = [ ...( updatedCategories[ categoryIndex ].links || [] ) ];
		updatedLinks[ linkIndex ] = { 
			...updatedLinks[ linkIndex ], 
			...updates 
		};
		updatedCategories[ categoryIndex ] = {
			...updatedCategories[ categoryIndex ],
			links: updatedLinks
		};
		setAttributes( { categories: updatedCategories } );
	};

	/**
	 * Add a new link to a category
	 */
	const addLink = ( categoryIndex ) => {
		const updatedCategories = [ ...categories ];
		updatedCategories[ categoryIndex ] = {
			...updatedCategories[ categoryIndex ],
			links: [
				...( updatedCategories[ categoryIndex ].links || [] ),
				{
					id: generateUniqueId(),
					text: '',
					url: '#'
				}
			]
		};
		setAttributes( { categories: updatedCategories } );
	};

	/**
	 * Remove a link from a category
	 */
	const removeLink = ( categoryIndex, linkIndex ) => {
		const updatedCategories = [ ...categories ];
		updatedCategories[ categoryIndex ] = {
			...updatedCategories[ categoryIndex ],
			links: updatedCategories[ categoryIndex ].links.filter( ( _, i ) => i !== linkIndex )
		};
		setAttributes( { categories: updatedCategories } );
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody 
					title={ __( 'Practice Area Categories', 'mbn-theme' ) } 
					initialOpen={ true }
				>
					<p style={ { marginBottom: '15px', fontSize: '13px', color: '#666' } }>
						{ __( 'Manage practice area categories. Click a category below to edit its content.', 'mbn-theme' ) }
					</p>

					{ categories.map( ( category, categoryIndex ) => (
						<PanelBody
							key={ category.id }
              title={ category.title || sprintf( __( 'Category %d', 'mbn-theme' ), categoryIndex + 1 ) }
							initialOpen={ activeSection === categoryIndex }
							onToggle={ () => setActiveSection( activeSection === categoryIndex ? null : categoryIndex ) }
						>
							<div style={ { marginBottom: '15px' } }>
								<div style={ { display: 'flex', gap: '8px', marginBottom: '15px' } }>
									<Button
										icon="admin-page"
										label={ __( 'Duplicate', 'mbn-theme' ) }
										onClick={ () => duplicateCategory( categoryIndex ) }
									/>
									<Button
										icon="trash"
										label={ __( 'Remove', 'mbn-theme' ) }
										isDestructive
										onClick={ () => removeCategory( categoryIndex ) }
									/>
								</div>

								<TextControl
									label={ __( 'Category Title', 'mbn-theme' ) }
									value={ category.title }
									onChange={ ( value ) => updateCategory( categoryIndex, { title: value } ) }
									placeholder={ __( 'e.g., Vehicle Accidents', 'mbn-theme' ) }
								/>

								<TextareaControl
									label={ __( 'Description', 'mbn-theme' ) }
									value={ category.description }
									onChange={ ( value ) => updateCategory( categoryIndex, { description: value } ) }
									rows={ 3 }
									placeholder={ __( 'Brief description of this practice area...', 'mbn-theme' ) }
								/>

								<div style={ { marginTop: '15px', marginBottom: '15px' } }>
									<label style={ { display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '12px' } }>
										{ __( 'Category Image', 'mbn-theme' ) }
									</label>
									<MediaUpload
										onSelect={ ( media ) => updateCategory( categoryIndex, { 
											imageUrl: media.url, 
											imageId: media.id 
										} ) }
										allowedTypes={ [ 'image' ] }
										value={ category.imageId }
										render={ ( { open } ) => (
											<div>
												<Button 
													onClick={ open } 
													variant="secondary"
													style={ { marginBottom: '10px' } }
												>
													{ category.imageUrl 
														? __( 'Replace Image', 'mbn-theme' ) 
														: __( 'Select Image', 'mbn-theme' ) 
													}
												</Button>
												{ category.imageUrl && (
													<div>
														<img 
															src={ category.imageUrl } 
															alt="" 
															style={ { 
																maxWidth: '100%', 
																height: 'auto', 
																borderRadius: '4px',
																marginTop: '10px' 
															} } 
														/>
														<Button
															isDestructive
															isSmall
															onClick={ () => updateCategory( categoryIndex, { 
																imageUrl: '', 
																imageId: 0 
															} ) }
															style={ { marginTop: '8px' } }
														>
															{ __( 'Remove Image', 'mbn-theme' ) }
														</Button>
													</div>
												) }
											</div>
										) }
									/>
								</div>

								<div style={ { 
									marginTop: '20px', 
									paddingTop: '20px', 
									borderTop: '1px solid #ddd' 
								} }>
									<label style={ { 
										display: 'block', 
										marginBottom: '12px', 
										fontWeight: 600, 
										fontSize: '13px' 
									} }>
										{ __( 'Practice Area Links', 'mbn-theme' ) }
									</label>

									{ category.links && category.links.length > 0 ? (
										<div style={ { marginBottom: '15px' } }>
											{ category.links.map( ( link, linkIndex ) => (
												<div 
													key={ link.id }
													style={ { 
														border: '1px solid #ddd', 
														padding: '12px', 
														marginBottom: '10px',
														borderRadius: '4px',
														backgroundColor: '#f9f9f9'
													} }
												>
													<div style={ { 
														display: 'flex', 
														justifyContent: 'space-between', 
														alignItems: 'center',
														marginBottom: '10px'
													} }>
														<strong style={ { fontSize: '12px' } }>
															{ __( 'Link', 'mbn-theme' ) } { linkIndex + 1 }
														</strong>
														<Button
															icon="trash"
															label={ __( 'Remove', 'mbn-theme' ) }
															isSmall
															isDestructive
															onClick={ () => removeLink( categoryIndex, linkIndex ) }
														/>
													</div>

													<TextControl
														label={ __( 'Link Text', 'mbn-theme' ) }
														value={ link.text }
														onChange={ ( value ) => updateLink( categoryIndex, linkIndex, { text: value } ) }
														placeholder={ __( 'e.g., Car Accidents', 'mbn-theme' ) }
													/>

													<TextControl
														label={ __( 'Link URL', 'mbn-theme' ) }
														value={ link.url }
														onChange={ ( value ) => updateLink( categoryIndex, linkIndex, { url: value } ) }
														placeholder={ __( 'https://...', 'mbn-theme' ) }
													/>
												</div>
											) ) }
										</div>
									) : (
										<p style={ { 
											fontSize: '12px', 
											color: '#666', 
											fontStyle: 'italic',
											marginBottom: '12px'
										} }>
											{ __( 'No links added yet.', 'mbn-theme' ) }
										</p>
									) }

									<Button 
										variant="secondary" 
										onClick={ () => addLink( categoryIndex ) }
									>
										{ __( '+ Add Link', 'mbn-theme' ) }
									</Button>
								</div>
							</div>
						</PanelBody>
					) ) }

					<Button 
						variant="primary" 
						onClick={ addCategory } 
						style={ { marginTop: '15px', width: '100%' } }
					>
						{ __( '+ Add Category', 'mbn-theme' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div style={ { 
					padding: '40px', 
					backgroundColor: '#f5f5f5', 
					border: '2px dashed #ccc',
					borderRadius: '8px'
				} }>
					<div style={ { 
						display: 'flex', 
						alignItems: 'center', 
						gap: '12px',
						marginBottom: '20px'
					} }>
						<Icon icon="list-view" />
						<h3 style={ { margin: 0, fontSize: '18px' } }>
							{ __( 'Practice Area Lists', 'mbn-theme' ) }
						</h3>
					</div>

					{ categories.length > 0 ? (
						<div style={ { display: 'flex', flexDirection: 'column', gap: '16px' } }>
							{ categories.map( ( category, index ) => (
								<div 
									key={ category.id }
									onClick={ () => setActiveSection( index ) }
									style={ { 
										padding: '20px',
										backgroundColor: activeSection === index ? '#fff' : '#fafafa',
										border: activeSection === index ? '2px solid #2271b1' : '1px solid #ddd',
										borderRadius: '6px',
										cursor: 'pointer',
										transition: 'all 0.2s ease'
									} }
								>
									<div style={ { 
										display: 'flex', 
										justifyContent: 'space-between',
										alignItems: 'flex-start',
										gap: '16px'
									} }>
										<div style={ { flex: 1 } }>
											<h4 style={ { 
												margin: '0 0 8px 0', 
												fontSize: '16px',
												fontWeight: 600,
												color: '#1e1e1e'
											} }>
                        { category.title || sprintf( __( 'Category %d', 'mbn-theme' ), index + 1 ) }
											</h4>
											{ category.description && (
												<p style={ { 
													margin: '0 0 12px 0', 
													fontSize: '13px',
													color: '#666',
													lineHeight: '1.5'
												} }>
													{ category.description }
												</p>
											) }
											<p style={ { 
												margin: 0, 
												fontSize: '12px',
												color: '#999'
											} }>
												{ category.links?.length || 0 } { __( 'links', 'mbn-theme' ) }
											</p>
										</div>
										{ category.imageUrl && (
											<img 
												src={ category.imageUrl } 
												alt=""
												style={ { 
													width: '100px',
													height: '60px',
													objectFit: 'cover',
													borderRadius: '4px'
												} }
											/>
										) }
									</div>
								</div>
							) ) }
						</div>
					) : (
						<p style={ { 
							margin: 0, 
							fontSize: '14px',
							color: '#666',
							fontStyle: 'italic'
						} }>
							{ __( 'No categories added yet. Use the sidebar to add categories.', 'mbn-theme' ) }
						</p>
					) }
				</div>
			</div>
		</Fragment>
	);
}

// Register the block
registerBlockType( metadata.name, {
	edit: Edit,
	save: () => null, // Dynamic block - rendered via PHP
} );
