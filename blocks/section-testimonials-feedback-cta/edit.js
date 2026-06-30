import { useBlockProps, InspectorControls, RichText, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
  const {
    title,
    body,
    note,
    yelpLogoId,
    yelpLogoUrl,
    yelpButtonLabel,
    yelpButtonUrl,
    googleLogoId,
    googleLogoUrl,
    googleButtonLabel,
    googleButtonUrl,
  } = attributes;

  const blockProps = useBlockProps({ className: 'tfcta' });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Yelp Review', 'mbn-theme')} initialOpen={true}>
          <MediaUpload
            onSelect={(media) => setAttributes({ yelpLogoUrl: media.url, yelpLogoId: media.id })}
            allowedTypes={['image']}
            value={yelpLogoId}
            render={({ open }) => (
              <div style={{ marginBottom: '12px' }}>
                <Button onClick={open} variant="secondary">
                  {yelpLogoUrl ? __('Replace Yelp Logo', 'mbn-theme') : __('Select Yelp Logo', 'mbn-theme')}
                </Button>
                {yelpLogoUrl && (
                  <img src={yelpLogoUrl} alt="" style={{ marginTop: '8px', maxWidth: '120px', height: 'auto', display: 'block' }} />
                )}
              </div>
            )}
          />
          <TextControl
            label={__('Button Label', 'mbn-theme')}
            value={yelpButtonLabel}
            onChange={(value) => setAttributes({ yelpButtonLabel: value })}
          />
          <TextControl
            label={__('Button URL', 'mbn-theme')}
            value={yelpButtonUrl}
            onChange={(value) => setAttributes({ yelpButtonUrl: value })}
          />
        </PanelBody>

        <PanelBody title={__('Google Review', 'mbn-theme')} initialOpen={false}>
          <MediaUpload
            onSelect={(media) => setAttributes({ googleLogoUrl: media.url, googleLogoId: media.id })}
            allowedTypes={['image']}
            value={googleLogoId}
            render={({ open }) => (
              <div style={{ marginBottom: '12px' }}>
                <Button onClick={open} variant="secondary">
                  {googleLogoUrl ? __('Replace Google Logo', 'mbn-theme') : __('Select Google Logo', 'mbn-theme')}
                </Button>
                {googleLogoUrl && (
                  <img src={googleLogoUrl} alt="" style={{ marginTop: '8px', maxWidth: '120px', height: 'auto', display: 'block' }} />
                )}
              </div>
            )}
          />
          <TextControl
            label={__('Button Label', 'mbn-theme')}
            value={googleButtonLabel}
            onChange={(value) => setAttributes({ googleButtonLabel: value })}
          />
          <TextControl
            label={__('Button URL', 'mbn-theme')}
            value={googleButtonUrl}
            onChange={(value) => setAttributes({ googleButtonUrl: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="tfcta__container">
          <div className="tfcta__card">

            <div className="tfcta__text">
              <RichText
                tagName="h2"
                className="tfcta__title"
                value={title}
                onChange={(value) => setAttributes({ title: value })}
                placeholder={__('Enter title…', 'mbn-theme')}
              />
              <RichText
                tagName="p"
                className="tfcta__body"
                value={body}
                onChange={(value) => setAttributes({ body: value })}
                placeholder={__('Enter body text…', 'mbn-theme')}
              />
              <RichText
                tagName="p"
                className="tfcta__note"
                value={note}
                onChange={(value) => setAttributes({ note: value })}
                placeholder={__('Enter note text…', 'mbn-theme')}
              />
            </div>

            <div className="tfcta__platforms">
              <div className="tfcta__platform">
                {yelpLogoUrl ? (
                  <figure className="tfcta__logo">
                    <img src={yelpLogoUrl} alt="Yelp" />
                  </figure>
                ) : (
                  <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '13px', margin: '0 0 8px' }}>
                    {__('← Select Yelp logo in sidebar', 'mbn-theme')}
                  </p>
                )}
                <span className="tfcta__btn">{yelpButtonLabel}</span>
              </div>
              <div className="tfcta__platform tfcta__platform--divider">
                {googleLogoUrl ? (
                  <figure className="tfcta__logo">
                    <img src={googleLogoUrl} alt="Google" />
                  </figure>
                ) : (
                  <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '13px', margin: '0 0 8px' }}>
                    {__('← Select Google logo in sidebar', 'mbn-theme')}
                  </p>
                )}
                <span className="tfcta__btn">{googleButtonLabel}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Fragment>
  );
}
