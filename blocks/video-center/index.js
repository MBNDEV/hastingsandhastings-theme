import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import metadata from './block.json';
import './style.css';

function Edit({ attributes, setAttributes }) {
  const { videoCards } = attributes;

  const blockProps = useBlockProps({
    className: 'video-center-editor',
  });

  const updateVideoCard = (index, field, value) => {
    const updatedCards = [...videoCards];
    updatedCards[index] = {
      ...updatedCards[index],
      [field]: value,
    };
    setAttributes({ videoCards: updatedCards });
  };

  const addVideoCard = () => {
    setAttributes({
      videoCards: [
        ...videoCards,
        {
          title: 'New Video',
          videoType: 'youtube',
          videoSrc: '',
          videoId: 0,
          thumbnailId: 0,
          thumbnailUrl: '',
          thumbnailAlt: '',
        },
      ],
    });
  };

  const removeVideoCard = (index) => {
    const updatedCards = videoCards.filter((_, i) => i !== index);
    setAttributes({ videoCards: updatedCards });
  };

  const duplicateVideoCard = (index) => {
    const cardToDuplicate = { ...videoCards[index] };
    const updatedCards = [
      ...videoCards.slice(0, index + 1),
      cardToDuplicate,
      ...videoCards.slice(index + 1),
    ];
    setAttributes({ videoCards: updatedCards });
  };

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Video Cards', 'mbn-theme')} initialOpen={true}>
          {videoCards.map((card, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <strong>
                  {__('Video Card', 'mbn-theme')} {index + 1}
                </strong>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    icon="admin-page"
                    label={__('Duplicate', 'mbn-theme')}
                    onClick={() => duplicateVideoCard(index)}
                  />
                  <Button
                    icon="trash"
                    label={__('Remove', 'mbn-theme')}
                    isDestructive
                    onClick={() => removeVideoCard(index)}
                  />
                </div>
              </div>

              <TextControl
                label={__('Video Title', 'mbn-theme')}
                value={card.title || ''}
                onChange={(value) => updateVideoCard(index, 'title', value)}
                help={__('Displayed below the video thumbnail', 'mbn-theme')}
              />

              <SelectControl
                label={__('Video Type', 'mbn-theme')}
                value={card.videoType || 'youtube'}
                options={[
                  { label: 'YouTube', value: 'youtube' },
                  { label: 'MP4', value: 'mp4' },
                ]}
                onChange={(value) => updateVideoCard(index, 'videoType', value)}
              />

              {card.videoType === 'youtube' ? (
                <TextControl
                  label={__('Video URL', 'mbn-theme')}
                  value={card.videoSrc || ''}
                  onChange={(value) => updateVideoCard(index, 'videoSrc', value)}
                  help={__('Any YouTube URL format (watch, youtu.be, or embed)', 'mbn-theme')}
                />
              ) : (
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '11px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}
                  >
                    {__('MP4 Video', 'mbn-theme')}
                  </label>
                  <MediaUploadCheck>
                    <MediaUpload
                      onSelect={(media) => {
                        updateVideoCard(index, 'videoId', media.id);
                        updateVideoCard(index, 'videoSrc', media.url);
                      }}
                      allowedTypes={['video']}
                      value={card.videoId || 0}
                      render={({ open }) => (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <Button onClick={open} variant="secondary">
                            {card.videoSrc
                              ? __('Replace Video', 'mbn-theme')
                              : __('Select Video', 'mbn-theme')}
                          </Button>
                          {card.videoSrc && (
                            <Button
                              onClick={() => {
                                updateVideoCard(index, 'videoId', 0);
                                updateVideoCard(index, 'videoSrc', '');
                              }}
                              variant="secondary"
                              isDestructive
                            >
                              {__('Remove Video', 'mbn-theme')}
                            </Button>
                          )}
                        </div>
                      )}
                    />
                  </MediaUploadCheck>
                  {card.videoSrc && (
                    <p
                      style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#666',
                        wordBreak: 'break-all',
                      }}
                    >
                      {card.videoSrc}
                    </p>
                  )}
                </div>
              )}

              {card.videoType === 'mp4' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '11px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}
                  >
                    {__('Custom Thumbnail (Optional)', 'mbn-theme')}
                  </label>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      marginBottom: '8px',
                      marginTop: '0',
                    }}
                  >
                    {__('Upload a custom thumbnail image for this video', 'mbn-theme')}
                  </p>
                  <MediaUploadCheck>
                    <MediaUpload
                      onSelect={(media) => {
                        updateVideoCard(index, 'thumbnailId', media.id);
                        updateVideoCard(index, 'thumbnailUrl', media.url);
                      }}
                      allowedTypes={['image']}
                      value={card.thumbnailId || 0}
                      render={({ open }) => (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Button onClick={open} variant="secondary">
                              {card.thumbnailUrl
                                ? __('Replace Thumbnail', 'mbn-theme')
                                : __('Select Thumbnail', 'mbn-theme')}
                            </Button>
                            {card.thumbnailUrl && (
                              <Button
                                onClick={() => {
                                  updateVideoCard(index, 'thumbnailId', 0);
                                  updateVideoCard(index, 'thumbnailUrl', '');
                                }}
                                variant="secondary"
                                isDestructive
                              >
                                {__('Remove Thumbnail', 'mbn-theme')}
                              </Button>
                            )}
                          </div>
                          {card.thumbnailUrl && (
                            <div
                              style={{
                                marginTop: '4px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                maxWidth: '200px',
                              }}
                            >
                              <img
                                src={card.thumbnailUrl}
                                alt="Thumbnail preview"
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  display: 'block',
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </MediaUploadCheck>
                </div>
              )}

              <TextControl
                label={__('Thumbnail Alt Text', 'mbn-theme')}
                value={card.thumbnailAlt || ''}
                onChange={(value) => updateVideoCard(index, 'thumbnailAlt', value)}
                help={__('Accessibility description for the video thumbnail', 'mbn-theme')}
              />
            </div>
          ))}

          <Button isPrimary onClick={addVideoCard} style={{ marginTop: '1rem' }}>
            {__('Add Video Card', 'mbn-theme')}
          </Button>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div
          style={{
            border: '2px dashed #ccc',
            padding: '2rem',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <svg
              style={{ width: '32px', height: '32px', fill: '#666' }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm-8.5 12.5v-7l5.5 3.5-5.5 3.5z" />
            </svg>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                {__('Video Center', 'mbn-theme')}
              </h3>
              <p style={{ margin: '0.25rem 0 0', color: '#666', fontSize: '14px' }}>
                {videoCards.length} {videoCards.length === 1 ? __('video', 'mbn-theme') : __('videos', 'mbn-theme')}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            {videoCards.map((card, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                }}
              >
                <div
                  style={{
                    aspectRatio: '16 / 9',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    style={{ width: '40px', height: '40px', fill: '#999' }}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#333',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {card.title || __('Untitled Video', 'mbn-theme')}
                  </p>
                  <p
                    style={{
                      margin: '0.25rem 0 0',
                      fontSize: '11px',
                      color: '#999',
                      textTransform: 'uppercase',
                    }}
                  >
                    {card.videoType || 'youtube'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
            }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              ℹ️ {__('Use the sidebar to add, edit, or remove video cards. YouTube thumbnails load automatically on the frontend.', 'mbn-theme')}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

registerBlockType(metadata.name, {
  edit: Edit,
  save: () => null,
});
