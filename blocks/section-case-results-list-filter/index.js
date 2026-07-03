import { registerBlockType } from '@wordpress/blocks';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import metadata from './block.json';
import './style.css';

function Edit({ attributes, setAttributes }) {
  const {
    filterLabel,
    filterDefaultText,
    filterTitle,
    filterSubtitle,
    clearButtonText,
    applyButtonText,
    noResultsText,
  } = attributes;

  const [activeEditorSection, setActiveEditorSection] = useState('filter');

  const blockProps = useBlockProps({
    className: 'case-results-filter-editor',
  });

  return (
    <>
      <InspectorControls>
        <PanelBody
          key={`filter-panel-${activeEditorSection}`}
          title={__('Filter UI Content', 'mbn-theme')}
          initialOpen={activeEditorSection === 'filter'}
        >
          <TextControl
            label={__('Filter Label', 'mbn-theme')}
            value={filterLabel}
            onChange={(value) => setAttributes({ filterLabel: value })}
          />
          <TextControl
            label={__('Dropdown Default Text', 'mbn-theme')}
            value={filterDefaultText}
            onChange={(value) => setAttributes({ filterDefaultText: value })}
          />
          <TextControl
            label={__('Dropdown Title', 'mbn-theme')}
            value={filterTitle}
            onChange={(value) => setAttributes({ filterTitle: value })}
          />
          <TextControl
            label={__('Dropdown Subtitle', 'mbn-theme')}
            value={filterSubtitle}
            onChange={(value) => setAttributes({ filterSubtitle: value })}
          />
          <TextControl
            label={__('Clear Button Text', 'mbn-theme')}
            value={clearButtonText}
            onChange={(value) => setAttributes({ clearButtonText: value })}
          />
          <TextControl
            label={__('Apply Button Text', 'mbn-theme')}
            value={applyButtonText}
            onChange={(value) => setAttributes({ applyButtonText: value })}
          />
        </PanelBody>

        <PanelBody
          key={`results-panel-${activeEditorSection}`}
          title={__('Results State', 'mbn-theme')}
          initialOpen={activeEditorSection === 'results'}
        >
          <TextControl
            label={__('No Results Text', 'mbn-theme')}
            value={noResultsText}
            onChange={(value) => setAttributes({ noResultsText: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="case-results-filter-editor__header">
          <h3>{__('Case Results List Filter', 'mbn-theme')}</h3>
          <p>{__('Dynamic frontend rendering from Case Results posts with client-side filtering.', 'mbn-theme')}</p>
        </div>

        <div
          className={`case-results-filter-editor__section ${activeEditorSection === 'filter' ? 'is-active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => setActiveEditorSection('filter')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setActiveEditorSection('filter');
            }
          }}
        >
          <div className="case-results-filter-editor__section-header">
            <strong>{__('Edit Filter Section', 'mbn-theme')}</strong>
          </div>
          <div className="case-results-filter-editor__inline-field">
            <span>{__('Filter Label', 'mbn-theme')}</span>
            <RichText
              tagName="p"
              value={filterLabel}
              onChange={(value) => setAttributes({ filterLabel: value })}
              placeholder={__('Filter Cases:', 'mbn-theme')}
              allowedFormats={ [] }
            />
          </div>
          <div className="case-results-filter-editor__inline-field">
            <span>{__('Dropdown Default', 'mbn-theme')}</span>
            <RichText
              tagName="p"
              value={filterDefaultText}
              onChange={(value) => setAttributes({ filterDefaultText: value })}
              placeholder={__('All Cases', 'mbn-theme')}
              allowedFormats={ [] }
            />
          </div>
        </div>

        <div
          className={`case-results-filter-editor__section ${activeEditorSection === 'results' ? 'is-active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => setActiveEditorSection('results')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setActiveEditorSection('results');
            }
          }}
        >
          <div className="case-results-filter-editor__section-header">
            <strong>{__('Edit Results Section', 'mbn-theme')}</strong>
          </div>
          <div className="case-results-filter-editor__inline-field">
            <span>{__('No Results Message', 'mbn-theme')}</span>
            <RichText
              tagName="p"
              value={noResultsText}
              onChange={(value) => setAttributes({ noResultsText: value })}
              placeholder={__('No case results match the selected filters.', 'mbn-theme')}
            />
          </div>
        </div>
      </div>
    </>
  );
}

registerBlockType(metadata.name, {
  edit: Edit,
  save: () => null,
});
