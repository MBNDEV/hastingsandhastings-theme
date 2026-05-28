import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

export default function Edit({ attributes, setAttributes }) {
  const { mainMenuId, contactMenuId, mobileMenuId, logoFullUrl, logoFullId, logoMarkUrl, logoMarkId, buttonText, buttonUrl } = attributes;

  // Fetch available menus
  const menus = useSelect((select) => {
    const { getEntityRecords } = select('core');
    return getEntityRecords('taxonomy', 'nav_menu', { per_page: -1 }) || [];
  }, []);

  // Create menu options for SelectControl
  const menuOptions = [
    { label: __('— Select Menu —', 'mbn-theme'), value: 0 },
    ...menus.map((menu) => ({
      label: menu.name,
      value: menu.id,
    })),
  ];

  const blockProps = useBlockProps({
    className: 'header-navigation-block'
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Logo Settings', 'mbn-theme')} initialOpen={true}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: '600', marginBottom: '10px' }}>
              {__('Full Logo (Desktop Default)', 'mbn-theme')}
            </p>
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => setAttributes({ 
                  logoFullUrl: media.url,
                  logoFullId: media.id 
                })}
                allowedTypes={['image']}
                value={logoFullId}
                render={({ open }) => (
                  <div>
                    <Button onClick={open} variant="secondary" style={{ marginBottom: '10px' }}>
                      {logoFullUrl ? __('Replace Logo', 'mbn-theme') : __('Select Logo', 'mbn-theme')}
                    </Button>
                    {logoFullUrl && (
                      <>
                        <div style={{ marginBottom: '10px' }}>
                          <img src={logoFullUrl} alt="" style={{ maxWidth: '220px', height: 'auto', display: 'block' }} />
                        </div>
                        <Button 
                          onClick={() => setAttributes({ logoFullUrl: '', logoFullId: 0 })}
                          variant="link"
                          isDestructive
                        >
                          {__('Remove Logo', 'mbn-theme')}
                        </Button>
                      </>
                    )}
                  </div>
                )}
              />
            </MediaUploadCheck>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              {__('Recommended size: 220px × 35px', 'mbn-theme')}
            </p>
          </div>

          <div>
            <p style={{ fontWeight: '600', marginBottom: '10px' }}>
              {__('Compact Logo (Sticky/Mobile)', 'mbn-theme')}
            </p>
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => setAttributes({ 
                  logoMarkUrl: media.url,
                  logoMarkId: media.id 
                })}
                allowedTypes={['image']}
                value={logoMarkId}
                render={({ open }) => (
                  <div>
                    <Button onClick={open} variant="secondary" style={{ marginBottom: '10px' }}>
                      {logoMarkUrl ? __('Replace Logo', 'mbn-theme') : __('Select Logo', 'mbn-theme')}
                    </Button>
                    {logoMarkUrl && (
                      <>
                        <div style={{ marginBottom: '10px' }}>
                          <img src={logoMarkUrl} alt="" style={{ maxWidth: '42px', height: 'auto', display: 'block' }} />
                        </div>
                        <Button 
                          onClick={() => setAttributes({ logoMarkUrl: '', logoMarkId: 0 })}
                          variant="link"
                          isDestructive
                        >
                          {__('Remove Logo', 'mbn-theme')}
                        </Button>
                      </>
                    )}
                  </div>
                )}
              />
            </MediaUploadCheck>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              {__('Recommended size: 42px × 35px', 'mbn-theme')}
            </p>
          </div>
        </PanelBody>

        <PanelBody title={__('Menu Settings', 'mbn-theme')}>
          <SelectControl
            label={__('Main Menu', 'mbn-theme')}
            value={mainMenuId}
            options={menuOptions}
            onChange={(value) => setAttributes({ mainMenuId: parseInt(value) })}
            help={__('Select the menu for desktop navigation (Practice Areas, Locations, etc.)', 'mbn-theme')}
          />
          <SelectControl
            label={__('Contact Menu', 'mbn-theme')}
            value={contactMenuId}
            options={menuOptions}
            onChange={(value) => setAttributes({ contactMenuId: parseInt(value) })}
            help={__('Select the menu for contact navigation', 'mbn-theme')}
          />
          <SelectControl
            label={__('Mobile Menu', 'mbn-theme')}
            value={mobileMenuId}
            options={menuOptions}
            onChange={(value) => setAttributes({ mobileMenuId: parseInt(value) })}
            help={__('Select a different menu for mobile navigation (optional, defaults to Main Menu)', 'mbn-theme')}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '15px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
            <strong>{__('Tip:', 'mbn-theme')}</strong> {__('If Mobile Menu is not set, the Main Menu will be used for mobile devices.', 'mbn-theme')}
          </p>
        </PanelBody>

        <PanelBody title={__('Button Settings', 'mbn-theme')}>
          <TextControl
            label={__('Button Text', 'mbn-theme')}
            value={buttonText}
            onChange={(value) => setAttributes({ buttonText: value })}
          />
          <TextControl
            label={__('Button URL', 'mbn-theme')}
            value={buttonUrl}
            onChange={(value) => setAttributes({ buttonUrl: value })}
            type="url"
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div style={{ background: 'white', border: '2px solid #D5DADD', padding: '20px', borderRadius: '8px' }}>
          <div style={{ textAlign: 'center', color: '#53585F' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' }}>
              {__('📱 Header Navigation Block', 'mbn-theme')}
            </p>
            <p style={{ fontSize: '14px', marginBottom: '15px' }}>
              {__('Sticky after 100px scroll • Responsive • Mobile Menu', 'mbn-theme')}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '15px', flexWrap: 'wrap' }}>
              {logoFullUrl && (
                <div>
                  <p style={{ fontSize: '12px', marginBottom: '5px', color: '#666' }}>Full Logo:</p>
                  <img src={logoFullUrl} alt="Full Logo" style={{ maxWidth: '120px', height: 'auto' }} />
                </div>
              )}
              {logoMarkUrl && (
                <div>
                  <p style={{ fontSize: '12px', marginBottom: '5px', color: '#666' }}>Compact Logo:</p>
                  <img src={logoMarkUrl} alt="Compact Logo" style={{ maxWidth: '42px', height: 'auto' }} />
                </div>
              )}
            </div>

            <div style={{ fontSize: '13px', marginBottom: '15px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <span>
                {mainMenuId > 0 ? '✅ Main Menu' : '❌ Main Menu'}
              </span>
              <span>
                {contactMenuId > 0 ? '✅ Contact Menu' : '❌ Contact Menu'}
              </span>
              <span>
                {mobileMenuId > 0 ? '✅ Mobile Menu' : '📱 Mobile Menu (uses Main)'}
              </span>
            </div>
            
            <div style={{ 
              display: 'inline-block', 
              background: 'linear-gradient(234deg, #FDE212 -2.47%, #ECC806 35.13%, #A37005 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '88px',
              fontWeight: 'bold',
              fontSize: '14px',
              textTransform: 'uppercase'
            }}>
              {buttonText}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
