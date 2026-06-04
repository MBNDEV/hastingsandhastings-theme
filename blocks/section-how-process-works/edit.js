import { useBlockProps, InspectorControls, MediaUpload, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, ToggleControl, Button, IconButton, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BackgroundColorControl from '../shared/BackgroundColorControl';
import './editor.css';

// Generate unique ID for repeater items
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Sortable Step Component
function SortableStep({ item, index, updateItem, removeItem, duplicateItem }) {
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
          <strong>{__('Step', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <IconButton
            icon="admin-page"
            label={__('Duplicate', 'mbn-theme')}
            onClick={() => duplicateItem(index)}
          />
          <IconButton
            icon="trash"
            label={__('Remove', 'mbn-theme')}
            onClick={() => removeItem(index)}
          />
        </div>
      </div>

      <TextControl
        label={__('Step Heading', 'mbn-theme')}
        value={item.heading}
        onChange={(value) => updateItem(index, { heading: value })}
      />

      <TextareaControl
        label={__('Step Description', 'mbn-theme')}
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
    steps,
    showCta,
    ctaLogoUrl,
    ctaLogoId,
    ctaHeading,
    ctaDescription,
    ctaButtonText,
    ctaButtonUrl,
    ctaPhoneLabel,
    ctaPhoneNumber,
    backgroundColor,
  } = attributes;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Step handlers
  const updateStep = (index, updates) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], ...updates };
    setAttributes({ steps: updated });
  };

  const addStep = () => {
    setAttributes({
      steps: [...steps, {
        id: generateUniqueId(),
        heading: '',
        description: ''
      }]
    });
  };

  const removeStep = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    setAttributes({ steps: updated });
  };

  const duplicateStep = (index) => {
    const itemToDuplicate = { ...steps[index], id: generateUniqueId() };
    const updated = [
      ...steps.slice(0, index + 1),
      itemToDuplicate,
      ...steps.slice(index + 1)
    ];
    setAttributes({ steps: updated });
  };

  const handleStepDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = steps.findIndex(item => item.id === active.id);
      const newIndex = steps.findIndex(item => item.id === over.id);
      setAttributes({
        steps: arrayMove(steps, oldIndex, newIndex),
      });
    }
  };

  const blockProps = useBlockProps({
    className: 'py-12',
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
            defaultValue="bg-white"
          />
        </PanelBody>

        {/* Process Steps */}
        <PanelBody title={__('Process Steps', 'mbn-theme')} initialOpen={false}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder steps', 'mbn-theme')}
          </p>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleStepDragEnd}
          >
            <SortableContext
              items={steps.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {steps.map((item, index) => (
                <SortableStep
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={updateStep}
                  removeItem={removeStep}
                  duplicateItem={duplicateStep}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addStep} style={{ marginTop: '15px' }}>
            {__('+ Add Step', 'mbn-theme')}
          </Button>
        </PanelBody>

        {/* CTA Card Settings */}
        <PanelBody title={__('CTA Card', 'mbn-theme')} initialOpen={false}>
          <ToggleControl
            label={__('Show CTA Card', 'mbn-theme')}
            checked={showCta}
            onChange={(value) => setAttributes({ showCta: value })}
          />

          {showCta && (
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
                label={__('CTA Heading', 'mbn-theme')}
                value={ctaHeading}
                onChange={(value) => setAttributes({ ctaHeading: value })}
                style={{ marginTop: '15px' }}
              />

              <TextareaControl
                label={__('CTA Description', 'mbn-theme')}
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

              <TextControl
                label={__('Phone Label', 'mbn-theme')}
                value={ctaPhoneLabel}
                onChange={(value) => setAttributes({ ctaPhoneLabel: value })}
              />

              <TextControl
                label={__('Phone Number', 'mbn-theme')}
                value={ctaPhoneNumber}
                onChange={(value) => setAttributes({ ctaPhoneNumber: value })}
              />
            </>
          )}
        </PanelBody>

      </InspectorControls>

      {/* Block preview */}
      <div {...blockProps}>
        <div className="max-w-[1440px] mx-auto px-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div>
              {eyebrowText && (
                <p className="font-body text-sm font-bold uppercase tracking-widest text-secondary mb-6">
                  {eyebrowText}
                </p>
              )}
              
              <RichText
                tagName="h2"
                value={mainHeading}
                onChange={(value) => setAttributes({ mainHeading: value })}
                placeholder={__('Enter heading...', 'mbn-theme')}
                className="font-heading font-bold text-4xl text-text-heading mb-8"
              />
              
              {description && (
                <p className="font-body text-base text-text-body leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Right Column - Steps Preview */}
            <div>
              {steps.length === 0 && (
                <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded">
                  {__('Add process steps in the sidebar →', 'mbn-theme')}
                </div>
              )}
              
              {steps.map((step, index) => (
                <div key={step.id} className="mb-8 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-secondary border-2 border-white shadow"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-2xl text-text-heading mb-2">
                      {step.heading || `Step ${index + 1}`}
                    </h3>
                    <p className="font-body text-base text-text-body">
                      {step.description || 'Add description...'}
                    </p>
                  </div>
                </div>
              ))}

              {showCta && (
                <div className="mt-8 p-6 bg-gradient-to-br from-accent-blue to-text-heading rounded-2xl">
                  <div className="text-white text-center">
                    <h3 className="font-heading font-bold text-xl mb-2">{ctaHeading}</h3>
                    <p className="text-sm mb-4">{ctaDescription}</p>
                    <div className="inline-flex px-4 py-2 bg-accent-gold rounded-full text-text-heading font-bold text-sm">
                      {ctaButtonText}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
