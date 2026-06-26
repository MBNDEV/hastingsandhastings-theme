import { useBlockProps, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Text Paragraph Component
function SortableParagraph({ paragraph, index, updateParagraph, removeParagraph, duplicateParagraph }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: paragraph.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '12px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '4px' }}>
            <Icon icon="menu" />
          </div>
          <strong>{__('Paragraph', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button
            icon="admin-page"
            label={__('Duplicate', 'mbn-theme')}
            onClick={() => duplicateParagraph(index)}
          />
          <Button
            icon="trash"
            label={__('Remove', 'mbn-theme')}
            onClick={() => removeParagraph(index)}
          />
        </div>
      </div>

      <TextareaControl
        label={__('Text', 'mbn-theme')}
        value={paragraph.text}
        onChange={(value) => updateParagraph(index, { text: value })}
        rows={3}
      />
    </div>
  );
}

// Sortable Badge Component
function SortableBadge({ badge, index, updateBadge, removeBadge, duplicateBadge }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: badge.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '12px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '4px' }}>
            <Icon icon="menu" />
          </div>
          <strong>{__('Badge', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button
            icon="admin-page"
            label={__('Duplicate', 'mbn-theme')}
            onClick={() => duplicateBadge(index)}
          />
          <Button
            icon="trash"
            label={__('Remove', 'mbn-theme')}
            onClick={() => removeBadge(index)}
          />
        </div>
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
              <img src={badge.imageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
            )}
          </div>
        )}
      />

      <TextControl
        label={__('Alt Text', 'mbn-theme')}
        value={badge.imageAlt}
        onChange={(value) => updateBadge(index, { imageAlt: value })}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
}

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Paragraph handlers
  const updateParagraph = (index, updates) => {
    const updated = [...badgesTextParagraphs];
    updated[index] = { ...updated[index], ...updates };
    setAttributes({ badgesTextParagraphs: updated });
  };

  const addParagraph = () => {
    setAttributes({
      badgesTextParagraphs: [...badgesTextParagraphs, {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        text: ''
      }]
    });
  };

  const removeParagraph = (index) => {
    const updated = badgesTextParagraphs.filter((_, i) => i !== index);
    setAttributes({ badgesTextParagraphs: updated });
  };

  const duplicateParagraph = (index) => {
    const toDuplicate = {
      ...badgesTextParagraphs[index],
      id: Date.now().toString(36) + Math.random().toString(36).slice(2)
    };
    const updated = [
      ...badgesTextParagraphs.slice(0, index + 1),
      toDuplicate,
      ...badgesTextParagraphs.slice(index + 1)
    ];
    setAttributes({ badgesTextParagraphs: updated });
  };

  const handleParagraphDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = badgesTextParagraphs.findIndex(p => p.id === active.id);
      const newIndex = badgesTextParagraphs.findIndex(p => p.id === over.id);
      setAttributes({
        badgesTextParagraphs: arrayMove(badgesTextParagraphs, oldIndex, newIndex),
      });
    }
  };

  // Badge handlers
  const updateBadge = (index, updates) => {
    const updated = [...badgesItems];
    updated[index] = { ...updated[index], ...updates };
    setAttributes({ badgesItems: updated });
  };

  const addBadge = () => {
    setAttributes({
      badgesItems: [...badgesItems, {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        imageUrl: '',
        imageId: 0,
        imageFallback: '',
        imageAlt: '',
        imageWidth: 303,
        imageHeight: 303
      }]
    });
  };

  const removeBadge = (index) => {
    const updated = badgesItems.filter((_, i) => i !== index);
    setAttributes({ badgesItems: updated });
  };

  const duplicateBadge = (index) => {
    const toDuplicate = {
      ...badgesItems[index],
      id: Date.now().toString(36) + Math.random().toString(36).slice(2)
    };
    const updated = [
      ...badgesItems.slice(0, index + 1),
      toDuplicate,
      ...badgesItems.slice(index + 1)
    ];
    setAttributes({ badgesItems: updated });
  };

  const handleBadgeDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = badgesItems.findIndex(b => b.id === active.id);
      const newIndex = badgesItems.findIndex(b => b.id === over.id);
      setAttributes({
        badgesItems: arrayMove(badgesItems, oldIndex, newIndex),
      });
    }
  };

  return (
    <Fragment>
      <InspectorControls>
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
            help={__('Link destination (e.g., #contact, /contact-us/)', 'mbn-theme')}
          />
        </PanelBody>

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

        <PanelBody title={__('Badges Text Paragraphs', 'mbn-theme')} initialOpen={false}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder paragraphs', 'mbn-theme')}
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleParagraphDragEnd}
          >
            <SortableContext
              items={badgesTextParagraphs.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {badgesTextParagraphs.map((paragraph, index) => (
                <SortableParagraph
                  key={paragraph.id}
                  paragraph={paragraph}
                  index={index}
                  updateParagraph={updateParagraph}
                  removeParagraph={removeParagraph}
                  duplicateParagraph={duplicateParagraph}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addParagraph} style={{ marginTop: '15px' }}>
            {__('+ Add Paragraph', 'mbn-theme')}
          </Button>
        </PanelBody>

        <PanelBody title={__('Badge Images', 'mbn-theme')} initialOpen={false}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder badges', 'mbn-theme')}
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleBadgeDragEnd}
          >
            <SortableContext
              items={badgesItems.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {badgesItems.map((badge, index) => (
                <SortableBadge
                  key={badge.id}
                  badge={badge}
                  index={index}
                  updateBadge={updateBadge}
                  removeBadge={removeBadge}
                  duplicateBadge={duplicateBadge}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addBadge} style={{ marginTop: '15px' }}>
            {__('+ Add Badge', 'mbn-theme')}
          </Button>
        </PanelBody>
      </InspectorControls>

      <div {...useBlockProps({ className: 'ldp-cta-card-badges' })}>
        <div className="ldp-cta-card" style={ctaBackgroundImageUrl ? {
          backgroundImage: `url(${ctaBackgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}>
          <div className="ldp-cta-card__body">
            <h4>{ctaTitle || __('CTA Title', 'mbn-theme')}</h4>
            <p>{ctaDescription || __('Description...', 'mbn-theme')}</p>
            <button className="ldp-btn ldp-btn--yellow" type="button">{ctaButtonText}</button>
            <p>{ctaPhoneLabel} <a href={ctaPhoneUrl} onClick={(e) => e.preventDefault()}>{ctaPhoneText}</a></p>
          </div>
        </div>

        <div className="ldp-faq__badges">
          {badgesTextParagraphs.length > 0 && (
            <div className="ldp-faq__badges-row-text">
              {badgesTextParagraphs.map((p, idx) => (
                <p key={p.id}>{p.text || `Paragraph ${idx + 1}`}</p>
              ))}
            </div>
          )}
          {badgesItems.length > 0 && (
            <div className="ldp-faq__badges-row">
              {badgesItems.map((badge, idx) => (
                <div key={badge.id} className="ldp-faq__badge">
                  {badge.imageUrl ? (
                    <img src={badge.imageUrl} alt={badge.imageAlt} />
                  ) : (
                    <div style={{ padding: '20px', border: '2px dashed #ddd', textAlign: 'center' }}>
                      Badge {idx + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
