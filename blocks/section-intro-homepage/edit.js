import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button, IconButton, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './editor.css';

// Sortable Award Item Component
function SortableAward({ award, index, updateAward, removeAward, duplicateAward }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: award.id });

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
          <strong>{__('Award', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <IconButton
            icon="admin-page"
            label={__('Duplicate', 'mbn-theme')}
            onClick={() => duplicateAward(index)}
          />
          <IconButton
            icon="trash"
            label={__('Remove', 'mbn-theme')}
            onClick={() => removeAward(index)}
          />
        </div>
      </div>

      <MediaUploadCheck>
        <MediaUpload
          onSelect={(media) => updateAward(index, { imageUrl: media.url, imageId: media.id })}
          allowedTypes={['image']}
          value={award.imageId}
          render={({ open }) => (
            <div>
              <Button onClick={open} variant="secondary">
                {award.imageUrl ? __('Replace Image', 'mbn-theme') : __('Select Image', 'mbn-theme')}
              </Button>
              {award.imageUrl && (
                <img src={award.imageUrl} alt="" style={{ marginTop: '10px', maxWidth: '150px', height: 'auto', borderRadius: '4px' }} />
              )}
            </div>
          )}
        />
      </MediaUploadCheck>
    </div>
  );
}

// Generate unique ID compatible with older browsers
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export default function Edit({ attributes, setAttributes }) {
  const {
    eyebrowText,
    mainHeading,
    subheading,
    backgroundImageUrl,
    backgroundImageId,
    awardsLabel,
    awards,
  } = attributes;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateAward = (index, updates) => {
    const updatedAwards = [...awards];
    updatedAwards[index] = { ...updatedAwards[index], ...updates };
    setAttributes({ awards: updatedAwards });
  };

  const addAward = () => {
    setAttributes({
      awards: [...awards, { id: generateUniqueId(), imageUrl: '', imageId: 0 }]
    });
  };

  const removeAward = (index) => {
    const updatedAwards = awards.filter((_, i) => i !== index);
    setAttributes({ awards: updatedAwards });
  };

  const duplicateAward = (index) => {
    const awardToDuplicate = { ...awards[index], id: generateUniqueId() };
    const updatedAwards = [
      ...awards.slice(0, index + 1),
      awardToDuplicate,
      ...awards.slice(index + 1)
    ];
    setAttributes({ awards: updatedAwards });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = awards.findIndex(award => award.id === active.id);
      const newIndex = awards.findIndex(award => award.id === over.id);
      
      setAttributes({
        awards: arrayMove(awards, oldIndex, newIndex),
      });
    }
  };

  const blockProps = useBlockProps({
    className: 'relative w-full py-12 md:py-16 lg:py-24',
    style: backgroundImageUrl ? {
      backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98)), url(${backgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'top center',
    } : {
      backgroundColor: '#f9fafb'
    }
  });

  return (
    <Fragment>
      <InspectorControls>
        
        {/* Content Settings */}
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
            help={__('Main heading for the section', 'mbn-theme')}
          />
          
          <TextareaControl
            label={__('Description', 'mbn-theme')}
            value={subheading}
            onChange={(value) => setAttributes({ subheading: value })}
            rows={4}
            help={__('Description text for the section', 'mbn-theme')}
          />
          
          <TextControl
            label={__('Awards Label', 'mbn-theme')}
            value={awardsLabel}
            onChange={(value) => setAttributes({ awardsLabel: value })}
            help={__('Label text for the awards section', 'mbn-theme')}
          />
        </PanelBody>

        {/* Background Image */}
        <PanelBody title={__('Background Image', 'mbn-theme')} initialOpen={false}>
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

        {/* Awards */}
        <PanelBody title={__('Awards', 'mbn-theme')} initialOpen={false}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder awards', 'mbn-theme')}
          </p>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={awards.map((award) => award.id)}
              strategy={verticalListSortingStrategy}
            >
              {awards.map((award, index) => (
                <SortableAward
                  key={award.id}
                  award={award}
                  index={index}
                  updateAward={updateAward}
                  removeAward={removeAward}
                  duplicateAward={duplicateAward}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addAward} style={{ marginTop: '15px' }}>
            {__('+ Add Award', 'mbn-theme')}
          </Button>
        </PanelBody>
      </InspectorControls>

      {/* Editor Preview */}
      <div {...blockProps}>
        <div className="container max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:gap-16 items-start">
            
            {/* Left Column - Text Content */}
            <div className="flex flex-col gap-6 flex-1">
              
              {/* Eyebrow */}
              {eyebrowText && (
                <p className="font-body text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-secondary">
                  {eyebrowText}
                </p>
              )}

              {/* Heading */}
              <RichText
                tagName="h2"
                value={mainHeading}
                onChange={(value) => setAttributes({ mainHeading: value })}
                placeholder={__('Enter heading...', 'mbn-theme')}
                className="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl text-heading leading-tight"
              />

              {/* Subheading */}
              <RichText
                tagName="p"
                value={subheading}
                onChange={(value) => setAttributes({ subheading: value })}
                placeholder={__('Enter description...', 'mbn-theme')}
                className="font-body text-base md:text-lg text-text-body leading-relaxed"
              />
            </div>

            {/* Right Column - Awards */}
            {awards.length > 0 && (
              <div className="flex flex-col md:flex-row lg:flex-col items-start md:items-center lg:items-start gap-6 lg:w-auto">
                {awardsLabel && (
                  <p className="font-heading text-sm md:text-base font-bold text-text-muted md:flex-shrink-0 max-w-none md:max-w-[100px]">
                    {awardsLabel}
                  </p>
                )}
                <div className="flex flex-wrap md:flex-1 lg:flex-initial gap-6">
                  {awards.map((award) => (
                    <div key={award.id} className="h-16 md:h-20 lg:h-24 w-auto">
                      {award.imageUrl && (
                        <img src={award.imageUrl} alt="" className="h-full w-auto object-contain" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
