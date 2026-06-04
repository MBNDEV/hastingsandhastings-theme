import { useBlockProps, InspectorControls, MediaUpload, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, ToggleControl, Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BackgroundColorControl from '../shared/BackgroundColorControl';
import './editor.css';

// Generate unique ID for repeater items
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Sortable Card Component
function SortableCard({ item, index, updateItem, removeItem, duplicateItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '5px' }}>
            <Icon icon="menu" />
          </div>
          <strong>{__('Practice Area', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            icon="admin-page"
            label={__('Duplicate', 'mbn-theme')}
            onClick={() => duplicateItem(index)}
          />
          <Button
            icon="trash"
            label={__('Remove', 'mbn-theme')}
            onClick={() => removeItem(index)}
          />
        </div>
      </div>

      <MediaUpload
        onSelect={(media) => updateItem(index, { imageUrl: media.url, imageId: media.id })}
        allowedTypes={['image']}
        value={item.imageId}
        render={({ open }) => (
          <div>
            <Button onClick={open} variant="secondary" style={{ marginTop: '10px' }}>
              {item.imageUrl ? __('Replace Image', 'mbn-theme') : __('Select Image', 'mbn-theme')}
            </Button>
            {item.imageUrl && (
              <img src={item.imageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }} />
            )}
          </div>
        )}
      />

      <TextControl
        label={__('Heading', 'mbn-theme')}
        value={item.heading}
        onChange={(value) => updateItem(index, { heading: value })}
        style={{ marginTop: '10px' }}
      />

      <TextareaControl
        label={__('Description', 'mbn-theme')}
        value={item.description}
        onChange={(value) => updateItem(index, { description: value })}
        rows={3}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
}

export default function Edit({ attributes, setAttributes }) {
  const {
    eyebrowText,
    mainHeading,
    description,
    cards,
    showCtaPanel,
    ctaLogoUrl,
    ctaLogoId,
    ctaHeading,
    ctaDescription,
    ctaButtonText,
    ctaButtonUrl,
    backgroundColor,
  } = attributes;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Card handlers
  const updateCard = (index, updates) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], ...updates };
    setAttributes({ cards: updated });
  };

  const addCard = () => {
    setAttributes({
      cards: [...cards, {
        id: generateUniqueId(),
        imageUrl: '',
        imageId: 0,
        heading: '',
        description: ''
      }]
    });
  };

  const removeCard = (index) => {
    const updated = cards.filter((_, i) => i !== index);
    setAttributes({ cards: updated });
  };

  const duplicateCard = (index) => {
    const itemToDuplicate = { ...cards[index], id: generateUniqueId() };
    const updated = [
      ...cards.slice(0, index + 1),
      itemToDuplicate,
      ...cards.slice(index + 1)
    ];
    setAttributes({ cards: updated });
  };

  const handleCardDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = cards.findIndex(item => item.id === active.id);
      const newIndex = cards.findIndex(item => item.id === over.id);
      setAttributes({
        cards: arrayMove(cards, oldIndex, newIndex),
      });
    }
  };

  const blockProps = useBlockProps({
    className: 'bg-gray-50 py-12',
  });

  return (
    <Fragment>
      <InspectorControls>
        
        {/* Section Content */}
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
            rows={2}
          />

          <TextareaControl
            label={__('Description', 'mbn-theme')}
            value={description}
            onChange={(value) => setAttributes({ description: value })}
            rows={4}
          />

          <BackgroundColorControl
            value={backgroundColor}
            onChange={(value) => setAttributes({ backgroundColor: value })}
            defaultValue="bg-light-blue"
          />
        </PanelBody>

        {/* Practice Area Cards */}
        <PanelBody title={__('Practice Area Cards', 'mbn-theme')} initialOpen={false}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder cards', 'mbn-theme')}
          </p>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleCardDragEnd}
          >
            <SortableContext
              items={cards.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {cards.map((item, index) => (
                <SortableCard
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={updateCard}
                  removeItem={removeCard}
                  duplicateItem={duplicateCard}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addCard} style={{ marginTop: '15px' }}>
            {__('+ Add Practice Area', 'mbn-theme')}
          </Button>
        </PanelBody>

        {/* CTA Panel Settings */}
        <PanelBody title={__('CTA Panel', 'mbn-theme')} initialOpen={false}>
          <ToggleControl
            label={__('Show CTA Panel', 'mbn-theme')}
            checked={showCtaPanel}
            onChange={(value) => setAttributes({ showCtaPanel: value })}
          />

          {showCtaPanel && (
            <>
              <MediaUpload
                onSelect={(media) => setAttributes({ ctaLogoUrl: media.url, ctaLogoId: media.id })}
                allowedTypes={['image']}
                value={ctaLogoId}
                render={({ open }) => (
                  <div style={{ marginTop: '15px' }}>
                    <p style={{ fontWeight: '600', marginBottom: '8px' }}>{__('Logo', 'mbn-theme')}</p>
                    <Button onClick={open} variant="secondary">
                      {ctaLogoUrl ? __('Replace Logo', 'mbn-theme') : __('Select Logo', 'mbn-theme')}
                    </Button>
                    {ctaLogoUrl && (
                      <img src={ctaLogoUrl} alt="" style={{ marginTop: '10px', maxWidth: '100px', height: 'auto' }} />
                    )}
                  </div>
                )}
              />

              <TextControl
                label={__('Heading', 'mbn-theme')}
                value={ctaHeading}
                onChange={(value) => setAttributes({ ctaHeading: value })}
                style={{ marginTop: '15px' }}
              />

              <TextareaControl
                label={__('Description', 'mbn-theme')}
                value={ctaDescription}
                onChange={(value) => setAttributes({ ctaDescription: value })}
                rows={3}
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
            </>
          )}
        </PanelBody>

      </InspectorControls>

      {/* Block preview */}
      <div {...blockProps}>
        <div className="max-w-[1440px] mx-auto px-4">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            {eyebrowText && (
              <p className="font-body text-sm font-bold uppercase tracking-[0.15em] text-secondary mb-4">
                {eyebrowText}
              </p>
            )}
            
            <RichText
              tagName="h2"
              value={mainHeading}
              onChange={(value) => setAttributes({ mainHeading: value })}
              placeholder={__('Enter heading...', 'mbn-theme')}
              className="font-heading font-semibold text-4xl text-text-heading mb-6"
            />
            
            {description && (
              <p className="font-body text-base text-text-body leading-relaxed max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>

          {/* Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.length === 0 && (
              <div className="col-span-4 text-center text-gray-400 py-8">
                {__('Add practice area cards in the sidebar →', 'mbn-theme')}
              </div>
            )}
            {cards.map((card) => (
              <div key={card.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt="" className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">{__('No image', 'mbn-theme')}</span>
                  </div>
                )}
                <div className="p-6">
                  {card.heading && (
                    <h3 className="font-heading font-bold text-xl mb-3">{card.heading}</h3>
                  )}
                  {card.description && (
                    <p className="font-body text-sm text-text-body">{card.description}</p>
                  )}
                </div>
              </div>
            ))}
            
            {/* CTA Panel Preview */}
            {showCtaPanel && (
              <div className="lg:col-span-2 bg-white rounded-lg border-2 border-secondary p-8 flex flex-col items-center justify-center text-center">
                {ctaLogoUrl && (
                  <img src={ctaLogoUrl} alt="" className="w-16 h-16 mb-4" />
                )}
                {ctaHeading && (
                  <h3 className="font-heading font-bold text-2xl mb-4">{ctaHeading}</h3>
                )}
                {ctaDescription && (
                  <p className="font-body text-base text-text-body mb-6">{ctaDescription}</p>
                )}
                {ctaButtonText && (
                  <a href={ctaButtonUrl} className="inline-flex h-12 px-8 rounded-full font-body font-bold border">
                    {ctaButtonText}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
