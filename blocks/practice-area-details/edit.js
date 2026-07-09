import { useBlockProps, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button, Icon, SelectControl, ToggleControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BackgroundColorControl from '../shared/BackgroundColorControl';

// Generate unique ID for section instances and repeater items.
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Section type → display label.
const SECTION_TYPES = {
  whyHire: { label: 'Why Hire' },
  caseResult: { label: 'Case Result Card' },
  cta: { label: 'CTA Banner' },
  afterAccident: { label: 'After Accident' },
  steps: { label: 'Steps Accordion' },
  timeLimit: { label: 'Time Limit' },
  insurance: { label: 'Insurance' },
  liability: { label: 'Liability' },
  compensation: { label: 'Compensation' },
  documentation: { label: 'Documentation' },
  attorneys: { label: 'Attorneys' },
  thirdParty: { label: 'Third-Party Liability' },
  commonCauses: { label: 'Common Causes' },
  testimonials: { label: 'Testimonials' },
  accidentList: { label: 'Lists of Accidents' },
  whyLawyer: { label: 'Why You Need a Lawyer' },
};

// Empty data payload for a newly added section of the given type.
function emptyData(type) {
  switch (type) {
    case 'whyHire':
      return { heading: '', subtitle: '', features: [], photoUrl: '', photoId: 0, badge90YearsUrl: '', badge90YearsId: 0, mapBackgroundUrl: '', mapBackgroundId: 0, badgeNoFeeUrl: '', badgeNoFeeId: 0, freeEvaluationsTitle: '', freeEvaluationsDescription: '', millionsRecoveredTitle: '', millionsRecoveredDescription: '' };
    case 'caseResult':
      return { tag: '', amount: '', title: '', description: '', photoUrl: '', photoId: 0 };
    case 'cta':
      return { logoUrl: '', logoId: 0, textureUrl: '', textureId: 0, heading: '', subtext: '', buttonText: '', buttonUrl: '', phoneLabel: '', phoneNumber: '' };
    case 'afterAccident':
      return { heading: '', splits: [] };
    case 'steps':
      return { heading: '', introText: '', chevronIconUrl: '', chevronIconId: 0, listType: 'ol', accordion: [] };
    case 'timeLimit':
      return { heading: '', subtitle: '', text: '', photoUrl: '', photoId: 0 };
    case 'insurance':
      return { heading: '', text: '', photoUrl: '', photoId: 0 };
    case 'liability':
      return { heading: '', subtitle: '', introHeading: '', introText: '', backgroundColor: 'bg-white', paddingTop: '', paddingBottom: '', afterText: '', items: [] };
    case 'compensation':
      return { heading: '', subtitle: '', afterText: '', items: [] };
    case 'documentation':
      return { heading: '', text: '', photoUrl: '', photoId: 0 };
    case 'attorneys':
      return { heading: '', text: '', photoUrl: '', photoId: 0, badgeCards: [] };
    case 'thirdParty':
      return { text: '', items: [], chevronIconUrl: '', chevronIconId: 0, photoUrl: '', photoId: 0 };
    case 'commonCauses':
      return { heading: '', text: '', photoUrl: '', photoId: 0, items: [] };
    case 'testimonials':
      return { eyebrow: '', heading: '', subtitle: '', starsIconUrl: '', starsIconId: 0, items: [] };
    case 'accidentList':
      return { heading: '', backgroundColor: 'bg-light-blue', items: [] };
    case 'whyLawyer':
      return {
        heading: '<span class="pad-text-blue">Why You Need a Lawyer</span> For a<br>Burn Injury Case',
        subtitle: 'Burn injury cases can be complex and require an experienced attorney to navigate the legal landscape. Here’s why it’s so important to work with one if you’ve experienced a burn injury:',
        rows: [
          { id: 'whyLawyerRow1', layout: 'text-left', heading: '<span class="pad-text-blue">Burn Injury Cases</span> Are Complex', text: '<p>Burn injuries can be complex, with long-term effects that may require extensive medical treatment. A lawyer can help assess and quantify these impacts, ensuring that all current and future medical needs are addressed in your claim.</p>', imageUrl: '', imageId: 0 },
          { id: 'whyLawyerRow2', layout: 'image-left', heading: '<span class="pad-text-blue">Determining</span> Liability', text: '<p>Establishing liability in burn injury cases can be challenging. A lawyer with experience in such cases can investigate the incident, identify responsible parties, and demonstrate their negligence to help you pursue compensation.</p>', imageUrl: '', imageId: 0 },
          { id: 'whyLawyerRow3', layout: 'text-left', heading: '<span class="pad-text-blue">Negotiating</span> With Insurance Companies', text: '<p>Insurance companies aim to settle claims for the lowest possible amount. A lawyer can negotiate effectively on your behalf to ensure you receive fair compensation that reflects the severity of your injury and covers your necessary treatment and losses.</p>', imageUrl: '', imageId: 0 },
        ],
      };
    default:
      return {};
  }
}

// Handlers for a repeater array stored inside a section's data.
function makeArrayField(data, setData, key) {
  const items = data[key] || [];
  return {
    items,
    update: (index, updates) => {
      const next = [...items];
      next[index] = { ...next[index], ...updates };
      setData({ [key]: next });
    },
    add: (newItem) => setData({ [key]: [...items, { ...newItem, id: generateUniqueId() }] }),
    remove: (index) => setData({ [key]: items.filter((_, i) => i !== index) }),
    duplicate: (index) => {
      const dup = { ...items[index], id: generateUniqueId() };
      setData({ [key]: [...items.slice(0, index + 1), dup, ...items.slice(index + 1)] });
    },
    dragEnd: (event) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        setData({ [key]: arrayMove(items, oldIndex, newIndex) });
      }
    },
  };
}

