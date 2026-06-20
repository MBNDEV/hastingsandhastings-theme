import { registerBlockType } from '@wordpress/blocks';
import {
  useBlockProps,
  InspectorControls,
  RichText,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, ToggleControl } from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';
import metadata from './block.json';
import './style.css';

const makeCaseResult = () => ( {
  tag: '',
  amount: '',
  title: '',
  description: '',
  imageId: 0,
  imageUrl: '',
  imageFallback: 'case-car-accident.jpg',
  imageAlt: '',
} );

const makeSimpleLink = () => ( {
  label: '',
  url: '#',
} );

const makeCaseCategory = () => ( {
  title: '',
  description: '',
  imageId: 0,
  imageUrl: '',
  imageFallback: 'vehicle-accidents.jpg',
  imageAlt: '',
  links: [ makeSimpleLink() ],
} );

const makeFaqItem = () => ( {
  question: '',
  answer: '',
  bullets: '',
} );

const makeServingColumn = () => ( {
  title: '',
  links: [ makeSimpleLink() ],
} );

const makeCtaCard = () => ( {
  title: '',
  description: '',
  buttonText: '',
  phoneLabel: 'Call Today',
  phoneText: '',
  phoneUrl: 'tel:',
  backgroundImageId: 0,
  backgroundImageUrl: '',
  backgroundImageFallback: 'column-bg.jpg',
  logoImageId: 0,
  logoImageUrl: '',
  logoImageFallback: 'logo-hh.svg',
} );

const makeWhyChooseItem = () => ( {
  heading: '',
  paragraph: '',
  imageId: 0,
  imageUrl: '',
  imageFallback: '',
  imageAlt: '',
} );

const makeWhyChooseStat = () => ( {
  number: '',
  label: '',
} );

const makeTestimonial = () => ( {
  quote: '',
  authorName: '',
  authorRole: '',
  rating: 5,
} );

const makeHowWeHelpItem = () => ( {
  text: '',
  imageId: 0,
  imageUrl: '',
  imageFallback: 'lawyer-consultation.jpg',
  imageAlt: '',
  imagePosition: 'right',
} );

const makeFaultDamageType = () => ( {
  title: '',
  description: '',
} );

const makeFaultStep = () => ( {
  number: '',
  title: '',
  description: '',
} );

const makeBadgeTextParagraph = () => ( {
  text: '',
} );

const makeBadgeItem = () => ( {
  imageId: 0,
  imageUrl: '',
  imageFallback: '',
  imageAlt: '',
  imageWidth: 303,
  imageHeight: 303,
} );

const sectionStyle = ( isActive ) => ( {
  border: isActive ? '2px solid #286fb7' : '1px solid #d5dadd',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '10px',
  backgroundColor: isActive ? '#f3f7fc' : '#ffffff',
} );

