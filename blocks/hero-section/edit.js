import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, ToggleControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import './editor.css';

export default function Edit({ attributes, setAttributes }) {
  const {
    eyebrowText,
    mainHeading,
    subheading,
    badgeImageUrl,
    badgeImageId,
    videoMp4Url,
    videoMp4Id,
    videoWebmUrl,
    videoWebmId,
    posterImageUrl,
    posterImageId,
    overlayImageUrl,
    overlayImageId,
    showCtaBar,
    ctaButtonText,
    ctaButtonUrl,
    phoneNumber,
    phoneNumberUrl,
    settlementFeesNumber,
    settlementFeesLabel,
    outOfPocketNumber,
    outOfPocketLabel,
    feeUntilWinNumber,
    feeUntilWinLabel,
  } = attributes;

  const blockProps = useBlockProps({
    className: 'relative min-h-screen bg-gray-900 overflow-hidden',
    style: {
      backgroundImage: posterImageUrl ? `url(${posterImageUrl})` : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  });

  return (
    <Fragment>
      <InspectorControls>
        
        {/* Content Settings */}
        <PanelBody title={__('Hero Content', 'mbn-theme')} initialOpen={true}>
          <TextControl
            label={__('Eyebrow Text', 'mbn-theme')}
            value={eyebrowText}
            onChange={(value) => setAttributes({ eyebrowText: value })}
            help={__('Small text above the main heading', 'mbn-theme')}
          />
          
          <TextareaControl
            label={__('Main Heading', 'mbn-theme')}
            value={mainHeading}
            onChange={(value) => setAttributes({ mainHeading: value })}
            rows={3}
          />
          
          <TextareaControl
            label={__('Subheading', 'mbn-theme')}
            value={subheading}
            onChange={(value) => setAttributes({ subheading: value })}
            rows={4}
          />
        </PanelBody>

        {/* Media Settings */}
        <PanelBody title={__('Media', 'mbn-theme')} initialOpen={false}>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) => setAttributes({ badgeImageUrl: media.url, badgeImageId: media.id })}
              allowedTypes={['image']}
              value={badgeImageId}
              render={({ open }) => (
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontWeight: '600', marginBottom: '8px' }}>{__('Badge Image', 'mbn-theme')}</p>
                  <Button onClick={open} variant="secondary">
                    {badgeImageUrl ? __('Replace Image', 'mbn-theme') : __('Select Image', 'mbn-theme')}
                  </Button>
                  {badgeImageUrl && (
                    <img src={badgeImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '150px', height: 'auto', borderRadius: '4px' }} />
                  )}
                </div>
              )}
            />
          </MediaUploadCheck>

          <MediaUploadCheck>
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
          </MediaUploadCheck>

          <MediaUploadCheck>
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
          </MediaUploadCheck>

          <MediaUploadCheck>
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
          </MediaUploadCheck>

          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) => setAttributes({ overlayImageUrl: media.url, overlayImageId: media.id })}
              allowedTypes={['image']}
              value={overlayImageId}
              render={({ open }) => (
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontWeight: '600', marginBottom: '8px' }}>{__('Overlay Image', 'mbn-theme')}</p>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{__('Gradient overlay PNG', 'mbn-theme')}</p>
                  <Button onClick={open} variant="secondary">
                    {overlayImageUrl ? __('Replace Image', 'mbn-theme') : __('Select Image', 'mbn-theme')}
                  </Button>
                  {overlayImageUrl && (
                    <img src={overlayImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                  )}
                </div>
              )}
            />
          </MediaUploadCheck>
        </PanelBody>

        {/* CTA Bar Settings */}
        <PanelBody title={__('CTA Bar', 'mbn-theme')} initialOpen={false}>
          <ToggleControl
            label={__('Show CTA Bar', 'mbn-theme')}
            checked={showCtaBar}
            onChange={(value) => setAttributes({ showCtaBar: value })}
            help={showCtaBar ? __('CTA bar is visible', 'mbn-theme') : __('CTA bar is hidden', 'mbn-theme')}
          />

          {showCtaBar && (
            <>
              <hr style={{ margin: '20px 0' }} />
              
              <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>{__('Value Propositions', 'mbn-theme')}</h4>
              
              <TextControl
                label={__('Settlement Fees Number', 'mbn-theme')}
                value={settlementFeesNumber}
                onChange={(value) => setAttributes({ settlementFeesNumber: value })}
              />
              <TextControl
                label={__('Settlement Fees Label', 'mbn-theme')}
                value={settlementFeesLabel}
                onChange={(value) => setAttributes({ settlementFeesLabel: value })}
              />

              <TextControl
                label={__('Out-of-Pocket Number', 'mbn-theme')}
                value={outOfPocketNumber}
                onChange={(value) => setAttributes({ outOfPocketNumber: value })}
              />
              <TextControl
                label={__('Out-of-Pocket Label', 'mbn-theme')}
                value={outOfPocketLabel}
                onChange={(value) => setAttributes({ outOfPocketLabel: value })}
              />

              <TextControl
                label={__('Fee Until Win Number', 'mbn-theme')}
                value={feeUntilWinNumber}
                onChange={(value) => setAttributes({ feeUntilWinNumber: value })}
              />
              <TextControl
                label={__('Fee Until Win Label', 'mbn-theme')}
                value={feeUntilWinLabel}
                onChange={(value) => setAttributes({ feeUntilWinLabel: value })}
              />

              <hr style={{ margin: '20px 0' }} />
              
              <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>{__('CTA Button', 'mbn-theme')}</h4>

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
                help={__('Format: tel:4804802929', 'mbn-theme')}
              />
            </>
          )}
        </PanelBody>
      </InspectorControls>

      {/* Editor Preview */}
      <div {...blockProps}>
        {/* Overlay Effect */}
        {overlayImageUrl && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${overlayImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3
            }}
          />
        )}
        
        <div className="relative flex items-center justify-center px-4 md:px-6 lg:px-12 min-h-screen">
          <div className="max-w-[1440px] w-full mx-auto py-20 md:pt-48 md:pb-16">
            
            <div className="flex flex-col items-center gap-8 md:gap-10">
              
              {/* Heading Group with Badge */}
              <div className="relative flex flex-col lg:flex-row md:justify-center items-center lg:items-end justify-between gap-6 lg:gap-12 w-full">
                
                {/* Text Content Group */}
                <div className="flex flex-col gap-4 md:gap-6 flex-1 max-w-4xl">
                  
                  {/* Eyebrow Text */}
                  {eyebrowText && (
                    <p className="font-body text-sm md:text-base xl:text-lg font-semibold uppercase tracking-[0.15em] text-accent-gold">
                      {eyebrowText}
                    </p>
                  )}
                  
                  {/* Main Heading */}
                  <RichText
                    tagName="h1"
                    value={mainHeading}
                    onChange={(value) => setAttributes({ mainHeading: value })}
                    placeholder={__('Enter main heading...', 'mbn-theme')}
                    className="font-heading font-semibold text-4xl md:text-5xl xl:text-6xl text-white xl:leading-[72px]"
                  />

                  {/* Subheading */}
                  <RichText
                    tagName="p"
                    value={subheading}
                    onChange={(value) => setAttributes({ subheading: value })}
                    placeholder={__('Enter subheading...', 'mbn-theme')}
                    className="font-body text-gray-300 text-lg md:text-xl leading-relaxed mt-2 pr-5"
                  />
                </div>
                
                {/* Badge */}
                {badgeImageUrl && (
                  <div className="lg:mb-10">
                    <img src={badgeImageUrl} alt="Badge" className="w-36 md:w-44 lg:w-52 h-auto" />
                  </div>
                )}
              </div>

              {/* CTA Bar */}
              {showCtaBar && (
                <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-[40px] px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12 w-full max-w-6xl">
                  <div className="flex flex-row items-center justify-between gap-6 lg:gap-8">
                    
                    {/* Value Props */}
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-10 flex-1">
                      <div className="text-center">
                        <div className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-1">{settlementFeesNumber}%</div>
                        <div className="font-body text-xs md:text-sm text-white/80 uppercase tracking-wide">{settlementFeesLabel}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-1">{outOfPocketNumber}</div>
                        <div className="font-body text-xs md:text-sm text-white/80 uppercase tracking-wide">{outOfPocketLabel}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-1">{feeUntilWinNumber}</div>
                        <div className="font-body text-xs md:text-sm text-white/80 uppercase tracking-wide">{feeUntilWinLabel}</div>
                      </div>
                    </div>
                    
                    {/* CTA Button & Phone */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
                      <a href={ctaButtonUrl} onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-2 h-12 md:h-14 px-6 md:px-8 rounded-full font-heading font-bold text-sm md:text-base bg-gradient-to-b from-accent-gold to-accent-gold-500 text-gray-900 hover:shadow-lg transition-all">
                        {ctaButtonText}
                      </a>
                      <a href={phoneNumberUrl} onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-2 h-12 md:h-14 px-6 md:px-8 rounded-full font-heading font-bold text-sm md:text-base bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 transition-all">
                        {phoneNumber}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