// Reusable image picker with Select / Replace / Remove.
function ImageField({ label, url, id, onSelect, onRemove, maxWidth = '100%' }) {
  return (
    <MediaUpload
      onSelect={onSelect}
      allowedTypes={['image']}
      value={id}
      render={({ open }) => (
        <div style={{ marginBottom: '10px', marginTop: '10px' }}>
          <Button onClick={open} variant="secondary">
            {url ? __('Replace', 'mbn-theme') : __('Select', 'mbn-theme')} {label}
          </Button>
          {url && (
            <Button onClick={onRemove} variant="link" isDestructive style={{ marginLeft: '8px' }}>
              {__('Remove', 'mbn-theme')}
            </Button>
          )}
          {url && <img src={url} alt="" style={{ display: 'block', marginTop: '10px', maxWidth, height: 'auto', borderRadius: '4px' }} />}
        </div>
      )}
    />
  );
}

// Shared drag/duplicate/remove header for repeater items.
function itemStyle(transform, transition, isDragging) {
  return {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
  };
}

function ItemHeader({ attributes, listeners, label, index, onDuplicate, onRemove }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '5px' }}>
          <Icon icon="menu" />
        </div>
        <strong>{label} {index + 1}</strong>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button icon="admin-page" label={__('Duplicate', 'mbn-theme')} onClick={onDuplicate} />
        <Button icon="trash" label={__('Remove', 'mbn-theme')} onClick={onRemove} />
      </div>
    </div>
  );
}

// ── Repeater item components ────────────────────────────────
function SortableFeature({ item, index, updateItem, removeItem, duplicateItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div ref={setNodeRef} style={itemStyle(transform, transition, isDragging)}>
      <ItemHeader attributes={attributes} listeners={listeners} label={__('Feature', 'mbn-theme')} index={index} onDuplicate={() => duplicateItem(index)} onRemove={() => removeItem(index)} />
      <TextControl label={__('Title', 'mbn-theme')} value={item.title} onChange={(v) => updateItem(index, { title: v })} />
      <TextareaControl label={__('Description (HTML allowed)', 'mbn-theme')} value={item.description} onChange={(v) => updateItem(index, { description: v })} rows={5} style={{ marginTop: '10px' }} />
    </div>
  );
}

function SortableStep({ item, index, updateItem, removeItem, duplicateItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div ref={setNodeRef} style={itemStyle(transform, transition, isDragging)}>
      <ItemHeader attributes={attributes} listeners={listeners} label={__('Step', 'mbn-theme')} index={index} onDuplicate={() => duplicateItem(index)} onRemove={() => removeItem(index)} />
      <TextControl label={__('Question', 'mbn-theme')} value={item.question} onChange={(v) => updateItem(index, { question: v })} />
      <TextareaControl label={__('Answer (HTML allowed)', 'mbn-theme')} value={item.answer} onChange={(v) => updateItem(index, { answer: v })} rows={5} style={{ marginTop: '10px' }} />
    </div>
  );
}

function SortableSplit({ item, index, updateItem, removeItem, duplicateItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div ref={setNodeRef} style={itemStyle(transform, transition, isDragging)}>
      <ItemHeader attributes={attributes} listeners={listeners} label={__('Split Section', 'mbn-theme')} index={index} onDuplicate={() => duplicateItem(index)} onRemove={() => removeItem(index)} />
      <SelectControl
        label={__('Layout', 'mbn-theme')}
        value={item.layout}
        options={[
          { label: 'Text Left, Image Right', value: 'text-left' },
          { label: 'Image Left, Text Right', value: 'image-left' },
        ]}
        onChange={(v) => updateItem(index, { layout: v })}
      />
      <TextareaControl label={__('Text (HTML allowed)', 'mbn-theme')} value={item.text} onChange={(v) => updateItem(index, { text: v })} rows={5} style={{ marginTop: '10px' }} />
      <ImageField
        label={__('Image', 'mbn-theme')}
        url={item.imageUrl}
        id={item.imageId}
        onSelect={(m) => updateItem(index, { imageUrl: m.url, imageId: m.id })}
        onRemove={() => updateItem(index, { imageUrl: '', imageId: 0 })}
      />
    </div>
  );
}

function SortableLiability({ item, index, updateItem, removeItem, duplicateItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div ref={setNodeRef} style={itemStyle(transform, transition, isDragging)}>
      <ItemHeader attributes={attributes} listeners={listeners} label={__('Liability', 'mbn-theme')} index={index} onDuplicate={() => duplicateItem(index)} onRemove={() => removeItem(index)} />
      <TextControl label={__('Term', 'mbn-theme')} value={item.term} onChange={(v) => updateItem(index, { term: v })} />
      <TextareaControl label={__('Description (HTML allowed)', 'mbn-theme')} value={item.description} onChange={(v) => updateItem(index, { description: v })} rows={5} style={{ marginTop: '10px' }} />
    </div>
  );
}

function SortableCompensation({ item, index, updateItem, removeItem, duplicateItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div ref={setNodeRef} style={itemStyle(transform, transition, isDragging)}>
      <ItemHeader attributes={attributes} listeners={listeners} label={__('Compensation', 'mbn-theme')} index={index} onDuplicate={() => duplicateItem(index)} onRemove={() => removeItem(index)} />
      <ToggleControl
        label={__('Feature', 'mbn-theme')}
        help={__('Adds a blue border to highlight this item.', 'mbn-theme')}
        checked={!!item.featured}
        onChange={(value) => updateItem(index, { featured: value })}
      />
      <TextControl label={__('Title', 'mbn-theme')} value={item.title} onChange={(v) => updateItem(index, { title: v })} />
      <TextareaControl label={__('Description (HTML allowed)', 'mbn-theme')} value={item.description} onChange={(v) => updateItem(index, { description: v })} rows={5} style={{ marginTop: '10px' }} />
    </div>
  );
}

