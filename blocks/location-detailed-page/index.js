import { registerBlockType } from '@wordpress/blocks';
import {
  useBlockProps,
  InspectorControls,
  RichText,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button, ToggleControl } from '@wordpress/components';
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
  isOpen: false,
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
    caseCategoriesClosing,
    faqTitle,
    servingTitle,
    caseResultsTitle,
    caseResultsSubtitle,
    caseResultsButtonText,
    caseResultsButtonUrl,
    ctaCards = [],
    caseResults = [],
    resourcesLinks = [],
    caseCategories = [],
    faqItems = [],
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
          <TextareaControl
            label="Intro text"
            value={ whyChooseIntro }
            onChange={ ( value ) => setAttributes( { whyChooseIntro: value } ) }
            rows={ 5 }
          />

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
                    onChange={ ( value ) => {
                      const updated = [ ...whyChooseStats ];
                      updated[ index ] = { ...updated[ index ], number: value };
                      setAttributes( { whyChooseStats: updated } );
                    } }
                  />
                  <TextControl
                    label="Stat label"
                    value={ stat.label || '' }
                    onChange={ ( value ) => {
                      const updated = [ ...whyChooseStats ];
                      updated[ index ] = { ...updated[ index ], label: value };
                      setAttributes( { whyChooseStats: updated } );
                    } }
                  />
                  <Button
                    isDestructive
                    onClick={ () =>
                      setAttributes( {
                        whyChooseStats: whyChooseStats.filter( ( _, i ) => i !== index ),
                      } )
                    }
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
                onChange={ ( value ) => {
                  const updated = [ ...whyChooseItems ];
                  updated[ index ] = { ...updated[ index ], heading: value };
                  setAttributes( { whyChooseItems: updated } );
                } }
              />
              <TextareaControl
                label="Paragraph"
                value={ item.paragraph || '' }
                onChange={ ( value ) => {
                  const updated = [ ...whyChooseItems ];
                  updated[ index ] = { ...updated[ index ], paragraph: value };
                  setAttributes( { whyChooseItems: updated } );
                } }
                rows={ 4 }
              />
              <TextControl
                label="Image Alt"
                value={ item.imageAlt || '' }
                onChange={ ( value ) => {
                  const updated = [ ...whyChooseItems ];
                  updated[ index ] = { ...updated[ index ], imageAlt: value };
                  setAttributes( { whyChooseItems: updated } );
                } }
              />
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={ ( media ) => {
                    const updated = [ ...whyChooseItems ];
                    updated[ index ] = {
                      ...updated[ index ],
                      imageId: media.id,
                      imageUrl: media.url,
                    };
                    setAttributes( { whyChooseItems: updated } );
                  } }
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
                onClick={ () =>
                  setAttributes( {
                    whyChooseItems: whyChooseItems.filter( ( _, i ) => i !== index ),
                  } )
                }
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
              <TextareaControl
                label="Description"
                value={ card.description || '' }
                onChange={ ( value ) => updateArrayItem( 'ctaCards', index, { description: value } ) }
                rows={ 4 }
              />
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
          <TextareaControl
            label="Section subtitle"
            value={ testimonialsSubtitle }
            onChange={ ( value ) => setAttributes( { testimonialsSubtitle: value } ) }
            rows={ 3 }
          />

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
              <TextareaControl
                label={ `Testimonial ${ index + 1 } Quote` }
                value={ testimonial.quote || '' }
                onChange={ ( value ) => {
                  const updated = [ ...testimonials ];
                  updated[ index ] = { ...updated[ index ], quote: value };
                  setAttributes( { testimonials: updated } );
                } }
                rows={ 4 }
              />
              <TextControl
                label="Author name"
                value={ testimonial.authorName || '' }
                onChange={ ( value ) => {
                  const updated = [ ...testimonials ];
                  updated[ index ] = { ...updated[ index ], authorName: value };
                  setAttributes( { testimonials: updated } );
                } }
              />
              <TextControl
                label="Author role"
                value={ testimonial.authorRole || '' }
                onChange={ ( value ) => {
                  const updated = [ ...testimonials ];
                  updated[ index ] = { ...updated[ index ], authorRole: value };
                  setAttributes( { testimonials: updated } );
                } }
              />
              <TextControl
                label="Star rating (1-5)"
                type="number"
                min="1"
                max="5"
                value={ testimonial.rating || 5 }
                onChange={ ( value ) => {
                  const updated = [ ...testimonials ];
                  updated[ index ] = { ...updated[ index ], rating: parseInt( value, 10 ) || 5 };
                  setAttributes( { testimonials: updated } );
                } }
              />
              <Button
                isDestructive
                onClick={ () =>
                  setAttributes( {
                    testimonials: testimonials.filter( ( _, i ) => i !== index ),
                  } )
                }
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
          <TextareaControl
            label="Intro Paragraph"
            value={ howWeHelpIntro }
            onChange={ ( value ) => setAttributes( { howWeHelpIntro: value } ) }
            rows={ 3 }
          />
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
              <TextareaControl
                label="Paragraph Text"
                value={ item.text }
                onChange={ ( value ) => updateArrayItem( 'howWeHelpItems', index, { text: value } ) }
                rows={ 4 }
              />
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
              <TextareaControl
                label="Description"
                value={ item.description || '' }
                onChange={ ( value ) => updateArrayItem( 'caseResults', index, { description: value } ) }
                rows={ 3 }
              />
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
                onChange={ ( value ) => {
                  const updated = [ ...resourcesLinks ];
                  updated[ index ] = { ...updated[ index ], label: value };
                  setAttributes( { resourcesLinks: updated } );
                } }
              />
              <TextControl
                label="URL"
                value={ link.url || '' }
                onChange={ ( value ) => {
                  const updated = [ ...resourcesLinks ];
                  updated[ index ] = { ...updated[ index ], url: value };
                  setAttributes( { resourcesLinks: updated } );
                } }
              />
              <Button
                isDestructive
                onClick={ () =>
                  setAttributes( {
                    resourcesLinks: resourcesLinks.filter( ( _, i ) => i !== index ),
                  } )
                }
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
          <TextareaControl
            label="Closing Paragraph"
            value={ caseCategoriesClosing }
            onChange={ ( value ) => setAttributes( { caseCategoriesClosing: value } ) }
            rows={ 4 }
            help="Optional closing text that appears after all case category sections."
          />
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
              <TextareaControl
                label="Description"
                value={ category.description || '' }
                onChange={ ( value ) => updateArrayItem( 'caseCategories', catIndex, { description: value } ) }
                rows={ 3 }
              />
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
                      const updated = [ ...caseCategories ];
                      const links = [ ...( updated[ catIndex ].links || [] ) ];
                      links[ linkIndex ] = { ...links[ linkIndex ], label: value };
                      updated[ catIndex ] = { ...updated[ catIndex ], links };
                      setAttributes( { caseCategories: updated } );
                    } }
                  />
                  <TextControl
                    label="Link URL"
                    value={ link.url || '' }
                    onChange={ ( value ) => {
                      const updated = [ ...caseCategories ];
                      const links = [ ...( updated[ catIndex ].links || [] ) ];
                      links[ linkIndex ] = { ...links[ linkIndex ], url: value };
                      updated[ catIndex ] = { ...updated[ catIndex ], links };
                      setAttributes( { caseCategories: updated } );
                    } }
                  />
                  <Button
                    isDestructive
                    onClick={ () => {
                      const updated = [ ...caseCategories ];
                      updated[ catIndex ] = {
                        ...updated[ catIndex ],
                        links: ( updated[ catIndex ].links || [] ).filter( ( _, i ) => i !== linkIndex ),
                      };
                      setAttributes( { caseCategories: updated } );
                    } }
                  >
                    Remove Category Link
                  </Button>
                </div>
              ) ) }

              <div style={ { marginTop: '8px' } }>
                <Button
                  isSecondary
                  onClick={ () => {
                    const updated = [ ...caseCategories ];
                    updated[ catIndex ] = {
                      ...updated[ catIndex ],
                      links: [ ...( updated[ catIndex ].links || [] ), makeSimpleLink() ],
                    };
                    setAttributes( { caseCategories: updated } );
                  } }
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
          key={ `faq-${ activeEditorSection }` }
          title="FAQ"
          initialOpen={ activeEditorSection === 'faq' }
        >
          <TextControl
            label="Section Title"
            value={ faqTitle }
            onChange={ ( value ) => setAttributes( { faqTitle: value } ) }
          />
          <hr />
          { faqItems.map( ( faq, index ) => (
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
                label={`Question ${ index + 1 }`}
                value={ faq.question || '' }
                onChange={ ( value ) => updateArrayItem( 'faqItems', index, { question: value } ) }
              />
              <p style={ { fontSize: '12px', color: '#757575', marginTop: '8px' } }>Click "Edit FAQ" below to edit answers with formatting toolbar</p>
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
                      const updated = [ ...servingColumns ];
                      const links = [ ...( updated[ colIndex ].links || [] ) ];
                      links[ linkIndex ] = { ...links[ linkIndex ], label: value };
                      updated[ colIndex ] = { ...updated[ colIndex ], links };
                      setAttributes( { servingColumns: updated } );
                    } }
                  />
                  <TextControl
                    label="Link URL"
                    value={ link.url || '' }
                    onChange={ ( value ) => {
                      const updated = [ ...servingColumns ];
                      const links = [ ...( updated[ colIndex ].links || [] ) ];
                      links[ linkIndex ] = { ...links[ linkIndex ], url: value };
                      updated[ colIndex ] = { ...updated[ colIndex ], links };
                      setAttributes( { servingColumns: updated } );
                    } }
                  />
                  <Button
                    isDestructive
                    onClick={ () => {
                      const updated = [ ...servingColumns ];
                      updated[ colIndex ] = {
                        ...updated[ colIndex ],
                        links: ( updated[ colIndex ].links || [] ).filter( ( _, i ) => i !== linkIndex ),
                      };
                      setAttributes( { servingColumns: updated } );
                    } }
                  >
                    Remove Column Link
                  </Button>
                </div>
              ) ) }

              <div style={ { marginTop: '8px' } }>
                <Button
                  isSecondary
                  onClick={ () => {
                    const updated = [ ...servingColumns ];
                    updated[ colIndex ] = {
                      ...updated[ colIndex ],
                      links: [ ...( updated[ colIndex ].links || [] ), makeSimpleLink() ],
                    };
                    setAttributes( { servingColumns: updated } );
                  } }
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
          />
          <RichText
            tagName="p"
            value={ whyChooseIntro }
            onChange={ ( value ) => setAttributes( { whyChooseIntro: value } ) }
            placeholder="Intro text"
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
          />
          <RichText
            tagName="p"
            value={ caseResultsSubtitle }
            onChange={ ( value ) => setAttributes( { caseResultsSubtitle: value } ) }
            placeholder="Case Results subtitle"
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
          />
          <RichText
            tagName="p"
            value={ testimonialsSubtitle }
            onChange={ ( value ) => setAttributes( { testimonialsSubtitle: value } ) }
            placeholder="Testimonials subtitle"
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
          />
          <RichText
            tagName="p"
            value={ howWeHelpIntro }
            onChange={ ( value ) => setAttributes( { howWeHelpIntro: value } ) }
            placeholder="Intro paragraph"
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
          />
          { activeEditorSection === 'faq' && (
            <div style={ { marginTop: '16px' } }>
              { faqItems.map( ( faq, index ) => (
                <div
                  key={ index }
                  style={ {
                    border: '2px solid #0073aa',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  } }
                >
                  <div style={ { backgroundColor: '#e3f2fd', padding: '8px 12px', borderRadius: '4px', marginBottom: '12px' } }>
                    <p style={ { fontWeight: '600', marginBottom: '4px', color: '#1976d2' } }>Question { index + 1 }:</p>
                    <p style={ { fontStyle: 'italic', color: '#424242' } }>{ faq.question || 'No question text' }</p>
                  </div>
                  <div style={ { backgroundColor: '#fff3e0', padding: '8px 12px', borderRadius: '4px', marginBottom: '8px' } }>
                    <p style={ { fontWeight: '600', marginBottom: '8px', color: '#e65100' } }>Answer:</p>
                  </div>
                  <RichText
                    tagName="div"
                    value={ faq.answer || '' }
                    onChange={ ( value ) => updateArrayItem( 'faqItems', index, { answer: value } ) }
                    placeholder="Click here and start typing. Use the toolbar above for formatting..."
                    allowedFormats={ [
                      'core/bold',
                      'core/italic',
                      'core/link',
                      'core/strikethrough',
                      'core/underline',
                      'core/list',
                    ] }
                    multiline="p"
                    style={ {
                      border: '2px solid #ff9800',
                      borderRadius: '6px',
                      padding: '12px',
                      minHeight: '120px',
                      backgroundColor: '#fff',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    } }
                  />
                </div>
              ) ) }
              { faqItems.length === 0 && (
                <div style={ { padding: '20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '6px' } }>
                  <p style={ { color: '#666', fontStyle: 'italic' } }>No FAQ items yet. Add items in the FAQ sidebar panel first.</p>
                </div>
              ) }
            </div>
          ) }
          { activeEditorSection !== 'faq' && (
            <p>{ faqItems.length } FAQ item(s)</p>
          ) }
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
