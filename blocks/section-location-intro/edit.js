import { useBlockProps, InspectorControls, RichText, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, SelectControl, Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
  const {
    title,
    introParagraph,
    sections,
    subheaderTitle,
    ctaBackgroundImageUrl,
    ctaBackgroundImageId,
    ctaLogoUrl,
    ctaLogoId,
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaPhoneNumber,
  } = attributes;

  const [activeSectionIndex, setActiveSectionIndex] = useState(null);
  const [activeStatIndex, setActiveStatIndex] = useState(null);

  const blockProps = useBlockProps({
    className: 'ldp-why-choose editor-preview',
  });

  // ── Section Management ───────────────────────────────────────────
  const addSection = (sectionType) => {
    const newSection = {
      type: sectionType,
    };

    if (sectionType === 'track-record') {
      newSection.columnPosition = 'text-left';
      newSection.subtitle = '';
      newSection.paragraph = '';
      newSection.stats = [];
    } else if (sectionType === 'fee-structure') {
      newSection.columnPosition = 'badge-left';
      newSection.badgeImageUrl = '';
      newSection.badgeImageId = 0;
      newSection.subtitle = '';
      newSection.paragraph = '';
    } else if (sectionType === 'attorneys') {
      newSection.columnPosition = 'text-left';
      newSection.subtitle = '';
      newSection.paragraph = '';
      newSection.teamImageUrl = '';
      newSection.teamImageId = 0;
    }

    setAttributes({ sections: [...sections, newSection] });
    setActiveSectionIndex(sections.length);
  };

  const updateSection = (index, updates) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], ...updates };
    setAttributes({ sections: updatedSections });
  };

  const removeSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setAttributes({ sections: updatedSections });
    if (activeSectionIndex === index) {
      setActiveSectionIndex(null);
    }
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    const updatedSections = [...sections];
    [updatedSections[index - 1], updatedSections[index]] = [updatedSections[index], updatedSections[index - 1]];
    setAttributes({ sections: updatedSections });
    setActiveSectionIndex(index - 1);
  };

  const moveSectionDown = (index) => {
    if (index === sections.length - 1) return;
    const updatedSections = [...sections];
    [updatedSections[index], updatedSections[index + 1]] = [updatedSections[index + 1], updatedSections[index]];
    setAttributes({ sections: updatedSections });
    setActiveSectionIndex(index + 1);
  };

  // ── Stats Management (nested in track-record) ─────────────────────
  const addStat = (sectionIndex) => {
    const updatedSections = [...sections];
    const stats = updatedSections[sectionIndex].stats || [];
    updatedSections[sectionIndex].stats = [
      ...stats,
      { number: '', label: '' },
    ];
    setAttributes({ sections: updatedSections });
  };

  const updateStat = (sectionIndex, statIndex, updates) => {
    const updatedSections = [...sections];
    const stats = [...(updatedSections[sectionIndex].stats || [])];
    stats[statIndex] = { ...stats[statIndex], ...updates };
    updatedSections[sectionIndex].stats = stats;
    setAttributes({ sections: updatedSections });
  };

  const removeStat = (sectionIndex, statIndex) => {
    const updatedSections = [...sections];
    const stats = (updatedSections[sectionIndex].stats || []).filter((_, i) => i !== statIndex);
    updatedSections[sectionIndex].stats = stats;
    setAttributes({ sections: updatedSections });
    if (activeStatIndex === statIndex) {
      setActiveStatIndex(null);
    }
  };

  // ── Render Section Type Label ──────────────────────────────────────
  const getSectionTypeLabel = (type) => {
    switch (type) {
      case 'track-record':
        return __('Track Record', 'mbn-theme');
      case 'fee-structure':
        return __('Fee Structure', 'mbn-theme');
      case 'attorneys':
        return __('Attorneys', 'mbn-theme');
      default:
        return __('Unknown', 'mbn-theme');
    }
  };

  return (
    <Fragment>
      <InspectorControls>
        {/* ── Header ─────────────────────────────────────── */}
        <PanelBody title={__('Header', 'mbn-theme')} initialOpen={true}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>
              {__('Title', 'mbn-theme')}
            </label>
            <RichText
              tagName="div"
              value={title}
              onChange={(value) => setAttributes({ title: value })}
              placeholder={__('Enter title...', 'mbn-theme')}
              allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/strikethrough', 'core/underline']}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '8px 12px',
                minHeight: '40px',
                backgroundColor: '#fff'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>
              {__('Intro Paragraph', 'mbn-theme')}
            </label>
            <RichText
              tagName="div"
              value={introParagraph}
              onChange={(value) => setAttributes({ introParagraph: value })}
              placeholder={__('Enter intro paragraph...', 'mbn-theme')}
              allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/strikethrough', 'core/underline']}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '8px 12px',
                minHeight: '100px',
                backgroundColor: '#fff'
              }}
            />
          </div>
        </PanelBody>

        {/* ── Sections ───────────────────────────────────── */}
        <PanelBody title={__('Sections (Repeater)', 'mbn-theme')} initialOpen={false}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Add optional sections in any order. Click to expand and edit.', 'mbn-theme')}
          </p>

          {sections.map((section, index) => (
            <div
              key={index}
              style={{
                marginBottom: '20px',
                padding: '15px',
                border: activeSectionIndex === index ? '2px solid #2271b1' : '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
              onClick={() => setActiveSectionIndex(activeSectionIndex === index ? null : index)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong>
                  {getSectionTypeLabel(section.type)} ({index + 1})
                </strong>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    icon="arrow-up-alt2"
                    label={__('Move Up', 'mbn-theme')}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSectionUp(index);
                    }}
                    disabled={index === 0}
                  />
                  <Button
                    icon="arrow-down-alt2"
                    label={__('Move Down', 'mbn-theme')}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSectionDown(index);
                    }}
                    disabled={index === sections.length - 1}
                  />
                  <Button
                    icon="trash"
                    label={__('Remove', 'mbn-theme')}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(index);
                    }}
                  />
                </div>
              </div>

              {activeSectionIndex === index && (
                <div onClick={(e) => e.stopPropagation()}>
                  {/* Column Layout Control */}
                  {section.type === 'track-record' && (
                    <SelectControl
                      label={__('Column Layout', 'mbn-theme')}
                      value={section.columnPosition || 'text-left'}
                      options={[
                        { label: __('Text Left, Stats Right', 'mbn-theme'), value: 'text-left' },
                        { label: __('Stats Left, Text Right', 'mbn-theme'), value: 'text-right' },
                      ]}
                      onChange={(value) => updateSection(index, { columnPosition: value })}
                      style={{ marginBottom: '15px' }}
                    />
                  )}

                  {section.type === 'fee-structure' && (
                    <SelectControl
                      label={__('Column Layout', 'mbn-theme')}
                      value={section.columnPosition || 'badge-left'}
                      options={[
                        { label: __('Badge Left, Text Right', 'mbn-theme'), value: 'badge-left' },
                        { label: __('Text Left, Badge Right', 'mbn-theme'), value: 'badge-right' },
                      ]}
                      onChange={(value) => updateSection(index, { columnPosition: value })}
                      style={{ marginBottom: '15px' }}
                    />
                  )}

                  {section.type === 'attorneys' && (
                    <SelectControl
                      label={__('Column Layout', 'mbn-theme')}
                      value={section.columnPosition || 'text-left'}
                      options={[
                        { label: __('Text Left, Image Right', 'mbn-theme'), value: 'text-left' },
                        { label: __('Image Left, Text Right', 'mbn-theme'), value: 'image-left' },
                      ]}
                      onChange={(value) => updateSection(index, { columnPosition: value })}
                      style={{ marginBottom: '15px' }}
                    />
                  )}

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>
                      {__('Subtitle', 'mbn-theme')}
                    </label>
                    <RichText
                      tagName="div"
                      value={section.subtitle || ''}
                      onChange={(value) => updateSection(index, { subtitle: value })}
                      placeholder={__('Enter subtitle...', 'mbn-theme')}
                      allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/strikethrough', 'core/underline']}
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        minHeight: '40px',
                        backgroundColor: '#fff'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>
                      {__('Paragraph', 'mbn-theme')}
                    </label>
                    <RichText
                      tagName="div"
                      value={section.paragraph || ''}
                      onChange={(value) => updateSection(index, { paragraph: value })}
                      placeholder={__('Enter paragraph...', 'mbn-theme')}
                      allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/strikethrough', 'core/underline']}
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        minHeight: '80px',
                        backgroundColor: '#fff'
                      }}
                    />
                  </div>

                  {/* ── Track Record: Stats Repeater ─────────── */}
                  {section.type === 'track-record' && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                      <h4 style={{ marginTop: 0 }}>{__('Stats', 'mbn-theme')}</h4>
                      {(section.stats || []).map((stat, statIndex) => (
                        <div
                          key={statIndex}
                          style={{
                            marginBottom: '15px',
                            padding: '12px',
                            border: activeStatIndex === statIndex ? '2px solid #2271b1' : '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveStatIndex(activeStatIndex === statIndex ? null : statIndex);
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <strong>{__('Stat', 'mbn-theme')} {statIndex + 1}</strong>
                            <Button
                              icon="trash"
                              label={__('Remove', 'mbn-theme')}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeStat(index, statIndex);
                              }}
                            />
                          </div>

                          {activeStatIndex === statIndex && (
                            <div onClick={(e) => e.stopPropagation()}>
                              <TextControl
                                label={__('Number', 'mbn-theme')}
                                value={stat.number || ''}
                                onChange={(value) => updateStat(index, statIndex, { number: value })}
                                placeholder="600+"
                              />
                              <TextControl
                                label={__('Label', 'mbn-theme')}
                                value={stat.label || ''}
                                onChange={(value) => updateStat(index, statIndex, { label: value })}
                                placeholder="Real, Handwritten Reviews"
                              />
                            </div>
                          )}
                        </div>
                      ))}

                      <Button variant="secondary" onClick={() => addStat(index)} style={{ marginTop: '10px' }}>
                        {__('+ Add Stat', 'mbn-theme')}
                      </Button>
                    </div>
                  )}

                  {/* ── Fee Structure: Badge Image ───────────── */}
                  {section.type === 'fee-structure' && (
                    <div style={{ marginTop: '15px' }}>
                      <MediaUpload
                        onSelect={(media) => updateSection(index, { badgeImageUrl: media.url, badgeImageId: media.id })}
                        allowedTypes={['image']}
                        value={section.badgeImageId}
                        render={({ open }) => (
                          <div>
                            <Button onClick={open} variant="secondary">
                              {section.badgeImageUrl ? __('Replace Badge Image', 'mbn-theme') : __('Select Badge Image', 'mbn-theme')}
                            </Button>
                            {section.badgeImageUrl && (
                              <img src={section.badgeImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '150px', display: 'block' }} />
                            )}
                          </div>
                        )}
                      />
                    </div>
                  )}

                  {/* ── Attorneys: Team Image ────────────────── */}
                  {section.type === 'attorneys' && (
                    <div style={{ marginTop: '15px' }}>
                      <MediaUpload
                        onSelect={(media) => updateSection(index, { teamImageUrl: media.url, teamImageId: media.id })}
                        allowedTypes={['image']}
                        value={section.teamImageId}
                        render={({ open }) => (
                          <div>
                            <Button onClick={open} variant="secondary">
                              {section.teamImageUrl ? __('Replace Team Image', 'mbn-theme') : __('Select Team Image', 'mbn-theme')}
                            </Button>
                            {section.teamImageUrl && (
                              <img src={section.teamImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '200px', display: 'block' }} />
                            )}
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button variant="primary" onClick={() => addSection('track-record')}>
              {__('+ Add Track Record Section', 'mbn-theme')}
            </Button>
            <Button variant="primary" onClick={() => addSection('fee-structure')}>
              {__('+ Add Fee Structure Section', 'mbn-theme')}
            </Button>
            <Button variant="primary" onClick={() => addSection('attorneys')}>
              {__('+ Add Attorneys Section', 'mbn-theme')}
            </Button>
          </div>
        </PanelBody>

        {/* ── Subheader ──────────────────────────────────── */}
        <PanelBody title={__('Subheader', 'mbn-theme')} initialOpen={false}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>
              {__('Subheader Title', 'mbn-theme')}
            </label>
            <RichText
              tagName="div"
              value={subheaderTitle}
              onChange={(value) => setAttributes({ subheaderTitle: value })}
              placeholder={__('Enter subheader...', 'mbn-theme')}
              allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/strikethrough', 'core/underline']}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '8px 12px',
                minHeight: '60px',
                backgroundColor: '#fff'
              }}
            />
          </div>
        </PanelBody>

        {/* ── CTA Card ───────────────────────────────────── */}
        <PanelBody title={__('CTA Card', 'mbn-theme')} initialOpen={false}>
          <MediaUpload
            onSelect={(media) => setAttributes({ ctaBackgroundImageUrl: media.url, ctaBackgroundImageId: media.id })}
            allowedTypes={['image']}
            value={ctaBackgroundImageId}
            render={({ open }) => (
              <div style={{ marginBottom: '15px' }}>
                <Button onClick={open} variant="secondary">
                  {ctaBackgroundImageUrl ? __('Replace Background', 'mbn-theme') : __('Select Background', 'mbn-theme')}
                </Button>
                {ctaBackgroundImageUrl && (
                  <img src={ctaBackgroundImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', display: 'block' }} />
                )}
              </div>
            )}
          />

          <MediaUpload
            onSelect={(media) => setAttributes({ ctaLogoUrl: media.url, ctaLogoId: media.id })}
            allowedTypes={['image']}
            value={ctaLogoId}
            render={({ open }) => (
              <div style={{ marginBottom: '15px' }}>
                <Button onClick={open} variant="secondary">
                  {ctaLogoUrl ? __('Replace Logo', 'mbn-theme') : __('Select Logo', 'mbn-theme')}
                </Button>
                {ctaLogoUrl && (
                  <img src={ctaLogoUrl} alt="" style={{ marginTop: '10px', maxWidth: '150px', display: 'block' }} />
                )}
              </div>
            )}
          />

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>
              {__('CTA Title', 'mbn-theme')}
            </label>
            <RichText
              tagName="div"
              value={ctaTitle}
              onChange={(value) => setAttributes({ ctaTitle: value })}
              placeholder={__('Enter CTA title...', 'mbn-theme')}
              allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/strikethrough', 'core/underline']}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '8px 12px',
                minHeight: '40px',
                backgroundColor: '#fff'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>
              {__('CTA Description', 'mbn-theme')}
            </label>
            <RichText
              tagName="div"
              value={ctaDescription}
              onChange={(value) => setAttributes({ ctaDescription: value })}
              placeholder={__('Enter CTA description...', 'mbn-theme')}
              allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/strikethrough', 'core/underline']}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '8px 12px',
                minHeight: '60px',
                backgroundColor: '#fff'
              }}
            />
          </div>

          <TextControl
            label={__('Button Text', 'mbn-theme')}
            value={ctaButtonText}
            onChange={(value) => setAttributes({ ctaButtonText: value })}
          />

          <TextControl
            label={__('Phone Number', 'mbn-theme')}
            value={ctaPhoneNumber}
            onChange={(value) => setAttributes({ ctaPhoneNumber: value })}
            placeholder="(480) 480-2929"
          />
        </PanelBody>
      </InspectorControls>

      {/* ── Block Preview ────────────────────────────────── */}
      <div {...blockProps}>
        <div style={{ padding: '40px', border: '2px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h3 style={{ marginTop: 0, color: '#2271b1' }}>{__('Section: Location – Intro (Why Choose)', 'mbn-theme')}</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <strong>{__('Title:', 'mbn-theme')}</strong> {title || __('(No title)', 'mbn-theme')}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <strong>{__('Intro:', 'mbn-theme')}</strong> {introParagraph ? introParagraph.slice(0, 100) + '...' : __('(No intro)', 'mbn-theme')}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <strong>{__('Sections:', 'mbn-theme')}</strong> {sections.length} {__('section(s)', 'mbn-theme')}
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              {sections.map((section, index) => (
                <li key={index}>{getSectionTypeLabel(section.type)}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <strong>{__('Subheader:', 'mbn-theme')}</strong> {subheaderTitle || __('(No subheader)', 'mbn-theme')}
          </div>

          <div>
            <strong>{__('CTA Card:', 'mbn-theme')}</strong> {ctaTitle || __('(No CTA title)', 'mbn-theme')}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
