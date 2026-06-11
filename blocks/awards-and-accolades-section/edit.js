import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { PanelBody, Button, Icon, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function SortableAwardItem({ award, index, updateAward, duplicateAward, removeAward }) {
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
    opacity: isDragging ? 0.6 : 1,
    marginBottom: '16px',
    padding: '14px',
    border: '1px solid #d6dae1',
    borderRadius: '6px',
    backgroundColor: '#fff',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '4px' }}>
            <Icon icon="menu" />
          </div>
          <strong>{__('Award', 'mbn-theme')} {index + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button
            icon="admin-page"
            label={__('Duplicate', 'mbn-theme')}
            onClick={() => duplicateAward(index)}
          />
          <Button
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
                <img
                  src={award.imageUrl}
                  alt=""
                  style={{ marginTop: '10px', maxWidth: '140px', maxHeight: '70px', objectFit: 'contain' }}
                />
              )}
            </div>
          )}
        />
      </MediaUploadCheck>
    </div>
  );
}

export default function Edit({ attributes, setAttributes }) {
  const { awardsLabel, awards = [] } = attributes;

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
      awards: [...awards, { id: generateUniqueId(), imageUrl: '', imageId: 0 }],
    });
  };

  const duplicateAward = (index) => {
    const copied = { ...awards[index], id: generateUniqueId() };
    const updatedAwards = [
      ...awards.slice(0, index + 1),
      copied,
      ...awards.slice(index + 1),
    ];
    setAttributes({ awards: updatedAwards });
  };

  const removeAward = (index) => {
    const updatedAwards = awards.filter((_, i) => i !== index);
    setAttributes({ awards: updatedAwards });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = awards.findIndex((award) => award.id === active.id);
    const newIndex = awards.findIndex((award) => award.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    setAttributes({ awards: arrayMove(awards, oldIndex, newIndex) });
  };

  const blockProps = useBlockProps({
    className: 'section-awards-accolades bg-white py-8 md:py-12 lg:py-14',
  });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Section Settings', 'mbn-theme')} initialOpen={true}>
          <TextControl
            label={__('Label', 'mbn-theme')}
            value={awardsLabel}
            onChange={(value) => setAttributes({ awardsLabel: value })}
          />
        </PanelBody>

        <PanelBody title={__('Awards', 'mbn-theme')} initialOpen={true}>
          <p style={{ marginBottom: '12px', fontSize: '12px', color: '#525866' }}>
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
                <SortableAwardItem
                  key={award.id}
                  award={award}
                  index={index}
                  updateAward={updateAward}
                  duplicateAward={duplicateAward}
                  removeAward={removeAward}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addAward} style={{ marginTop: '10px' }}>
            {__('+ Add Award', 'mbn-theme')}
          </Button>
        </PanelBody>
      </InspectorControls>

      <section {...blockProps}>
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 lg:gap-20">
            <RichText
              tagName="p"
              value={awardsLabel}
              onChange={(value) => setAttributes({ awardsLabel: value })}
              placeholder={__('Awards & Accolades', 'mbn-theme')}
              className="font-heading text-sm md:text-base font-bold text-text-muted md:flex-shrink-0 max-w-none md:max-w-[100px]"
            />

            <div className="flex w-full flex-wrap items-center gap-6 md:flex-1 md:gap-10 lg:gap-14">
              {awards.length === 0 && (
                <p className="font-body text-sm text-gray-500">
                  {__('Add award logos from the block settings panel.', 'mbn-theme')}
                </p>
              )}

              {awards.map((award) => (
                <div key={award.id} className="flex h-14 w-[130px] items-center justify-center md:h-16 md:w-[150px]">
                  {award.imageUrl && (
                    <img
                      src={award.imageUrl}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}