function Edit( { attributes, setAttributes } ) {
  const {
    whyChooseTitle,
    whyChooseIntro,
    whyChooseItems = [],
    whyChooseStatsDisplayMode,
    whyChooseStats = [],
    whyChooseStatsImageId,
    whyChooseStatsImageUrl,
    whyChooseStatsImageAlt,
    testimonialsTitle,
    testimonialsSubtitle,
    testimonials = [],
    howWeHelpTitle,
    howWeHelpIntro,
    howWeHelpHeaderImageId,
    howWeHelpHeaderImageUrl,
    howWeHelpHeaderImageAlt,
    howWeHelpItems = [],
    caseCategoriesTitle,
    caseCategoriesSubtitle,
    caseCategoriesClosing,
    faqTitle,
    faqSubtitle,
    servingTitle,
    caseResultsTitle,
    caseResultsSubtitle,
    caseResultsButtonText,
    caseResultsButtonUrl,
    ctaCards = [],
    caseResults = [],
    resourcesLinks = [],
    caseCategories = [],
    faultIntroTitle,
    faultIntroText,
    faultIntroImageId,
    faultIntroImageUrl,
    faultIntroImageAlt,
    faultComparativeTitle,
    faultComparativeColumn1,
    faultComparativeColumn2,
    faultCompensationTitle,
    faultCompensationSubtitle,
    faultDamageTypes = [],
    faultStepsTitle,
    faultStepsSubtitle,
    faultSteps = [],
    faultTimeLimitTitle,
    faultTimeLimitParagraph1,
    faultTimeLimitParagraph2,
    faultTimeLimitImageId,
    faultTimeLimitImageUrl,
    faultTimeLimitImageAlt,
    faultStatuteImageId,
    faultStatuteImageUrl,
    faultStatuteImageAlt,
    faultStatuteText,
    faqItems = [],
    badgesTextParagraphs = [],
    badgesItems = [],
    servingColumns = [],
  } = attributes;

  const [ activeEditorSection, setActiveEditorSection ] = useState( 'whyChoose' );

  const blockProps = useBlockProps( {
    className: 'ldp-editor-preview',
  } );

  const updateArrayItem = ( key, index, updates ) => {
    const updated = [ ...( attributes[ key ] || [] ) ];
    updated[ index ] = {
      ...updated[ index ],
      ...updates,
    };
    setAttributes( { [ key ]: updated } );
  };

  const removeArrayItem = ( key, index ) => {
    setAttributes( {
      [ key ]: ( attributes[ key ] || [] ).filter( ( _, i ) => i !== index ),
    } );
  };

  const addArrayItem = ( key, factory ) => {
    setAttributes( {
      [ key ]: [ ...( attributes[ key ] || [] ), factory() ],
    } );
  };

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody
          key={ `why-choose-${ activeEditorSection }` }
          title="Why Choose"
          initialOpen={ activeEditorSection === 'whyChoose' }
        >
          <TextControl
            label="Section title"
            value={ whyChooseTitle }
            onChange={ ( value ) => setAttributes( { whyChooseTitle: value } ) }
          />
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Intro text
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '120px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="why-choose-intro"
                placeholder="Enter intro text..."
                value={ whyChooseIntro }
                onChange={ ( value ) => setAttributes( { whyChooseIntro: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>

          <ToggleControl
            label="Show image instead of stats"
            checked={ whyChooseStatsDisplayMode === 'image' }
            onChange={ ( value ) =>
              setAttributes( {
                whyChooseStatsDisplayMode: value ? 'image' : 'stats',
              } )
            }
          />

          { whyChooseStatsDisplayMode === 'image' ? (
            <div
              style={ {
                border: '1px solid #d5dadd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
              } }
            >
              <TextControl
                label="Stats image alt"
                value={ whyChooseStatsImageAlt || '' }
                onChange={ ( value ) => setAttributes( { whyChooseStatsImageAlt: value } ) }
              />
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={ ( media ) =>
                    setAttributes( {
                      whyChooseStatsImageId: media.id,
                      whyChooseStatsImageUrl: media.url,
                    } )
                  }
                  allowedTypes={ [ 'image' ] }
                  value={ whyChooseStatsImageId || 0 }
                  render={ ( { open } ) => (
                    <Button onClick={ open } variant="secondary" style={ { marginRight: '8px' } }>
                      { whyChooseStatsImageUrl ? 'Replace Stats Image' : 'Select Stats Image' }
                    </Button>
                  ) }
                />
              </MediaUploadCheck>
            </div>
          ) : (
            <>
              { whyChooseStats.map( ( stat, index ) => (
                <div
                  key={ index }
                  style={ {
                    border: '1px solid #d5dadd',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '12px',
                  } }
                >
                  <TextControl
                    label={ `Stat ${ index + 1 } Number` }
                    value={ stat.number || '' }
                    onChange={ ( value ) => updateArrayItem( 'whyChooseStats', index, { number: value } ) }
                  />
                  <TextControl
                    label="Stat label"
                    value={ stat.label || '' }
                    onChange={ ( value ) => updateArrayItem( 'whyChooseStats', index, { label: value } ) }
                  />
                  <Button
                    isDestructive
                    onClick={ () => removeArrayItem( 'whyChooseStats', index ) }
                  >
                    Remove Stat
                  </Button>
                </div>
              ) ) }
              <Button isPrimary onClick={ () => addArrayItem( 'whyChooseStats', makeWhyChooseStat ) }>
                Add Stat
              </Button>
            </>
          ) }

          { whyChooseItems.map( ( item, index ) => (
            <div
              key={ index }
              style={ {
                border: '1px solid #d5dadd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
              } }
            >
              <TextControl
                label={ `Item ${ index + 1 } Heading` }
                value={ item.heading || '' }
                onChange={ ( value ) => updateArrayItem( 'whyChooseItems', index, { heading: value } ) }
              />
              <div style={ { marginBottom: '16px' } }>
                <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
                  Paragraph
                </label>
                <div style={ {
                  border: '1px solid #949494',
                  borderRadius: '2px',
                  padding: '8px',
                  minHeight: '96px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                } }>
                  <RichText
                    tagName="p"
                    identifier={ `why-choose-item-${ index }` }
                    placeholder="Enter paragraph text..."
                    value={ item.paragraph || '' }
                    onChange={ ( value ) => updateArrayItem( 'whyChooseItems', index, { paragraph: value } ) }
                    allowedFormats={ [
                      'core/bold',
                      'core/italic',
                      'core/link',
                      'core/strikethrough',
                      'core/underline',
                    ] }
                  />
                </div>
              </div>
              <TextControl
                label="Image Alt"
                value={ item.imageAlt || '' }
                onChange={ ( value ) => updateArrayItem( 'whyChooseItems', index, { imageAlt: value } ) }
              />
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={ ( media ) =>
                    updateArrayItem( 'whyChooseItems', index, { imageId: media.id, imageUrl: media.url } )
                  }
                  allowedTypes={ [ 'image' ] }
                  value={ item.imageId || 0 }
                  render={ ( { open } ) => (
                    <Button onClick={ open } variant="secondary" style={ { marginRight: '8px' } }>
                      { item.imageUrl ? 'Replace Image' : 'Select Image' }
                    </Button>
                  ) }
                />
              </MediaUploadCheck>
              <Button
                isDestructive
                onClick={ () => removeArrayItem( 'whyChooseItems', index ) }
              >
                Remove Item
              </Button>
            </div>
          ) ) }

          <Button isPrimary onClick={ () => addArrayItem( 'whyChooseItems', makeWhyChooseItem ) }>
            Add Why Choose Item
          </Button>
        </PanelBody>

        <PanelBody
          key={ `cta-cards-${ activeEditorSection }` }
          title="CTA Cards"
          initialOpen={ activeEditorSection === 'ctaCards' }
        >
          { ctaCards.map( ( card, index ) => (
            <div
              key={ index }
              style={ {
                border: '1px solid #d5dadd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
              } }
            >
              <TextControl
                label={ `CTA ${ index + 1 } title` }
                value={ card.title || '' }
                onChange={ ( value ) => updateArrayItem( 'ctaCards', index, { title: value } ) }
              />
              <div style={ { marginBottom: '16px' } }>
                <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
                  Description
                </label>
                <div style={ {
                  border: '1px solid #949494',
                  borderRadius: '2px',
                  padding: '8px',
                  minHeight: '96px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                } }>
                  <RichText
                    tagName="p"
                    identifier={ `cta-card-${ index }` }
                    placeholder="Enter description..."
                    value={ card.description || '' }
                    onChange={ ( value ) => updateArrayItem( 'ctaCards', index, { description: value } ) }
                    allowedFormats={ [
                      'core/bold',
                      'core/italic',
                      'core/link',
                      'core/strikethrough',
                      'core/underline',
                    ] }
                  />
                </div>
              </div>
              <TextControl
                label="Button text"
                value={ card.buttonText || '' }
                onChange={ ( value ) => updateArrayItem( 'ctaCards', index, { buttonText: value } ) }
              />
              <TextControl
                label="Phone label"
                value={ card.phoneLabel || '' }
                onChange={ ( value ) => updateArrayItem( 'ctaCards', index, { phoneLabel: value } ) }
              />
              <TextControl
                label="Phone text"
                value={ card.phoneText || '' }
                onChange={ ( value ) => updateArrayItem( 'ctaCards', index, { phoneText: value } ) }
              />
              <TextControl
                label="Phone URL"
                value={ card.phoneUrl || '' }
                onChange={ ( value ) => updateArrayItem( 'ctaCards', index, { phoneUrl: value } ) }
              />
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={ ( media ) =>
                    updateArrayItem( 'ctaCards', index, {
                      backgroundImageId: media.id,
                      backgroundImageUrl: media.url,
                    } )
                  }
                  allowedTypes={ [ 'image' ] }
                  value={ card.backgroundImageId || 0 }
                  render={ ( { open } ) => (
                    <Button onClick={ open } variant="secondary" style={ { marginRight: '8px' } }>
                      { card.backgroundImageUrl ? 'Replace Background' : 'Select Background' }
                    </Button>
                  ) }
                />
              </MediaUploadCheck>
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={ ( media ) =>
                    updateArrayItem( 'ctaCards', index, {
                      logoImageId: media.id,
                      logoImageUrl: media.url,
                    } )
                  }
                  allowedTypes={ [ 'image' ] }
                  value={ card.logoImageId || 0 }
                  render={ ( { open } ) => (
                    <Button onClick={ open } variant="secondary">
                      { card.logoImageUrl ? 'Replace Logo' : 'Select Logo' }
                    </Button>
                  ) }
                />
              </MediaUploadCheck>
              <div style={ { marginTop: '10px' } }>
                <Button isDestructive onClick={ () => removeArrayItem( 'ctaCards', index ) }>
                  Remove CTA
                </Button>
              </div>
            </div>
          ) ) }
          <Button isPrimary onClick={ () => addArrayItem( 'ctaCards', makeCtaCard ) }>
            Add CTA
          </Button>
        </PanelBody>

        <PanelBody title="Testimonials" initialOpen={ false }>
          <TextControl
            label="Section title"
            value={ testimonialsTitle }
            onChange={ ( value ) => setAttributes( { testimonialsTitle: value } ) }
          />
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Section subtitle
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '72px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="testimonials-subtitle"
                placeholder="Enter section subtitle..."
                value={ testimonialsSubtitle }
                onChange={ ( value ) => setAttributes( { testimonialsSubtitle: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>

          { testimonials.map( ( testimonial, index ) => (
            <div
              key={ index }
              style={ {
                border: '1px solid #d5dadd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
              } }
            >
              <div style={ { marginBottom: '16px' } }>
                <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
                  { `Testimonial ${ index + 1 } Quote` }
                </label>
                <div style={ {
                  border: '1px solid #949494',
                  borderRadius: '2px',
                  padding: '8px',
                  minHeight: '96px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                } }>
                  <RichText
                    tagName="p"
                    identifier={ `testimonial-${ index }` }
                    placeholder="Enter testimonial quote..."
                    value={ testimonial.quote || '' }
                    onChange={ ( value ) => updateArrayItem( 'testimonials', index, { quote: value } ) }
                    allowedFormats={ [
                      'core/bold',
                      'core/italic',
                      'core/link',
                      'core/strikethrough',
                      'core/underline',
                    ] }
                  />
                </div>
              </div>
              <TextControl
                label="Author name"
                value={ testimonial.authorName || '' }
                onChange={ ( value ) => updateArrayItem( 'testimonials', index, { authorName: value } ) }
              />
              <TextControl
                label="Author role"
                value={ testimonial.authorRole || '' }
                onChange={ ( value ) => updateArrayItem( 'testimonials', index, { authorRole: value } ) }
              />
              <TextControl
                label="Star rating (1-5)"
                type="number"
                min="1"
                max="5"
                value={ testimonial.rating || 5 }
                onChange={ ( value ) => updateArrayItem( 'testimonials', index, { rating: parseInt( value, 10 ) || 5 } ) }
              />
              <Button
                isDestructive
                onClick={ () => removeArrayItem( 'testimonials', index ) }
              >
                Remove Testimonial
              </Button>
            </div>
          ) ) }
          <Button isPrimary onClick={ () => addArrayItem( 'testimonials', makeTestimonial ) }>
            Add Testimonial
          </Button>
        </PanelBody>

        <PanelBody
          key={ `how-we-help-${ activeEditorSection }` }
          title="How We Help"
          initialOpen={ activeEditorSection === 'howWeHelp' }
        >
          <TextControl
            label="Section Title"
            value={ howWeHelpTitle }
            onChange={ ( value ) => setAttributes( { howWeHelpTitle: value } ) }
          />
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Intro Paragraph
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '72px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="how-we-help-intro"
                placeholder="Enter intro paragraph..."
                value={ howWeHelpIntro }
                onChange={ ( value ) => setAttributes( { howWeHelpIntro: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>
          <hr />
          <p><strong>Header Image</strong></p>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={ ( media ) => setAttributes( { howWeHelpHeaderImageId: media.id, howWeHelpHeaderImageUrl: media.url } ) }
              allowedTypes={ [ 'image' ] }
              value={ howWeHelpHeaderImageId }
              render={ ( { open } ) => (
                <div>
                  <Button onClick={ open } variant="secondary">
                    { howWeHelpHeaderImageUrl ? 'Replace Header Image' : 'Select Header Image' }
                  </Button>
                  { howWeHelpHeaderImageUrl && (
                    <img src={ howWeHelpHeaderImageUrl } alt="" style={ { marginTop: '10px', maxWidth: '100%', height: 'auto' } } />
                  ) }
                </div>
              ) }
            />
          </MediaUploadCheck>
          <TextControl
            label="Header Image Alt Text"
            value={ howWeHelpHeaderImageAlt }
            onChange={ ( value ) => setAttributes( { howWeHelpHeaderImageAlt: value } ) }
          />
          <hr />
          <p><strong>Content Rows</strong></p>
          { howWeHelpItems.map( ( item, index ) => (
            <div key={ index } style={ sectionStyle( false ) }>
              <p style={ { marginBottom: '8px', fontWeight: '600' } }>Row { index + 1 }</p>
              <div style={ { marginBottom: '16px' } }>
                <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
                  Paragraph Text
                </label>
                <div style={ {
                  border: '1px solid #949494',
                  borderRadius: '2px',
                  padding: '8px',
                  minHeight: '96px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                } }>
                  <RichText
                    tagName="p"
                    identifier={ `how-we-help-item-${ index }` }
                    placeholder="Enter paragraph text..."
                    value={ item.text }
                    onChange={ ( value ) => updateArrayItem( 'howWeHelpItems', index, { text: value } ) }
                    allowedFormats={ [
                      'core/bold',
                      'core/italic',
                      'core/link',
                      'core/strikethrough',
                      'core/underline',
                    ] }
                  />
                </div>
              </div>
              <ToggleControl
                label="Image Position"
                help={ item.imagePosition === 'left' ? 'Image on Left' : 'Image on Right (default)' }
                checked={ item.imagePosition === 'left' }
                onChange={ ( value ) => updateArrayItem( 'howWeHelpItems', index, { imagePosition: value ? 'left' : 'right' } ) }
              />
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={ ( media ) => updateArrayItem( 'howWeHelpItems', index, { imageId: media.id, imageUrl: media.url } ) }
                  allowedTypes={ [ 'image' ] }
                  value={ item.imageId }
                  render={ ( { open } ) => (
                    <div>
                      <Button onClick={ open } variant="secondary">
                        { item.imageUrl ? 'Replace Image' : 'Select Image' }
                      </Button>
                      { item.imageUrl && (
                        <img src={ item.imageUrl } alt="" style={ { marginTop: '10px', maxWidth: '100%', height: 'auto' } } />
                      ) }
                    </div>
                  ) }
                />
              </MediaUploadCheck>
              <TextControl
                label="Image Alt Text"
                value={ item.imageAlt }
                onChange={ ( value ) => updateArrayItem( 'howWeHelpItems', index, { imageAlt: value } ) }
              />
              <Button isDestructive onClick={ () => removeArrayItem( 'howWeHelpItems', index ) } style={ { marginTop: '10px' } }>
                Remove Row
              </Button>
            </div>
          ) ) }
          <Button isPrimary onClick={ () => addArrayItem( 'howWeHelpItems', makeHowWeHelpItem ) }>
            Add Row
          </Button>
        </PanelBody>

        <PanelBody
          key={ `case-results-${ activeEditorSection }` }
          title="Case Results"
          initialOpen={ activeEditorSection === 'caseResults' }
        >
          <TextControl
            label="Section title"
            value={ caseResultsTitle }
            onChange={ ( value ) => setAttributes( { caseResultsTitle: value } ) }
          />
          <TextControl
            label="Section subtitle"
            value={ caseResultsSubtitle }
            onChange={ ( value ) => setAttributes( { caseResultsSubtitle: value } ) }
          />
          <TextControl
            label="Button text"
            value={ caseResultsButtonText }
            onChange={ ( value ) => setAttributes( { caseResultsButtonText: value } ) }
          />
          <TextControl
            label="Button URL"
            value={ caseResultsButtonUrl }
            onChange={ ( value ) => setAttributes( { caseResultsButtonUrl: value } ) }
          />
          { caseResults.map( ( item, index ) => (
            <div
              key={ index }
              style={ {
                border: '1px solid #d5dadd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
              } }
            >
              <TextControl
                label={`Result ${ index + 1 } tag`}
                value={ item.tag || '' }
                onChange={ ( value ) => updateArrayItem( 'caseResults', index, { tag: value } ) }
              />
              <TextControl
                label="Amount"
                value={ item.amount || '' }
                onChange={ ( value ) => updateArrayItem( 'caseResults', index, { amount: value } ) }
              />
              <TextControl
                label="Title"
                value={ item.title || '' }
                onChange={ ( value ) => updateArrayItem( 'caseResults', index, { title: value } ) }
              />
              <div style={ { marginBottom: '16px' } }>
                <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
                  Description
                </label>
                <div style={ {
                  border: '1px solid #949494',
                  borderRadius: '2px',
                  padding: '8px',
                  minHeight: '72px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                } }>
                  <RichText
                    tagName="p"
                    identifier={ `case-result-${ index }` }
                    placeholder="Enter description..."
                    value={ item.description || '' }
                    onChange={ ( value ) => updateArrayItem( 'caseResults', index, { description: value } ) }
                    allowedFormats={ [
                      'core/bold',
                      'core/italic',
                      'core/link',
                      'core/strikethrough',
                      'core/underline',
                    ] }
                  />
                </div>
              </div>
              <TextControl
                label="Image alt"
                value={ item.imageAlt || '' }
                onChange={ ( value ) => updateArrayItem( 'caseResults', index, { imageAlt: value } ) }
              />
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={ ( media ) =>
                    updateArrayItem( 'caseResults', index, {
                      imageId: media.id,
                      imageUrl: media.url,
                    } )
                  }
                  allowedTypes={ [ 'image' ] }
                  value={ item.imageId || 0 }
                  render={ ( { open } ) => (
                    <Button onClick={ open } variant="secondary" style={ { marginBottom: '8px' } }>
                      { item.imageUrl ? 'Replace Image' : 'Select Image' }
                    </Button>
                  ) }
                />
              </MediaUploadCheck>
              <div>
                <Button isDestructive onClick={ () => removeArrayItem( 'caseResults', index ) }>
                  Remove Result
                </Button>
              </div>
            </div>
          ) ) }
          <Button isPrimary onClick={ () => addArrayItem( 'caseResults', makeCaseResult ) }>
            Add Result
          </Button>
        </PanelBody>

        <PanelBody
          key={ `resources-${ activeEditorSection }` }
          title="Resource Links"
          initialOpen={ activeEditorSection === 'resources' }
        >
          { resourcesLinks.map( ( link, index ) => (
            <div
              key={ index }
              style={ {
                border: '1px solid #d5dadd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
              } }
            >
              <TextControl
                label="Label"
                value={ link.label || '' }
                onChange={ ( value ) => updateArrayItem( 'resourcesLinks', index, { label: value } ) }
              />
              <TextControl
                label="URL"
                value={ link.url || '' }
                onChange={ ( value ) => updateArrayItem( 'resourcesLinks', index, { url: value } ) }
              />
              <Button
                isDestructive
                onClick={ () => removeArrayItem( 'resourcesLinks', index ) }
              >
                Remove Link
              </Button>
            </div>
          ) ) }
          <Button
            isPrimary
            onClick={ () => setAttributes( { resourcesLinks: [ ...resourcesLinks, makeSimpleLink() ] } ) }
          >
            Add Link
          </Button>
        </PanelBody>

        <PanelBody
          key={ `cases-categories-${ activeEditorSection }` }
          title="Case Categories"
          initialOpen={ activeEditorSection === 'caseCategories' }
        >
          <TextControl
            label="Section Title"
            value={ caseCategoriesTitle }
            onChange={ ( value ) => setAttributes( { caseCategoriesTitle: value } ) }
          />
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Section Subtitle
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '72px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="case-categories-subtitle"
                placeholder="Enter section subtitle..."
                value={ caseCategoriesSubtitle }
                onChange={ ( value ) => setAttributes( { caseCategoriesSubtitle: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Closing Paragraph
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '96px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="case-categories-closing"
                placeholder="Enter closing paragraph..."
                value={ caseCategoriesClosing }
                onChange={ ( value ) => setAttributes( { caseCategoriesClosing: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
            <p style={ { marginTop: '4px', fontSize: '12px', color: '#757575' } }>Optional closing text that appears after all case category sections.</p>
          </div>
          <hr />
          { caseCategories.map( ( category, catIndex ) => (
            <div
              key={ catIndex }
              style={ {
                border: '1px solid #d5dadd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
              } }
            >
              <TextControl
                label={`Category ${ catIndex + 1 } title`}
                value={ category.title || '' }
                onChange={ ( value ) => updateArrayItem( 'caseCategories', catIndex, { title: value } ) }
              />
              <div style={ { marginBottom: '16px' } }>
                <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
                  Description
                </label>
                <div style={ {
                  border: '1px solid #949494',
                  borderRadius: '2px',
                  padding: '8px',
                  minHeight: '72px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                } }>
                  <RichText
                    tagName="p"
                    identifier={ `case-category-${ catIndex }` }
                    placeholder="Enter description..."
                    value={ category.description || '' }
                    onChange={ ( value ) => updateArrayItem( 'caseCategories', catIndex, { description: value } ) }
                    allowedFormats={ [
                      'core/bold',
                      'core/italic',
                      'core/link',
                      'core/strikethrough',
                      'core/underline',
                    ] }
                  />
                </div>
              </div>
              <TextControl
                label="Image alt"
                value={ category.imageAlt || '' }
                onChange={ ( value ) => updateArrayItem( 'caseCategories', catIndex, { imageAlt: value } ) }
              />
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={ ( media ) =>
                    updateArrayItem( 'caseCategories', catIndex, {
                      imageId: media.id,
                      imageUrl: media.url,
                    } )
                  }
                  allowedTypes={ [ 'image' ] }
                  value={ category.imageId || 0 }
                  render={ ( { open } ) => (
                    <Button onClick={ open } variant="secondary" style={ { marginBottom: '8px' } }>
                      { category.imageUrl ? 'Replace Image' : 'Select Image' }
                    </Button>
                  ) }
                />
              </MediaUploadCheck>

              { ( category.links || [] ).map( ( link, linkIndex ) => (
                <div key={ linkIndex } style={ { borderTop: '1px dashed #d5dadd', paddingTop: '8px', marginTop: '8px' } }>
                  <TextControl
                    label="Link label"
                    value={ link.label || '' }
                    onChange={ ( value ) => {
                      const links = [ ...( category.links || [] ) ];
                      links[ linkIndex ] = { ...links[ linkIndex ], label: value };
                      updateArrayItem( 'caseCategories', catIndex, { links } );
                    } }
                  />
                  <TextControl
                    label="Link URL"
                    value={ link.url || '' }
                    onChange={ ( value ) => {
                      const links = [ ...( category.links || [] ) ];
                      links[ linkIndex ] = { ...links[ linkIndex ], url: value };
                      updateArrayItem( 'caseCategories', catIndex, { links } );
                    } }
                  />
                  <Button
                    isDestructive
                    onClick={ () =>
                      updateArrayItem( 'caseCategories', catIndex, {
                        links: ( category.links || [] ).filter( ( _, i ) => i !== linkIndex ),
                      } )
                    }
                  >
                    Remove Category Link
                  </Button>
                </div>
              ) ) }

              <div style={ { marginTop: '8px' } }>
                <Button
                  isSecondary
                  onClick={ () =>
                    updateArrayItem( 'caseCategories', catIndex, {
                      links: [ ...( category.links || [] ), makeSimpleLink() ],
                    } )
                  }
                >
                  Add Category Link
                </Button>
              </div>
              <div style={ { marginTop: '8px' } }>
                <Button isDestructive onClick={ () => removeArrayItem( 'caseCategories', catIndex ) }>
                  Remove Category
                </Button>
              </div>
            </div>
          ) ) }
          <Button isPrimary onClick={ () => addArrayItem( 'caseCategories', makeCaseCategory ) }>
            Add Category
          </Button>
        </PanelBody>

        <PanelBody
          key={ `fault-${ activeEditorSection }` }
          title="Determining Fault"
          initialOpen={ activeEditorSection === 'fault' }
        >
          <p><strong>Intro Section</strong></p>
          <TextControl
            label="Intro Title"
            value={ faultIntroTitle }
            onChange={ ( value ) => setAttributes( { faultIntroTitle: value } ) }
          />
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Intro Text
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '96px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="fault-intro-text"
                placeholder="Enter intro text..."
                value={ faultIntroText }
                onChange={ ( value ) => setAttributes( { faultIntroText: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={ ( media ) => setAttributes( { faultIntroImageId: media.id, faultIntroImageUrl: media.url } ) }
              allowedTypes={ [ 'image' ] }
              value={ faultIntroImageId }
              render={ ( { open } ) => (
                <div>
                  <Button onClick={ open } variant="secondary">
                    { faultIntroImageUrl ? 'Replace Intro Image' : 'Select Intro Image' }
                  </Button>
                  { faultIntroImageUrl && (
                    <img src={ faultIntroImageUrl } alt="" style={ { marginTop: '10px', maxWidth: '100%', height: 'auto' } } />
                  ) }
                </div>
              ) }
            />
          </MediaUploadCheck>
          <TextControl
            label="Intro Image Alt Text"
            value={ faultIntroImageAlt }
            onChange={ ( value ) => setAttributes( { faultIntroImageAlt: value } ) }
          />
          <hr />
          <p><strong>Comparative Negligence</strong></p>
          <TextControl
            label="Comparative Title"
            value={ faultComparativeTitle }
            onChange={ ( value ) => setAttributes( { faultComparativeTitle: value } ) }
          />
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Column 1 Text
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '144px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="fault-comparative-column1"
                placeholder="Enter column 1 text..."
                value={ faultComparativeColumn1 }
                onChange={ ( value ) => setAttributes( { faultComparativeColumn1: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Column 2 Text
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '144px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="fault-comparative-column2"
                placeholder="Enter column 2 text..."
                value={ faultComparativeColumn2 }
                onChange={ ( value ) => setAttributes( { faultComparativeColumn2: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>
          <hr />
          <p><strong>Compensation Section</strong></p>
          <TextControl
            label="Compensation Title"
            value={ faultCompensationTitle }
            onChange={ ( value ) => setAttributes( { faultCompensationTitle: value } ) }
          />
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Compensation Subtitle
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '72px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="fault-compensation-subtitle"
                placeholder="Enter subtitle..."
                value={ faultCompensationSubtitle }
                onChange={ ( value ) => setAttributes( { faultCompensationSubtitle: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>
          { faultDamageTypes.map( ( damage, index ) => (
            <div key={ index } style={ { border: '1px solid #d5dadd', borderRadius: '6px', padding: '12px', marginBottom: '12px' } }>
              <TextControl
                label={ `Damage Type ${ index + 1 } Title` }
                value={ damage.title || '' }
                onChange={ ( value ) => updateArrayItem( 'faultDamageTypes', index, { title: value } ) }
              />
              <div style={ { marginBottom: '16px' } }>
                <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
                  Description
                </label>
                <div style={ {
                  border: '1px solid #949494',
                  borderRadius: '2px',
                  padding: '8px',
                  minHeight: '96px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                } }>
                  <RichText
                    tagName="p"
                    identifier={ `fault-damage-${ index }` }
                    placeholder="Enter description..."
                    value={ damage.description || '' }
                    onChange={ ( value ) => updateArrayItem( 'faultDamageTypes', index, { description: value } ) }
                    allowedFormats={ [
                      'core/bold',
                      'core/italic',
                      'core/link',
                      'core/strikethrough',
                      'core/underline',
                    ] }
                  />
                </div>
              </div>
              <Button isDestructive onClick={ () => removeArrayItem( 'faultDamageTypes', index ) }>
                Remove Damage Type
              </Button>
            </div>
          ) ) }
          <Button isPrimary onClick={ () => addArrayItem( 'faultDamageTypes', makeFaultDamageType ) }>
            Add Damage Type
          </Button>
          <hr />
          <p><strong>Steps Section</strong></p>
          <TextControl
            label="Steps Title"
            value={ faultStepsTitle }
            onChange={ ( value ) => setAttributes( { faultStepsTitle: value } ) }
          />
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Steps Subtitle
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '72px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="fault-steps-subtitle"
                placeholder="Enter subtitle..."
                value={ faultStepsSubtitle }
                onChange={ ( value ) => setAttributes( { faultStepsSubtitle: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>
          { faultSteps.map( ( step, index ) => (
            <div key={ index } style={ { border: '1px solid #d5dadd', borderRadius: '6px', padding: '12px', marginBottom: '12px' } }>
              <TextControl
                label={ `Step ${ index + 1 } Number` }
                value={ step.number || '' }
                onChange={ ( value ) => updateArrayItem( 'faultSteps', index, { number: value } ) }
              />
              <TextControl
                label="Step Title"
                value={ step.title || '' }
                onChange={ ( value ) => updateArrayItem( 'faultSteps', index, { title: value } ) }
              />
              <div style={ { marginBottom: '16px' } }>
                <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
                  Step Description
                </label>
                <div style={ {
                  border: '1px solid #949494',
                  borderRadius: '2px',
                  padding: '8px',
                  minHeight: '96px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                } }>
                  <RichText
                    tagName="p"
                    identifier={ `fault-step-${ index }` }
                    placeholder="Enter step description..."
                    value={ step.description || '' }
                    onChange={ ( value ) => updateArrayItem( 'faultSteps', index, { description: value } ) }
                    allowedFormats={ [
                      'core/bold',
                      'core/italic',
                      'core/link',
                      'core/strikethrough',
                      'core/underline',
                    ] }
                  />
                </div>
              </div>
              <Button isDestructive onClick={ () => removeArrayItem( 'faultSteps', index ) }>
                Remove Step
              </Button>
            </div>
          ) ) }
          <Button isPrimary onClick={ () => addArrayItem( 'faultSteps', makeFaultStep ) }>
            Add Step
          </Button>
          <hr />
          <p><strong>Time Limit Section</strong></p>
          <TextControl
            label="Time Limit Title"
            value={ faultTimeLimitTitle }
            onChange={ ( value ) => setAttributes( { faultTimeLimitTitle: value } ) }
          />
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Paragraph 1
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '72px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="fault-time-limit-paragraph1"
                placeholder="Enter paragraph text..."
                value={ faultTimeLimitParagraph1 }
                onChange={ ( value ) => setAttributes( { faultTimeLimitParagraph1: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Paragraph 2
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '72px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="fault-time-limit-paragraph2"
                placeholder="Enter paragraph text..."
                value={ faultTimeLimitParagraph2 }
                onChange={ ( value ) => setAttributes( { faultTimeLimitParagraph2: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={ ( media ) => setAttributes( { faultTimeLimitImageId: media.id, faultTimeLimitImageUrl: media.url } ) }
              allowedTypes={ [ 'image' ] }
              value={ faultTimeLimitImageId }
              render={ ( { open } ) => (
                <div>
                  <Button onClick={ open } variant="secondary">
                    { faultTimeLimitImageUrl ? 'Replace Time Limit Image' : 'Select Time Limit Image' }
                  </Button>
                  { faultTimeLimitImageUrl && (
                    <img src={ faultTimeLimitImageUrl } alt="" style={ { marginTop: '10px', maxWidth: '100%', height: 'auto' } } />
                  ) }
                </div>
              ) }
            />
          </MediaUploadCheck>
          <TextControl
            label="Time Limit Image Alt Text"
            value={ faultTimeLimitImageAlt }
            onChange={ ( value ) => setAttributes( { faultTimeLimitImageAlt: value } ) }
          />
          <hr />
          <p><strong>Statute Section</strong></p>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={ ( media ) => setAttributes( { faultStatuteImageId: media.id, faultStatuteImageUrl: media.url } ) }
              allowedTypes={ [ 'image' ] }
              value={ faultStatuteImageId }
              render={ ( { open } ) => (
                <div>
                  <Button onClick={ open } variant="secondary">
                    { faultStatuteImageUrl ? 'Replace Statute Image' : 'Select Statute Image' }
                  </Button>
                  { faultStatuteImageUrl && (
                    <img src={ faultStatuteImageUrl } alt="" style={ { marginTop: '10px', maxWidth: '100%', height: 'auto' } } />
                  ) }
                </div>
              ) }
            />
          </MediaUploadCheck>
          <TextControl
            label="Statute Image Alt Text"
            value={ faultStatuteImageAlt }
            onChange={ ( value ) => setAttributes( { faultStatuteImageAlt: value } ) }
          />
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Statute Text
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '96px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="fault-statute-text"
                placeholder="Enter statute text..."
                value={ faultStatuteText }
                onChange={ ( value ) => setAttributes( { faultStatuteText: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>
        </PanelBody>

        <PanelBody
          key={ `faq-${ activeEditorSection }` }
          title="FAQ"
          initialOpen={ activeEditorSection === 'faq' }
        >
          <TextControl
            label="Section Title"
            value={ faqTitle }
            onChange={ ( value ) => setAttributes( { faqTitle: value } ) }
          />
          <div style={ { marginBottom: '16px' } }>
            <label style={ { display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#1e1e1e' } }>
              Section Subtitle
            </label>
            <div style={ {
              border: '1px solid #949494',
              borderRadius: '2px',
              padding: '8px',
              minHeight: '72px',
              fontSize: '13px',
              lineHeight: '1.4',
            } }>
              <RichText
                tagName="p"
                identifier="faq-subtitle"
                placeholder="Enter section subtitle..."
                value={ faqSubtitle }
                onChange={ ( value ) => setAttributes( { faqSubtitle: value } ) }
                allowedFormats={ [
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/strikethrough',
                  'core/underline',
                ] }
              />
            </div>
          </div>
          <hr />
          { faqItems.map( ( faq, index ) => (
            <div
              key={ index }
              style={ {
                border: '1px solid #d5dadd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
                backgroundColor: '#fff',
              } }
            >
              <TextControl
                label={`Question ${ index + 1 }`}
                value={ faq.question || '' }
                onChange={ ( value ) => updateArrayItem( 'faqItems', index, { question: value } ) }
              />
              <div style={ { marginTop: '12px' } }>
                <label
                  style={ {
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#1e1e1e',
                  } }
                >
                  Answer (with formatting)
                </label>
                <div style={ {
                  border: '1px solid #949494',
                  borderRadius: '2px',
                  padding: '8px',
                  minHeight: '100px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                } }>
                  <RichText
                    tagName="p"
                    identifier={ `faq-answer-${ index }` }
                    value={ faq.answer || '' }
                    onChange={ ( value ) => updateArrayItem( 'faqItems', index, { answer: value } ) }
                    placeholder="Type your answer here. Use the toolbar for formatting..."
                    allowedFormats={ [
                      'core/bold',
                      'core/italic',
                      'core/link',
                      'core/strikethrough',
                      'core/underline',
                    ] }
                  />
                </div>
              </div>
              <div style={ { marginTop: '12px' } }>
                <label
                  style={ {
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#1e1e1e',
                  } }
                >
                  Bullet Points (optional)
                </label>
                <div style={ {
                  border: '1px solid #949494',
                  borderRadius: '2px',
                  padding: '8px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  listStyleType: 'disc',
                  paddingLeft: '24px',
                } }>
                  <RichText
                    tagName="ul"
                    multiline="li"
                    identifier={ `faq-bullets-${ index }` }
                    value={ faq.bullets || '' }
                    onChange={ ( value ) => updateArrayItem( 'faqItems', index, { bullets: value } ) }
                    placeholder="Add a bullet point (press Enter for next)..."
                    allowedFormats={ [
                      'core/bold',
                      'core/italic',
                      'core/link',
                      'core/strikethrough',
                      'core/underline',
                    ] }
                  />
                </div>
              </div>
              <Button isDestructive onClick={ () => removeArrayItem( 'faqItems', index ) } style={ { marginTop: '10px' } }>
                Remove FAQ
              </Button>
            </div>
          ) ) }
          <Button isPrimary onClick={ () => addArrayItem( 'faqItems', makeFaqItem ) }>
            Add FAQ
          </Button>
        </PanelBody>

        <PanelBody
          key={ `badges-${ activeEditorSection }` }
          title="FAQ Badges Section"
          initialOpen={ activeEditorSection === 'badges' }
        >
          <h3 style={ { fontSize: '13px', marginBottom: '12px' } }>Badge Text Paragraphs</h3>
          { badgesTextParagraphs.map( ( paragraph, index ) => (
            <div
              key={ index }
              style={ {
                border: '1px solid #d5dadd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
                backgroundColor: '#fff',
              } }
            >
              <label
                style={ {
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: '#1e1e1e',
                } }
              >
                Paragraph { index + 1 }
              </label>
              <div style={ {
                border: '1px solid #949494',
                borderRadius: '2px',
                padding: '8px',
                minHeight: '60px',
                fontSize: '13px',
                lineHeight: '1.4',
              } }>
                <RichText
                  tagName="p"
                  identifier={ `badge-text-${ index }` }
                  value={ paragraph.text || '' }
                  onChange={ ( value ) => updateArrayItem( 'badgesTextParagraphs', index, { text: value } ) }
                  placeholder="Enter paragraph text..."
                  allowedFormats={ [
                    'core/bold',
                    'core/italic',
                    'core/link',
                    'core/strikethrough',
                    'core/underline',
                  ] }
                />
              </div>
              <Button isDestructive onClick={ () => removeArrayItem( 'badgesTextParagraphs', index ) } style={ { marginTop: '10px' } }>
                Remove Paragraph
              </Button>
            </div>
          ) ) }
          <Button isPrimary onClick={ () => addArrayItem( 'badgesTextParagraphs', makeBadgeTextParagraph ) }>
            Add Paragraph
          </Button>

          <hr style={ { margin: '20px 0' } } />

          <h3 style={ { fontSize: '13px', marginBottom: '12px' } }>Badge Images</h3>
          { badgesItems.map( ( badge, index ) => (
            <div
              key={ index }
              style={ {
                border: '1px solid #d5dadd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
                backgroundColor: '#fff',
              } }
            >
              <h4 style={ { fontSize: '12px', marginBottom: '8px' } }>Badge { index + 1 }</h4>

              <TextControl
                label="Image Alt Text"
                value={ badge.imageAlt || '' }
                onChange={ ( value ) => updateArrayItem( 'badgesItems', index, { imageAlt: value } ) }
              />

              <TextControl
                label="Image Width (px)"
                type="number"
                value={ badge.imageWidth || 303 }
                onChange={ ( value ) => updateArrayItem( 'badgesItems', index, { imageWidth: parseInt( value ) } ) }
              />

              <TextControl
                label="Image Height (px)"
                type="number"
                value={ badge.imageHeight || 303 }
                onChange={ ( value ) => updateArrayItem( 'badgesItems', index, { imageHeight: parseInt( value ) } ) }
              />

              <TextControl
                label="Fallback Image (filename)"
                value={ badge.imageFallback || '' }
                onChange={ ( value ) => updateArrayItem( 'badgesItems', index, { imageFallback: value } ) }
                help="e.g., badge-90-plus-combined-legal-experience-blck.svg"
              />

              <MediaUploadCheck>
                <MediaUpload
                  onSelect={ ( media ) =>
                    updateArrayItem( 'badgesItems', index, {
                      imageId: media.id,
                      imageUrl: media.url,
                    } )
                  }
                  allowedTypes={ [ 'image' ] }
                  value={ badge.imageId }
                  render={ ( { open } ) => (
                    <div style={ { marginTop: '10px' } }>
                      <Button onClick={ open } isSecondary>
                        { badge.imageUrl ? 'Change Image' : 'Upload Image' }
                      </Button>
                      { badge.imageUrl && (
                        <div style={ { marginTop: '10px' } }>
                          <img src={ badge.imageUrl } style={ { maxWidth: '150px', height: 'auto' } } alt="" />
                        </div>
                      ) }
                    </div>
                  ) }
                />
              </MediaUploadCheck>

              <Button isDestructive onClick={ () => removeArrayItem( 'badgesItems', index ) } style={ { marginTop: '10px' } }>
                Remove Badge
              </Button>
            </div>
          ) ) }
          <Button isPrimary onClick={ () => addArrayItem( 'badgesItems', makeBadgeItem ) }>
            Add Badge
          </Button>
        </PanelBody>

        <PanelBody
          key={ `serving-${ activeEditorSection }` }
          title="Serving Columns"
          initialOpen={ activeEditorSection === 'serving' }
        >
          <TextControl
            label="Section Title"
            value={ servingTitle }
            onChange={ ( value ) => setAttributes( { servingTitle: value } ) }
          />
          <hr />
          { servingColumns.map( ( column, colIndex ) => (
            <div
              key={ colIndex }
              style={ {
                border: '1px solid #d5dadd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
              } }
            >
              <TextControl
                label={`Column ${ colIndex + 1 } title`}
                value={ column.title || '' }
                onChange={ ( value ) => updateArrayItem( 'servingColumns', colIndex, { title: value } ) }
              />

              { ( column.links || [] ).map( ( link, linkIndex ) => (
                <div key={ linkIndex } style={ { borderTop: '1px dashed #d5dadd', paddingTop: '8px', marginTop: '8px' } }>
                  <TextControl
                    label="Link label"
                    value={ link.label || '' }
                    onChange={ ( value ) => {
                      const links = [ ...( column.links || [] ) ];
                      links[ linkIndex ] = { ...links[ linkIndex ], label: value };
                      updateArrayItem( 'servingColumns', colIndex, { links } );
                    } }
                  />
                  <TextControl
                    label="Link URL"
                    value={ link.url || '' }
                    onChange={ ( value ) => {
                      const links = [ ...( column.links || [] ) ];
                      links[ linkIndex ] = { ...links[ linkIndex ], url: value };
                      updateArrayItem( 'servingColumns', colIndex, { links } );
                    } }
                  />
                  <Button
                    isDestructive
                    onClick={ () =>
                      updateArrayItem( 'servingColumns', colIndex, {
                        links: ( column.links || [] ).filter( ( _, i ) => i !== linkIndex ),
                      } )
                    }
                  >
                    Remove Column Link
                  </Button>
                </div>
              ) ) }

              <div style={ { marginTop: '8px' } }>
                <Button
                  isSecondary
                  onClick={ () =>
                    updateArrayItem( 'servingColumns', colIndex, {
                      links: [ ...( column.links || [] ), makeSimpleLink() ],
                    } )
                  }
                >
                  Add Column Link
                </Button>
              </div>
              <div style={ { marginTop: '8px' } }>
                <Button isDestructive onClick={ () => removeArrayItem( 'servingColumns', colIndex ) }>
                  Remove Column
                </Button>
              </div>
            </div>
          ) ) }
          <Button isPrimary onClick={ () => addArrayItem( 'servingColumns', makeServingColumn ) }>
            Add Column
          </Button>
        </PanelBody>
      </InspectorControls>

      <div { ...blockProps }>
        <div style={ sectionStyle( activeEditorSection === 'whyChoose' ) }>
          <Button isSecondary onClick={ () => setActiveEditorSection( 'whyChoose' ) }>
            Edit Why Choose
          </Button>
          <RichText
            tagName="h3"
            value={ whyChooseTitle }
            onChange={ ( value ) => setAttributes( { whyChooseTitle: value } ) }
            placeholder="Why Choose heading"
            allowedFormats={ [
              'core/bold',
              'core/italic',
              'core/link',
              'core/strikethrough',
              'core/underline',
            ] }
          />
          <RichText
            tagName="p"
            value={ whyChooseIntro }
            onChange={ ( value ) => setAttributes( { whyChooseIntro: value } ) }
            placeholder="Intro text"
            allowedFormats={ [
              'core/bold',
              'core/italic',
              'core/link',
              'core/strikethrough',
              'core/underline',
            ] }
          />
        </div>

        <div style={ sectionStyle( activeEditorSection === 'ctaCards' ) }>
          <Button isSecondary onClick={ () => setActiveEditorSection( 'ctaCards' ) }>
            Edit CTA Cards
          </Button>
          <p>{ ctaCards.length } CTA card(s)</p>
        </div>

        <div style={ sectionStyle( activeEditorSection === 'caseResults' ) }>
          <Button isSecondary onClick={ () => setActiveEditorSection( 'caseResults' ) }>
            Edit Case Results
          </Button>
          <RichText
            tagName="h4"
            value={ caseResultsTitle }
            onChange={ ( value ) => setAttributes( { caseResultsTitle: value } ) }
            placeholder="Case Results heading"
            allowedFormats={ [
              'core/bold',
              'core/italic',
              'core/link',
              'core/strikethrough',
              'core/underline',
            ] }
          />
          <RichText
            tagName="p"
            value={ caseResultsSubtitle }
            onChange={ ( value ) => setAttributes( { caseResultsSubtitle: value } ) }
            placeholder="Case Results subtitle"
            allowedFormats={ [
              'core/bold',
              'core/italic',
              'core/link',
              'core/strikethrough',
              'core/underline',
            ] }
          />
          <p>{ caseResults.length } result card(s)</p>
        </div>

        <div style={ sectionStyle( activeEditorSection === 'testimonials' ) }>
          <Button isSecondary onClick={ () => setActiveEditorSection( 'testimonials' ) }>
            Edit Testimonials
          </Button>
          <RichText
            tagName="h4"
            value={ testimonialsTitle }
            onChange={ ( value ) => setAttributes( { testimonialsTitle: value } ) }
            placeholder="Testimonials heading"
            allowedFormats={ [
              'core/bold',
              'core/italic',
              'core/link',
              'core/strikethrough',
              'core/underline',
            ] }
          />
          <RichText
            tagName="p"
            value={ testimonialsSubtitle }
            onChange={ ( value ) => setAttributes( { testimonialsSubtitle: value } ) }
            placeholder="Testimonials subtitle"
            allowedFormats={ [
              'core/bold',
              'core/italic',
              'core/link',
              'core/strikethrough',
              'core/underline',
            ] }
          />
          <p>{ testimonials.length } testimonial(s)</p>
        </div>

        <div style={ sectionStyle( activeEditorSection === 'howWeHelp' ) }>
          <Button isSecondary onClick={ () => setActiveEditorSection( 'howWeHelp' ) }>
            Edit How We Help
          </Button>
          <RichText
            tagName="h4"
            value={ howWeHelpTitle }
            onChange={ ( value ) => setAttributes( { howWeHelpTitle: value } ) }
            placeholder="How We Help heading"
            allowedFormats={ [
              'core/bold',
              'core/italic',
              'core/link',
              'core/strikethrough',
              'core/underline',
            ] }
          />
          <RichText
            tagName="p"
            value={ howWeHelpIntro }
            onChange={ ( value ) => setAttributes( { howWeHelpIntro: value } ) }
            placeholder="Intro paragraph"
            allowedFormats={ [
              'core/bold',
              'core/italic',
              'core/link',
              'core/strikethrough',
              'core/underline',
            ] }
          />
          { howWeHelpHeaderImageUrl && (
            <div style={ { marginTop: '10px' } }>
              <img src={ howWeHelpHeaderImageUrl } alt={ howWeHelpHeaderImageAlt } style={ { maxWidth: '200px', height: 'auto', border: '1px solid #ddd' } } />
            </div>
          ) }
          <p>{ howWeHelpItems.length } content row(s)</p>
        </div>

        <div style={ sectionStyle( activeEditorSection === 'resources' ) }>
          <Button isSecondary onClick={ () => setActiveEditorSection( 'resources' ) }>
            Edit Resources
          </Button>
          <p>{ resourcesLinks.length } resource link(s)</p>
        </div>

        <div style={ sectionStyle( activeEditorSection === 'caseCategories' ) }>
          <Button isSecondary onClick={ () => setActiveEditorSection( 'caseCategories' ) }>
            Edit Cases We Handle
          </Button>
          <p>{ caseCategories.length } case category section(s)</p>
        </div>

        <div style={ sectionStyle( activeEditorSection === 'faq' ) }>
          <Button isSecondary onClick={ () => setActiveEditorSection( 'faq' ) }>
            Edit FAQ
          </Button>
          <RichText
            tagName="h4"
            value={ faqTitle }
            onChange={ ( value ) => setAttributes( { faqTitle: value } ) }
            placeholder="FAQ section title"
            allowedFormats={ [
              'core/bold',
              'core/italic',
              'core/link',
              'core/strikethrough',
              'core/underline',
            ] }
          />
          <RichText
            tagName="p"
            value={ faqSubtitle }
            onChange={ ( value ) => setAttributes( { faqSubtitle: value } ) }
            placeholder="FAQ section subtitle"
            allowedFormats={ [
              'core/bold',
              'core/italic',
              'core/link',
              'core/strikethrough',
              'core/underline',
            ] }
          />
          <p>{ faqItems.length } FAQ item(s). Edit questions and answers in the FAQ sidebar panel.</p>
        </div>

        <div style={ sectionStyle( activeEditorSection === 'serving' ) }>
          <Button isSecondary onClick={ () => setActiveEditorSection( 'serving' ) }>
            Edit Serving Columns
          </Button>
          <p>{ servingColumns.length } serving column(s)</p>
        </div>
      </div>
    </Fragment>
  );
}

registerBlockType( metadata.name, {
  edit: Edit,
  save: () => null,
} );
