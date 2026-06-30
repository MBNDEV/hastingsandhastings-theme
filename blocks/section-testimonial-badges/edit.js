import { useBlockProps, InspectorControls, RichText, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, Button, TextareaControl, Icon, RangeControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './editor.css';

// Generate unique ID for repeater items
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Sortable Testimonial Component
function SortableTestimonial({ item, index, updateItem, removeItem, duplicateItem }) {
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
          <strong>{__('Testimonial', 'mbn-theme')} {index + 1}</strong>
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

      <RangeControl
        label={__('Star Rating', 'mbn-theme')}
        value={item.starRating}
        onChange={(value) => updateItem(index, { starRating: value })}
        min={1}
        max={5}
        step={1}
      />

      <TextareaControl
        label={__('Testimonial Content', 'mbn-theme')}
        value={item.content}
        onChange={(value) => updateItem(index, { content: value })}
        rows={5}
      />

      <TextareaControl
        label={__('Testimonial Description', 'mbn-theme')}
        value={item.description}
        onChange={(value) => updateItem(index, { description: value })}
        rows={5}
        help={__('Shown in Detailed style only', 'mbn-theme')}
      />

      <TextareaControl
        label={__('Author', 'mbn-theme')}
        value={item.author}
        onChange={(value) => updateItem(index, { author: value })}
        rows={1}
      />
    </div>
  );
}

// Sortable Badge Component
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
        onSelect={(media) => updateItem(index, { iconUrl: media.url, iconId: media.id })}
        allowedTypes={['image']}
        value={item.iconId}
        render={({ open }) => (
          <div>
            <Button onClick={open} variant="secondary" style={{ marginTop: '10px' }}>
              {item.iconUrl ? __('Replace Icon', 'mbn-theme') : __('Select Icon', 'mbn-theme')}
            </Button>
            {item.iconUrl && (
              <img src={item.iconUrl} alt="" style={{ marginTop: '10px', maxWidth: '80px', height: 'auto' }} />
            )}
          </div>
        )}
      />

      <TextareaControl
        label={__('Primary Text', 'mbn-theme')}
        value={item.primaryText}
        onChange={(value) => updateItem(index, { primaryText: value })}
        rows={2}
        style={{ marginTop: '10px' }}
      />

      <TextareaControl
        label={__('Secondary Text', 'mbn-theme')}
        value={item.secondaryText}
        onChange={(value) => updateItem(index, { secondaryText: value })}
        rows={2}
      />
    </div>
  );
}

