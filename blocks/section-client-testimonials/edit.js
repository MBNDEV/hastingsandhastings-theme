import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, RangeControl, Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BackgroundColorControl from '../shared/BackgroundColorControl';

// Generate unique ID
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Sortable Testimonial Item
function SortableTestimonial({ testimonial, index, updateTestimonial, removeTestimonial, duplicateTestimonial }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: testimonial.id });

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
            onClick={() => duplicateTestimonial(index)}
          />
          <Button
            icon="trash"
            label={__('Remove', 'mbn-theme')}
            onClick={() => removeTestimonial(index)}
          />
        </div>
      </div>

      <TextareaControl
        label={__('Short Quote', 'mbn-theme')}
        value={testimonial.quote}
        onChange={(value) => updateTestimonial(index, { quote: value })}
        rows={2}
        help={__('Brief summary quote shown first', 'mbn-theme')}
      />

      <TextareaControl
        label={__('Full Testimonial', 'mbn-theme')}
        value={testimonial.fullText}
        onChange={(value) => updateTestimonial(index, { fullText: value })}
        rows={6}
        help={__('Complete testimonial text', 'mbn-theme')}
      />

      <TextControl
        label={__('Author Name', 'mbn-theme')}
        value={testimonial.authorName}
        onChange={(value) => updateTestimonial(index, { authorName: value })}
      />

      <TextControl
        label={__('Author Title', 'mbn-theme')}
        value={testimonial.authorTitle}
        onChange={(value) => updateTestimonial(index, { authorTitle: value })}
      />

      <RangeControl
        label={__('Star Rating', 'mbn-theme')}
        value={testimonial.rating || 5}
        onChange={(value) => updateTestimonial(index, { rating: value })}
        min={1}
        max={5}
        step={1}
        help={__('Number of stars (1-5)', 'mbn-theme')}
      />
    </div>
  );
}

export default function Edit({ attributes, setAttributes }) {
  const { backgroundColor, eyebrowText, mainHeading, description, testimonials } = attributes;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Determine background style
  const isCustomColor = backgroundColor && backgroundColor.startsWith('#');
  const bgStyle = isCustomColor ? { backgroundColor } : {};
  const bgClass = isCustomColor ? '' : backgroundColor;

  const blockProps = useBlockProps({
    className: `w-full py-16 md:py-20 lg:py-24 ${bgClass}`,
    style: bgStyle,
  });

  const updateTestimonial = (index, updates) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], ...updates };
    setAttributes({ testimonials: updatedTestimonials });
  };

  const addTestimonial = () => {
    setAttributes({
      testimonials: [
        ...testimonials,
        {
          id: generateUniqueId(),
          quote: '',
          fullText: '',
          authorName: 'Verified Client',
          authorTitle: 'Car Accident Victim',
          rating: 5,
        },
      ],
    });
  };

  const removeTestimonial = (index) => {
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    setAttributes({ testimonials: updatedTestimonials });
  };

  const duplicateTestimonial = (index) => {
    const testimonialToDuplicate = { ...testimonials[index], id: generateUniqueId() };
    const updatedTestimonials = [
      ...testimonials.slice(0, index + 1),
      testimonialToDuplicate,
      ...testimonials.slice(index + 1),
    ];
    setAttributes({ testimonials: updatedTestimonials });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = testimonials.findIndex((item) => item.id === active.id);
      const newIndex = testimonials.findIndex((item) => item.id === over.id);

      setAttributes({
        testimonials: arrayMove(testimonials, oldIndex, newIndex),
      });
    }
  };

  return (
    <Fragment>
      <InspectorControls>
        {/* Background Settings */}
        <PanelBody title={__('Background', 'mbn-theme')} initialOpen={true}>
          <BackgroundColorControl
            value={backgroundColor}
            onChange={(value) => setAttributes({ backgroundColor: value })}
            defaultValue="bg-white"
            label={__('Section Background', 'mbn-theme')}
          />
        </PanelBody>

        {/* Content Settings */}
        <PanelBody title={__('Content', 'mbn-theme')} initialOpen={true}>
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
          />

          <TextareaControl
            label={__('Description', 'mbn-theme')}
            value={description}
            onChange={(value) => setAttributes({ description: value })}
            rows={4}
          />
        </PanelBody>

        {/* Testimonials */}
        <PanelBody title={__('Testimonials', 'mbn-theme')} initialOpen={true}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder testimonials', 'mbn-theme')}
          </p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={testimonials.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              {testimonials.map((testimonial, index) => (
                <SortableTestimonial
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                  updateTestimonial={updateTestimonial}
                  removeTestimonial={removeTestimonial}
                  duplicateTestimonial={duplicateTestimonial}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addTestimonial} style={{ marginTop: '15px' }}>
            {__('+ Add Testimonial', 'mbn-theme')}
          </Button>
        </PanelBody>
      </InspectorControls>

      {/* Editor Preview */}
      <div {...blockProps}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column */}
            <div className="sticky-content">
              {eyebrowText && (
                <p className="font-body text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-secondary mb-6">
                  {eyebrowText}
                </p>
              )}

              <RichText
                tagName="h2"
                value={mainHeading}
                onChange={(value) => setAttributes({ mainHeading: value })}
                placeholder={__('Enter heading...', 'mbn-theme')}
                className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-text-heading mb-8"
              />

              <RichText
                tagName="p"
                value={description}
                onChange={(value) => setAttributes({ description: value })}
                placeholder={__('Enter description...', 'mbn-theme')}
                className="font-body text-base md:text-lg text-text-body leading-relaxed max-w-xl"
              />
            </div>

            {/* Right Column - Testimonials Preview */}
            <div className="cards-container">
              {testimonials.length > 0 ? (
                testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="testimonial-card mb-8 bg-white rounded-3xl p-8 shadow-md">
                    <div className="stars mb-6">
                      {[...Array(testimonial.rating || 5)].map((_, star) => (
                        <span key={star} className="text-accent-gold text-xl">★</span>
                      ))}
                    </div>
                    {testimonial.quote && (
                      <p className="font-body text-base text-text-body mb-4">
                        {testimonial.quote}
                      </p>
                    )}
                    {testimonial.fullText && (
                      <p className="font-body text-base text-text-body mb-6">
                        {testimonial.fullText}
                      </p>
                    )}
                    <div className="border-t border-gray-200 pt-4">
                      <p className="font-body font-bold text-base text-text-heading mb-1">
                        {testimonial.authorName || 'Verified Client'}
                      </p>
                      <p className="font-body text-sm text-text-body">
                        {testimonial.authorTitle || 'Client'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 bg-gray-100 rounded-lg text-center">
                  <p className="text-gray-600">{__('No testimonials yet. Add some in the sidebar!', 'mbn-theme')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
