import { registerBlockType } from '@wordpress/blocks';
import {
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
  RichText,
  useBlockProps,
} from '@wordpress/block-editor';
import {
  PanelBody,
  Button,
  TextControl,
  TextareaControl,
  Notice,
} from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';
import metadata from './block.json';
import './style.css';

const createEmptyLink = () => ( {
  label: '',
  url: '#',
} );

const createEmptyCard = () => ( {
  title: '',
  imageId: 0,
  imageUrl: '',
  imageAlt: '',
  imageFallback: 'office-mesa.jpg',
  address: '',
  addressUrl: '#',
  phone: '',
  phoneUrl: 'tel:',
} );

const createEmptyRegion = () => ( {
  title: '',
  description: '',
  links: [ createEmptyLink() ],
  cards: [ createEmptyCard() ],
} );

const createEmptyMapArea = () => ( {
  title: '',
  description: '',
  links: [ createEmptyLink() ],
} );

const sectionStyle = ( isActive ) => ( {
  border: isActive ? '2px solid #286fb7' : '1px solid #d7dce1',
  borderRadius: '8px',
  padding: '14px',
  marginBottom: '12px',
  background: isActive ? '#f3f7fc' : '#fff',
} );

const panelWrapperStyle = {
  border: '1px solid #d7dce1',
  borderRadius: '6px',
  padding: '12px',
  marginBottom: '12px',
};