export default function Edit({ attributes, setAttributes }) {
  const { testimonials = [], badges = [], testimonialStyle = 'classic', backgroundLayout = 'full' } = attributes;

  const testimonialSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const badgeSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Testimonial handlers
  const updateTestimonial = (index, updates) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], ...updates };
    setAttributes({ testimonials: updated });
  };

  const addTestimonial = () => {
    setAttributes({
      testimonials: [...testimonials, {
        id: generateUniqueId(),
        starRating: 5,
        content: '',
        description: '',
        author: 'Verified Client'
      }]
    });
  };

  const removeTestimonial = (index) => {
    const updated = testimonials.filter((_, i) => i !== index);
    setAttributes({ testimonials: updated });
  };

  const duplicateTestimonial = (index) => {
    const itemToDuplicate = { ...testimonials[index], id: generateUniqueId() };
    const updated = [
      ...testimonials.slice(0, index + 1),
      itemToDuplicate,
      ...testimonials.slice(index + 1)
    ];
    setAttributes({ testimonials: updated });
  };

  const handleTestimonialDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = testimonials.findIndex(item => item.id === active.id);
      const newIndex = testimonials.findIndex(item => item.id === over.id);
      setAttributes({
        testimonials: arrayMove(testimonials, oldIndex, newIndex),
      });
    }
  };

  // Badge handlers
  const updateBadge = (index, updates) => {
    const updated = [...badges];
    updated[index] = { ...updated[index], ...updates };
    setAttributes({ badges: updated });
  };

  const addBadge = () => {
    setAttributes({
      badges: [...badges, {
        id: generateUniqueId(),
        iconUrl: '',
        iconId: 0,
        primaryText: '',
        secondaryText: ''
      }]
    });
  };

  const removeBadge = (index) => {
    const updated = badges.filter((_, i) => i !== index);
    setAttributes({ badges: updated });
  };

  const duplicateBadge = (index) => {
    const itemToDuplicate = { ...badges[index], id: generateUniqueId() };
    const updated = [
      ...badges.slice(0, index + 1),
      itemToDuplicate,
      ...badges.slice(index + 1)
    ];
    setAttributes({ badges: updated });
  };

  const handleBadgeDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = badges.findIndex(item => item.id === active.id);
      const newIndex = badges.findIndex(item => item.id === over.id);
      setAttributes({
        badges: arrayMove(badges, oldIndex, newIndex),
      });
    }
  };

  const blockProps = useBlockProps({
    className: backgroundLayout === 'full' ? 'testimonials-section-bg py-12 md:py-16 lg:py-20' : '',
  });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Layout', 'mbn-theme')} initialOpen={true}>
          <SelectControl
            label={__('Background Width', 'mbn-theme')}
            value={backgroundLayout}
            options={[
              { label: __('Full Width', 'mbn-theme'), value: 'full' },
              { label: __('Contained', 'mbn-theme'), value: 'contained' },
            ]}
            onChange={(value) => setAttributes({ backgroundLayout: value })}
          />
        </PanelBody>
        <PanelBody title={__('Testimonials', 'mbn-theme')} initialOpen={true}>
          <SelectControl
            label={__('Testimonial Style', 'mbn-theme')}
            value={testimonialStyle}
            options={[
              { label: __('Classic (Bordered)', 'mbn-theme'), value: 'classic' },
              { label: __('Detailed', 'mbn-theme'), value: 'detailed' },
            ]}
            onChange={(value) => setAttributes({ testimonialStyle: value })}
            style={{ marginBottom: '15px' }}
          />
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder testimonials', 'mbn-theme')}
          </p>
          
          <DndContext
            sensors={testimonialSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleTestimonialDragEnd}
          >
            <SortableContext
              items={testimonials.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {testimonials.map((item, index) => (
                <SortableTestimonial
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={updateTestimonial}
                  removeItem={removeTestimonial}
                  duplicateItem={duplicateTestimonial}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addTestimonial} style={{ marginTop: '15px' }}>
            {__('+ Add Testimonial', 'mbn-theme')}
          </Button>
        </PanelBody>

        <PanelBody title={__('Badges', 'mbn-theme')} initialOpen={false}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder badges', 'mbn-theme')}
          </p>
          
          <DndContext
            sensors={badgeSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleBadgeDragEnd}
          >
            <SortableContext
              items={badges.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {badges.map((item, index) => (
                <SortableBadge
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={updateBadge}
                  removeItem={removeBadge}
                  duplicateItem={duplicateBadge}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addBadge} style={{ marginTop: '15px' }}>
            {__('+ Add Badge', 'mbn-theme')}
          </Button>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className={`container mx-auto px-4 ${backgroundLayout === 'contained' ? 'testimonials-section-bg py-12 md:py-16 lg:py-20 rounded-2xl' : ''}`}>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            
            {/* Left Column: Testimonials Preview */}
            <div className={`lg:w-[60%] flex-shrink-0 p-8 ${testimonialStyle === 'classic' ? 'border-l-8 border-secondary' : ''}`}>
              <p className="text-white text-lg font-bold mb-4">
                {__('📋 Testimonials Slider', 'mbn-theme')} ({testimonials.length}) — {testimonialStyle === 'classic' ? __('Classic', 'mbn-theme') : __('Detailed', 'mbn-theme')}
              </p>
              {testimonials.length === 0 && (
                <p className="text-gray-300 italic">
                  {__('Add testimonials in the sidebar →', 'mbn-theme')}
                </p>
              )}
              {testimonials.length > 0 && (
                <div className="space-y-4">
                  {testimonials.slice(0, 1).map((testimonial) => (
                    <div key={testimonial.id} className="flex flex-col gap-4">
                      <div className="flex gap-1">
                        {[...Array(parseInt(testimonial.starRating, 10) || 5)].map((_, i) => (
                          <span key={i} className="text-accent-gold text-xl">⭐</span>
                        ))}
                      </div>
                      {testimonialStyle === 'classic' ? (
                        <blockquote className="font-heading text-2xl text-white leading-relaxed">
                          {testimonial.content || __('Enter testimonial content...', 'mbn-theme')}
                        </blockquote>
                      ) : (
                        <>
                          <p className="font-heading text-3xl font-semibold text-white leading-tight">
                            {testimonial.content || __('Enter testimonial content...', 'mbn-theme')}
                          </p>
                          {testimonial.description && (
                            <p className="font-body text-base text-primary-300 leading-relaxed">
                              {testimonial.description}
                            </p>
                          )}
                        </>
                      )}
                      <p className={`font-medium ${testimonialStyle === 'detailed' ? 'text-secondary font-semibold' : 'text-secondary'}`}>
                        {testimonial.author}
                      </p>
                    </div>
                  ))}
                  {testimonials.length > 1 && (
                    <p className="text-gray-300 text-sm italic">
                      {__('+ ', 'mbn-theme')}{testimonials.length - 1} {__('more testimonials', 'mbn-theme')}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Badges Preview */}
            <div className="lg:w-[40%] flex-shrink-0 flex flex-col justify-center gap-8">
              <p className="text-white text-lg font-bold">
                {__('🏆 Badges', 'mbn-theme')} ({badges.length})
              </p>
              {badges.length === 0 && (
                <p className="text-gray-300 italic">
                  {__('Add badges in the sidebar →', 'mbn-theme')}
                </p>
              )}
              {badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-4">
                  {badge.iconUrl && (
                    <img src={badge.iconUrl} alt="" className="w-14 h-14 flex-shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <p className="font-heading text-lg font-bold text-white leading-tight">
                      {badge.primaryText || __('Primary text...', 'mbn-theme')}
                    </p>
                    <p className="font-heading text-lg font-bold text-secondary">
                      {badge.secondaryText || __('Secondary text...', 'mbn-theme')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </Fragment>
  );
}
