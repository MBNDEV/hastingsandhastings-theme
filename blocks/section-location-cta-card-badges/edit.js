import { useBlockProps, InspectorControls, RichText, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect } from '@wordpress/element';

// Generate unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export default function Edit({ attributes, setAttributes }) {
  const {
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaButtonUrl,
    ctaPhoneLabel,
    ctaPhoneText,
    ctaPhoneUrl,
    ctaBackgroundImageUrl,
    ctaBackgroundImageId,
    ctaLogoImageUrl,
    ctaLogoImageId,
    badgesTextParagraphs,
    badgesItems,
  } = attributes;

  const blockProps = useBlockProps();

  // Ensure all items have unique IDs
  useEffect(() => {
    let needsUpdate = false;
    
    const updatedParagraphs = badgesTextParagraphs.map(p => {
      if (!p.id) {
        needsUpdate = true;
        return { ...p, id: generateUniqueId() };
      }
      return p;
    });
    
    const updatedBadges = badgesItems.map(b => {
      if (!b.id) {
        needsUpdate = true;
        return { ...b, id: generateUniqueId() };
      }
      return b;
    });
    
    if (needsUpdate) {
      setAttributes({
        badgesTextParagraphs: updatedParagraphs,
        badgesItems: updatedBadges
      });
    }
  }, [badgesTextParagraphs, badgesItems, setAttributes]);

  // Helper to update paragraph
  const updateParagraph = (index, updates) => {
    const updated = [...badgesTextParagraphs];
    updated[index] = { ...updated[index], ...updates };
    setAttributes({ badgesTextParagraphs: updated });
  };

  // Helper to add paragraph
  const addParagraph = () => {
    setAttributes({
      badgesTextParagraphs: [...badgesTextParagraphs, { id: generateUniqueId(), text: '' }]
    });
  };

  // Helper to remove paragraph
  const removeParagraph = (index) => {
    const updated = badgesTextParagraphs.filter((_, i) => i !== index);
    setAttributes({ badgesTextParagraphs: updated });
  };

  // Helper to update badge
  const updateBadge = (index, updates) => {
    const updated = [...badgesItems];
    updated[index] = { ...updated[index], ...updates };
    setAttributes({ badgesItems: updated });
  };

  // Helper to add badge
  const addBadge = () => {
    setAttributes({
      badgesItems: [...badgesItems, {
        id: generateUniqueId(),
        imageUrl: '',
        imageId: 0,
        imageFallback: '',
        imageAlt: '',
        imageWidth: 303,
        imageHeight: 303
      }]
    });
  };

  // Helper to remove badge
  const removeBadge = (index) => {
    const updated = badgesItems.filter((_, i) => i !== index);
    setAttributes({ badgesItems: updated });
  };

  return (
    <Fragment>
      <InspectorControls>
        {/* CTA Card Settings */}
        <PanelBody title={__('CTA Card Content', 'mbn-theme')} initialOpen={true}>
          <TextControl
            label={__('Title', 'mbn-theme')}
            value={ctaTitle}
            onChange={(value) => setAttributes({ ctaTitle: value })}
          />
          <TextareaControl
            label={__('Description', 'mbn-theme')}
            value={ctaDescription}
            onChange={(value) => setAttributes({ ctaDescription: value })}
            rows={4}
          />
          <TextControl
            label={__('Button Text', 'mbn-theme')}
            value={ctaButtonText}
            onChange={(value) => setAttributes({ ctaButtonText: value })}
          />
          <TextControl
            label={__('Button URL', 'mbn-theme')}
            value={ctaButtonUrl}
            onChange={(value) => setAttributes({ ctaButtonUrl: value })}
          />
        </PanelBody>

        {/* Phone Settings */}
        <PanelBody title={__('Phone Number', 'mbn-theme')} initialOpen={false}>
          <TextControl
            label={__('Phone Label', 'mbn-theme')}
            value={ctaPhoneLabel}
            onChange={(value) => setAttributes({ ctaPhoneLabel: value })}
          />
          <TextControl
            label={__('Phone Text', 'mbn-theme')}
            value={ctaPhoneText}
            onChange={(value) => setAttributes({ ctaPhoneText: value })}
          />
          <TextControl
            label={__('Phone URL', 'mbn-theme')}
            value={ctaPhoneUrl}
            onChange={(value) => setAttributes({ ctaPhoneUrl: value })}
            help={__('Format: tel:1234567890', 'mbn-theme')}
          />
        </PanelBody>

        {/* Background Image */}
        <PanelBody title={__('Background Image', 'mbn-theme')} initialOpen={false}>
          <MediaUpload
            onSelect={(media) => setAttributes({
              ctaBackgroundImageUrl: media.url,
              ctaBackgroundImageId: media.id
            })}
            allowedTypes={['image']}
            value={ctaBackgroundImageId}
            render={({ open }) => (
              <div>
                <Button onClick={open} variant="primary">
                  {ctaBackgroundImageUrl ? __('Replace Image', 'mbn-theme') : __('Select Image', 'mbn-theme')}
                </Button>
                {ctaBackgroundImageUrl && (
                  <img src={ctaBackgroundImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }} />
                )}
              </div>
            )}
          />
        </PanelBody>

        {/* Logo Image */}
        <PanelBody title={__('Logo Image', 'mbn-theme')} initialOpen={false}>
          <MediaUpload
            onSelect={(media) => setAttributes({
              ctaLogoImageUrl: media.url,
              ctaLogoImageId: media.id
            })}
            allowedTypes={['image']}
            value={ctaLogoImageId}
            render={({ open }) => (
              <div>
                <Button onClick={open} variant="primary">
                  {ctaLogoImageUrl ? __('Replace Logo', 'mbn-theme') : __('Select Logo', 'mbn-theme')}
                </Button>
                {ctaLogoImageUrl && (
                  <img src={ctaLogoImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }} />
                )}
              </div>
            )}
          />
        </PanelBody>

        {/* Badges Text Paragraphs */}
        <PanelBody title={__('Badges Text Paragraphs', 'mbn-theme')} initialOpen={false}>
          {badgesTextParagraphs.map((paragraph, index) => (
            <div key={paragraph.id || index} style={{ marginBottom: '15px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong>{__('Paragraph', 'mbn-theme')} {index + 1}</strong>
                <Button
                  icon="trash"
                  label={__('Remove', 'mbn-theme')}
                  onClick={() => removeParagraph(index)}
                  isDestructive
                />
              </div>
              <TextareaControl
                label={__('Text', 'mbn-theme')}
                value={paragraph.text || ''}
                onChange={(value) => updateParagraph(index, { text: value })}
                rows={3}
              />
            </div>
          ))}
          <Button variant="primary" onClick={addParagraph}>
            {__('+ Add Paragraph', 'mbn-theme')}
          </Button>
        </PanelBody>

        {/* Badge Images */}
        <PanelBody title={__('Badge Images', 'mbn-theme')} initialOpen={false}>
          {badgesItems.map((badge, index) => (
            <div key={badge.id || index} style={{ marginBottom: '15px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong>{__('Badge', 'mbn-theme')} {index + 1}</strong>
                <Button
                  icon="trash"
                  label={__('Remove', 'mbn-theme')}
                  onClick={() => removeBadge(index)}
                  isDestructive
                />
              </div>
              <MediaUpload
                onSelect={(media) => updateBadge(index, {
                  imageUrl: media.url,
                  imageId: media.id,
                  imageWidth: media.width || 303,
                  imageHeight: media.height || 303
                })}
                allowedTypes={['image']}
                value={badge.imageId}
                render={({ open }) => (
                  <div>
                    <Button onClick={open} variant="secondary">
                      {badge.imageUrl ? __('Replace Image', 'mbn-theme') : __('Select Image', 'mbn-theme')}
                    </Button>
                    {badge.imageUrl && (
                      <img src={badge.imageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }} />
                    )}
                  </div>
                )}
              />
              <TextControl
                label={__('Alt Text', 'mbn-theme')}
                value={badge.imageAlt || ''}
                onChange={(value) => updateBadge(index, { imageAlt: value })}
                style={{ marginTop: '10px' }}
              />
            </div>
          ))}
          <Button variant="primary" onClick={addBadge}>
            {__('+ Add Badge', 'mbn-theme')}
          </Button>
        </PanelBody>
      </InspectorControls>

      {/* Block Preview */}
      <div {...blockProps}>
        <div style={{ padding: '20px', border: '2px dashed #ccc', borderRadius: '4px', backgroundColor: '#f5f5f5' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
            {ctaTitle || __('CTA Card with Badges', 'mbn-theme')}
          </h3>
          {ctaDescription && (
            <p style={{ margin: '0 0 15px 0', color: '#666' }}>
              {ctaDescription}
            </p>
          )}
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ display: 'block', marginBottom: '5px' }}>{__('Paragraphs:', 'mbn-theme')} {badgesTextParagraphs.length}</strong>
            <strong style={{ display: 'block' }}>{__('Badges:', 'mbn-theme')} {badgesItems.length}</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
            {__('Configure block settings in the sidebar →', 'mbn-theme')}
          </p>
        </div>
      </div>
    </Fragment>
  );
}

