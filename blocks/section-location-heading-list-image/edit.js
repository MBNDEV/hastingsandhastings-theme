import {
  useBlockProps,
  InspectorControls,
  RichText,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import {
  PanelBody,
  Button,
  SelectControl,
  TextareaControl,
  TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import BackgroundColorControl from '../shared/BackgroundColorControl';

export default function Edit( { attributes, setAttributes } ) {
  const {
    heading,
    introParagraphs,
    listStyle,
    listItems,
    imageUrl,
    imageId,
    beforeListParagraphs,
    afterListParagraphs,
    footerParagraphs,
    backgroundColor,
  } = attributes;

  const [ activeSection, setActiveSection ] = useState( 'header' );

  // Handle background color for editor
  const isCustomColor = backgroundColor && backgroundColor.startsWith( '#' );
  const bgStyle = isCustomColor ? { backgroundColor } : {};
  const bgClass = isCustomColor ? '' : backgroundColor;

  const blockProps = useBlockProps( {
    className: `loc-hlimg ${ bgClass }`,
    style: bgStyle,
  } );

  // Update a specific intro paragraph
  const updateIntroParagraph = ( index, value ) => {
    const newParagraphs = [ ...introParagraphs ];
    newParagraphs[ index ] = value;
    setAttributes( { introParagraphs: newParagraphs } );
  };

  // Add intro paragraph
  const addIntroParagraph = () => {
    setAttributes( { introParagraphs: [ ...introParagraphs, '' ] } );
  };

  // Remove intro paragraph
  const removeIntroParagraph = ( index ) => {
    setAttributes( { introParagraphs: introParagraphs.filter( ( _, i ) => i !== index ) } );
  };

  // Update a specific list item
  const updateListItem = ( index, updates ) => {
    const newItems = [ ...listItems ];
    newItems[ index ] = { ...newItems[ index ], ...updates };
    setAttributes( { listItems: newItems } );
  };

  // Add list item
  const addListItem = () => {
    const newItem = listStyle === 'two-column'
      ? { title: '', description: '', label: 'New Item', url: '' }
      : { title: 'New Item', description: '', label: '', url: '' };
    setAttributes( { listItems: [ ...listItems, newItem ] } );
  };

  // Remove list item
  const removeListItem = ( index ) => {
    setAttributes( { listItems: listItems.filter( ( _, i ) => i !== index ) } );
  };

  // Update a specific before list paragraph
  const updateBeforeListParagraph = ( index, value ) => {
    const newParagraphs = [ ...beforeListParagraphs ];
    newParagraphs[ index ] = value;
    setAttributes( { beforeListParagraphs: newParagraphs } );
  };

  // Add before list paragraph
  const addBeforeListParagraph = () => {
    setAttributes( { beforeListParagraphs: [ ...beforeListParagraphs, '' ] } );
  };

  // Remove before list paragraph
  const removeBeforeListParagraph = ( index ) => {
    setAttributes( { beforeListParagraphs: beforeListParagraphs.filter( ( _, i ) => i !== index ) } );
  };

  // Update a specific after list paragraph
  const updateAfterListParagraph = ( index, value ) => {
    const newParagraphs = [ ...afterListParagraphs ];
    newParagraphs[ index ] = value;
    setAttributes( { afterListParagraphs: newParagraphs } );
  };

  // Add after list paragraph
  const addAfterListParagraph = () => {
    setAttributes( { afterListParagraphs: [ ...afterListParagraphs, '' ] } );
  };

  // Remove after list paragraph
  const removeAfterListParagraph = ( index ) => {
    setAttributes( { afterListParagraphs: afterListParagraphs.filter( ( _, i ) => i !== index ) } );
  };

  // Update a specific footer paragraph
  const updateFooterParagraph = ( index, value ) => {
    const newParagraphs = [ ...footerParagraphs ];
    newParagraphs[ index ] = value;
    setAttributes( { footerParagraphs: newParagraphs } );
  };

  // Add footer paragraph
  const addFooterParagraph = () => {
    setAttributes( { footerParagraphs: [ ...footerParagraphs, '' ] } );
  };

  // Remove footer paragraph
  const removeFooterParagraph = ( index ) => {
    setAttributes( { footerParagraphs: footerParagraphs.filter( ( _, i ) => i !== index ) } );
  };

  return (
    <Fragment>
      <InspectorControls>
        {/* Background */}
        <PanelBody title={ __( 'Background', 'mbn-theme' ) } initialOpen={ true }>
          <BackgroundColorControl
            value={ backgroundColor }
            onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
            defaultValue="bg-light-blue"
            label={ __( 'Section Background', 'mbn-theme' ) }
          />
        </PanelBody>

        {/* Header Section */}
        <PanelBody
          title={ __( 'Header Section', 'mbn-theme' ) }
          initialOpen={ activeSection === 'header' }
        >
          <TextareaControl
            label={ __( 'Heading', 'mbn-theme' ) }
            value={ heading }
            onChange={ ( value ) => setAttributes( { heading: value } ) }
            rows={ 2 }
          />

          <div style={ { marginTop: '16px' } }>
            <strong>{ __( 'Intro Paragraphs', 'mbn-theme' ) }</strong>
            { introParagraphs && introParagraphs.map( ( paragraph, index ) => (
              <div
                key={ index }
                style={ {
                  border: '1px solid #ddd',
                  padding: '12px',
                  marginTop: '8px',
                  borderRadius: '4px',
                } }
              >
                <TextareaControl
                  label={ `${ __( 'Paragraph', 'mbn-theme' ) } ${ index + 1 }` }
                  value={ paragraph }
                  onChange={ ( value ) => updateIntroParagraph( index, value ) }
                  rows={ 3 }
                />
                <Button
                  isDestructive
                  isSmall
                  onClick={ () => removeIntroParagraph( index ) }
                  style={ { marginTop: '8px' } }
                >
                  { __( 'Remove Paragraph', 'mbn-theme' ) }
                </Button>
              </div>
            ) ) }
            <Button
              isSecondary
              isSmall
              onClick={ addIntroParagraph }
              style={ { marginTop: '8px' } }
            >
              { __( '+ Add Intro Paragraph', 'mbn-theme' ) }
            </Button>
          </div>
        </PanelBody>

        {/* List Section */}
        <PanelBody
          title={ __( 'List Items', 'mbn-theme' ) }
          initialOpen={ activeSection === 'list' }
        >
          <SelectControl
            label={ __( 'List Style', 'mbn-theme' ) }
            value={ listStyle }
            options={ [
              { label: __( 'Single Column (Title + Description)', 'mbn-theme' ), value: 'single' },
              { label: __( 'Two Column (Label/Link)', 'mbn-theme' ), value: 'two-column' },
            ] }
            onChange={ ( value ) => setAttributes( { listStyle: value } ) }
            help={ __( 'Single column shows title + description. Two column shows label + optional link.', 'mbn-theme' ) }
          />

          <div style={ { marginTop: '16px' } }>
            <strong>{ __( 'Items', 'mbn-theme' ) }</strong>
            { listItems && listItems.map( ( item, index ) => (
              <div
                key={ index }
                style={ {
                  border: '1px solid #ddd',
                  padding: '12px',
                  marginTop: '8px',
                  borderRadius: '4px',
                } }
              >
                <strong style={ { display: 'block', marginBottom: '8px' } }>
                  { __( 'Item', 'mbn-theme' ) } { index + 1 }
                </strong>

                { listStyle === 'two-column' ? (
                  <Fragment>
                    <TextControl
                      label={ __( 'Label', 'mbn-theme' ) }
                      value={ item.label || '' }
                      onChange={ ( value ) => updateListItem( index, { label: value } ) }
                    />
                    <TextControl
                      label={ __( 'URL (Optional)', 'mbn-theme' ) }
                      value={ item.url || '' }
                      onChange={ ( value ) => updateListItem( index, { url: value } ) }
                      help={ __( 'Leave empty for plain text', 'mbn-theme' ) }
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <TextControl
                      label={ __( 'Title', 'mbn-theme' ) }
                      value={ item.title || '' }
                      onChange={ ( value ) => updateListItem( index, { title: value } ) }
                    />
                    <TextareaControl
                      label={ __( 'Description', 'mbn-theme' ) }
                      value={ item.description || '' }
                      onChange={ ( value ) => updateListItem( index, { description: value } ) }
                      rows={ 2 }
                    />
                  </Fragment>
                ) }

                <Button
                  isDestructive
                  isSmall
                  onClick={ () => removeListItem( index ) }
                  style={ { marginTop: '8px' } }
                >
                  { __( 'Remove Item', 'mbn-theme' ) }
                </Button>
              </div>
            ) ) }
            <Button
              isPrimary
              isSmall
              onClick={ addListItem }
              style={ { marginTop: '8px' } }
            >
              { __( '+ Add List Item', 'mbn-theme' ) }
            </Button>
          </div>
        </PanelBody>

        {/* Before List Paragraphs */}
        <PanelBody
          title={ __( 'Before List Paragraphs (Optional)', 'mbn-theme' ) }
          initialOpen={ false }
        >
          <div>
            <strong>{ __( 'Paragraphs Before List', 'mbn-theme' ) }</strong>
            { beforeListParagraphs && beforeListParagraphs.map( ( paragraph, index ) => (
              <div
                key={ index }
                style={ {
                  border: '1px solid #ddd',
                  padding: '12px',
                  marginTop: '8px',
                  borderRadius: '4px',
                } }
              >
                <label
                  style={ {
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                  } }
                >
                  { `${ __( 'Paragraph', 'mbn-theme' ) } ${ index + 1 }` }
                </label>
                <RichText
                  tagName="div"
                  value={ paragraph }
                  onChange={ ( value ) => updateBeforeListParagraph( index, value ) }
                  placeholder={ __( 'Enter paragraph...', 'mbn-theme' ) }
                  allowedFormats={ [ 'core/bold', 'core/italic', 'core/link', 'core/strikethrough', 'core/underline' ] }
                  style={ {
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    minHeight: '60px',
                    backgroundColor: '#fff',
                  } }
                />
                <Button
                  isDestructive
                  isSmall
                  onClick={ () => removeBeforeListParagraph( index ) }
                  style={ { marginTop: '8px' } }
                >
                  { __( 'Remove Paragraph', 'mbn-theme' ) }
                </Button>
              </div>
            ) ) }
            <Button
              isSecondary
              isSmall
              onClick={ addBeforeListParagraph }
              style={ { marginTop: '8px' } }
            >
              { __( '+ Add Before List Paragraph', 'mbn-theme' ) }
            </Button>
          </div>
        </PanelBody>

        {/* After List Paragraphs */}
        <PanelBody
          title={ __( 'After List Paragraphs (Optional)', 'mbn-theme' ) }
          initialOpen={ false }
        >
          <div>
            <strong>{ __( 'Paragraphs After List', 'mbn-theme' ) }</strong>
            { afterListParagraphs && afterListParagraphs.map( ( paragraph, index ) => (
              <div
                key={ index }
                style={ {
                  border: '1px solid #ddd',
                  padding: '12px',
                  marginTop: '8px',
                  borderRadius: '4px',
                } }
              >
                <label
                  style={ {
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                  } }
                >
                  { `${ __( 'Paragraph', 'mbn-theme' ) } ${ index + 1 }` }
                </label>
                <RichText
                  tagName="div"
                  value={ paragraph }
                  onChange={ ( value ) => updateAfterListParagraph( index, value ) }
                  placeholder={ __( 'Enter paragraph...', 'mbn-theme' ) }
                  allowedFormats={ [ 'core/bold', 'core/italic', 'core/link', 'core/strikethrough', 'core/underline' ] }
                  style={ {
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    minHeight: '60px',
                    backgroundColor: '#fff',
                  } }
                />
                <Button
                  isDestructive
                  isSmall
                  onClick={ () => removeAfterListParagraph( index ) }
                  style={ { marginTop: '8px' } }
                >
                  { __( 'Remove Paragraph', 'mbn-theme' ) }
                </Button>
              </div>
            ) ) }
            <Button
              isSecondary
              isSmall
              onClick={ addAfterListParagraph }
              style={ { marginTop: '8px' } }
            >
              { __( '+ Add After List Paragraph', 'mbn-theme' ) }
            </Button>
          </div>
        </PanelBody>

        {/* Image Section */}
        <PanelBody
          title={ __( 'Image', 'mbn-theme' ) }
          initialOpen={ activeSection === 'image' }
        >
          <MediaUploadCheck>
            <MediaUpload
              onSelect={ ( media ) =>
                setAttributes( { imageUrl: media.url, imageId: media.id } )
              }
              allowedTypes={ [ 'image' ] }
              value={ imageId }
              render={ ( { open } ) => (
                <div>
                  <Button onClick={ open } variant="secondary">
                    { imageUrl
                      ? __( 'Replace Image', 'mbn-theme' )
                      : __( 'Select Image', 'mbn-theme' ) }
                  </Button>
                  { imageUrl && (
                    <img
                      src={ imageUrl }
                      alt=""
                      style={ {
                        marginTop: '10px',
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                      } }
                    />
                  ) }
                </div>
              ) }
            />
          </MediaUploadCheck>
        </PanelBody>

        {/* Footer Section */}
        <PanelBody
          title={ __( 'Footer Paragraphs', 'mbn-theme' ) }
          initialOpen={ activeSection === 'footer' }
        >
          <div>
            <strong>{ __( 'Footer Paragraphs', 'mbn-theme' ) }</strong>
            { footerParagraphs && footerParagraphs.map( ( paragraph, index ) => (
              <div
                key={ index }
                style={ {
                  border: '1px solid #ddd',
                  padding: '12px',
                  marginTop: '8px',
                  borderRadius: '4px',
                } }
              >
                <TextareaControl
                  label={ `${ __( 'Paragraph', 'mbn-theme' ) } ${ index + 1 }` }
                  value={ paragraph }
                  onChange={ ( value ) => updateFooterParagraph( index, value ) }
                  rows={ 3 }
                />
                <Button
                  isDestructive
                  isSmall
                  onClick={ () => removeFooterParagraph( index ) }
                  style={ { marginTop: '8px' } }
                >
                  { __( 'Remove Paragraph', 'mbn-theme' ) }
                </Button>
              </div>
            ) ) }
            <Button
              isSecondary
              isSmall
              onClick={ addFooterParagraph }
              style={ { marginTop: '8px' } }
            >
              { __( '+ Add Footer Paragraph', 'mbn-theme' ) }
            </Button>
          </div>
        </PanelBody>
      </InspectorControls>

      <section { ...blockProps }>
        <div className="loc-hlimg__container">
          {/* Header Preview */}
          <div
            onClick={ () => setActiveSection( 'header' ) }
            style={ {
              cursor: 'pointer',
              border: activeSection === 'header' ? '2px solid #007cba' : '2px solid transparent',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
            } }
          >
            <div
              style={ {
                fontSize: '12px',
                fontWeight: '600',
                color: activeSection === 'header' ? '#007cba' : '#757575',
                marginBottom: '8px',
              } }
            >
              { __( 'HEADER', 'mbn-theme' ) }
            </div>
            <RichText
              tagName="h3"
              value={ heading }
              onChange={ ( value ) => setAttributes( { heading: value } ) }
              placeholder={ __( 'Enter heading…', 'mbn-theme' ) }
              className="loc-hlimg__heading"
            />
            { introParagraphs && introParagraphs.length > 0 && (
              <p style={ { fontSize: '13px', color: '#757575', marginTop: '8px' } }>
                { introParagraphs.length } { __( 'intro paragraph(s)', 'mbn-theme' ) }
              </p>
            ) }
          </div>

          {/* Body Preview */}
          <div
            onClick={ () => setActiveSection( 'list' ) }
            style={ {
              cursor: 'pointer',
              border: activeSection === 'list' ? '2px solid #007cba' : '2px solid transparent',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
            } }
          >
            <div style={ { flex: 1 } }>
              <div
                style={ {
                  fontSize: '12px',
                  fontWeight: '600',
                  color: activeSection === 'list' ? '#007cba' : '#757575',
                  marginBottom: '8px',
                } }
              >
                { __( 'LIST ITEMS', 'mbn-theme' ) } ({ listStyle === 'two-column' ? __( 'Two Column', 'mbn-theme' ) : __( 'Single Column', 'mbn-theme' ) })
              </div>
              { listItems && listItems.length > 0 ? (
                <p style={ { fontSize: '13px', color: '#757575' } }>
                  { listItems.length } { __( 'item(s)', 'mbn-theme' ) }
                </p>
              ) : (
                <p style={ { fontSize: '13px', color: '#999' } }>
                  { __( 'No items yet', 'mbn-theme' ) }
                </p>
              ) }
            </div>
            <div
              onClick={ () => setActiveSection( 'image' ) }
              style={ { flex: 1, minHeight: '120px' } }
            >
              { imageUrl ? (
                <img
                  src={ imageUrl }
                  alt=""
                  style={ { width: '100%', height: 'auto', borderRadius: '8px' } }
                />
              ) : (
                <div
                  style={ {
                    width: '100%',
                    height: '120px',
                    background: '#f0f0f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#757575',
                    fontSize: '12px',
                  } }
                >
                  { __( 'No image', 'mbn-theme' ) }
                </div>
              ) }
            </div>
          </div>

          {/* Footer Preview */}
          <div
            onClick={ () => setActiveSection( 'footer' ) }
            style={ {
              cursor: 'pointer',
              border: activeSection === 'footer' ? '2px solid #007cba' : '2px solid transparent',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
            } }
          >
            <div
              style={ {
                fontSize: '12px',
                fontWeight: '600',
                color: activeSection === 'footer' ? '#007cba' : '#757575',
                marginBottom: '8px',
              } }
            >
              { __( 'FOOTER', 'mbn-theme' ) }
            </div>
            { footerParagraphs && footerParagraphs.length > 0 ? (
              <p style={ { fontSize: '13px', color: '#757575' } }>
                { footerParagraphs.length } { __( 'footer paragraph(s)', 'mbn-theme' ) }
              </p>
            ) : (
              <p style={ { fontSize: '13px', color: '#999' } }>
                { __( 'No footer paragraphs', 'mbn-theme' ) }
              </p>
            ) }
          </div>
        </div>
      </section>
    </Fragment>
  );
}