function SortableBadge({ item, index, updateItem, removeItem, duplicateItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div ref={setNodeRef} style={itemStyle(transform, transition, isDragging)}>
      <ItemHeader attributes={attributes} listeners={listeners} label={__('Badge', 'mbn-theme')} index={index} onDuplicate={() => duplicateItem(index)} onRemove={() => removeItem(index)} />
      <ImageField
        label={__('Badge Image', 'mbn-theme')}
        url={item.imageUrl}
        id={item.imageId}
        onSelect={(m) => updateItem(index, { imageUrl: m.url, imageId: m.id })}
        onRemove={() => updateItem(index, { imageUrl: '', imageId: 0 })}
        maxWidth="150px"
      />
      <TextareaControl label={__('Description', 'mbn-theme')} value={item.description} onChange={(v) => updateItem(index, { description: v })} rows={3} style={{ marginTop: '10px' }} />
    </div>
  );
}

function SortableTextItem({ item, index, updateItem, removeItem, duplicateItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div ref={setNodeRef} style={itemStyle(transform, transition, isDragging)}>
      <ItemHeader attributes={attributes} listeners={listeners} label={__('Item', 'mbn-theme')} index={index} onDuplicate={() => duplicateItem(index)} onRemove={() => removeItem(index)} />
      <TextareaControl label={__('Text (HTML allowed)', 'mbn-theme')} value={item.text} onChange={(v) => updateItem(index, { text: v })} rows={3} />
    </div>
  );
}

function SortableAccident({ item, index, updateItem, removeItem, duplicateItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div ref={setNodeRef} style={itemStyle(transform, transition, isDragging)}>
      <ItemHeader attributes={attributes} listeners={listeners} label={__('Accident', 'mbn-theme')} index={index} onDuplicate={() => duplicateItem(index)} onRemove={() => removeItem(index)} />
      <TextControl label={__('Label', 'mbn-theme')} value={item.label} onChange={(v) => updateItem(index, { label: v })} />
      <TextControl label={__('URL', 'mbn-theme')} value={item.url} onChange={(v) => updateItem(index, { url: v })} />
    </div>
  );
}

function SortableTestimonial({ item, index, updateItem, removeItem, duplicateItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div ref={setNodeRef} style={itemStyle(transform, transition, isDragging)}>
      <ItemHeader attributes={attributes} listeners={listeners} label={__('Testimonial', 'mbn-theme')} index={index} onDuplicate={() => duplicateItem(index)} onRemove={() => removeItem(index)} />
      <TextareaControl label={__('Quote', 'mbn-theme')} value={item.quote} onChange={(v) => updateItem(index, { quote: v })} rows={3} />
      <TextControl label={__('Name', 'mbn-theme')} value={item.name} onChange={(v) => updateItem(index, { name: v })} />
      <TextControl label={__('Role (optional)', 'mbn-theme')} value={item.role} onChange={(v) => updateItem(index, { role: v })} />
    </div>
  );
}

function SortableWhyLawyerRow({ item, index, updateItem, removeItem, duplicateItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div ref={setNodeRef} style={itemStyle(transform, transition, isDragging)}>
      <ItemHeader attributes={attributes} listeners={listeners} label={__('Row', 'mbn-theme')} index={index} onDuplicate={() => duplicateItem(index)} onRemove={() => removeItem(index)} />
      <SelectControl
        label={__('Layout', 'mbn-theme')}
        value={item.layout}
        options={[
          { label: 'Text Left, Image Right', value: 'text-left' },
          { label: 'Image Left, Text Right', value: 'image-left' },
        ]}
        onChange={(v) => updateItem(index, { layout: v })}
      />
      <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={item.heading} onChange={(v) => updateItem(index, { heading: v })} rows={2} help={__('Wrap text in <span class="pad-text-blue">…</span> to highlight it blue.', 'mbn-theme')} />
      <TextareaControl label={__('Text (HTML)', 'mbn-theme')} value={item.text} onChange={(v) => updateItem(index, { text: v })} rows={5} style={{ marginTop: '10px' }} />
      <ImageField
        label={__('Image', 'mbn-theme')}
        url={item.imageUrl}
        id={item.imageId}
        onSelect={(m) => updateItem(index, { imageUrl: m.url, imageId: m.id })}
        onRemove={() => updateItem(index, { imageUrl: '', imageId: 0 })}
      />
    </div>
  );
}

