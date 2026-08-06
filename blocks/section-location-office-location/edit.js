import { useBlockProps, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, ToggleControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const {
		locationsHeading,
		officeLocations = [],
		mapIframeUrl,
		mapTitle
	} = attributes;

	// Update array item helper
	const updateOfficeLocation = (index, updates) => {
		const updated = [...officeLocations];
		updated[index] = { ...updated[index], ...updates };
		setAttributes({ officeLocations: updated });
	};

	// Remove array item helper
	const removeOfficeLocation = (index) => {
		setAttributes({ officeLocations: officeLocations.filter((_, i) => i !== index) });
	};

	// Add array item helper
	const addOfficeLocation = () => {
		setAttributes({
			officeLocations: [
				...officeLocations,
				{
					name: '',
					address: '',
					addressUrl: '',
					phoneNumber: '',
					phoneUrl: '',
					byAppointmentOnly: false,
					otherNumbers: []
				}
			]
		});
	};

	// Update an "Other Numbers" row within an office
	const updateOtherNumber = (officeIndex, otherIndex, updates) => {
		const updatedOthers = [...(officeLocations[officeIndex].otherNumbers || [])];
		updatedOthers[otherIndex] = { ...updatedOthers[otherIndex], ...updates };
		updateOfficeLocation(officeIndex, { otherNumbers: updatedOthers });
	};

	// Remove an "Other Numbers" row within an office
	const removeOtherNumber = (officeIndex, otherIndex) => {
		const updatedOthers = (officeLocations[officeIndex].otherNumbers || []).filter((_, i) => i !== otherIndex);
		updateOfficeLocation(officeIndex, { otherNumbers: updatedOthers });
	};

	// Add an "Other Numbers" row within an office
	const addOtherNumber = (officeIndex) => {
		const updatedOthers = [
			...(officeLocations[officeIndex].otherNumbers || []),
			{ iconUrl: '', iconId: 0, label: '', phoneNumber: '', phoneUrl: '' }
		];
		updateOfficeLocation(officeIndex, { otherNumbers: updatedOthers });
	};

	const blockProps = useBlockProps({
		className: 'section-location-office-location-editor',
		style: {
			padding: '20px',
			backgroundColor: '#f3f7fc',
			border: '1px solid #e8eaec',
			borderRadius: '8px'
		}
	});

	return (
		<Fragment>
			<InspectorControls>
				{/* Office Locations Section */}
				<PanelBody title={__('Office Locations', 'mbn-theme')} initialOpen={true}>
					<TextControl
						label={__('Section Heading', 'mbn-theme')}
						value={locationsHeading}
						onChange={(value) => setAttributes({ locationsHeading: value })}
					/>

					<div style={{ marginTop: '20px' }}>
						<strong>{__('Office Locations', 'mbn-theme')}</strong>
						{officeLocations.map((office, index) => (
							<div
								key={index}
								style={{
									border: '1px solid #ddd',
									padding: '12px',
									marginTop: '12px',
									borderRadius: '4px',
									backgroundColor: '#fff'
								}}
							>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
									<strong>{__('Office', 'mbn-theme')} {index + 1}</strong>
									<Button
										isDestructive
										isSmall
										onClick={() => removeOfficeLocation(index)}
									>
										{__('Remove', 'mbn-theme')}
									</Button>
								</div>

								<TextControl
									label={__('Office Name', 'mbn-theme')}
									value={office.name}
									onChange={(value) => updateOfficeLocation(index, { name: value })}
								/>

								<TextareaControl
									label={__('Address', 'mbn-theme')}
									value={office.address}
									onChange={(value) => updateOfficeLocation(index, { address: value })}
									rows={2}
								/>

								<TextControl
									label={__('Address URL (Optional)', 'mbn-theme')}
									value={office.addressUrl}
									onChange={(value) => updateOfficeLocation(index, { addressUrl: value })}
									help={__('Google Maps link for the address', 'mbn-theme')}
								/>

								<ToggleControl
									label={__('By Appointment Only', 'mbn-theme')}
									checked={office.byAppointmentOnly}
									onChange={(value) => updateOfficeLocation(index, { byAppointmentOnly: value })}
								/>

								{!office.byAppointmentOnly && (
									<Fragment>
										<TextControl
											label={__('Phone Number', 'mbn-theme')}
											value={office.phoneNumber}
											onChange={(value) => updateOfficeLocation(index, { phoneNumber: value })}
											placeholder="(480) 706-1100"
										/>

										<TextControl
											label={__('Phone URL', 'mbn-theme')}
											value={office.phoneUrl}
											onChange={(value) => updateOfficeLocation(index, { phoneUrl: value })}
											placeholder="tel:4807061100"
											help={__('Format: tel:PHONENUMBER (remove spaces and dashes)', 'mbn-theme')}
										/>
									</Fragment>
								)}

								<div style={{ marginTop: '16px' }}>
									<strong>{__('Other Numbers', 'mbn-theme')}</strong>
									{(office.otherNumbers || []).map((other, otherIndex) => (
										<div
											key={otherIndex}
											style={{
												border: '1px solid #eee',
												padding: '10px',
												marginTop: '8px',
												borderRadius: '4px'
											}}
										>
											<MediaUpload
												onSelect={(media) => updateOtherNumber(index, otherIndex, { iconUrl: media.url, iconId: media.id })}
												allowedTypes={['image']}
												value={other.iconId}
												render={({ open }) => (
													<div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
														{other.iconUrl && (
															<img
																src={other.iconUrl}
																alt=""
																style={{ display: 'block', width: '24px', height: '24px' }}
															/>
														)}
														<Button
															icon="upload"
															label={other.iconUrl ? __('Replace Icon', 'mbn-theme') : __('Select Icon', 'mbn-theme')}
															onClick={open}
															variant="secondary"
															isSmall
														/>
														{other.iconUrl && (
															<Button
																icon="trash"
																label={__('Remove Icon', 'mbn-theme')}
																onClick={() => updateOtherNumber(index, otherIndex, { iconUrl: '', iconId: 0 })}
																isDestructive
																isSmall
															/>
														)}
													</div>
												)}
											/>
											<TextControl
												label={__('Label', 'mbn-theme')}
												value={other.label}
												onChange={(value) => updateOtherNumber(index, otherIndex, { label: value.slice(0, 10) })}
												maxLength={10}
												help={__('Short label, e.g. "Fax" (max 10 characters).', 'mbn-theme')}
											/>
											<TextControl
												label={__('Phone Number', 'mbn-theme')}
												value={other.phoneNumber}
												onChange={(value) => updateOtherNumber(index, otherIndex, { phoneNumber: value })}
											/>
											<TextControl
												label={__('Phone URL', 'mbn-theme')}
												value={other.phoneUrl}
												onChange={(value) => updateOtherNumber(index, otherIndex, { phoneUrl: value })}
												placeholder="tel:4807061100"
												help={__('Format: tel:PHONENUMBER (remove spaces and dashes)', 'mbn-theme')}
											/>
											<Button isDestructive isSmall onClick={() => removeOtherNumber(index, otherIndex)}>
												{__('Remove', 'mbn-theme')}
											</Button>
										</div>
									))}
									<Button
										variant="secondary"
										isSmall
										onClick={() => addOtherNumber(index)}
										style={{ marginTop: '8px' }}
									>
										{__('+ Add Other Number', 'mbn-theme')}
									</Button>
								</div>
							</div>
						))}

						<Button
							isPrimary
							onClick={addOfficeLocation}
							style={{ marginTop: '12px' }}
						>
							{__('+ Add Office Location', 'mbn-theme')}
						</Button>
					</div>
				</PanelBody>

				{/* Map Section */}
				<PanelBody title={__('Map Embed', 'mbn-theme')} initialOpen={false}>
					<TextareaControl
						label={__('Map Iframe URL', 'mbn-theme')}
						value={mapIframeUrl}
						onChange={(value) => setAttributes({ mapIframeUrl: value })}
						rows={3}
						help={__('Google Maps embed URL', 'mbn-theme')}
					/>

					<TextControl
						label={__('Map Title (for accessibility)', 'mbn-theme')}
						value={mapTitle}
						onChange={(value) => setAttributes({ mapTitle: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div style={{ textAlign: 'center', padding: '40px 20px' }}>
					<h2 style={{ margin: '0 0 16px', fontSize: '28px', fontWeight: '600', color: '#13263e' }}>
						{locationsHeading || __('Office Locations', 'mbn-theme')}
					</h2>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '24px' }}>
						{officeLocations.map((office, index) => (
							<div
								key={index}
								style={{
									padding: '16px',
									backgroundColor: '#fff',
									border: '1px solid #e8eaec',
									borderRadius: '8px',
									textAlign: 'left'
								}}
							>
								<h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '700', color: '#286fb7' }}>
									{office.name || `${__('Office', 'mbn-theme')} ${index + 1}`}
								</h3>
								{office.byAppointmentOnly && (
									<p style={{ margin: '0 0 8px', fontSize: '12px', color: '#53585f' }}>
										{__('(By Appointment Only)', 'mbn-theme')}
									</p>
								)}
								{office.address && (
									<p style={{ margin: '0', fontSize: '13px', color: '#363b3f' }}>
										{office.address}
									</p>
								)}
								{office.phoneNumber && (
									<p style={{ margin: '4px 0 0', fontSize: '13px', color: '#363b3f' }}>
										{office.phoneNumber}
									</p>
								)}
							</div>
						))}
					</div>
					<div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fff', border: '1px solid #e8eaec', borderRadius: '8px' }}>
						<p style={{ margin: '0', fontSize: '14px', color: '#53585f' }}>
							📍 {__('Map Preview', 'mbn-theme')}: {officeLocations.length} {__('locations', 'mbn-theme')}
						</p>
					</div>
				</div>
			</div>
		</Fragment>
	);
}
