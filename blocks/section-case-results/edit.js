import { useBlockProps, InspectorControls, MediaUpload, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button, Icon } from '@wordpress/components';
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

// Sortable Case Result Component
function SortableCaseResult({ item, index, updateItem, removeItem, duplicateItem }) {
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
          <strong>{__('Case Result', 'mbn-theme')} {index + 1}</strong>
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
        label={__('Tag Text', 'mbn-theme')}
        value={item.tagText}
        onChange={(value) => updateItem(index, { tagText: value })}
        style={{ marginTop: '10px' }}
      />

      <TextControl
        label={__('Case Heading (Amount)', 'mbn-theme')}
        value={item.caseHeading}
        onChange={(value) => updateItem(index, { caseHeading: value })}
        placeholder="$15,000,000"
        style={{ marginTop: '10px' }}
      />

      <TextareaControl
        label={__('Case Subheading', 'mbn-theme')}
        value={item.caseSubheading}
        onChange={(value) => updateItem(index, { caseSubheading: value })}
        rows={2}
        style={{ marginTop: '10px' }}
      />

      <TextareaControl
        label={__('Case Content', 'mbn-theme')}
        value={item.caseContent}
        onChange={(value) => updateItem(index, { caseContent: value })}
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
    caseResults,
    buttonText,
    buttonUrl,
    backgroundColor,
  } = attributes;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Case Results handlers
  const updateCaseResult = (index, updates) => {
    const updated = [...caseResults];
    updated[index] = { ...updated[index], ...updates };
    setAttributes({ caseResults: updated });
  };

  const addCaseResult = () => {
    setAttributes({
      caseResults: [...caseResults, {
        id: generateUniqueId(),
        imageUrl: '',
        imageId: 0,
        tagText: '',
        caseHeading: '',
        caseSubheading: '',
        caseContent: ''
      }]
    });
  };

  const removeCaseResult = (index) => {
    const updated = caseResults.filter((_, i) => i !== index);
    setAttributes({ caseResults: updated });
  };

  const duplicateCaseResult = (index) => {
    const itemToDuplicate = { ...caseResults[index], id: generateUniqueId() };
    const updated = [
      ...caseResults.slice(0, index + 1),
      itemToDuplicate,
      ...caseResults.slice(index + 1)
    ];
    setAttributes({ caseResults: updated });
  };

  const handleCaseResultDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = caseResults.findIndex(item => item.id === active.id);
      const newIndex = caseResults.findIndex(item => item.id === over.id);
      setAttributes({
        caseResults: arrayMove(caseResults, oldIndex, newIndex),
      });
    }
  };

  const blockProps = useBlockProps({
    className: 'bg-white py-12',
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

        {/* Case Results Settings */}
        <PanelBody title={__('Case Results', 'mbn-theme')} initialOpen={false}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder case results', 'mbn-theme')}
          </p>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleCaseResultDragEnd}
          >
            <SortableContext
              items={caseResults.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {caseResults.map((item, index) => (
                <SortableCaseResult
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={updateCaseResult}
                  removeItem={removeCaseResult}
                  duplicateItem={duplicateCaseResult}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addCaseResult} style={{ marginTop: '15px' }}>
            {__('+ Add Case Result', 'mbn-theme')}
          </Button>
        </PanelBody>

        {/* Button Settings */}
        <PanelBody title={__('Button', 'mbn-theme')} initialOpen={false}>
          <TextControl
            label={__('Button Text', 'mbn-theme')}
            value={buttonText}
            onChange={(value) => setAttributes({ buttonText: value })}
          />
          <TextControl
            label={__('Button URL', 'mbn-theme')}
            value={buttonUrl}
            onChange={(value) => setAttributes({ buttonUrl: value })}
          />
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

          {/* Case Results Preview */}
          <div className="flex flex-col gap-10 mb-12">
            {caseResults.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                {__('Add case results in the sidebar →', 'mbn-theme')}
              </div>
            )}
            {caseResults.map((caseResult, index) => (
              <div key={caseResult.id} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-6`}>
                <div className="w-1/2">
                  {caseResult.imageUrl ? (
                    <img src={caseResult.imageUrl} alt="" className="w-full h-48 object-cover shadow-lg" />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">{__('No image', 'mbn-theme')}</span>
                    </div>
                  )}
                </div>
                <div className="w-1/2">
                  <div className="bg-white p-6 shadow-lg rounded-lg border">
                    {caseResult.tagText && (
                      <span className="inline-block text-xs px-3 py-1 border rounded mb-3">
                        {caseResult.tagText}
                      </span>
                    )}
                    {caseResult.caseHeading && (
                      <h3 className="font-heading font-bold text-3xl mb-2">
                        {caseResult.caseHeading}
                      </h3>
                    )}
                    {caseResult.caseSubheading && (
                      <p className="font-heading font-semibold text-lg mb-2">
                        {caseResult.caseSubheading}
                      </p>
                    )}
                    {caseResult.caseContent && (
                      <p className="font-body text-sm text-text-body">
                        {caseResult.caseContent}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Button */}
          {buttonText && (
            <div className="text-center">
              <a href={buttonUrl} className="inline-flex h-12 px-8 rounded-full font-body font-bold border">
                {buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
