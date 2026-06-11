import { useBlockProps, InspectorControls, MediaUpload, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, ToggleControl, SelectControl, Button, Icon } from '@wordpress/components';
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
        onSelect={(media) => updateItem(index, { imageUrl: media.url, imageId: media.id })}
        allowedTypes={['image']}
        value={item.imageId}
        render={({ open }) => (
          <div>
            <Button onClick={open} variant="secondary" style={{ marginTop: '10px' }}>
              {item.imageUrl ? __('Replace Badge Image', 'mbn-theme') : __('Select Badge Image', 'mbn-theme')}
            </Button>
            {item.imageUrl && (
              <img src={item.imageUrl} alt="" style={{ marginTop: '10px', maxWidth: '150px', height: 'auto' }} />
            )}
          </div>
        )}
      />

      <TextareaControl
        label={__('Badge Text', 'mbn-theme')}
        value={item.text}
        onChange={(value) => updateItem(index, { text: value })}
        rows={3}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
}

export default function Edit({ attributes, setAttributes }) {
  const {
    backgroundColor,
    eyebrowText,
    mainHeading,
    subHeading,
    mainContent,
    backgroundImageUrl,
    backgroundImageId,
    videoMp4Url,
    videoMp4Id,
    videoWebmUrl,
    videoWebmId,
    posterImageUrl,
    posterImageId,
    overlayImageUrl,
    overlayImageId,
    showOverlay,
    overlayFallbackStyle,
    badges = [],
    badgeTextColor,
    showCtaBar,
    ctaHeading,
    ctaText,
    ctaButtonText,
    ctaButtonUrl,
    phoneNumber,
    phoneNumberUrl,
  } = attributes;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        imageUrl: '',
        imageId: 0,
        text: ''
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

  const isCustomColor = backgroundColor && backgroundColor.startsWith('#');
  const bgStyle = isCustomColor ? { backgroundColor } : {};
  const bgClass = isCustomColor ? '' : backgroundColor;

  const blockProps = useBlockProps({
    className: `relative overflow-hidden ${bgClass}`,
    style: {
      ...bgStyle,
      backgroundImage: posterImageUrl ? `url(${posterImageUrl})` : (backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none'),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Background', 'mbn-theme')} initialOpen={true}>
          <BackgroundColorControl
            value={backgroundColor}
            onChange={(value) => setAttributes({ backgroundColor: value })}
            defaultValue="bg-white"
            label={__('Section Background', 'mbn-theme')}
            help={__('Choose a preset or custom background color', 'mbn-theme')}
          />
        </PanelBody>
        
        {/* Content Settings */}
        <PanelBody title={__('Section Content', 'mbn-theme')} initialOpen={false}>
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
            label={__('Heading (H3)', 'mbn-theme')}
            value={subHeading}
            onChange={(value) => setAttributes({ subHeading: value })}
            rows={2}
          />

          <TextareaControl
            label={__('Main Content', 'mbn-theme')}
            value={mainContent}
            onChange={(value) => setAttributes({ mainContent: value })}
            rows={3}
          />

          <MediaUpload
            onSelect={(media) => setAttributes({ backgroundImageUrl: media.url, backgroundImageId: media.id })}
            allowedTypes={['image']}
            value={backgroundImageId}
            render={({ open }) => (
              <div style={{ marginTop: '15px' }}>
                <Button onClick={open} variant="secondary">
                  {backgroundImageUrl ? __('Replace Background', 'mbn-theme') : __('Select Background', 'mbn-theme')}
                </Button>
                {backgroundImageUrl && (
                  <img src={backgroundImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                )}
              </div>
            )}
          />
        </PanelBody>
        {/* Media Settings */}
        <PanelBody title={__('Media', 'mbn-theme')} initialOpen={false}>
          <MediaUpload
            onSelect={(media) => setAttributes({ videoMp4Url: media.url, videoMp4Id: media.id })}
            allowedTypes={['video']}
            value={videoMp4Id}
            render={({ open }) => (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontWeight: '600', marginBottom: '8px' }}>{__('Video MP4', 'mbn-theme')}</p>
                <Button onClick={open} variant="secondary">
                  {videoMp4Url ? __('Replace Video', 'mbn-theme') : __('Select Video', 'mbn-theme')}
                </Button>
                {videoMp4Url && (
                  <p style={{ marginTop: '8px', fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                    {videoMp4Url}
                  </p>
                )}
              </div>
            )}
          />

          <MediaUpload
            onSelect={(media) => setAttributes({ videoWebmUrl: media.url, videoWebmId: media.id })}
            allowedTypes={['video']}
            value={videoWebmId}
            render={({ open }) => (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontWeight: '600', marginBottom: '8px' }}>{__('Video WebM', 'mbn-theme')}</p>
                <Button onClick={open} variant="secondary">
                  {videoWebmUrl ? __('Replace Video', 'mbn-theme') : __('Select Video', 'mbn-theme')}
                </Button>
                {videoWebmUrl && (
                  <p style={{ marginTop: '8px', fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                    {videoWebmUrl}
                  </p>
                )}
              </div>
            )}
          />

          <MediaUpload
            onSelect={(media) => setAttributes({ posterImageUrl: media.url, posterImageId: media.id })}
            allowedTypes={['image']}
            value={posterImageId}
            render={({ open }) => (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontWeight: '600', marginBottom: '8px' }}>{__('Poster Image', 'mbn-theme')}</p>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{__('Fallback image before video loads', 'mbn-theme')}</p>
                <Button onClick={open} variant="secondary">
                  {posterImageUrl ? __('Replace Image', 'mbn-theme') : __('Select Image', 'mbn-theme')}
                </Button>
                {posterImageUrl && (
                  <img src={posterImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                )}
              </div>
            )}
          />

          <MediaUpload
            onSelect={(media) => setAttributes({ overlayImageUrl: media.url, overlayImageId: media.id })}
            allowedTypes={['image']}
            value={overlayImageId}
            render={({ open }) => (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontWeight: '600', marginBottom: '8px' }}>{__('Overlay Image', 'mbn-theme')}</p>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{__('Optional gradient overlay PNG', 'mbn-theme')}</p>
                <Button onClick={open} variant="secondary">
                  {overlayImageUrl ? __('Replace Image', 'mbn-theme') : __('Select Image', 'mbn-theme')}
                </Button>
                {overlayImageUrl && (
                  <img src={overlayImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                )}
              </div>
            )}
          />

          <ToggleControl
            label={__('Show Overlay Layer', 'mbn-theme')}
            checked={showOverlay}
            onChange={(value) => setAttributes({ showOverlay: value })}
          />

          {showOverlay && (
            <SelectControl
              label={__('Overlay Fallback', 'mbn-theme')}
              value={overlayFallbackStyle}
              options={[
                { label: __('Gradient', 'mbn-theme'), value: 'gradient' },
                { label: __('Transparent', 'mbn-theme'), value: 'transparent' },
              ]}
              onChange={(value) => setAttributes({ overlayFallbackStyle: value })}
              help={__('Used when no overlay image is set.', 'mbn-theme')}
            />
          )}
        </PanelBody>
        {/* Badges Settings */}
        <PanelBody title={__('Badges', 'mbn-theme')} initialOpen={false}>
          <SelectControl
            label={__('Badge Text Color', 'mbn-theme')}
            value={badgeTextColor}
            options={[
              { label: __('Light Gray (text-gray-200)', 'mbn-theme'), value: 'text-gray-200' },
              { label: __('Body (text-body)', 'mbn-theme'), value: 'text-body' },
            ]}
            onChange={(value) => setAttributes({ badgeTextColor: value })}
          />

          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder badges', 'mbn-theme')}
          </p>
          
          <DndContext
            sensors={sensors}
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

        {/* CTA Bar Settings */}
        <PanelBody title={__('CTA Bar', 'mbn-theme')} initialOpen={false}>
          <ToggleControl
            label={__('Show CTA Bar', 'mbn-theme')}
            checked={showCtaBar}
            onChange={(value) => setAttributes({ showCtaBar: value })}
          />

          {showCtaBar && (
            <>
              <TextareaControl
                label={__('CTA Heading', 'mbn-theme')}
                value={ctaHeading}
                onChange={(value) => setAttributes({ ctaHeading: value })}
                rows={2}
              />
              
              <TextareaControl
                label={__('CTA Text', 'mbn-theme')}
                value={ctaText}
                onChange={(value) => setAttributes({ ctaText: value })}
                rows={4}
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
                label={__('Phone Number (Display)', 'mbn-theme')}
                value={phoneNumber}
                onChange={(value) => setAttributes({ phoneNumber: value })}
              />
              <TextControl
                label={__('Phone Number (Link)', 'mbn-theme')}
                value={phoneNumberUrl}
                onChange={(value) => setAttributes({ phoneNumberUrl: value })}
              />
            </>
          )}
        </PanelBody>
      </InspectorControls>

      {/* Editor Preview */}
      <div {...blockProps}>
        <div className="relative py-12 md:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
            
            {/* Heading Section */}
            <div className="text-center mb-10 md:mb-16">
              {eyebrowText && (
                <p className="font-body text-sm md:text-base font-semibold uppercase tracking-[0.15em] text-accent-gold mb-4">
                  {eyebrowText}
                </p>
              )}
              
              <RichText
                tagName="h2"
                value={mainHeading}
                onChange={(value) => setAttributes({ mainHeading: value })}
                placeholder={__('Enter heading...', 'mbn-theme')}
                className="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl text-white"
              />

              <RichText
                tagName="h3"
                value={subHeading}
                onChange={(value) => setAttributes({ subHeading: value })}
                placeholder={__('Enter heading (H3)...', 'mbn-theme')}
                className="section-3col-badge-cta__sub-heading font-heading text-heading text-center text-[28px] font-semibold leading-10 mt-4"
              />

              <RichText
                tagName="p"
                value={mainContent}
                onChange={(value) => setAttributes({ mainContent: value })}
                placeholder={__('Enter main content...', 'mbn-theme')}
                className="section-3col-badge-cta__main-content font-body text-body text-center text-lg font-normal leading-7 mt-3"
              />
            </div>

            {/* 3 Column Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 mb-12 md:mb-16">
              {badges.length === 0 && (
                <div className="col-span-3 text-center text-gray-400 py-8">
                  {__('Add badges in the sidebar →', 'mbn-theme')}
                </div>
              )}
              {badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center text-center gap-6">
                  {badge.imageUrl && (
                    <img src={badge.imageUrl} alt="" className="w-40 h-40 object-contain" />
                  )}
                  {badge.text && (
                    <p className={`font-body ${badgeTextColor} text-sm md:text-base leading-relaxed`}>
                      {badge.text}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Bar */}
            {showCtaBar && (
              <div className="bg-gradient-to-r from-[#1D456F] to-[#13263E] rounded-[32px] px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
                  
                  {/* Left: Text Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <RichText
                      tagName="h3"
                      value={ctaHeading}
                      onChange={(value) => setAttributes({ ctaHeading: value })}
                      placeholder={__('Enter CTA heading...', 'mbn-theme')}
                      className="font-heading font-bold text-2xl md:text-3xl text-white mb-4"
                    />
                    <RichText
                      tagName="p"
                      value={ctaText}
                      onChange={(value) => setAttributes({ ctaText: value })}
                      placeholder={__('Enter CTA text...', 'mbn-theme')}
                      className="font-body text-gray-200 text-base md:text-lg leading-relaxed"
                    />
                  </div>
                  
                  {/* Right: Buttons */}
                  <div className="flex flex-col items-center gap-4">
                    <a href={ctaButtonUrl} onClick={(e) => e.preventDefault()} className="btn-cta">
                      {ctaButtonText}
                    </a>
                    <a href={phoneNumberUrl} onClick={(e) => e.preventDefault()} className="font-body font-bold text-sm transition-colors whitespace-nowrap">
                      <span className="text-white no-underline">CALL TODAY</span> <span className="text-primary underline">{phoneNumber}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
