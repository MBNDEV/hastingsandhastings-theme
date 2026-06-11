import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button, ToggleControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
  const {
    eyebrowText,
    mainHeading,
    subheading,
    backgroundImageUrl,
    backgroundImageId,
    swapColumns,
    backgroundColor,
  } = attributes;

  const layoutClass = swapColumns
    ? 'section-two-column-text-image__layout section-two-column-text-image__layout--image-left grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-center'
    : 'section-two-column-text-image__layout section-two-column-text-image__layout--image-right grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 items-center';

  const textWrapClass = swapColumns
    ? 'section-two-column-text-image__text-wrap order-2 lg:order-2'
    : 'section-two-column-text-image__text-wrap order-2 lg:order-1';

  const imageWrapClass = swapColumns
    ? 'section-two-column-text-image__image-wrap order-1 lg:order-1'
    : 'section-two-column-text-image__image-wrap order-1 lg:order-2';

  const blockProps = useBlockProps({
    className: `section-two-column-text-image py-12 md:py-16 lg:py-20 ${backgroundColor}`,
  });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Section Content', 'mbn-theme')} initialOpen={true}>
          <TextControl
            label={__('Eyebrow Text', 'mbn-theme')}
            value={eyebrowText}
            onChange={(value) => setAttributes({ eyebrowText: value })}
          />

          <TextareaControl
            label={__('Main Heading', 'mbn-theme')}
            value={mainHeading}
            onChange={(value) => setAttributes({ mainHeading: value })}
            rows={3}
          />

          <TextareaControl
            label={__('Description', 'mbn-theme')}
            value={subheading}
            onChange={(value) => setAttributes({ subheading: value })}
            rows={4}
          />

          <ToggleControl
            label={__('Swap columns (image left, text right)', 'mbn-theme')}
            checked={swapColumns}
            onChange={(value) => setAttributes({ swapColumns: value })}
          />

          <SelectControl
            label={__('Background Color', 'mbn-theme')}
            value={backgroundColor}
            options={[
              { label: __('White', 'mbn-theme'), value: 'bg-white' },
              { label: __('Light Gray', 'mbn-theme'), value: 'bg-gray-50' },
              { label: __('Blue Tint', 'mbn-theme'), value: 'bg-slate-50' },
            ]}
            onChange={(value) => setAttributes({ backgroundColor: value })}
          />
        </PanelBody>

        <PanelBody title={__('Image', 'mbn-theme')} initialOpen={false}>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) => setAttributes({ backgroundImageUrl: media.url, backgroundImageId: media.id })}
              allowedTypes={['image']}
              value={backgroundImageId}
              render={({ open }) => (
                <div>
                  <Button onClick={open} variant="secondary">
                    {backgroundImageUrl ? __('Replace Image', 'mbn-theme') : __('Select Image', 'mbn-theme')}
                  </Button>
                  {backgroundImageUrl && (
                    <img src={backgroundImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                  )}
                </div>
              )}
            />
          </MediaUploadCheck>
        </PanelBody>

      </InspectorControls>

      <section {...blockProps}>
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-12">
          <div className={layoutClass}>
            <div className={textWrapClass}>
              <p className="font-body text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-secondary">{eyebrowText}</p>
              <RichText
                tagName="h2"
                value={mainHeading}
                onChange={(value) => setAttributes({ mainHeading: value })}
                placeholder={__('Enter heading...', 'mbn-theme')}
                className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-heading leading-tight"
              />
              <RichText
                tagName="p"
                value={subheading}
                onChange={(value) => setAttributes({ subheading: value })}
                placeholder={__('Enter description...', 'mbn-theme')}
                className="mt-6 font-body text-base md:text-lg text-text-body leading-relaxed"
              />
            </div>

            <div className={imageWrapClass}>
              <div className="section-two-column-text-image__preview-image overflow-hidden rounded-sm bg-gray-100">
                {backgroundImageUrl ? (
                  <img src={backgroundImageUrl} alt="" className="section-two-column-text-image__image" />
                ) : (
                  <div className="flex min-h-[220px] items-center justify-center text-sm text-gray-500">
                    {__('Select an image to display here.', 'mbn-theme')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}
