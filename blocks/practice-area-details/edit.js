import { useBlockProps, InspectorControls, RichText, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button, Icon, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Generate unique ID for repeater items
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Sortable Feature Component
function SortableFeature({ item, index, updateItem, removeItem, duplicateItem }) {
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
          <strong>{__('Feature', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon="admin-page" label={__('Duplicate', 'mbn-theme')} onClick={() => duplicateItem(index)} />
          <Button icon="trash" label={__('Remove', 'mbn-theme')} onClick={() => removeItem(index)} />
        </div>
      </div>
      <TextControl
        label={__('Title', 'mbn-theme')}
        value={item.title}
        onChange={(value) => updateItem(index, { title: value })}
      />
      <TextareaControl
        label={__('Description (HTML allowed)', 'mbn-theme')}
        value={item.description}
        onChange={(value) => updateItem(index, { description: value })}
        rows={5}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
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
          <Button icon="admin-page" label={__('Duplicate', 'mbn-theme')} onClick={() => duplicateItem(index)} />
          <Button icon="trash" label={__('Remove', 'mbn-theme')} onClick={() => removeItem(index)} />
        </div>
      </div>
      <TextControl
        label={__('Question', 'mbn-theme')}
        value={item.question}
        onChange={(value) => updateItem(index, { question: value })}
      />
      <TextareaControl
        label={__('Answer (HTML allowed)', 'mbn-theme')}
        value={item.answer}
        onChange={(value) => updateItem(index, { answer: value })}
        rows={5}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
}

// Sortable Split Section Component
function SortableSplit({ item, index, updateItem, removeItem, duplicateItem }) {
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
          <strong>{__('Split Section', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon="admin-page" label={__('Duplicate', 'mbn-theme')} onClick={() => duplicateItem(index)} />
          <Button icon="trash" label={__('Remove', 'mbn-theme')} onClick={() => removeItem(index)} />
        </div>
      </div>
      <SelectControl
        label={__('Layout', 'mbn-theme')}
        value={item.layout}
        options={[
          { label: 'Text Left, Image Right', value: 'text-left' },
          { label: 'Image Left, Text Right', value: 'image-left' },
        ]}
        onChange={(value) => updateItem(index, { layout: value })}
      />
      <TextareaControl
        label={__('Text (HTML allowed)', 'mbn-theme')}
        value={item.text}
        onChange={(value) => updateItem(index, { text: value })}
        rows={5}
        style={{ marginTop: '10px' }}
      />
      <MediaUpload
        onSelect={(media) => updateItem(index, { imageUrl: media.url, imageId: media.id })}
        allowedTypes={['image']}
        value={item.imageId}
        render={({ open }) => (
          <div style={{ marginTop: '10px' }}>
            <Button onClick={open} variant="secondary">
              {item.imageUrl ? __('Replace Image', 'mbn-theme') : __('Select Image', 'mbn-theme')}
            </Button>
            {item.imageUrl && (
              <img src={item.imageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
            )}
          </div>
        )}
      />
    </div>
  );
}

// Sortable Liability Item Component
function SortableLiability({ item, index, updateItem, removeItem, duplicateItem }) {
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
          <strong>{__('Liability', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon="admin-page" label={__('Duplicate', 'mbn-theme')} onClick={() => duplicateItem(index)} />
          <Button icon="trash" label={__('Remove', 'mbn-theme')} onClick={() => removeItem(index)} />
        </div>
      </div>
      <TextControl
        label={__('Term', 'mbn-theme')}
        value={item.term}
        onChange={(value) => updateItem(index, { term: value })}
      />
      <TextareaControl
        label={__('Description (HTML allowed)', 'mbn-theme')}
        value={item.description}
        onChange={(value) => updateItem(index, { description: value })}
        rows={5}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
}

// Sortable Compensation Item Component
function SortableCompensation({ item, index, updateItem, removeItem, duplicateItem }) {
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
          <strong>{__('Compensation', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon="admin-page" label={__('Duplicate', 'mbn-theme')} onClick={() => duplicateItem(index)} />
          <Button icon="trash" label={__('Remove', 'mbn-theme')} onClick={() => removeItem(index)} />
        </div>
      </div>
      <TextControl
        label={__('Title', 'mbn-theme')}
        value={item.title}
        onChange={(value) => updateItem(index, { title: value })}
      />
      <TextareaControl
        label={__('Description (HTML allowed)', 'mbn-theme')}
        value={item.description}
        onChange={(value) => updateItem(index, { description: value })}
        rows={5}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
}

// Sortable Badge Card Component
function SortableBadge({ item, index, updateItem, removeItem, duplicateItem }) {
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
          <strong>{__('Badge', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon="admin-page" label={__('Duplicate', 'mbn-theme')} onClick={() => duplicateItem(index)} />
          <Button icon="trash" label={__('Remove', 'mbn-theme')} onClick={() => removeItem(index)} />
        </div>
      </div>
      <MediaUpload
        onSelect={(media) => updateItem(index, { imageUrl: media.url, imageId: media.id })}
        allowedTypes={['image']}
        value={item.imageId}
        render={({ open }) => (
          <div>
            <Button onClick={open} variant="secondary">
              {item.imageUrl ? __('Replace Badge Image', 'mbn-theme') : __('Select Badge Image', 'mbn-theme')}
            </Button>
            {item.imageUrl && (
              <img src={item.imageUrl} alt="" style={{ marginTop: '10px', maxWidth: '150px', height: 'auto', borderRadius: '4px' }} />
            )}
          </div>
        )}
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
    whyHireHeading,
    whyHireSubtitle,
    whyHireFeatures,
    whyHirePhotoUrl,
    whyHirePhotoId,
    badge90YearsUrl,
    badge90YearsId,
    mapBackgroundUrl,
    mapBackgroundId,
    badgeNoFeeUrl,
    badgeNoFeeId,
    freeEvaluationsTitle,
    freeEvaluationsDescription,
    millionsRecoveredTitle,
    millionsRecoveredDescription,
    caseResultTag,
    caseResultAmount,
    caseResultTitle,
    caseResultDescription,
    caseResultPhotoUrl,
    caseResultPhotoId,
    cta1LogoUrl,
    cta1LogoId,
    cta1TextureUrl,
    cta1TextureId,
    cta1Heading,
    cta1Subtext,
    cta1ButtonText,
    cta1ButtonUrl,
    cta1PhoneLabel,
    cta1PhoneNumber,
    afterAccidentHeading,
    afterAccidentSplits,
    stepsHeading,
    stepsIntroText,
    stepsAccordion,
    chevronIconUrl,
    chevronIconId,
    timeLimitHeading,
    timeLimitSubtitle,
    timeLimitText,
    timeLimitPhotoUrl,
    timeLimitPhotoId,
    insuranceHeading,
    insuranceText,
    insurancePhotoUrl,
    insurancePhotoId,
    cta2LogoUrl,
    cta2LogoId,
    cta2TextureUrl,
    cta2TextureId,
    cta2Heading,
    cta2Subtext,
    cta2ButtonText,
    cta2ButtonUrl,
    cta2PhoneLabel,
    cta2PhoneNumber,
    liabilityHeading,
    liabilitySubtitle,
    liabilityItems,
    compensationHeading,
    compensationSubtitle,
    compensationItems,
    documentationHeading,
    documentationText,
    documentationPhotoUrl,
    documentationPhotoId,
    badgeCards,
    attorneysHeading,
    attorneysText,
    attorneysPhotoUrl,
    attorneysPhotoId,
  } = attributes;

  const [activeSection, setActiveSection] = useState('whyHire');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generic array handlers
  const createArrayHandlers = (attributeName) => ({
    update: (index, updates) => {
      const updated = [...attributes[attributeName]];
      updated[index] = { ...updated[index], ...updates };
      setAttributes({ [attributeName]: updated });
    },
    add: (newItem) => {
      setAttributes({
        [attributeName]: [...attributes[attributeName], { ...newItem, id: generateUniqueId() }]
      });
    },
    remove: (index) => {
      const updated = attributes[attributeName].filter((_, i) => i !== index);
      setAttributes({ [attributeName]: updated });
    },
    duplicate: (index) => {
      const itemToDuplicate = { ...attributes[attributeName][index], id: generateUniqueId() };
      const updated = [
        ...attributes[attributeName].slice(0, index + 1),
        itemToDuplicate,
        ...attributes[attributeName].slice(index + 1)
      ];
      setAttributes({ [attributeName]: updated });
    },
    handleDragEnd: (event) => {
      const { active, over } = event;
      if (active.id !== over.id) {
        const oldIndex = attributes[attributeName].findIndex(item => item.id === active.id);
        const newIndex = attributes[attributeName].findIndex(item => item.id === over.id);
        setAttributes({
          [attributeName]: arrayMove(attributes[attributeName], oldIndex, newIndex),
        });
      }
    },
  });

  const featureHandlers = createArrayHandlers('whyHireFeatures');
  const splitHandlers = createArrayHandlers('afterAccidentSplits');
  const stepHandlers = createArrayHandlers('stepsAccordion');
  const liabilityHandlers = createArrayHandlers('liabilityItems');
  const compensationHandlers = createArrayHandlers('compensationItems');
  const badgeHandlers = createArrayHandlers('badgeCards');

  const blockProps = useBlockProps({
    className: 'practice-area-details-editor',
  });

  const sectionStyle = (section) => ({
    padding: '20px',
    marginBottom: '10px',
    border: activeSection === section ? '2px solid #2271b1' : '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: activeSection === section ? '#f0f6fc' : '#fff',
    cursor: 'pointer',
  });

  return (
    <Fragment>
      <InspectorControls>
        
        {/* Why Hire Section */}
        <PanelBody title={__('1. Why Hire Section', 'mbn-theme')} initialOpen={activeSection === 'whyHire'}>
          <TextControl
            label={__('Heading', 'mbn-theme')}
            value={whyHireHeading}
            onChange={(value) => setAttributes({ whyHireHeading: value })}
          />
          <TextareaControl
            label={__('Subtitle', 'mbn-theme')}
            value={whyHireSubtitle}
            onChange={(value) => setAttributes({ whyHireSubtitle: value })}
            rows={3}
          />
          
          <h4 style={{ marginTop: '20px' }}>{__('Features', 'mbn-theme')}</h4>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={featureHandlers.handleDragEnd}>
            <SortableContext items={whyHireFeatures.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {whyHireFeatures.map((item, index) => (
                <SortableFeature
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={featureHandlers.update}
                  removeItem={featureHandlers.remove}
                  duplicateItem={featureHandlers.duplicate}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button
            variant="primary"
            onClick={() => featureHandlers.add({ title: '', description: '' })}
            style={{ marginTop: '10px' }}
          >
            {__('+ Add Feature', 'mbn-theme')}
          </Button>

          <hr style={{ margin: '20px 0' }} />
          
          <h4>{__('Images', 'mbn-theme')}</h4>
          <MediaUpload
            onSelect={(media) => setAttributes({ whyHirePhotoUrl: media.url, whyHirePhotoId: media.id })}
            allowedTypes={['image']}
            value={whyHirePhotoId}
            render={({ open }) => (
              <div style={{ marginBottom: '10px' }}>
                <Button onClick={open} variant="secondary">
                  {whyHirePhotoUrl ? __('Replace Attorney Photo', 'mbn-theme') : __('Select Attorney Photo', 'mbn-theme')}
                </Button>
                {whyHirePhotoUrl && <img src={whyHirePhotoUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%' }} />}
              </div>
            )}
          />
          <MediaUpload
            onSelect={(media) => setAttributes({ badge90YearsUrl: media.url, badge90YearsId: media.id })}
            allowedTypes={['image']}
            value={badge90YearsId}
            render={({ open }) => (
              <div style={{ marginBottom: '10px' }}>
                <Button onClick={open} variant="secondary">
                  {badge90YearsUrl ? __('Replace 90+ Years Badge', 'mbn-theme') : __('Select 90+ Years Badge', 'mbn-theme')}
                </Button>
                {badge90YearsUrl && <img src={badge90YearsUrl} alt="" style={{ marginTop: '10px', maxWidth: '150px' }} />}
              </div>
            )}
          />
          <MediaUpload
            onSelect={(media) => setAttributes({ mapBackgroundUrl: media.url, mapBackgroundId: media.id })}
            allowedTypes={['image']}
            value={mapBackgroundId}
            render={({ open }) => (
              <div style={{ marginBottom: '10px' }}>
                <Button onClick={open} variant="secondary">
                  {mapBackgroundUrl ? __('Replace Map Background', 'mbn-theme') : __('Select Map Background', 'mbn-theme')}
                </Button>
                {mapBackgroundUrl && <img src={mapBackgroundUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%' }} />}
              </div>
            )}
          />
          <MediaUpload
            onSelect={(media) => setAttributes({ badgeNoFeeUrl: media.url, badgeNoFeeId: media.id })}
            allowedTypes={['image']}
            value={badgeNoFeeId}
            render={({ open }) => (
              <div style={{ marginBottom: '10px' }}>
                <Button onClick={open} variant="secondary">
                  {badgeNoFeeUrl ? __('Replace No Fee Badge', 'mbn-theme') : __('Select No Fee Badge', 'mbn-theme')}
                </Button>
                {badgeNoFeeUrl && <img src={badgeNoFeeUrl} alt="" style={{ marginTop: '10px', maxWidth: '150px' }} />}
              </div>
            )}
          />

          <hr style={{ margin: '20px 0' }} />
          
          <h4>{__('Free Evaluations', 'mbn-theme')}</h4>
          <TextControl
            label={__('Title', 'mbn-theme')}
            value={freeEvaluationsTitle}
            onChange={(value) => setAttributes({ freeEvaluationsTitle: value })}
          />
          <TextareaControl
            label={__('Description (HTML)', 'mbn-theme')}
            value={freeEvaluationsDescription}
            onChange={(value) => setAttributes({ freeEvaluationsDescription: value })}
            rows={4}
          />

          <h4 style={{ marginTop: '20px' }}>{__('Millions Recovered', 'mbn-theme')}</h4>
          <TextControl
            label={__('Title', 'mbn-theme')}
            value={millionsRecoveredTitle}
            onChange={(value) => setAttributes({ millionsRecoveredTitle: value })}
          />
          <TextareaControl
            label={__('Description (HTML)', 'mbn-theme')}
            value={millionsRecoveredDescription}
            onChange={(value) => setAttributes({ millionsRecoveredDescription: value })}
            rows={3}
          />
        </PanelBody>

        {/* Case Result */}
        <PanelBody title={__('2. Case Result Card', 'mbn-theme')} initialOpen={activeSection === 'caseResult'}>
          <TextControl
            label={__('Tag', 'mbn-theme')}
            value={caseResultTag}
            onChange={(value) => setAttributes({ caseResultTag: value })}
          />
          <TextControl
            label={__('Amount', 'mbn-theme')}
            value={caseResultAmount}
            onChange={(value) => setAttributes({ caseResultAmount: value })}
          />
          <TextControl
            label={__('Title', 'mbn-theme')}
            value={caseResultTitle}
            onChange={(value) => setAttributes({ caseResultTitle: value })}
          />
          <TextareaControl
            label={__('Description (HTML)', 'mbn-theme')}
            value={caseResultDescription}
            onChange={(value) => setAttributes({ caseResultDescription: value })}
            rows={3}
          />
          <MediaUpload
            onSelect={(media) => setAttributes({ caseResultPhotoUrl: media.url, caseResultPhotoId: media.id })}
            allowedTypes={['image']}
            value={caseResultPhotoId}
            render={({ open }) => (
              <div style={{ marginTop: '10px' }}>
                <Button onClick={open} variant="secondary">
                  {caseResultPhotoUrl ? __('Replace Photo', 'mbn-theme') : __('Select Photo', 'mbn-theme')}
                </Button>
                {caseResultPhotoUrl && <img src={caseResultPhotoUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%' }} />}
              </div>
            )}
          />
        </PanelBody>

        {/* CTA Banner 1 */}
        <PanelBody title={__('3. CTA Banner #1', 'mbn-theme')} initialOpen={activeSection === 'cta1'}>
          <TextControl label={__('Heading', 'mbn-theme')} value={cta1Heading} onChange={(value) => setAttributes({ cta1Heading: value })} />
          <TextareaControl label={__('Subtext', 'mbn-theme')} value={cta1Subtext} onChange={(value) => setAttributes({ cta1Subtext: value })} rows={2} />
          <TextControl label={__('Button Text', 'mbn-theme')} value={cta1ButtonText} onChange={(value) => setAttributes({ cta1ButtonText: value })} />
          <TextControl label={__('Button URL', 'mbn-theme')} value={cta1ButtonUrl} onChange={(value) => setAttributes({ cta1ButtonUrl: value })} />
          <TextControl label={__('Phone Label', 'mbn-theme')} value={cta1PhoneLabel} onChange={(value) => setAttributes({ cta1PhoneLabel: value })} />
          <TextControl label={__('Phone Number', 'mbn-theme')} value={cta1PhoneNumber} onChange={(value) => setAttributes({ cta1PhoneNumber: value })} />
          <MediaUpload
            onSelect={(media) => setAttributes({ cta1LogoUrl: media.url, cta1LogoId: media.id })}
            allowedTypes={['image']}
            value={cta1LogoId}
            render={({ open }) => (
              <div style={{ marginTop: '10px' }}>
                <Button onClick={open} variant="secondary">{cta1LogoUrl ? __('Replace Logo', 'mbn-theme') : __('Select Logo', 'mbn-theme')}</Button>
                {cta1LogoUrl && <img src={cta1LogoUrl} alt="" style={{ marginTop: '10px', maxWidth: '100px' }} />}
              </div>
            )}
          />
          <MediaUpload
            onSelect={(media) => setAttributes({ cta1TextureUrl: media.url, cta1TextureId: media.id })}
            allowedTypes={['image']}
            value={cta1TextureId}
            render={({ open }) => (
              <div style={{ marginTop: '10px' }}>
                <Button onClick={open} variant="secondary">{cta1TextureUrl ? __('Replace Texture', 'mbn-theme') : __('Select Texture', 'mbn-theme')}</Button>
                {cta1TextureUrl && <img src={cta1TextureUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%' }} />}
              </div>
            )}
          />
        </PanelBody>

        {/* After Accident */}
        <PanelBody title={__('4. After Accident Section', 'mbn-theme')} initialOpen={activeSection === 'afterAccident'}>
          <TextControl
            label={__('Heading', 'mbn-theme')}
            value={afterAccidentHeading}
            onChange={(value) => setAttributes({ afterAccidentHeading: value })}
          />
          <h4 style={{ marginTop: '20px' }}>{__('Split Sections', 'mbn-theme')}</h4>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={splitHandlers.handleDragEnd}>
            <SortableContext items={afterAccidentSplits.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {afterAccidentSplits.map((item, index) => (
                <SortableSplit
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={splitHandlers.update}
                  removeItem={splitHandlers.remove}
                  duplicateItem={splitHandlers.duplicate}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button variant="primary" onClick={() => splitHandlers.add({ text: '', imageUrl: '', imageId: 0, layout: 'text-left' })} style={{ marginTop: '10px' }}>
            {__('+ Add Split Section', 'mbn-theme')}
          </Button>
        </PanelBody>

        {/* Steps Accordion */}
        <PanelBody title={__('5. Steps Accordion', 'mbn-theme')} initialOpen={activeSection === 'steps'}>
          <TextareaControl
            label={__('Heading (HTML)', 'mbn-theme')}
            value={stepsHeading}
            onChange={(value) => setAttributes({ stepsHeading: value })}
            rows={2}
          />
          <TextareaControl
            label={__('Intro Text (HTML)', 'mbn-theme')}
            value={stepsIntroText}
            onChange={(value) => setAttributes({ stepsIntroText: value })}
            rows={3}
          />
          <MediaUpload
            onSelect={(media) => setAttributes({ chevronIconUrl: media.url, chevronIconId: media.id })}
            allowedTypes={['image']}
            value={chevronIconId}
            render={({ open }) => (
              <div style={{ marginTop: '10px' }}>
                <Button onClick={open} variant="secondary">{chevronIconUrl ? __('Replace Chevron Icon', 'mbn-theme') : __('Select Chevron Icon', 'mbn-theme')}</Button>
                {chevronIconUrl && <img src={chevronIconUrl} alt="" style={{ marginTop: '10px', maxWidth: '50px' }} />}
              </div>
            )}
          />
          <h4 style={{ marginTop: '20px' }}>{__('Steps', 'mbn-theme')}</h4>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={stepHandlers.handleDragEnd}>
            <SortableContext items={stepsAccordion.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {stepsAccordion.map((item, index) => (
                <SortableStep
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={stepHandlers.update}
                  removeItem={stepHandlers.remove}
                  duplicateItem={stepHandlers.duplicate}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button variant="primary" onClick={() => stepHandlers.add({ question: '', answer: '' })} style={{ marginTop: '10px' }}>
            {__('+ Add Step', 'mbn-theme')}
          </Button>
        </PanelBody>

        {/* Time Limit */}
        <PanelBody title={__('6. Time Limit Section', 'mbn-theme')} initialOpen={activeSection === 'timeLimit'}>
          <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={timeLimitHeading} onChange={(value) => setAttributes({ timeLimitHeading: value })} rows={2} />
          <TextareaControl label={__('Subtitle (HTML)', 'mbn-theme')} value={timeLimitSubtitle} onChange={(value) => setAttributes({ timeLimitSubtitle: value })} rows={3} />
          <TextareaControl label={__('Text (HTML)', 'mbn-theme')} value={timeLimitText} onChange={(value) => setAttributes({ timeLimitText: value })} rows={5} />
          <MediaUpload
            onSelect={(media) => setAttributes({ timeLimitPhotoUrl: media.url, timeLimitPhotoId: media.id })}
            allowedTypes={['image']}
            value={timeLimitPhotoId}
            render={({ open }) => (
              <div style={{ marginTop: '10px' }}>
                <Button onClick={open} variant="secondary">{timeLimitPhotoUrl ? __('Replace Photo', 'mbn-theme') : __('Select Photo', 'mbn-theme')}</Button>
                {timeLimitPhotoUrl && <img src={timeLimitPhotoUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%' }} />}
              </div>
            )}
          />
        </PanelBody>

        {/* Insurance */}
        <PanelBody title={__('7. Insurance Section', 'mbn-theme')} initialOpen={activeSection === 'insurance'}>
          <TextControl label={__('Heading', 'mbn-theme')} value={insuranceHeading} onChange={(value) => setAttributes({ insuranceHeading: value })} />
          <TextareaControl label={__('Text (HTML)', 'mbn-theme')} value={insuranceText} onChange={(value) => setAttributes({ insuranceText: value })} rows={5} />
          <MediaUpload
            onSelect={(media) => setAttributes({ insurancePhotoUrl: media.url, insurancePhotoId: media.id })}
            allowedTypes={['image']}
            value={insurancePhotoId}
            render={({ open }) => (
              <div style={{ marginTop: '10px' }}>
                <Button onClick={open} variant="secondary">{insurancePhotoUrl ? __('Replace Photo', 'mbn-theme') : __('Select Photo', 'mbn-theme')}</Button>
                {insurancePhotoUrl && <img src={insurancePhotoUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%' }} />}
              </div>
            )}
          />
        </PanelBody>

        {/* CTA Banner 2 */}
        <PanelBody title={__('8. CTA Banner #2', 'mbn-theme')} initialOpen={activeSection === 'cta2'}>
          <TextControl label={__('Heading', 'mbn-theme')} value={cta2Heading} onChange={(value) => setAttributes({ cta2Heading: value })} />
          <TextareaControl label={__('Subtext', 'mbn-theme')} value={cta2Subtext} onChange={(value) => setAttributes({ cta2Subtext: value })} rows={2} />
          <TextControl label={__('Button Text', 'mbn-theme')} value={cta2ButtonText} onChange={(value) => setAttributes({ cta2ButtonText: value })} />
          <TextControl label={__('Button URL', 'mbn-theme')} value={cta2ButtonUrl} onChange={(value) => setAttributes({ cta2ButtonUrl: value })} />
          <TextControl label={__('Phone Label', 'mbn-theme')} value={cta2PhoneLabel} onChange={(value) => setAttributes({ cta2PhoneLabel: value })} />
          <TextControl label={__('Phone Number', 'mbn-theme')} value={cta2PhoneNumber} onChange={(value) => setAttributes({ cta2PhoneNumber: value })} />
          <MediaUpload
            onSelect={(media) => setAttributes({ cta2LogoUrl: media.url, cta2LogoId: media.id })}
            allowedTypes={['image']}
            value={cta2LogoId}
            render={({ open }) => (
              <div style={{ marginTop: '10px' }}>
                <Button onClick={open} variant="secondary">{cta2LogoUrl ? __('Replace Logo', 'mbn-theme') : __('Select Logo', 'mbn-theme')}</Button>
                {cta2LogoUrl && <img src={cta2LogoUrl} alt="" style={{ marginTop: '10px', maxWidth: '100px' }} />}
              </div>
            )}
          />
          <MediaUpload
            onSelect={(media) => setAttributes({ cta2TextureUrl: media.url, cta2TextureId: media.id })}
            allowedTypes={['image']}
            value={cta2TextureId}
            render={({ open }) => (
              <div style={{ marginTop: '10px' }}>
                <Button onClick={open} variant="secondary">{cta2TextureUrl ? __('Replace Texture', 'mbn-theme') : __('Select Texture', 'mbn-theme')}</Button>
                {cta2TextureUrl && <img src={cta2TextureUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%' }} />}
              </div>
            )}
          />
        </PanelBody>

        {/* Liability */}
        <PanelBody title={__('9. Liability Section', 'mbn-theme')} initialOpen={activeSection === 'liability'}>
          <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={liabilityHeading} onChange={(value) => setAttributes({ liabilityHeading: value })} rows={2} />
          <TextareaControl label={__('Subtitle', 'mbn-theme')} value={liabilitySubtitle} onChange={(value) => setAttributes({ liabilitySubtitle: value })} rows={2} />
          <h4 style={{ marginTop: '20px' }}>{__('Liability Items', 'mbn-theme')}</h4>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={liabilityHandlers.handleDragEnd}>
            <SortableContext items={liabilityItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {liabilityItems.map((item, index) => (
                <SortableLiability
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={liabilityHandlers.update}
                  removeItem={liabilityHandlers.remove}
                  duplicateItem={liabilityHandlers.duplicate}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button variant="primary" onClick={() => liabilityHandlers.add({ term: '', description: '' })} style={{ marginTop: '10px' }}>
            {__('+ Add Liability Item', 'mbn-theme')}
          </Button>
        </PanelBody>

        {/* Compensation */}
        <PanelBody title={__('10. Compensation Section', 'mbn-theme')} initialOpen={activeSection === 'compensation'}>
          <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={compensationHeading} onChange={(value) => setAttributes({ compensationHeading: value })} rows={2} />
          <TextareaControl label={__('Subtitle', 'mbn-theme')} value={compensationSubtitle} onChange={(value) => setAttributes({ compensationSubtitle: value })} rows={2} />
          <h4 style={{ marginTop: '20px' }}>{__('Compensation Items', 'mbn-theme')}</h4>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={compensationHandlers.handleDragEnd}>
            <SortableContext items={compensationItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {compensationItems.map((item, index) => (
                <SortableCompensation
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={compensationHandlers.update}
                  removeItem={compensationHandlers.remove}
                  duplicateItem={compensationHandlers.duplicate}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button variant="primary" onClick={() => compensationHandlers.add({ title: '', description: '' })} style={{ marginTop: '10px' }}>
            {__('+ Add Compensation Item', 'mbn-theme')}
          </Button>
        </PanelBody>

        {/* Documentation */}
        <PanelBody title={__('11. Documentation Section', 'mbn-theme')} initialOpen={activeSection === 'documentation'}>
          <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={documentationHeading} onChange={(value) => setAttributes({ documentationHeading: value })} rows={2} />
          <TextareaControl label={__('Text (HTML)', 'mbn-theme')} value={documentationText} onChange={(value) => setAttributes({ documentationText: value })} rows={5} />
          <MediaUpload
            onSelect={(media) => setAttributes({ documentationPhotoUrl: media.url, documentationPhotoId: media.id })}
            allowedTypes={['image']}
            value={documentationPhotoId}
            render={({ open }) => (
              <div style={{ marginTop: '10px' }}>
                <Button onClick={open} variant="secondary">{documentationPhotoUrl ? __('Replace Photo', 'mbn-theme') : __('Select Photo', 'mbn-theme')}</Button>
                {documentationPhotoUrl && <img src={documentationPhotoUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%' }} />}
              </div>
            )}
          />
        </PanelBody>

        {/* Attorneys */}
        <PanelBody title={__('12. Attorneys Section', 'mbn-theme')} initialOpen={activeSection === 'attorneys'}>
          <h4>{__('Badge Cards', 'mbn-theme')}</h4>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={badgeHandlers.handleDragEnd}>
            <SortableContext items={badgeCards.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {badgeCards.map((item, index) => (
                <SortableBadge
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={badgeHandlers.update}
                  removeItem={badgeHandlers.remove}
                  duplicateItem={badgeHandlers.duplicate}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button variant="primary" onClick={() => badgeHandlers.add({ imageUrl: '', imageId: 0, description: '' })} style={{ marginTop: '10px' }}>
            {__('+ Add Badge Card', 'mbn-theme')}
          </Button>

          <hr style={{ margin: '20px 0' }} />
          
          <h4>{__('Attorneys Content', 'mbn-theme')}</h4>
          <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={attorneysHeading} onChange={(value) => setAttributes({ attorneysHeading: value })} rows={2} />
          <TextareaControl label={__('Text (HTML)', 'mbn-theme')} value={attorneysText} onChange={(value) => setAttributes({ attorneysText: value })} rows={4} />
          <MediaUpload
            onSelect={(media) => setAttributes({ attorneysPhotoUrl: media.url, attorneysPhotoId: media.id })}
            allowedTypes={['image']}
            value={attorneysPhotoId}
            render={({ open }) => (
              <div style={{ marginTop: '10px' }}>
                <Button onClick={open} variant="secondary">{attorneysPhotoUrl ? __('Replace Photo', 'mbn-theme') : __('Select Photo', 'mbn-theme')}</Button>
                {attorneysPhotoUrl && <img src={attorneysPhotoUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%' }} />}
              </div>
            )}
          />
        </PanelBody>

      </InspectorControls>

      <div {...blockProps}>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 'bold' }}>
            {__('Practice Area Details Block', 'mbn-theme')}
          </h3>
          <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
            {__('Click on any section below to edit its content in the sidebar →', 'mbn-theme')}
          </p>

          <div onClick={() => setActiveSection('whyHire')} style={sectionStyle('whyHire')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>1. Why Hire Section</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              {whyHireFeatures.length} features • Photos & badges
            </p>
          </div>

          <div onClick={() => setActiveSection('caseResult')} style={sectionStyle('caseResult')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>2. Case Result Card</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              {caseResultAmount} • {caseResultTag}
            </p>
          </div>

          <div onClick={() => setActiveSection('cta1')} style={sectionStyle('cta1')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>3. CTA Banner #1</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              {cta1Heading}
            </p>
          </div>

          <div onClick={() => setActiveSection('afterAccident')} style={sectionStyle('afterAccident')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>4. After Accident Section</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              {afterAccidentSplits.length} split sections
            </p>
          </div>

          <div onClick={() => setActiveSection('steps')} style={sectionStyle('steps')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>5. Steps Accordion</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              {stepsAccordion.length} steps
            </p>
          </div>

          <div onClick={() => setActiveSection('timeLimit')} style={sectionStyle('timeLimit')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>6. Time Limit Section</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Split layout with text + image
            </p>
          </div>

          <div onClick={() => setActiveSection('insurance')} style={sectionStyle('insurance')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>7. Insurance Section</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Split layout with text + image
            </p>
          </div>

          <div onClick={() => setActiveSection('cta2')} style={sectionStyle('cta2')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>8. CTA Banner #2</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              {cta2Heading}
            </p>
          </div>

          <div onClick={() => setActiveSection('liability')} style={sectionStyle('liability')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>9. Liability Section</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              {liabilityItems.length} liability scenarios
            </p>
          </div>

          <div onClick={() => setActiveSection('compensation')} style={sectionStyle('compensation')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>10. Compensation Section</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              {compensationItems.length} compensation types
            </p>
          </div>

          <div onClick={() => setActiveSection('documentation')} style={sectionStyle('documentation')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>11. Documentation Section</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Split layout with text + image
            </p>
          </div>

          <div onClick={() => setActiveSection('attorneys')} style={sectionStyle('attorneys')}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>12. Attorneys Section</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              {badgeCards.length} badge cards • Attorney photo
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
