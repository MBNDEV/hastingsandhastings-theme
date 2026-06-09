import { useBlockProps, InspectorControls, RichText, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button, SelectControl, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes }) {
  const { 
    videoMp4Url, 
    videoWebmUrl, 
    enableGradientOverlay, 
    eyebrowText, 
    mainHeading, 
    subheadingText,
    gravityFormId
  } = attributes;

  const [gravityForms, setGravityForms] = useState([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);

  // Fetch Gravity Forms
  useEffect(() => {
    setIsLoadingForms(true);
    
    // Try multiple endpoints for Gravity Forms
    const endpoints = [
      '/hastingsandhastings/v1/gravity-forms', // Custom endpoint (most reliable)
      '/gf/v2/forms',                          // Gravity Forms REST API v2
      '/wp/v2/gf_form',                        // Alternative endpoint
    ];
    
    const tryFetchForms = async () => {
      for (const endpoint of endpoints) {
        try {
          const forms = await apiFetch({ path: endpoint });
          
          // Handle different response structures
          let formsList = forms;
          if (forms.forms) formsList = forms.forms; // Some endpoints wrap in 'forms' property
          
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
      
      // If all endpoints fail, show error
      setGravityForms([{ label: __('No forms found or Gravity Forms not active', 'mbn-theme'), value: '' }]);
      setIsLoadingForms(false);
    };
    
    tryFetchForms();
  }, []);

  const blockProps = useBlockProps({
    className: 'video-bg-form-section',
    style: {
      minHeight: '100vh',
      position: 'relative'
    }
  });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Video Background', 'mbn-theme')} initialOpen={true}>
          <MediaUpload
            onSelect={(media) => setAttributes({ videoMp4Url: media.url })}
            allowedTypes={['video']}
            render={({ open }) => (
              <div style={{ marginBottom: '15px' }}>
                <Button onClick={open} variant="secondary">
                  {videoMp4Url ? __('Replace MP4 Video', 'mbn-theme') : __('Select MP4 Video', 'mbn-theme')}
                </Button>
                {videoMp4Url && (
                  <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    {videoMp4Url.split('/').pop()}
                  </p>
                )}
              </div>
            )}
          />
          
          <MediaUpload
            onSelect={(media) => setAttributes({ videoWebmUrl: media.url })}
            allowedTypes={['video']}
            render={({ open }) => (
              <div style={{ marginBottom: '15px' }}>
                <Button onClick={open} variant="secondary">
                  {videoWebmUrl ? __('Replace WebM Video', 'mbn-theme') : __('Select WebM Video (Optional)', 'mbn-theme')}
                </Button>
                {videoWebmUrl && (
                  <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    {videoWebmUrl.split('/').pop()}
                  </p>
                )}
              </div>
            )}
          />
          
          <ToggleControl
            label={__('Enable Gradient Overlay', 'mbn-theme')}
            checked={enableGradientOverlay}
            onChange={(value) => setAttributes({ enableGradientOverlay: value })}
            help={__('Add a dark gradient overlay on the video', 'mbn-theme')}
          />
        </PanelBody>

        <PanelBody title={__('Content', 'mbn-theme')}>
          <TextControl
            label={__('Eyebrow Text', 'mbn-theme')}
            value={eyebrowText}
            onChange={(value) => setAttributes({ eyebrowText: value })}
          />
          
          <TextControl
            label={__('Main Heading', 'mbn-theme')}
            value={mainHeading}
            onChange={(value) => setAttributes({ mainHeading: value })}
          />
          
          <TextControl
            label={__('Subheading Text', 'mbn-theme')}
            value={subheadingText}
            onChange={(value) => setAttributes({ subheadingText: value })}
            help={__('Brief description below the heading', 'mbn-theme')}
          />
        </PanelBody>

        <PanelBody title={__('Gravity Form', 'mbn-theme')}>
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
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            {__('Add custom classes to fields: gfield_email_with_help, gfield_phone_with_help, gf_name_group', 'mbn-theme')}
          </p>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        {/* Video Background Preview */}
        {videoMp4Url && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            pointerEvents: 'none'
          }}>
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            >
              <source src={videoMp4Url} type="video/mp4" />
            </video>
          </div>
        )}
        
        {/* Gradient Overlay */}
        {enableGradientOverlay && (
          <div className="gradient-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(13, 40, 71, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
            pointerEvents: 'none'
          }} />
        )}
        
        <div className="form-section-container">
          <div className="form-container">
          {/* Form Header */}
          <div className="form-header">
            <div className="form-header-content">
              {eyebrowText && (
                <p className="form-eyebrow">
                  {eyebrowText}
                </p>
              )}
              
              {mainHeading && (
                <h1 className="form-main-heading">
                  {mainHeading}
                </h1>
              )}
              
              {subheadingText && (
                <p className="form-subheading">
                  {subheadingText}
                </p>
              )}
            </div>
          </div>

          {/* Form Preview */}
          <div className="form-placeholder">
            {gravityFormId ? (
              <p style={{ margin: 0 }}>
                {__('Gravity Form', 'mbn-theme')} #{gravityFormId}<br />
                <small style={{ opacity: 0.7 }}>{__('(Preview in frontend)', 'mbn-theme')}</small>
              </p>
            ) : (
              <p style={{ margin: 0, opacity: 0.7 }}>
                {__('No Gravity Form selected', 'mbn-theme')}
              </p>
            )}
          </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
