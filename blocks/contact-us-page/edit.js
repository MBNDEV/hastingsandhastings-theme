import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, ToggleControl, Button, SelectControl, Spinner, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes }) {
	const {
		eyebrowText,
		heading,
		bodyText,
		phoneLabel,
		phoneNumber,
		phoneUrl,
		socialLabel,
		socialLinks,
		gravityFormId,
		locationsHeading,
		officeLocations,
		mapIframeUrl,
		mapTitle,
		badges
	} = attributes;

	const [activeSection, setActiveSection] = useState('hero');
	const [gravityForms, setGravityForms] = useState([]);
	const [isLoadingForms, setIsLoadingForms] = useState(false);

	// Fetch Gravity Forms
	useEffect(() => {
		setIsLoadingForms(true);

		const endpoints = [
			'/hastingsandhastings/v1/gravity-forms',
			'/gf/v2/forms',
			'/wp/v2/gf_form',
		];

		const tryFetchForms = async () => {
			for (const endpoint of endpoints) {
				try {
					const forms = await apiFetch({ path: endpoint });

					let formsList = forms;
					if (forms.forms) formsList = forms.forms;

					if (formsList && formsList.length > 0) {
						const formOptions = formsList.map((form) => ({
							label: form.title || form.name || `Form ${form.id}`,
							value: form.id.toString()
						}));
						setGravityForms([{ label: __('Select a form...', 'mbn-theme'), value: '' }, ...formOptions]);
						setIsLoadingForms(false);
						return;
					}
				} catch (error) {
					console.log(`Tried ${endpoint}:`, error.message);
					continue;
				}
			}

			setGravityForms([{ label: __('No forms found or Gravity Forms not active', 'mbn-theme'), value: '' }]);
			setIsLoadingForms(false);
		};

		tryFetchForms();
	}, []);

	// Update array item helper
	const updateArrayItem = (arrayName, index, updates) => {
		const array = attributes[arrayName];
		const updated = [...array];
		updated[index] = { ...updated[index], ...updates };
		setAttributes({ [arrayName]: updated });
	};

	// Remove array item helper
	const removeArrayItem = (arrayName, index) => {
		const array = attributes[arrayName];
		setAttributes({ [arrayName]: array.filter((_, i) => i !== index) });
	};

	// Add array item helper
	const addArrayItem = (arrayName, defaultItem) => {
    const array = attributes[arrayName] || [];
    setAttributes({ [arrayName]: [...array, defaultItem] });
  };

	const blockProps = useBlockProps({
		className: 'contact-us-page-block-editor',
		style: {
			padding: '20px',
			backgroundColor: '#f9f9f9',
			border: '1px solid #ddd'
		}
	});

	return (
		<Fragment>
			<InspectorControls>
				{/* Hero Section Controls */}
				<PanelBody title={__('Hero Section', 'mbn-theme')} initialOpen={activeSection === 'hero'}>
					<TextControl
						label={__('Eyebrow Text', 'mbn-theme')}
						value={eyebrowText}
						onChange={(value) => setAttributes({ eyebrowText: value })}
					/>
					<TextControl
						label={__('Heading', 'mbn-theme')}
						value={heading}
						onChange={(value) => setAttributes({ heading: value })}
					/>
					<TextareaControl
						label={__('Body Text', 'mbn-theme')}
						value={bodyText}
						onChange={(value) => setAttributes({ bodyText: value })}
						rows={4}
					/>
					<TextControl
						label={__('Phone Label', 'mbn-theme')}
						value={phoneLabel}
						onChange={(value) => setAttributes({ phoneLabel: value })}
					/>
					<TextControl
						label={__('Phone Number', 'mbn-theme')}
						value={phoneNumber}
						onChange={(value) => setAttributes({ phoneNumber: value })}
					/>
					<TextControl
						label={__('Phone URL', 'mbn-theme')}
						value={phoneUrl}
						onChange={(value) => setAttributes({ phoneUrl: value })}
						help={__('Format: tel:4807061100', 'mbn-theme')}
					/>
					<TextControl
						label={__('Social Label', 'mbn-theme')}
						value={socialLabel}
						onChange={(value) => setAttributes({ socialLabel: value })}
					/>

					<h4 style={{ marginTop: '20px', marginBottom: '10px' }}>{__('Social Media Links', 'mbn-theme')}</h4>
					{socialLinks.map((social, index) => (
						<div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#fff' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
								<strong>{__('Link', 'mbn-theme')} {index + 1}</strong>
								<Button
									icon="trash"
									label={__('Remove', 'mbn-theme')}
									onClick={() => removeArrayItem('socialLinks', index)}
									isDestructive
								/>
							</div>
							<TextControl
								label={__('Platform', 'mbn-theme')}
								value={social.platform}
								onChange={(value) => updateArrayItem('socialLinks', index, { platform: value })}
							/>
							<TextControl
								label={__('URL', 'mbn-theme')}
								value={social.url}
								onChange={(value) => updateArrayItem('socialLinks', index, { url: value })}
							/>
							<SelectControl
								label={__('Icon', 'mbn-theme')}
								value={social.icon}
								options={[
									{ label: 'LinkedIn', value: 'linkedin' },
									{ label: 'Facebook', value: 'facebook' },
									{ label: 'Instagram', value: 'instagram' },
									{ label: 'YouTube', value: 'youtube' }
								]}
								onChange={(value) => updateArrayItem('socialLinks', index, { icon: value })}
							/>
						</div>
					))}
					<Button
						variant="primary"
						onClick={() => addArrayItem('socialLinks', { platform: 'New Platform', url: '#', icon: 'linkedin' })}
					>
						{__('+ Add Social Link', 'mbn-theme')}
					</Button>
				</PanelBody>

				{/* Gravity Form Controls */}
				<PanelBody title={__('Contact Form', 'mbn-theme')} initialOpen={activeSection === 'form'}>
					{isLoadingForms ? (
						<Spinner />
					) : (
						<SelectControl
							label={__('Select Gravity Form', 'mbn-theme')}
							value={gravityFormId}
							options={gravityForms}
							onChange={(value) => setAttributes({ gravityFormId: value })}
							help={__('Choose a form from your Gravity Forms', 'mbn-theme')}
						/>
					)}
				</PanelBody>

				{/* Office Locations Controls */}
				<PanelBody title={__('Office Locations', 'mbn-theme')} initialOpen={activeSection === 'locations'}>
					<TextControl
						label={__('Section Heading', 'mbn-theme')}
						value={locationsHeading}
						onChange={(value) => setAttributes({ locationsHeading: value })}
					/>

					<h4 style={{ marginTop: '20px', marginBottom: '10px' }}>{__('Office List', 'mbn-theme')}</h4>
					<p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
						{__('Offices will be displayed in 3 columns. Leave phone fields empty for appointment-only locations.', 'mbn-theme')}
					</p>

					{officeLocations.map((office, index) => (
						<div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#fff' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
								<strong>{office.name || `${__('Office', 'mbn-theme')} ${index + 1}`}</strong>
								<Button
									icon="trash"
									label={__('Remove', 'mbn-theme')}
									onClick={() => removeArrayItem('officeLocations', index)}
									isDestructive
								/>
							</div>

							<TextControl
								label={__('Office Name', 'mbn-theme')}
								value={office.name}
								onChange={(value) => updateArrayItem('officeLocations', index, { name: value })}
							/>

							<TextareaControl
								label={__('Address', 'mbn-theme')}
								value={office.address}
								onChange={(value) => updateArrayItem('officeLocations', index, { address: value })}
								rows={2}
							/>

							<TextControl
								label={__('Address URL (optional)', 'mbn-theme')}
								value={office.addressUrl}
								onChange={(value) => updateArrayItem('officeLocations', index, { addressUrl: value })}
								help={__('Link to Google Maps or directions', 'mbn-theme')}
							/>

							<ToggleControl
								label={__('By Appointment Only', 'mbn-theme')}
								checked={office.byAppointmentOnly}
								onChange={(value) => updateArrayItem('officeLocations', index, { byAppointmentOnly: value })}
								help={__('Show "(By Appointment Only)" note', 'mbn-theme')}
							/>

							{!office.byAppointmentOnly && (
								<>
									<TextControl
										label={__('Phone Number', 'mbn-theme')}
										value={office.phoneNumber}
										onChange={(value) => updateArrayItem('officeLocations', index, { phoneNumber: value })}
										placeholder="(480) 706-1100"
									/>

									<TextControl
										label={__('Phone URL', 'mbn-theme')}
										value={office.phoneUrl}
										onChange={(value) => updateArrayItem('officeLocations', index, { phoneUrl: value })}
										help={__('Format: tel:4807061100', 'mbn-theme')}
									/>
								</>
							)}
						</div>
					))}

					<Button
						variant="primary"
						onClick={() => addArrayItem('officeLocations', {
							name: 'New Office',
							address: '',
							addressUrl: '',
							phoneNumber: '',
							phoneUrl: '',
							byAppointmentOnly: false
						})}
					>
						{__('+ Add Office Location', 'mbn-theme')}
					</Button>
				</PanelBody>

				{/* Map Controls */}
				<PanelBody title={__('Map', 'mbn-theme')} initialOpen={activeSection === 'map'}>
					<TextareaControl
						label={__('Map Iframe URL', 'mbn-theme')}
						value={mapIframeUrl}
						onChange={(value) => setAttributes({ mapIframeUrl: value })}
						rows={4}
						help={__('Paste the full iframe src URL from Google Maps embed', 'mbn-theme')}
					/>
					<TextControl
						label={__('Map Title (for accessibility)', 'mbn-theme')}
						value={mapTitle}
						onChange={(value) => setAttributes({ mapTitle: value })}
					/>
				</PanelBody>

				{/* Badges Controls */}
				<PanelBody title={__('Award Badges', 'mbn-theme')} initialOpen={activeSection === 'badges'}>
					{badges.map((badge, index) => (
						<div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#fff' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
								<strong>{__('Badge', 'mbn-theme')} {index + 1}</strong>
								<Button
									icon="trash"
									label={__('Remove', 'mbn-theme')}
									onClick={() => removeArrayItem('badges', index)}
									isDestructive
								/>
							</div>

							<TextareaControl
								label={__('Caption', 'mbn-theme')}
								value={badge.caption}
								onChange={(value) => updateArrayItem('badges', index, { caption: value })}
								rows={3}
							/>

							<p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
								{__('Note: Badge images will use fallback assets if not uploaded.', 'mbn-theme')}
							</p>
						</div>
					))}

					<Button
						variant="primary"
						onClick={() => addArrayItem('badges', { imageUrl: '', imageId: 0, caption: '' })}
					>
						{__('+ Add Badge', 'mbn-theme')}
					</Button>
				</PanelBody>
			</InspectorControls>

			{/* Editor Preview with Jump Targets */}
			<div {...blockProps}>
				<h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>
					{__('Contact Us Page', 'mbn-theme')}
				</h2>

				{/* Hero Section Preview */}
				<div
					onClick={() => setActiveSection('hero')}
					style={{
						padding: '20px',
						marginBottom: '15px',
						border: activeSection === 'hero' ? '2px solid #0073aa' : '1px solid #ccc',
						borderRadius: '4px',
						backgroundColor: '#fff',
						cursor: 'pointer'
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
						<h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
							<Icon icon="admin-users" style={{ marginRight: '8px' }} />
							{__('Hero Section', 'mbn-theme')}
						</h3>
						<Button
							variant="secondary"
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								setActiveSection('hero');
							}}
						>
							{__('Edit', 'mbn-theme')}
						</Button>
					</div>
					<div style={{ fontSize: '13px', color: '#666' }}>
						<p style={{ margin: '0 0 8px 0' }}>
							<strong>{__('Eyebrow:', 'mbn-theme')}</strong> {eyebrowText}
						</p>
						<p style={{ margin: '0 0 8px 0' }}>
							<strong>{__('Heading:', 'mbn-theme')}</strong> {heading}
						</p>
						<p style={{ margin: '0 0 8px 0' }}>
							<strong>{__('Phone:', 'mbn-theme')}</strong> {phoneNumber}
						</p>
						<p style={{ margin: '0' }}>
							<strong>{__('Social Links:', 'mbn-theme')}</strong> {socialLinks.length} {__('links', 'mbn-theme')}
						</p>
					</div>
				</div>

				{/* Form Section Preview */}
				<div
					onClick={() => setActiveSection('form')}
					style={{
						padding: '20px',
						marginBottom: '15px',
						border: activeSection === 'form' ? '2px solid #0073aa' : '1px solid #ccc',
						borderRadius: '4px',
						backgroundColor: '#fff',
						cursor: 'pointer'
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
						<h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
							<Icon icon="feedback" style={{ marginRight: '8px' }} />
							{__('Contact Form', 'mbn-theme')}
						</h3>
						<Button
							variant="secondary"
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								setActiveSection('form');
							}}
						>
							{__('Edit', 'mbn-theme')}
						</Button>
					</div>
					<div style={{ fontSize: '13px', color: '#666' }}>
						{gravityFormId ? (
							<p style={{ margin: 0 }}>
								<strong>{__('Form ID:', 'mbn-theme')}</strong> {gravityFormId}
							</p>
						) : (
							<p style={{ margin: 0, fontStyle: 'italic' }}>
								{__('No form selected', 'mbn-theme')}
							</p>
						)}
					</div>
				</div>

				{/* Office Locations Preview */}
				<div
					onClick={() => setActiveSection('locations')}
					style={{
						padding: '20px',
						marginBottom: '15px',
						border: activeSection === 'locations' ? '2px solid #0073aa' : '1px solid #ccc',
						borderRadius: '4px',
						backgroundColor: '#fff',
						cursor: 'pointer'
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
						<h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
							<Icon icon="location" style={{ marginRight: '8px' }} />
							{__('Office Locations', 'mbn-theme')}
						</h3>
						<Button
							variant="secondary"
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								setActiveSection('locations');
							}}
						>
							{__('Edit', 'mbn-theme')}
						</Button>
					</div>
					<div style={{ fontSize: '13px', color: '#666' }}>
						<p style={{ margin: '0 0 8px 0' }}>
							<strong>{__('Heading:', 'mbn-theme')}</strong> {locationsHeading}
						</p>
						<p style={{ margin: 0 }}>
							<strong>{__('Total Offices:', 'mbn-theme')}</strong> {officeLocations.length}
						</p>
					</div>
				</div>

				{/* Map Preview */}
				<div
					onClick={() => setActiveSection('map')}
					style={{
						padding: '20px',
						marginBottom: '15px',
						border: activeSection === 'map' ? '2px solid #0073aa' : '1px solid #ccc',
						borderRadius: '4px',
						backgroundColor: '#fff',
						cursor: 'pointer'
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
						<h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
							<Icon icon="location-alt" style={{ marginRight: '8px' }} />
							{__('Map', 'mbn-theme')}
						</h3>
						<Button
							variant="secondary"
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								setActiveSection('map');
							}}
						>
							{__('Edit', 'mbn-theme')}
						</Button>
					</div>
					<div style={{ fontSize: '13px', color: '#666' }}>
						<p style={{ margin: 0 }}>
							{mapIframeUrl ? __('Map configured', 'mbn-theme') : __('No map configured', 'mbn-theme')}
						</p>
					</div>
				</div>

				{/* Badges Preview */}
				<div
					onClick={() => setActiveSection('badges')}
					style={{
						padding: '20px',
						marginBottom: '15px',
						border: activeSection === 'badges' ? '2px solid #0073aa' : '1px solid #ccc',
						borderRadius: '4px',
						backgroundColor: '#fff',
						cursor: 'pointer'
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
						<h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
							<Icon icon="awards" style={{ marginRight: '8px' }} />
							{__('Award Badges', 'mbn-theme')}
						</h3>
						<Button
							variant="secondary"
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								setActiveSection('badges');
							}}
						>
							{__('Edit', 'mbn-theme')}
						</Button>
					</div>
					<div style={{ fontSize: '13px', color: '#666' }}>
						<p style={{ margin: 0 }}>
							<strong>{__('Total Badges:', 'mbn-theme')}</strong> {badges.length}
						</p>
					</div>
				</div>
			</div>
		</Fragment>
	);
}
