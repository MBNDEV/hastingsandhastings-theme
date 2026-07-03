import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
  const { postsPerPage } = attributes;
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Settings', 'mbn-theme')}>
          <RangeControl
            label={__('Posts Per Page', 'mbn-theme')}
            value={postsPerPage}
            onChange={(value) => setAttributes({ postsPerPage: value })}
            min={6}
            max={24}
            step={3}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="bg-white px-4 md:px-20 lg:px-44 py-6 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5a2 2 0 00-2 2v8a2 2 0 002 2h14m0-12v12m0-12l6-6m-6 6l-6-6m6 18v12m0-12h14a2 2 0 012 2v8a2 2 0 01-2 2H19m0-12l-6 6m6-6l6 6" />
            </svg>
            <h3 className="mt-2 text-lg font-bold font-noto-serif text-gray-900">
              {__('Blog Listing with Filter', 'mbn-theme')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {__(`Displaying ${postsPerPage} posts per page with category filtering`, 'mbn-theme')}
            </p>
            <p className="mt-4 text-xs text-gray-400">
              {__('Preview available on frontend', 'mbn-theme')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
