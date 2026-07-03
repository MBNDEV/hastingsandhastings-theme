import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
  const { heading, description } = attributes;

  const blockProps = useBlockProps({
    className: 'w-full py-12 md:py-16 lg:py-20 bg-[#f1f2f4]',
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Content', 'mbn-theme')} initialOpen={true}>
          <TextareaControl
            label={__('Heading', 'mbn-theme')}
            value={heading}
            onChange={(value) => setAttributes({ heading: value })}
            rows={2}
          />
          <TextareaControl
            label={__('Description', 'mbn-theme')}
            value={description}
            onChange={(value) => setAttributes({ description: value })}
            rows={3}
          />
        </PanelBody>
      </InspectorControls>

      <section {...blockProps}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="mb-10 text-center">
            <RichText
              tagName="h2"
              value={heading}
              onChange={(value) => setAttributes({ heading: value })}
              placeholder={__('Enter heading...', 'mbn-theme')}
              className="font-heading text-3xl md:text-4xl font-bold text-text-heading mb-3"
            />
            <RichText
              tagName="p"
              value={description}
              onChange={(value) => setAttributes({ description: value })}
              placeholder={__('Enter description...', 'mbn-theme')}
              className="font-body text-base md:text-lg text-text-body"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <article key={item} className="bg-transparent">
                <div className="attorney-listing-placeholder-image rounded-xl mb-4" />
                <div className="space-y-2">
                  <p className="font-heading text-2xl font-bold text-text-heading">{__('Attorney Name', 'mbn-theme')}</p>
                  <p className="font-body text-base text-text-muted">{__('Attorney Type', 'mbn-theme')}</p>
                  <p className="font-body text-base text-text-body line-clamp-3">{__('Attorney excerpt preview appears on frontend.', 'mbn-theme')}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
