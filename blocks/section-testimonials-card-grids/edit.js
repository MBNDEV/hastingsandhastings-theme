import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, Button, TextareaControl, RangeControl, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function StarPreview({ count }) {
  const parsedCount = parseInt(count, 10);
  const starCount = !isNaN(parsedCount) ? Math.max(1, Math.min(5, parsedCount)) : 5;
  return (
    <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
      {[...Array(starCount)].map((_, i) => (
        <span key={i} style={{ color: '#ecc806', fontSize: '16px' }}>★</span>
      ))}
    </div>
  );
}

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
    marginBottom: '16px',
    padding: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '4px' }}>
            <Icon icon="menu" />
          </div>
          <strong style={{ fontSize: '13px' }}>{__('Card', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button icon="admin-page" label={__('Duplicate', 'mbn-theme')} onClick={() => duplicateItem(index)} />
          <Button icon="trash" label={__('Remove', 'mbn-theme')} onClick={() => removeItem(index)} />
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
        label={__('Headline', 'mbn-theme')}
        value={item.headline}
        onChange={(value) => updateItem(index, { headline: value })}
        rows={2}
      />

      <TextareaControl
        label={__('Quote', 'mbn-theme')}
        value={item.quote}
        onChange={(value) => updateItem(index, { quote: value })}
        rows={5}
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

export default function Edit({ attributes, setAttributes }) {
  const { cards = [] } = attributes;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const updateCard = (index, updates) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], ...updates };
    setAttributes({ cards: updated });
  };

  const addCard = () => {
    setAttributes({
      cards: [...cards, {
        id: generateUniqueId(),
        starRating: 5,
        headline: '',
        quote: '',
        author: 'Verified Client',
      }],
    });
  };

  const removeCard = (index) => {
    setAttributes({ cards: cards.filter((_, i) => i !== index) });
  };

  const duplicateCard = (index) => {
    const copy = { ...cards[index], id: generateUniqueId() };
    const updated = [
      ...cards.slice(0, index + 1),
      copy,
      ...cards.slice(index + 1),
    ];
    setAttributes({ cards: updated });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = cards.findIndex((c) => c.id === active.id);
      const newIndex = cards.findIndex((c) => c.id === over.id);
      setAttributes({ cards: arrayMove(cards, oldIndex, newIndex) });
    }
  };

  const blockProps = useBlockProps({ className: 'tfcards' });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Cards', 'mbn-theme')} initialOpen={true}>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
            {__('Drag to reorder. Each card has an editable star rating (1–5).', 'mbn-theme')}
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={cards.map((c) => c.id)}
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

          <Button variant="primary" onClick={addCard} style={{ marginTop: '12px' }}>
            {__('+ Add Card', 'mbn-theme')}
          </Button>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="tfcards__container">
          <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '16px' }}>
            {__('Testimonial Cards', 'mbn-theme')} ({cards.length}) — {__('Edit content in sidebar →', 'mbn-theme')}
          </p>
          <div className="tfcards__grid">
            {cards.length === 0 && (
              <p style={{ color: '#aaa', fontStyle: 'italic', gridColumn: '1 / -1' }}>
                {__('Add cards in the sidebar →', 'mbn-theme')}
              </p>
            )}
            {cards.map((card, index) => (
              <article key={card.id} className="tfcards__card">
                <div className="tfcards__card-content">
                  <StarPreview count={card.starRating} />
                  <div className="tfcards__card-text">
                    <RichText
                      tagName="h2"
                      className="tfcards__card-headline"
                      value={card.headline}
                      onChange={(value) => updateCard(index, { headline: value })}
                      placeholder={__('Card headline…', 'mbn-theme')}
                    />
                    <RichText
                      tagName="p"
                      className="tfcards__card-quote"
                      value={card.quote}
                      onChange={(value) => updateCard(index, { quote: value })}
                      placeholder={__('Enter quote…', 'mbn-theme')}
                    />
                  </div>
                </div>
                <footer className="tfcards__card-footer">
                  <p className="tfcards__card-author">{card.author}</p>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