// Renders a repeater (DnD list + add button) for a data array.
function Repeater({ field, sensors, ItemComponent, addLabel, newItem }) {
  return (
    <Fragment>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={field.dragEnd}>
        <SortableContext items={field.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {field.items.map((item, index) => (
            <ItemComponent key={item.id} item={item} index={index} updateItem={field.update} removeItem={field.remove} duplicateItem={field.duplicate} />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="primary" onClick={() => field.add(newItem)} style={{ marginTop: '10px' }}>
        {addLabel}
      </Button>
    </Fragment>
  );
}

// Optional Section Title band controls (heading + descriptions + background).
function SectionTitleControls({ data, onChange }) {
  const heading = data?.heading || '';
  const paragraphs = data?.paragraphs || [];
  const backgroundColor = data?.backgroundColor || 'bg-light-blue';

  const updateParagraph = (i, value) => {
    const next = [...paragraphs];
    next[i] = value;
    onChange({ paragraphs: next });
  };
  const addParagraph = () => onChange({ paragraphs: [...paragraphs, ''] });
  const removeParagraph = (i) => onChange({ paragraphs: paragraphs.filter((_, idx) => idx !== i) });

  return (
    <div style={{ border: '1px dashed #c3c4c7', borderRadius: '4px', padding: '12px', marginBottom: '16px', background: '#fbfbfc' }}>
      <strong style={{ display: 'block', marginBottom: '8px' }}>{__('Section Title', 'mbn-theme')}</strong>
      <BackgroundColorControl value={backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} defaultValue="bg-light-blue" label={__('Title Background', 'mbn-theme')} />
      <TextareaControl
        label={__('Title (HTML allowed)', 'mbn-theme')}
        value={heading}
        onChange={(v) => onChange({ heading: v })}
        rows={2}
        help={__('Leave empty to hide. Wrap text in <span class="pad-text-blue">…</span> to highlight it blue.', 'mbn-theme')}
      />
      <strong style={{ display: 'block', margin: '8px 0' }}>{__('Descriptions (HTML allowed)', 'mbn-theme')}</strong>
      {paragraphs.map((paragraph, index) => (
        <div key={index} style={{ border: '1px solid #ddd', padding: '8px', marginBottom: '8px', borderRadius: '4px' }}>
          <TextareaControl label={`${__('Description', 'mbn-theme')} ${index + 1}`} value={paragraph} onChange={(v) => updateParagraph(index, v)} rows={3} />
          <Button isDestructive isSmall onClick={() => removeParagraph(index)}>{__('Remove', 'mbn-theme')}</Button>
        </div>
      ))}
      <Button variant="secondary" isSmall onClick={addParagraph}>{__('+ Add Description', 'mbn-theme')}</Button>
    </div>
  );
}

// ── Per-type editors ────────────────────────────────────────
function WhyHireEditor({ data, setData, sensors }) {
  const features = makeArrayField(data, setData, 'features');
  return (
    <Fragment>
      <TextControl label={__('Heading', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} />
      <TextareaControl label={__('Subtitle', 'mbn-theme')} value={data.subtitle || ''} onChange={(v) => setData({ subtitle: v })} rows={3} />
      <h4 style={{ marginTop: '20px' }}>{__('Features', 'mbn-theme')}</h4>
      <Repeater field={features} sensors={sensors} ItemComponent={SortableFeature} addLabel={__('+ Add Feature', 'mbn-theme')} newItem={{ title: '', description: '' }} />
      <hr style={{ margin: '20px 0' }} />
      <h4>{__('Images', 'mbn-theme')}</h4>
      <ImageField label={__('Attorney Photo', 'mbn-theme')} url={data.photoUrl} id={data.photoId} onSelect={(m) => setData({ photoUrl: m.url, photoId: m.id })} onRemove={() => setData({ photoUrl: '', photoId: 0 })} />
      <ImageField label={__('90+ Years Badge', 'mbn-theme')} url={data.badge90YearsUrl} id={data.badge90YearsId} onSelect={(m) => setData({ badge90YearsUrl: m.url, badge90YearsId: m.id })} onRemove={() => setData({ badge90YearsUrl: '', badge90YearsId: 0 })} maxWidth="150px" />
      <ImageField label={__('Map Background', 'mbn-theme')} url={data.mapBackgroundUrl} id={data.mapBackgroundId} onSelect={(m) => setData({ mapBackgroundUrl: m.url, mapBackgroundId: m.id })} onRemove={() => setData({ mapBackgroundUrl: '', mapBackgroundId: 0 })} />
      <ImageField label={__('No Fee Badge', 'mbn-theme')} url={data.badgeNoFeeUrl} id={data.badgeNoFeeId} onSelect={(m) => setData({ badgeNoFeeUrl: m.url, badgeNoFeeId: m.id })} onRemove={() => setData({ badgeNoFeeUrl: '', badgeNoFeeId: 0 })} maxWidth="150px" />
      <hr style={{ margin: '20px 0' }} />
      <h4>{__('Free Evaluations', 'mbn-theme')}</h4>
      <TextControl label={__('Title', 'mbn-theme')} value={data.freeEvaluationsTitle || ''} onChange={(v) => setData({ freeEvaluationsTitle: v })} />
      <TextareaControl label={__('Description (HTML)', 'mbn-theme')} value={data.freeEvaluationsDescription || ''} onChange={(v) => setData({ freeEvaluationsDescription: v })} rows={4} />
      <h4 style={{ marginTop: '20px' }}>{__('Millions Recovered', 'mbn-theme')}</h4>
      <TextControl label={__('Title', 'mbn-theme')} value={data.millionsRecoveredTitle || ''} onChange={(v) => setData({ millionsRecoveredTitle: v })} />
      <TextareaControl label={__('Description (HTML)', 'mbn-theme')} value={data.millionsRecoveredDescription || ''} onChange={(v) => setData({ millionsRecoveredDescription: v })} rows={3} />
    </Fragment>
  );
}

function CaseResultEditor({ data, setData }) {
  return (
    <Fragment>
      <TextControl label={__('Tag', 'mbn-theme')} value={data.tag || ''} onChange={(v) => setData({ tag: v })} />
      <TextControl label={__('Amount', 'mbn-theme')} value={data.amount || ''} onChange={(v) => setData({ amount: v })} />
      <TextControl label={__('Title', 'mbn-theme')} value={data.title || ''} onChange={(v) => setData({ title: v })} />
      <TextareaControl label={__('Description (HTML)', 'mbn-theme')} value={data.description || ''} onChange={(v) => setData({ description: v })} rows={3} />
      <ImageField label={__('Photo', 'mbn-theme')} url={data.photoUrl} id={data.photoId} onSelect={(m) => setData({ photoUrl: m.url, photoId: m.id })} onRemove={() => setData({ photoUrl: '', photoId: 0 })} />
    </Fragment>
  );
}

function CtaEditor({ data, setData }) {
  return (
    <Fragment>
      <TextControl label={__('Heading', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} />
      <TextareaControl label={__('Subtext', 'mbn-theme')} value={data.subtext || ''} onChange={(v) => setData({ subtext: v })} rows={2} />
      <TextControl label={__('Button Text', 'mbn-theme')} value={data.buttonText || ''} onChange={(v) => setData({ buttonText: v })} />
      <TextControl label={__('Button URL', 'mbn-theme')} value={data.buttonUrl || ''} onChange={(v) => setData({ buttonUrl: v })} />
      <TextControl label={__('Phone Label', 'mbn-theme')} value={data.phoneLabel || ''} onChange={(v) => setData({ phoneLabel: v })} />
      <TextControl label={__('Phone Number', 'mbn-theme')} value={data.phoneNumber || ''} onChange={(v) => setData({ phoneNumber: v })} />
      <ImageField label={__('Logo', 'mbn-theme')} url={data.logoUrl} id={data.logoId} onSelect={(m) => setData({ logoUrl: m.url, logoId: m.id })} onRemove={() => setData({ logoUrl: '', logoId: 0 })} maxWidth="100px" />
      <ImageField label={__('Texture', 'mbn-theme')} url={data.textureUrl} id={data.textureId} onSelect={(m) => setData({ textureUrl: m.url, textureId: m.id })} onRemove={() => setData({ textureUrl: '', textureId: 0 })} />
    </Fragment>
  );
}

function AfterAccidentEditor({ data, setData, sensors }) {
  const splits = makeArrayField(data, setData, 'splits');
  return (
    <Fragment>
      <TextControl label={__('Heading', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} />
      <h4 style={{ marginTop: '20px' }}>{__('Split Sections', 'mbn-theme')}</h4>
      <Repeater field={splits} sensors={sensors} ItemComponent={SortableSplit} addLabel={__('+ Add Split Section', 'mbn-theme')} newItem={{ text: '', imageUrl: '', imageId: 0, layout: 'text-left' }} />
    </Fragment>
  );
}

function StepsEditor({ data, setData, sensors }) {
  const steps = makeArrayField(data, setData, 'accordion');
  return (
    <Fragment>
      <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} rows={2} />
      <TextareaControl label={__('Intro Text (HTML)', 'mbn-theme')} value={data.introText || ''} onChange={(v) => setData({ introText: v })} rows={3} />
      <ImageField label={__('Chevron Icon', 'mbn-theme')} url={data.chevronIconUrl} id={data.chevronIconId} onSelect={(m) => setData({ chevronIconUrl: m.url, chevronIconId: m.id })} onRemove={() => setData({ chevronIconUrl: '', chevronIconId: 0 })} maxWidth="50px" />
      <SelectControl
        label={__('List Type', 'mbn-theme')}
        value={data.listType || 'ol'}
        options={[
          { label: __('Accordion — numbered (ol)', 'mbn-theme'), value: 'ol' },
          { label: __('Accordion — no marker (ul)', 'mbn-theme'), value: 'ul' },
          { label: __('Title only — no accordion', 'mbn-theme'), value: 'plain' },
        ]}
        onChange={(v) => setData({ listType: v })}
        help={(data.listType || 'ol') === 'plain' ? __('Only each step’s title is shown as a simple divider list. Answers and the chevron icon are ignored.', 'mbn-theme') : undefined}
      />
      <h4 style={{ marginTop: '20px' }}>{__('Steps', 'mbn-theme')}</h4>
      <Repeater field={steps} sensors={sensors} ItemComponent={SortableStep} addLabel={__('+ Add Step', 'mbn-theme')} newItem={{ question: '', answer: '' }} />
    </Fragment>
  );
}

function TimeLimitEditor({ data, setData }) {
  return (
    <Fragment>
      <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} rows={2} />
      <TextareaControl label={__('Subtitle (HTML)', 'mbn-theme')} value={data.subtitle || ''} onChange={(v) => setData({ subtitle: v })} rows={3} />
      <TextareaControl label={__('Text (HTML)', 'mbn-theme')} value={data.text || ''} onChange={(v) => setData({ text: v })} rows={5} />
      <ImageField label={__('Photo', 'mbn-theme')} url={data.photoUrl} id={data.photoId} onSelect={(m) => setData({ photoUrl: m.url, photoId: m.id })} onRemove={() => setData({ photoUrl: '', photoId: 0 })} />
    </Fragment>
  );
}

function InsuranceEditor({ data, setData }) {
  return (
    <Fragment>
      <TextControl label={__('Heading', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} />
      <TextareaControl label={__('Text (HTML)', 'mbn-theme')} value={data.text || ''} onChange={(v) => setData({ text: v })} rows={5} />
      <ImageField label={__('Photo', 'mbn-theme')} url={data.photoUrl} id={data.photoId} onSelect={(m) => setData({ photoUrl: m.url, photoId: m.id })} onRemove={() => setData({ photoUrl: '', photoId: 0 })} />
    </Fragment>
  );
}

function LiabilityEditor({ data, setData, sensors }) {
  const items = makeArrayField(data, setData, 'items');
  return (
    <Fragment>
      <BackgroundColorControl value={data.backgroundColor || 'bg-white'} onChange={(v) => setData({ backgroundColor: v })} defaultValue="bg-white" label={__('Section Background', 'mbn-theme')} />
      <RangeControl
        label={__('Top Padding (px)', 'mbn-theme')}
        value={data.paddingTop === '' || data.paddingTop === undefined ? undefined : Number(data.paddingTop)}
        onChange={(v) => setData({ paddingTop: v === undefined ? '' : v })}
        min={0}
        max={200}
        allowReset
        help={__('Reset to use the theme default (80px desktop / 56px tablet / 40px mobile).', 'mbn-theme')}
      />
      <RangeControl
        label={__('Bottom Padding (px)', 'mbn-theme')}
        value={data.paddingBottom === '' || data.paddingBottom === undefined ? undefined : Number(data.paddingBottom)}
        onChange={(v) => setData({ paddingBottom: v === undefined ? '' : v })}
        min={0}
        max={200}
        allowReset
        help={__('Reset to use the theme default (80px desktop / 56px tablet / 40px mobile).', 'mbn-theme')}
      />
      <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} rows={2} />
      <TextareaControl label={__('Subtitle', 'mbn-theme')} value={data.subtitle || ''} onChange={(v) => setData({ subtitle: v })} rows={2} />
      <h4 style={{ marginTop: '20px' }}>{__('Intro (optional)', 'mbn-theme')}</h4>
      <TextControl label={__('Intro Heading', 'mbn-theme')} value={data.introHeading || ''} onChange={(v) => setData({ introHeading: v })} help={__('Leave empty to hide the intro block.', 'mbn-theme')} />
      <TextareaControl label={__('Intro Text (HTML)', 'mbn-theme')} value={data.introText || ''} onChange={(v) => setData({ introText: v })} rows={3} />
      <h4 style={{ marginTop: '20px' }}>{__('Liability Items', 'mbn-theme')}</h4>
      <Repeater field={items} sensors={sensors} ItemComponent={SortableLiability} addLabel={__('+ Add Liability Item', 'mbn-theme')} newItem={{ term: '', description: '' }} />
      <TextareaControl label={__('Text After List (HTML)', 'mbn-theme')} value={data.afterText || ''} onChange={(v) => setData({ afterText: v })} rows={4} help={__('Optional paragraph(s) shown below the liability list. Leave empty to hide.', 'mbn-theme')} style={{ marginTop: '20px' }} />
    </Fragment>
  );
}

function CompensationEditor({ data, setData, sensors }) {
  const items = makeArrayField(data, setData, 'items');
  return (
    <Fragment>
      <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} rows={2} />
      <TextareaControl label={__('Subtitle', 'mbn-theme')} value={data.subtitle || ''} onChange={(v) => setData({ subtitle: v })} rows={2} />
      <h4 style={{ marginTop: '20px' }}>{__('Compensation Items', 'mbn-theme')}</h4>
      <Repeater field={items} sensors={sensors} ItemComponent={SortableCompensation} addLabel={__('+ Add Compensation Item', 'mbn-theme')} newItem={{ title: '', description: '', featured: false }} />
      <TextareaControl label={__('Text After Grid (HTML)', 'mbn-theme')} value={data.afterText || ''} onChange={(v) => setData({ afterText: v })} rows={4} help={__('Optional paragraph(s) shown below the compensation grid. Leave empty to hide.', 'mbn-theme')} style={{ marginTop: '20px' }} />
    </Fragment>
  );
}

function DocumentationEditor({ data, setData }) {
  return (
    <Fragment>
      <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} rows={2} />
      <TextareaControl label={__('Text (HTML)', 'mbn-theme')} value={data.text || ''} onChange={(v) => setData({ text: v })} rows={5} />
      <ImageField label={__('Photo', 'mbn-theme')} url={data.photoUrl} id={data.photoId} onSelect={(m) => setData({ photoUrl: m.url, photoId: m.id })} onRemove={() => setData({ photoUrl: '', photoId: 0 })} />
    </Fragment>
  );
}

function AttorneysEditor({ data, setData, sensors }) {
  const badges = makeArrayField(data, setData, 'badgeCards');
  return (
    <Fragment>
      <h4>{__('Badge Cards', 'mbn-theme')}</h4>
      <Repeater field={badges} sensors={sensors} ItemComponent={SortableBadge} addLabel={__('+ Add Badge Card', 'mbn-theme')} newItem={{ imageUrl: '', imageId: 0, description: '' }} />
      <hr style={{ margin: '20px 0' }} />
      <h4>{__('Attorneys Content', 'mbn-theme')}</h4>
      <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} rows={2} />
      <TextareaControl label={__('Text (HTML)', 'mbn-theme')} value={data.text || ''} onChange={(v) => setData({ text: v })} rows={4} />
      <ImageField label={__('Photo', 'mbn-theme')} url={data.photoUrl} id={data.photoId} onSelect={(m) => setData({ photoUrl: m.url, photoId: m.id })} onRemove={() => setData({ photoUrl: '', photoId: 0 })} />
    </Fragment>
  );
}

function ThirdPartyEditor({ data, setData, sensors }) {
  const items = makeArrayField(data, setData, 'items');
  return (
    <Fragment>
      <TextareaControl label={__('Text (HTML)', 'mbn-theme')} value={data.text || ''} onChange={(v) => setData({ text: v })} rows={6} />
      <h4 style={{ marginTop: '20px' }}>{__('Third-Party List', 'mbn-theme')}</h4>
      <Repeater field={items} sensors={sensors} ItemComponent={SortableTextItem} addLabel={__('+ Add List Item', 'mbn-theme')} newItem={{ text: '' }} />
      <hr style={{ margin: '20px 0' }} />
      <ImageField label={__('Chevron Icon', 'mbn-theme')} url={data.chevronIconUrl} id={data.chevronIconId} onSelect={(m) => setData({ chevronIconUrl: m.url, chevronIconId: m.id })} onRemove={() => setData({ chevronIconUrl: '', chevronIconId: 0 })} maxWidth="50px" />
      <ImageField label={__('Photo', 'mbn-theme')} url={data.photoUrl} id={data.photoId} onSelect={(m) => setData({ photoUrl: m.url, photoId: m.id })} onRemove={() => setData({ photoUrl: '', photoId: 0 })} />
    </Fragment>
  );
}

function CommonCausesEditor({ data, setData, sensors }) {
  const items = makeArrayField(data, setData, 'items');
  return (
    <Fragment>
      <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} rows={2} />
      <TextareaControl label={__('Intro Text (HTML)', 'mbn-theme')} value={data.text || ''} onChange={(v) => setData({ text: v })} rows={4} />
      <ImageField label={__('Photo', 'mbn-theme')} url={data.photoUrl} id={data.photoId} onSelect={(m) => setData({ photoUrl: m.url, photoId: m.id })} onRemove={() => setData({ photoUrl: '', photoId: 0 })} />
      <h4 style={{ marginTop: '20px' }}>{__('Causes', 'mbn-theme')}</h4>
      <Repeater field={items} sensors={sensors} ItemComponent={SortableTextItem} addLabel={__('+ Add Cause', 'mbn-theme')} newItem={{ text: '' }} />
    </Fragment>
  );
}

function TestimonialsEditor({ data, setData, sensors }) {
  const items = makeArrayField(data, setData, 'items');
  return (
    <Fragment>
      <TextControl label={__('Eyebrow', 'mbn-theme')} value={data.eyebrow || ''} onChange={(v) => setData({ eyebrow: v })} />
      <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} rows={2} />
      <TextareaControl label={__('Subtitle', 'mbn-theme')} value={data.subtitle || ''} onChange={(v) => setData({ subtitle: v })} rows={3} />
      <ImageField label={__('Stars Icon', 'mbn-theme')} url={data.starsIconUrl} id={data.starsIconId} onSelect={(m) => setData({ starsIconUrl: m.url, starsIconId: m.id })} onRemove={() => setData({ starsIconUrl: '', starsIconId: 0 })} maxWidth="150px" />
      <h4 style={{ marginTop: '20px' }}>{__('Testimonials', 'mbn-theme')}</h4>
      <Repeater field={items} sensors={sensors} ItemComponent={SortableTestimonial} addLabel={__('+ Add Testimonial', 'mbn-theme')} newItem={{ quote: '', name: '', role: '' }} />
    </Fragment>
  );
}

