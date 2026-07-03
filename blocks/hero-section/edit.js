import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, ToggleControl, Button, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import BackgroundColorControl from '../shared/BackgroundColorControl';
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
    heroButtonText,
    heroButtonUrl,
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
    backgroundImageUrl,
    backgroundImageId,
    backgroundColor,
    paddingTop,
    paddingBottom,
    contentJustify,
    contentVerticalAlign,
    textMaxWidth,
    showQuickCall,
    quickCallLabel,
    quickCallPhoneNumber,
    quickCallPhoneNumberUrl,
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
          
          <TextControl
            label={__('Hero Button Text', 'mbn-theme')}
            value={heroButtonText}
            onChange={(value) => setAttributes({ heroButtonText: value })}
          />
          
          <TextControl
            label={__('Hero Button URL', 'mbn-theme')}
            value={heroButtonUrl}
            onChange={(value) => setAttributes({ heroButtonUrl: value })}
            help={__('URL for the hero button (e.g., #contact)', 'mbn-theme')}
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
                    <>
                      <img src={badgeImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '150px', height: 'auto', borderRadius: '4px' }} />
                      <Button 
                        onClick={() => setAttributes({ badgeImageUrl: '', badgeImageId: 0 })}
                        variant="link"
                        isDestructive
                        style={{ marginTop: '8px' }}
                      >
                        {__('Remove Image', 'mbn-theme')}
                      </Button>
                    </>
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
                    <>
                      <p style={{ marginTop: '8px', fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                        {videoMp4Url}
                      </p>
                      <Button 
                        onClick={() => setAttributes({ videoMp4Url: '', videoMp4Id: 0 })}
                        variant="link"
                        isDestructive
                        style={{ marginTop: '8px' }}
                      >
                        {__('Remove Video', 'mbn-theme')}
                      </Button>
                    </>
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
                    <>
                      <p style={{ marginTop: '8px', fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                        {videoWebmUrl}
                      </p>
                      <Button 
                        onClick={() => setAttributes({ videoWebmUrl: '', videoWebmId: 0 })}
                        variant="link"
                        isDestructive
                        style={{ marginTop: '8px' }}
                      >
                        {__('Remove Video', 'mbn-theme')}
                      </Button>
                    </>
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
                    <>
                      <img src={posterImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                      <Button 
                        onClick={() => setAttributes({ posterImageUrl: '', posterImageId: 0 })}
                        variant="link"
                        isDestructive
                        style={{ marginTop: '8px' }}
                      >
                        {__('Remove Image', 'mbn-theme')}
                      </Button>
                    </>
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
                    <>
                      <img src={overlayImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                      <Button 
                        onClick={() => setAttributes({ overlayImageUrl: '', overlayImageId: 0 })}
                        variant="link"
                        isDestructive
                        style={{ marginTop: '8px' }}
                      >
                        {__('Remove Image', 'mbn-theme')}
                      </Button>
                    </>
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

        {/* Hero Quick Call CTA */}
        <PanelBody title={__('Hero Quick Call CTA', 'mbn-theme')} initialOpen={false}>
          <ToggleControl
            label={__('Show Quick Call', 'mbn-theme')}
            checked={showQuickCall}
            onChange={(value) => setAttributes({ showQuickCall: value })}
            help={showQuickCall ? __('Quick call section is visible', 'mbn-theme') : __('Quick call section is hidden', 'mbn-theme')}
          />

          {showQuickCall && (
            <>
              <TextControl
                label={__('Quick Call Label', 'mbn-theme')}
                value={quickCallLabel}
                onChange={(value) => setAttributes({ quickCallLabel: value })}
                help={__('Text before phone number (e.g., "CALL TODAY")', 'mbn-theme')}
              />
              <TextControl
                label={__('Quick Call Phone (Display)', 'mbn-theme')}
                value={quickCallPhoneNumber}
                onChange={(value) => setAttributes({ quickCallPhoneNumber: value })}
              />
              <TextControl
                label={__('Quick Call Phone (Link)', 'mbn-theme')}
                value={quickCallPhoneNumberUrl}
                onChange={(value) => setAttributes({ quickCallPhoneNumberUrl: value })}
                help={__('Format: tel:4804802929', 'mbn-theme')}
              />
            </>
          )}
        </PanelBody>

        {/* Background Settings */}
        <PanelBody title={__('Background Settings', 'mbn-theme')} initialOpen={false}>
          <BackgroundColorControl
            value={backgroundColor}
            onChange={(value) => setAttributes({ backgroundColor: value })}
          />
          
          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) => setAttributes({ backgroundImageUrl: media.url, backgroundImageId: media.id })}
              allowedTypes={['image']}
              value={backgroundImageId}
              render={({ open }) => (
                <div style={{ marginTop: '15px' }}>
                  <p style={{ fontWeight: '600', marginBottom: '8px' }}>{__('Background Image', 'mbn-theme')}</p>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{__('Optional background image (will overlay on top of video/color)', 'mbn-theme')}</p>
                  <Button onClick={open} variant="secondary">
                    {backgroundImageUrl ? __('Replace Image', 'mbn-theme') : __('Select Image', 'mbn-theme')}
                  </Button>
                  {backgroundImageUrl && (
                    <>
                      <img src={backgroundImageUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                      <Button 
                        onClick={() => setAttributes({ backgroundImageUrl: '', backgroundImageId: 0 })}
                        variant="link"
                        isDestructive
                        style={{ marginTop: '8px' }}
                      >
                        {__('Remove Image', 'mbn-theme')}
                      </Button>
                    </>
                  )}
                </div>
              )}
            />
          </MediaUploadCheck>
        </PanelBody>

        {/* Layout Settings */}
        <PanelBody title={__('Layout Settings', 'mbn-theme')} initialOpen={false}>
          <SelectControl
            label={__('Content Padding Top', 'mbn-theme')}
            value={paddingTop}
            options={[
              { label: 'None (pt-0)', value: 'pt-0' },
              { label: 'Small (pt-20)', value: 'pt-20' },
              { label: 'Medium (pt-28)', value: 'pt-28' },
              { label: 'Default (pt-36)', value: 'pt-36' },
              { label: 'Large (pt-48)', value: 'pt-48' },
              { label: 'Extra Large (pt-64)', value: 'pt-64' },
            ]}
            onChange={(value) => setAttributes({ paddingTop: value })}
            help={__('Vertical padding at the top of content area', 'mbn-theme')}
          />

          <SelectControl
            label={__('Content Padding Bottom', 'mbn-theme')}
            value={paddingBottom}
            options={[
              { label: 'None (pb-0)', value: 'pb-0' },
              { label: 'Small (pb-12)', value: 'pb-12' },
              { label: 'Medium (pb-16)', value: 'pb-16' },
              { label: 'Default (pb-20)', value: 'pb-20' },
              { label: 'Large (pb-32)', value: 'pb-32' },
              { label: 'Extra Large (pb-48)', value: 'pb-48' },
            ]}
            onChange={(value) => setAttributes({ paddingBottom: value })}
            help={__('Vertical padding at the bottom of content area', 'mbn-theme')}
          />

          <SelectControl
            label={__('Content Horizontal Alignment', 'mbn-theme')}
            value={contentJustify}
            options={[
              { label: 'Start', value: 'justify-start' },
              { label: 'Center', value: 'justify-center' },
              { label: 'End', value: 'justify-end' },
              { label: 'Between', value: 'justify-between' },
            ]}
            onChange={(value) => setAttributes({ contentJustify: value })}
            help={__('Horizontal alignment of hero content', 'mbn-theme')}
          />

          <SelectControl
            label={__('Content Vertical Alignment', 'mbn-theme')}
            value={contentVerticalAlign}
            options={[
              { label: 'Top', value: 'items-start' },
              { label: 'Center', value: 'items-center' },
              { label: 'Bottom', value: 'items-end' },
            ]}
            onChange={(value) => setAttributes({ contentVerticalAlign: value })}
            help={__('Vertical alignment of hero content', 'mbn-theme')}
          />

          <SelectControl
            label={__('Text Content Max Width', 'mbn-theme')}
            value={textMaxWidth}
            options={[
              { label: 'Small (max-w-xl)', value: 'max-w-xl' },
              { label: 'Medium (max-w-2xl)', value: 'max-w-2xl' },
              { label: 'Large (max-w-3xl)', value: 'max-w-3xl' },
              { label: 'Default (max-w-4xl)', value: 'max-w-4xl' },
              { label: 'Extra Large (max-w-5xl)', value: 'max-w-5xl' },
              { label: 'Full Width (max-w-full)', value: 'max-w-full' },
            ]}
            onChange={(value) => setAttributes({ textMaxWidth: value })}
            help={__('Maximum width of text content area', 'mbn-theme')}
          />
        </PanelBody>
      </InspectorControls>

      {/* Editor Preview */}
      <div {...blockProps}>
        {/* Background Image */}
        {backgroundImageUrl && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0
            }}
          />
        )}

        {/* Video Background Preview - only if no background image */}
        {!backgroundImageUrl && (videoMp4Url || videoWebmUrl) && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <video 
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={posterImageUrl || undefined}
            >
              {videoMp4Url && <source src={videoMp4Url} type="video/mp4" />}
              {videoWebmUrl && <source src={videoWebmUrl} type="video/webm" />}
            </video>
          </div>
        )}
        
        {/* Overlay Effect */}
        {overlayImageUrl && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${overlayImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
              zIndex: 1
            }}
          />
        )}
        
        <div className="relative flex items-center justify-center px-4 md:px-6 lg:px-12 min-h-screen" style={{ zIndex: 10 }}>
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
                
                {/* Hero Button & Quick Call */}
                {showQuickCall && (
                  <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
                    <a href={heroButtonUrl} onClick={(e) => e.preventDefault()} className="inline-flex items-center justify-center gap-2 h-12 md:h-14 px-6 md:px-8 rounded-full font-heading font-bold text-sm md:text-base bg-gradient-to-b from-accent-gold to-accent-gold-500 text-gray-900 hover:shadow-lg transition-all shadow-md hover:-translate-y-0.5">
                      {heroButtonText}
                    </a>
                    
                    <div className="flex items-center gap-2 text-white">
                      <span className="font-body font-semibold text-base xl:text-lg">
                        {quickCallLabel}
                      </span>
                      <a href={quickCallPhoneNumberUrl} onClick={(e) => e.preventDefault()} className="font-body font-bold text-base xl:text-lg text-accent-gold underline hover:text-accent-gold-300 transition-colors">
                        {quickCallPhoneNumber}
                      </a>
                    </div>
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
                    <div className="flex flex-col items-center justify-center gap-4">
                      <a href={ctaButtonUrl} onClick={(e) => e.preventDefault()} className="inline-flex items-center justify-center gap-2 h-12 md:h-14 px-6 md:px-8 rounded-full font-heading font-bold text-sm md:text-base bg-gradient-to-b from-accent-gold to-accent-gold-500 text-gray-900 hover:shadow-lg transition-all shadow-md hover:-translate-y-0.5">
                        {ctaButtonText}
                      </a>
                      <a href={phoneNumberUrl} onClick={(e) => e.preventDefault()} className="font-body font-bold text-base xl:text-lg hover:text-accent-gold transition-colors">
                        <span className="text-white no-underline">{__('CALL TODAY', 'mbn-theme')}</span>{' '}
                        <span className="text-accent-gold underline">{phoneNumber}</span>
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