const Edit = ( { attributes, setAttributes } ) => {
  const {
    iconChevronId,
    iconChevronUrl,
    iconMapPinId,
    iconMapPinUrl,
    iconPhoneId,
    iconPhoneUrl,
    mapTitle,
    mapEmbedUrl,
    regions,
    mapAreas,
  } = attributes;

  const [ activeEditorSection, setActiveEditorSection ] = useState( 'map' );

  const blockProps = useBlockProps( {
    className: 'locations-directory',
  } );

  const setRegionField = ( regionIndex, key, value ) => {
    const updated = [ ...regions ];
    updated[ regionIndex ] = {
      ...updated[ regionIndex ],
      [ key ]: value,
    };
    setAttributes( { regions: updated } );
  };

  const setRegionLinkField = ( regionIndex, linkIndex, key, value ) => {
    const updated = [ ...regions ];
    const links = [ ...( updated[ regionIndex ]?.links || [] ) ];
    links[ linkIndex ] = {
      ...links[ linkIndex ],
      [ key ]: value,
    };

    updated[ regionIndex ] = {
      ...updated[ regionIndex ],
      links,
    };

    setAttributes( { regions: updated } );
  };

  const setRegionCardField = ( regionIndex, cardIndex, key, value ) => {
    const updated = [ ...regions ];
    const cards = [ ...( updated[ regionIndex ]?.cards || [] ) ];
    cards[ cardIndex ] = {
      ...cards[ cardIndex ],
      [ key ]: value,
    };

    updated[ regionIndex ] = {
      ...updated[ regionIndex ],
      cards,
    };

    setAttributes( { regions: updated } );
  };

  const addRegionLink = ( regionIndex ) => {
    const updated = [ ...regions ];
    updated[ regionIndex ] = {
      ...updated[ regionIndex ],
      links: [ ...( updated[ regionIndex ]?.links || [] ), createEmptyLink() ],
    };
    setAttributes( { regions: updated } );
  };

  const removeRegionLink = ( regionIndex, linkIndex ) => {
    const updated = [ ...regions ];
    updated[ regionIndex ] = {
      ...updated[ regionIndex ],
      links: ( updated[ regionIndex ]?.links || [] ).filter( ( _, index ) => index !== linkIndex ),
    };
    setAttributes( { regions: updated } );
  };

  const addRegionCard = ( regionIndex ) => {
    const updated = [ ...regions ];
    updated[ regionIndex ] = {
      ...updated[ regionIndex ],
      cards: [ ...( updated[ regionIndex ]?.cards || [] ), createEmptyCard() ],
    };
    setAttributes( { regions: updated } );
  };

  const removeRegionCard = ( regionIndex, cardIndex ) => {
    const updated = [ ...regions ];
    updated[ regionIndex ] = {
      ...updated[ regionIndex ],
      cards: ( updated[ regionIndex ]?.cards || [] ).filter( ( _, index ) => index !== cardIndex ),
    };
    setAttributes( { regions: updated } );
  };

  const addRegion = () => {
    setAttributes( { regions: [ ...regions, createEmptyRegion() ] } );
  };

  const removeRegion = ( regionIndex ) => {
    setAttributes( { regions: regions.filter( ( _, index ) => index !== regionIndex ) } );
  };

  const setMapAreaField = ( areaIndex, key, value ) => {
    const updated = [ ...mapAreas ];
    updated[ areaIndex ] = {
      ...updated[ areaIndex ],
      [ key ]: value,
    };
    setAttributes( { mapAreas: updated } );
  };

  const setMapAreaLinkField = ( areaIndex, linkIndex, key, value ) => {
    const updated = [ ...mapAreas ];
    const links = [ ...( updated[ areaIndex ]?.links || [] ) ];

    links[ linkIndex ] = {
      ...links[ linkIndex ],
      [ key ]: value,
    };

    updated[ areaIndex ] = {
      ...updated[ areaIndex ],
      links,
    };

    setAttributes( { mapAreas: updated } );
  };

  const addMapArea = () => {
    setAttributes( { mapAreas: [ ...mapAreas, createEmptyMapArea() ] } );
  };

  const removeMapArea = ( areaIndex ) => {
    setAttributes( { mapAreas: mapAreas.filter( ( _, index ) => index !== areaIndex ) } );
  };

  const addMapAreaLink = ( areaIndex ) => {
    const updated = [ ...mapAreas ];
    updated[ areaIndex ] = {
      ...updated[ areaIndex ],
      links: [ ...( updated[ areaIndex ]?.links || [] ), createEmptyLink() ],
    };
    setAttributes( { mapAreas: updated } );
  };

  const removeMapAreaLink = ( areaIndex, linkIndex ) => {
    const updated = [ ...mapAreas ];
    updated[ areaIndex ] = {
      ...updated[ areaIndex ],
      links: ( updated[ areaIndex ]?.links || [] ).filter( ( _, index ) => index !== linkIndex ),
    };
    setAttributes( { mapAreas: updated } );
  };

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody
          key={ `icons-${ activeEditorSection }` }
          title="Icons"
          initialOpen={ activeEditorSection === 'icons' }
        >
          <MediaUploadCheck>
            <MediaUpload
              onSelect={ ( media ) =>
                setAttributes( {
                  iconChevronId: media.id,
                  iconChevronUrl: media.url,
                } )
              }
              allowedTypes={ [ 'image' ] }
              value={ iconChevronId }
              render={ ( { open } ) => (
                <Button onClick={ open } variant="secondary" style={ { marginBottom: '10px' } }>
                  { iconChevronUrl ? 'Replace Chevron Icon' : 'Select Chevron Icon' }
                </Button>
              ) }
            />
          </MediaUploadCheck>

          <MediaUploadCheck>
            <MediaUpload
              onSelect={ ( media ) =>
                setAttributes( {
                  iconMapPinId: media.id,
                  iconMapPinUrl: media.url,
                } )
              }
              allowedTypes={ [ 'image' ] }
              value={ iconMapPinId }
              render={ ( { open } ) => (
                <Button onClick={ open } variant="secondary" style={ { marginBottom: '10px', marginLeft: '10px' } }>
                  { iconMapPinUrl ? 'Replace Map Pin Icon' : 'Select Map Pin Icon' }
                </Button>
              ) }
            />
          </MediaUploadCheck>

          <MediaUploadCheck>
            <MediaUpload
              onSelect={ ( media ) =>
                setAttributes( {
                  iconPhoneId: media.id,
                  iconPhoneUrl: media.url,
                } )
              }
              allowedTypes={ [ 'image' ] }
              value={ iconPhoneId }
              render={ ( { open } ) => (
                <Button onClick={ open } variant="secondary" style={ { marginBottom: '10px', marginLeft: '10px' } }>
                  { iconPhoneUrl ? 'Replace Phone Icon' : 'Select Phone Icon' }
                </Button>
              ) }
            />
          </MediaUploadCheck>
        </PanelBody>

        <PanelBody
          key={ `map-${ activeEditorSection }` }
          title="Map Settings"
          initialOpen={ activeEditorSection === 'map' }
        >
          <TextControl
            label="Map iframe URL"
            value={ mapEmbedUrl }
            onChange={ ( value ) => setAttributes( { mapEmbedUrl: value } ) }
          />
          <TextControl
            label="Map title"
            value={ mapTitle }
            onChange={ ( value ) => setAttributes( { mapTitle: value } ) }
          />
        </PanelBody>

        <PanelBody
          key={ `regions-${ activeEditorSection }` }
          title="List Regions"
          initialOpen={ activeEditorSection === 'regions' }
        >
          { regions.map( ( region, regionIndex ) => (
            <div key={ regionIndex } style={ panelWrapperStyle }>
              <TextControl
                label={`Region ${ regionIndex + 1 } Title`}
                value={ region.title || '' }
                onChange={ ( value ) => setRegionField( regionIndex, 'title', value ) }
              />
              <TextareaControl
                label="Region description"
                value={ region.description || '' }
                onChange={ ( value ) => setRegionField( regionIndex, 'description', value ) }
              />

              <Notice status="info" isDismissible={ false }>
                Sidebar links
              </Notice>

              { ( region.links || [] ).map( ( link, linkIndex ) => (
                <div key={ linkIndex } style={ panelWrapperStyle }>
                  <TextControl
                    label="Link label"
                    value={ link.label || '' }
                    onChange={ ( value ) => setRegionLinkField( regionIndex, linkIndex, 'label', value ) }
                  />
                  <TextControl
                    label="Link URL"
                    value={ link.url || '' }
                    onChange={ ( value ) => setRegionLinkField( regionIndex, linkIndex, 'url', value ) }
                  />
                  <Button
                    isDestructive
                    variant="secondary"
                    onClick={ () => removeRegionLink( regionIndex, linkIndex ) }
                  >
                    Remove Link
                  </Button>
                </div>
              ) ) }

              <Button variant="primary" onClick={ () => addRegionLink( regionIndex ) } style={ { marginBottom: '12px' } }>
                Add Link
              </Button>

              <Notice status="info" isDismissible={ false }>
                Location cards
              </Notice>

              { ( region.cards || [] ).map( ( card, cardIndex ) => (
                <div key={ cardIndex } style={ panelWrapperStyle }>
                  <TextControl
                    label="Card title"
                    value={ card.title || '' }
                    onChange={ ( value ) => setRegionCardField( regionIndex, cardIndex, 'title', value ) }
                  />

                  <MediaUploadCheck>
                    <MediaUpload
                      onSelect={ ( media ) => {
                        setRegionCardField( regionIndex, cardIndex, 'imageId', media.id || 0 );
                        setRegionCardField( regionIndex, cardIndex, 'imageUrl', media.url || '' );
                        setRegionCardField( regionIndex, cardIndex, 'imageAlt', media.alt || card.title || '' );
                      } }
                      allowedTypes={ [ 'image' ] }
                      value={ card.imageId || 0 }
                      render={ ( { open } ) => (
                        <Button onClick={ open } variant="secondary" style={ { marginBottom: '10px' } }>
                          { card.imageUrl ? 'Replace Card Image' : 'Select Card Image' }
                        </Button>
                      ) }
                    />
                  </MediaUploadCheck>

                  <TextControl
                    label="Image alt"
                    value={ card.imageAlt || '' }
                    onChange={ ( value ) => setRegionCardField( regionIndex, cardIndex, 'imageAlt', value ) }
                  />
                  <TextControl
                    label="Fallback image filename"
                    value={ card.imageFallback || '' }
                    onChange={ ( value ) => setRegionCardField( regionIndex, cardIndex, 'imageFallback', value ) }
                    help="Example: office-mesa.jpg"
                  />
                  <TextareaControl
                    label="Address text"
                    value={ card.address || '' }
                    onChange={ ( value ) => setRegionCardField( regionIndex, cardIndex, 'address', value ) }
                  />
                  <TextControl
                    label="Address URL"
                    value={ card.addressUrl || '' }
                    onChange={ ( value ) => setRegionCardField( regionIndex, cardIndex, 'addressUrl', value ) }
                  />
                  <TextControl
                    label="Phone text"
                    value={ card.phone || '' }
                    onChange={ ( value ) => setRegionCardField( regionIndex, cardIndex, 'phone', value ) }
                  />
                  <TextControl
                    label="Phone URL"
                    value={ card.phoneUrl || '' }
                    onChange={ ( value ) => setRegionCardField( regionIndex, cardIndex, 'phoneUrl', value ) }
                    help="Example: tel:+16024332323"
                  />
                  <Button
                    isDestructive
                    variant="secondary"
                    onClick={ () => removeRegionCard( regionIndex, cardIndex ) }
                  >
                    Remove Card
                  </Button>
                </div>
              ) ) }

              <Button variant="primary" onClick={ () => addRegionCard( regionIndex ) } style={ { marginBottom: '12px' } }>
                Add Card
              </Button>

              <Button
                isDestructive
                variant="secondary"
                onClick={ () => removeRegion( regionIndex ) }
              >
                Remove Region
              </Button>
            </div>
          ) ) }

          <Button variant="primary" onClick={ addRegion }>
            Add Region
          </Button>
        </PanelBody>

        <PanelBody
          key={ `areas-${ activeEditorSection }` }
          title="Map Area Columns"
          initialOpen={ activeEditorSection === 'areas' }
        >
          { mapAreas.map( ( area, areaIndex ) => (
            <div key={ areaIndex } style={ panelWrapperStyle }>
              <TextControl
                label={`Area ${ areaIndex + 1 } Title`}
                value={ area.title || '' }
                onChange={ ( value ) => setMapAreaField( areaIndex, 'title', value ) }
              />
              <TextareaControl
                label="Area description"
                value={ area.description || '' }
                onChange={ ( value ) => setMapAreaField( areaIndex, 'description', value ) }
              />

              { ( area.links || [] ).map( ( link, linkIndex ) => (
                <div key={ linkIndex } style={ panelWrapperStyle }>
                  <TextControl
                    label="Link label"
                    value={ link.label || '' }
                    onChange={ ( value ) => setMapAreaLinkField( areaIndex, linkIndex, 'label', value ) }
                  />
                  <TextControl
                    label="Link URL"
                    value={ link.url || '' }
                    onChange={ ( value ) => setMapAreaLinkField( areaIndex, linkIndex, 'url', value ) }
                  />
                  <Button
                    isDestructive
                    variant="secondary"
                    onClick={ () => removeMapAreaLink( areaIndex, linkIndex ) }
                  >
                    Remove Link
                  </Button>
                </div>
              ) ) }

              <Button variant="primary" onClick={ () => addMapAreaLink( areaIndex ) } style={ { marginBottom: '12px' } }>
                Add Link
              </Button>

              <Button
                isDestructive
                variant="secondary"
                onClick={ () => removeMapArea( areaIndex ) }
              >
                Remove Area Column
              </Button>
            </div>
          ) ) }

          <Button variant="primary" onClick={ addMapArea }>
            Add Area Column
          </Button>
        </PanelBody>
      </InspectorControls>

      <div { ...blockProps }>
        <div style={ sectionStyle( activeEditorSection === 'map' ) }>
          <Button variant="link" onClick={ () => setActiveEditorSection( 'map' ) }>
            Edit Map Section
          </Button>
          <RichText
            tagName="h4"
            value={ mapTitle }
            onChange={ ( value ) => setAttributes( { mapTitle: value } ) }
            placeholder="Map title"
            style={ { marginTop: '6px' } }
          />
          <p style={ { margin: '8px 0 0', color: '#53585f' } }>Map embed URL is editable in the sidebar.</p>
        </div>

        <div style={ sectionStyle( activeEditorSection === 'regions' ) }>
          <Button variant="link" onClick={ () => setActiveEditorSection( 'regions' ) }>
            Edit List Regions
          </Button>
          { regions.map( ( region, index ) => (
            <div key={ index } style={ { borderTop: '1px solid #e8eaec', marginTop: '12px', paddingTop: '12px' } }>
              <RichText
                tagName="h5"
                value={ region.title || '' }
                onChange={ ( value ) => setRegionField( index, 'title', value ) }
                placeholder="Region title"
              />
              <RichText
                tagName="p"
                value={ region.description || '' }
                onChange={ ( value ) => setRegionField( index, 'description', value ) }
                placeholder="Region description"
              />
              <p style={ { margin: '8px 0 0', color: '#53585f' } }>
                { ( region.links || [] ).length } links and { ( region.cards || [] ).length } cards
              </p>
            </div>
          ) ) }
        </div>

        <div style={ sectionStyle( activeEditorSection === 'areas' ) }>
          <Button variant="link" onClick={ () => setActiveEditorSection( 'areas' ) }>
            Edit Map Area Columns
          </Button>
          { mapAreas.map( ( area, index ) => (
            <div key={ index } style={ { borderTop: '1px solid #e8eaec', marginTop: '12px', paddingTop: '12px' } }>
              <RichText
                tagName="h5"
                value={ area.title || '' }
                onChange={ ( value ) => setMapAreaField( index, 'title', value ) }
                placeholder="Area title"
              />
              <RichText
                tagName="p"
                value={ area.description || '' }
                onChange={ ( value ) => setMapAreaField( index, 'description', value ) }
                placeholder="Area description"
              />
              <p style={ { margin: '8px 0 0', color: '#53585f' } }>
                { ( area.links || [] ).length } links
              </p>
            </div>
          ) ) }
        </div>

        <div style={ sectionStyle( activeEditorSection === 'icons' ) }>
          <Button variant="link" onClick={ () => setActiveEditorSection( 'icons' ) }>
            Edit Icons
          </Button>
          <p style={ { margin: '8px 0 0', color: '#53585f' } }>
            Chevron, map pin, and phone icons are configurable in the sidebar.
          </p>
        </div>
      </div>
    </Fragment>
  );
};

registerBlockType( metadata.name, {
  ...metadata,
  edit: Edit,
  save: () => null,
} );