function AccidentListEditor({ data, setData, sensors }) {
  const items = makeArrayField(data, setData, 'items');
  return (
    <Fragment>
      <BackgroundColorControl value={data.backgroundColor || 'bg-light-blue'} onChange={(v) => setData({ backgroundColor: v })} defaultValue="bg-light-blue" label={__('Section Background', 'mbn-theme')} />
      <TextControl label={__('List Heading', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} help={__('Shown above the list, e.g. “Examples of personal injury in Arizona include:”', 'mbn-theme')} />
      <h4 style={{ marginTop: '20px' }}>{__('Accidents', 'mbn-theme')}</h4>
      <Repeater field={items} sensors={sensors} ItemComponent={SortableAccident} addLabel={__('+ Add Accident', 'mbn-theme')} newItem={{ label: '', url: '' }} />
    </Fragment>
  );
}

function WhyLawyerEditor({ data, setData, sensors }) {
  const rows = makeArrayField(data, setData, 'rows');
  return (
    <Fragment>
      <TextareaControl label={__('Heading (HTML)', 'mbn-theme')} value={data.heading || ''} onChange={(v) => setData({ heading: v })} rows={2} help={__('Wrap text in <span class="pad-text-blue">…</span> to highlight it blue.', 'mbn-theme')} />
      <TextareaControl label={__('Subtitle (HTML)', 'mbn-theme')} value={data.subtitle || ''} onChange={(v) => setData({ subtitle: v })} rows={3} />
      <h4 style={{ marginTop: '20px' }}>{__('Rows', 'mbn-theme')}</h4>
      <Repeater field={rows} sensors={sensors} ItemComponent={SortableWhyLawyerRow} addLabel={__('+ Add Row', 'mbn-theme')} newItem={{ layout: 'text-left', heading: '', text: '', imageUrl: '', imageId: 0 }} />
    </Fragment>
  );
}

// Dispatch to the correct editor for a section type.
function SectionEditor({ type, data, setData, sensors }) {
  switch (type) {
    case 'whyHire':
      return <WhyHireEditor data={data} setData={setData} sensors={sensors} />;
    case 'caseResult':
      return <CaseResultEditor data={data} setData={setData} />;
    case 'cta':
      return <CtaEditor data={data} setData={setData} />;
    case 'afterAccident':
      return <AfterAccidentEditor data={data} setData={setData} sensors={sensors} />;
    case 'steps':
      return <StepsEditor data={data} setData={setData} sensors={sensors} />;
    case 'timeLimit':
      return <TimeLimitEditor data={data} setData={setData} />;
    case 'insurance':
      return <InsuranceEditor data={data} setData={setData} />;
    case 'liability':
      return <LiabilityEditor data={data} setData={setData} sensors={sensors} />;
    case 'compensation':
      return <CompensationEditor data={data} setData={setData} sensors={sensors} />;
    case 'documentation':
      return <DocumentationEditor data={data} setData={setData} />;
    case 'attorneys':
      return <AttorneysEditor data={data} setData={setData} sensors={sensors} />;
    case 'thirdParty':
      return <ThirdPartyEditor data={data} setData={setData} sensors={sensors} />;
    case 'commonCauses':
      return <CommonCausesEditor data={data} setData={setData} sensors={sensors} />;
    case 'testimonials':
      return <TestimonialsEditor data={data} setData={setData} sensors={sensors} />;
    case 'accidentList':
      return <AccidentListEditor data={data} setData={setData} sensors={sensors} />;
    case 'whyLawyer':
      return <WhyLawyerEditor data={data} setData={setData} sensors={sensors} />;
    default:
      return null;
  }
}

// A single sortable, duplicatable, removable section card.
function SortableSection({ section, expanded, onToggle, onDuplicate, onRemove, updateData, updateTitle, sensors }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '12px',
    border: '1px solid #ccd0d4',
    borderRadius: '4px',
    background: '#fff',
  };
  const label = SECTION_TYPES[section.type] ? SECTION_TYPES[section.type].label : section.type;

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderBottom: expanded ? '1px solid #eee' : 'none' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex' }} title={__('Drag to reorder', 'mbn-theme')}>
          <Icon icon="menu" />
        </div>
        <button type="button" onClick={onToggle} style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', padding: 0 }}>
          <Icon icon={expanded ? 'arrow-down' : 'arrow-right'} size={16} /> {label}
        </button>
        <Button icon="admin-page" label={__('Duplicate', 'mbn-theme')} onClick={onDuplicate} isSmall style={{ minWidth: 'auto' }} />
        <Button icon="trash" label={__('Remove', 'mbn-theme')} onClick={onRemove} isDestructive isSmall style={{ minWidth: 'auto' }} />
      </div>
      {expanded && (
        <div style={{ padding: '12px' }}>
          <SectionTitleControls data={section.title || {}} onChange={(updates) => updateTitle(section.id, updates)} />
          <SectionEditor type={section.type} data={section.data || {}} setData={(updates) => updateData(section.id, updates)} sensors={sensors} />
        </div>
      )}
    </div>
  );
}

export default function Edit({ attributes, setAttributes }) {
  const sections = attributes.sections || [];
  const [expandedId, setExpandedId] = useState(sections.length ? sections[0].id : null);
  const [addType, setAddType] = useState('cta');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const updateData = (id, updates) => {
    setAttributes({ sections: sections.map((s) => (s.id === id ? { ...s, data: { ...s.data, ...updates } } : s)) });
  };
  const updateTitle = (id, updates) => {
    setAttributes({ sections: sections.map((s) => (s.id === id ? { ...s, title: { ...(s.title || {}), ...updates } } : s)) });
  };
  const duplicateSection = (id) => {
    const index = sections.findIndex((s) => s.id === id);
    if (index < 0) {
      return;
    }
    const copy = JSON.parse(JSON.stringify(sections[index]));
    copy.id = generateUniqueId();
    Object.keys(copy.data || {}).forEach((key) => {
      if (Array.isArray(copy.data[key])) {
        copy.data[key] = copy.data[key].map((it) => (it && typeof it === 'object' && 'id' in it ? { ...it, id: generateUniqueId() } : it));
      }
    });
    setAttributes({ sections: [...sections.slice(0, index + 1), copy, ...sections.slice(index + 1)] });
    setExpandedId(copy.id);
  };
  const removeSection = (id) => {
    setAttributes({ sections: sections.filter((s) => s.id !== id) });
  };
  const addSection = () => {
    const section = { id: generateUniqueId(), type: addType, title: { heading: '', paragraphs: [], backgroundColor: 'bg-light-blue' }, data: emptyData(addType) };
    setAttributes({ sections: [...sections, section] });
    setExpandedId(section.id);
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      setAttributes({ sections: arrayMove(sections, oldIndex, newIndex) });
    }
  };

  const blockProps = useBlockProps({ className: 'practice-area-details-editor' });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Sections', 'mbn-theme')} initialOpen={true}>
          <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#666' }}>
            {__('Drag to reorder. Use the icons to duplicate or delete a section. Click a name to expand and edit it.', 'mbn-theme')}
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {sections.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  expanded={expandedId === section.id}
                  onToggle={() => setExpandedId(expandedId === section.id ? null : section.id)}
                  onDuplicate={() => duplicateSection(section.id)}
                  onRemove={() => removeSection(section.id)}
                  updateData={updateData}
                  updateTitle={updateTitle}
                  sensors={sensors}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <SelectControl
                label={__('Add Section', 'mbn-theme')}
                value={addType}
                options={Object.keys(SECTION_TYPES).map((t) => ({ label: SECTION_TYPES[t].label, value: t }))}
                onChange={setAddType}
              />
            </div>
            <Button variant="primary" onClick={addSection} style={{ marginBottom: '8px' }}>{__('Add', 'mbn-theme')}</Button>
          </div>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold' }}>
            {__('Practice Area Details Block', 'mbn-theme')}
          </h3>
          <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
            {sections.length} {__('sections — reorder, duplicate, remove and edit them in the sidebar →', 'mbn-theme')}
          </p>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            {sections.map((s) => (
              <li key={s.id} style={{ fontSize: '13px', color: '#444', marginBottom: '4px' }}>
                {SECTION_TYPES[s.type] ? SECTION_TYPES[s.type].label : s.type}
                {s.title && s.title.heading ? ` — ${__('titled', 'mbn-theme')}` : ''}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Fragment>
  );
}
