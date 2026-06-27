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
  ToggleControl,
  Icon,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Generate unique ID for rows
const generateUniqueId = () => {
  return Date.now().toString( 36 ) + Math.random().toString( 36 ).slice( 2 );
};

// Sortable Row Component
function SortableRow( { row, index, updateRow, removeRow, duplicateRow, updateParagraph, addParagraph, removeParagraph, updateListItem, addListItem, removeListItem, updateParagraphAfterList, addParagraphAfterList, removeParagraphAfterList } ) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable( { id: row.id } );

  const style = {
    transform: CSS.Transform.toString( transform ),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={ setNodeRef } style={ style }>
      <PanelBody
        title={
          <div style={ { display: 'flex', alignItems: 'center', gap: '10px' } }>
            <div { ...attributes } { ...listeners } style={ { cursor: 'grab', padding: '5px', display: 'flex', alignItems: 'center' } }>
              <Icon icon="menu" />
            </div>
            <span>{ `${ __( 'Row', 'mbn-theme' ) } ${ index + 1 }` }</span>
          </div>
        }
        initialOpen={ false }
      >
        <div style={ { display: 'flex', gap: '8px', marginBottom: '16px' } }>
          <Button
            icon="admin-page"
            label={ __( 'Duplicate', 'mbn-theme' ) }
            onClick={ () => duplicateRow( index ) }
          />
          <Button
            icon="trash"
            label={ __( 'Remove', 'mbn-theme' ) }
            isDestructive
            onClick={ () => {
              if ( window.confirm( __( 'Are you sure you want to remove this row?', 'mbn-theme' ) ) ) {
                removeRow( index );
              }
            } }
          />
        </div>

        {/* Heading */}
        <TextareaControl
          label={ __( 'Heading', 'mbn-theme' ) }
          value={ row.heading }
          onChange={ ( value ) => updateRow( index, { heading: value } ) }
          help={ __( 'Leave empty to hide the heading.', 'mbn-theme' ) }
          rows={ 2 }
        />

        {/* Paragraphs */}
        <div style={ { marginTop: '16px' } }>
          <strong>{ __( 'Paragraphs', 'mbn-theme' ) }</strong>
          { row.paragraphs && row.paragraphs.map( ( paragraph, pIndex ) => (
            <div
              key={ pIndex }
              style={ {
                border: '1px solid #ddd',
                padding: '12px',
                marginTop: '8px',
                borderRadius: '4px',
              } }
            >
              <TextareaControl
                label={ `${ __( 'Paragraph', 'mbn-theme' ) } ${ pIndex + 1 }` }
                value={ paragraph }
                onChange={ ( value ) => updateParagraph( index, pIndex, value ) }
                rows={ 3 }
              />
              <Button
                isDestructive
                isSmall
                onClick={ () => removeParagraph( index, pIndex ) }
                style={ { marginTop: '8px' } }
              >
                { __( 'Remove Paragraph', 'mbn-theme' ) }
              </Button>
            </div>
          ) ) }
          <Button
            isSecondary
            isSmall
            onClick={ () => addParagraph( index ) }
            style={ { marginTop: '8px' } }
          >
            { __( '+ Add Paragraph', 'mbn-theme' ) }
          </Button>
        </div>

        {/* List Items */}
        <div style={ { marginTop: '16px' } }>
          <strong>{ __( 'List Items (Optional)', 'mbn-theme' ) }</strong>
          { row.listItems && row.listItems.map( ( item, lIndex ) => (
            <div
              key={ lIndex }
              style={ {
                border: '1px solid #ddd',
                padding: '12px',
                marginTop: '8px',
                borderRadius: '4px',
              } }
            >
              <TextareaControl
                label={ `${ __( 'Item', 'mbn-theme' ) } ${ lIndex + 1 }` }
                value={ item }
                onChange={ ( value ) => updateListItem( index, lIndex, value ) }
                rows={ 2 }
              />
              <Button
                isDestructive
                isSmall
                onClick={ () => removeListItem( index, lIndex ) }
                style={ { marginTop: '8px' } }
              >
                { __( 'Remove Item', 'mbn-theme' ) }
              </Button>
            </div>
          ) ) }
          <Button
            isSecondary
            isSmall
            onClick={ () => addListItem( index ) }
            style={ { marginTop: '8px' } }
          >
            { __( '+ Add List Item', 'mbn-theme' ) }
          </Button>
        </div>

        {/* Paragraphs After List */}
        <div style={ { marginTop: '16px' } }>
          <strong>{ __( 'Paragraphs After List (Optional)', 'mbn-theme' ) }</strong>
          <p style={ { fontSize: '12px', color: '#757575', marginTop: '4px' } }>
            { __( 'Add paragraphs that appear after the list items.', 'mbn-theme' ) }
          </p>
          { row.paragraphsAfterList && row.paragraphsAfterList.map( ( paragraph, paIndex ) => (
            <div
              key={ paIndex }
              style={ {
                border: '1px solid #ddd',
                padding: '12px',
                marginTop: '8px',
                borderRadius: '4px',
              } }
            >
              <TextareaControl
                label={ `${ __( 'Paragraph', 'mbn-theme' ) } ${ paIndex + 1 }` }
                value={ paragraph }
                onChange={ ( value ) => updateParagraphAfterList( index, paIndex, value ) }
                rows={ 3 }
              />
              <Button
                isDestructive
                isSmall
                onClick={ () => removeParagraphAfterList( index, paIndex ) }
                style={ { marginTop: '8px' } }
              >
                { __( 'Remove Paragraph', 'mbn-theme' ) }
              </Button>
            </div>
          ) ) }
          <Button
            isSecondary
            isSmall
            onClick={ () => addParagraphAfterList( index ) }
            style={ { marginTop: '8px' } }
          >
            { __( '+ Add Paragraph After List', 'mbn-theme' ) }
          </Button>
        </div>

        {/* Image Position */}
        <SelectControl
          label={ __( 'Image Position', 'mbn-theme' ) }
          value={ row.imagePosition }
          options={ [
            { label: __( 'Right', 'mbn-theme' ), value: 'right' },
            { label: __( 'Left', 'mbn-theme' ), value: 'left' },
          ] }
          onChange={ ( value ) => updateRow( index, { imagePosition: value } ) }
          help={ __( 'On mobile, images always appear above text.', 'mbn-theme' ) }
        />

        {/* Image Upload */}
        <div style={ { marginTop: '16px' } }>
          <strong>{ __( 'Image', 'mbn-theme' ) }</strong>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={ ( media ) =>
                updateRow( index, { imageUrl: media.url, imageId: media.id } )
              }
              allowedTypes={ [ 'image' ] }
              value={ row.imageId }
              render={ ( { open } ) => (
                <div style={ { marginTop: '8px' } }>
                  <div style={ { display: 'flex', gap: '8px' } }>
                    <Button onClick={ open } variant="secondary">
                      { row.imageUrl
                        ? __( 'Replace Image', 'mbn-theme' )
                        : __( 'Select Image', 'mbn-theme' ) }
                    </Button>
                    { row.imageUrl && (
                      <Button
                        icon="trash"
                        label={ __( 'Remove Image', 'mbn-theme' ) }
                        isDestructive
                        onClick={ () => updateRow( index, { imageUrl: '', imageId: 0 } ) }
                      />
                    ) }
                  </div>
                  { row.imageUrl && (
                    <img
                      src={ row.imageUrl }
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
        </div>
      </PanelBody>
    </div>
  );
}

export default function Edit( { attributes, setAttributes } ) {
  const { rows } = attributes;
  const [ activeRowIndex, setActiveRowIndex ] = useState( 0 );

  const sensors = useSensors(
    useSensor( PointerSensor ),
    useSensor( KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    } )
  );

  const blockProps = useBlockProps( {
    className: 'section-loc-text-image',
  } );

  // Ensure all rows have unique IDs
  const ensureRowIds = ( rowsArray ) => {
    return rowsArray.map( ( row ) => {
      if ( ! row.id ) {
        return { ...row, id: generateUniqueId() };
      }
      return row;
    } );
  };

  // Initialize rows with IDs if they don't have them
  useEffect( () => {
    const hasMissingIds = rows.some( ( row ) => ! row.id );
    if ( hasMissingIds ) {
      const rowsWithIds = ensureRowIds( rows );
      setAttributes( { rows: rowsWithIds } );
    }
  }, [ rows, setAttributes ] );

  // Update a specific row
  const updateRow = ( index, updates ) => {
    const newRows = [ ...rows ];
    newRows[ index ] = { ...newRows[ index ], ...updates };
    setAttributes( { rows: newRows } );
  };

  // Add a new row
  const addRow = () => {
    const newRow = {
      id: generateUniqueId(),
      heading: 'New Section Heading',
      paragraphs: [ 'Enter paragraph text here.' ],
      listItems: [],
      paragraphsAfterList: [],
      imageUrl: '',
      imageId: 0,
      imagePosition: 'right',
    };
    setAttributes( { rows: [ ...rows, newRow ] } );
    setActiveRowIndex( rows.length );
  };

  // Remove a row
  const removeRow = ( index ) => {
    const newRows = rows.filter( ( _, i ) => i !== index );
    setAttributes( { rows: newRows } );
    if ( activeRowIndex >= newRows.length ) {
      setActiveRowIndex( Math.max( 0, newRows.length - 1 ) );
    }
  };

  // Duplicate a row
  const duplicateRow = ( index ) => {
    const rowToDuplicate = { ...rows[ index ], id: generateUniqueId() };
    const newRows = [
      ...rows.slice( 0, index + 1 ),
      rowToDuplicate,
      ...rows.slice( index + 1 ),
    ];
    setAttributes( { rows: newRows } );
  };

  // Handle drag end
  const handleDragEnd = ( event ) => {
    const { active, over } = event;

    if ( over && active.id !== over.id ) {
      const oldIndex = rows.findIndex( ( row ) => row.id === active.id );
      const newIndex = rows.findIndex( ( row ) => row.id === over.id );

      setAttributes( {
        rows: arrayMove( rows, oldIndex, newIndex ),
      } );
    }
  };

  // Update a specific paragraph in a row
  const updateParagraph = ( rowIndex, paragraphIndex, value ) => {
    const newRows = [ ...rows ];
    const newParagraphs = [ ...newRows[ rowIndex ].paragraphs ];
    newParagraphs[ paragraphIndex ] = value;
    newRows[ rowIndex ] = { ...newRows[ rowIndex ], paragraphs: newParagraphs };
    setAttributes( { rows: newRows } );
  };

  // Add a paragraph to a row
  const addParagraph = ( rowIndex ) => {
    const newRows = [ ...rows ];
    newRows[ rowIndex ] = {
      ...newRows[ rowIndex ],
      paragraphs: [ ...newRows[ rowIndex ].paragraphs, '' ],
    };
    setAttributes( { rows: newRows } );
  };

  // Remove a paragraph from a row
  const removeParagraph = ( rowIndex, paragraphIndex ) => {
    const newRows = [ ...rows ];
    newRows[ rowIndex ] = {
      ...newRows[ rowIndex ],
      paragraphs: newRows[ rowIndex ].paragraphs.filter( ( _, i ) => i !== paragraphIndex ),
    };
    setAttributes( { rows: newRows } );
  };

  // Update a specific list item in a row
  const updateListItem = ( rowIndex, itemIndex, value ) => {
    const newRows = [ ...rows ];
    const newListItems = [ ...newRows[ rowIndex ].listItems ];
    newListItems[ itemIndex ] = value;
    newRows[ rowIndex ] = { ...newRows[ rowIndex ], listItems: newListItems };
    setAttributes( { rows: newRows } );
  };

  // Add a list item to a row
  const addListItem = ( rowIndex ) => {
    const newRows = [ ...rows ];
    newRows[ rowIndex ] = {
      ...newRows[ rowIndex ],
      listItems: [ ...newRows[ rowIndex ].listItems, '' ],
    };
    setAttributes( { rows: newRows } );
  };

  // Remove a list item from a row
  const removeListItem = ( rowIndex, itemIndex ) => {
    const newRows = [ ...rows ];
    newRows[ rowIndex ] = {
      ...newRows[ rowIndex ],
      listItems: newRows[ rowIndex ].listItems.filter( ( _, i ) => i !== itemIndex ),
    };
    setAttributes( { rows: newRows } );
  };

  // Update a specific paragraph after list in a row
  const updateParagraphAfterList = ( rowIndex, paragraphIndex, value ) => {
    const newRows = [ ...rows ];
    const newParagraphs = [ ...( newRows[ rowIndex ].paragraphsAfterList || [] ) ];
    newParagraphs[ paragraphIndex ] = value;
    newRows[ rowIndex ] = { ...newRows[ rowIndex ], paragraphsAfterList: newParagraphs };
    setAttributes( { rows: newRows } );
  };

  // Add a paragraph after list to a row
  const addParagraphAfterList = ( rowIndex ) => {
    const newRows = [ ...rows ];
    newRows[ rowIndex ] = {
      ...newRows[ rowIndex ],
      paragraphsAfterList: [ ...( newRows[ rowIndex ].paragraphsAfterList || [] ), '' ],
    };
    setAttributes( { rows: newRows } );
  };

  // Remove a paragraph after list from a row
  const removeParagraphAfterList = ( rowIndex, paragraphIndex ) => {
    const newRows = [ ...rows ];
    newRows[ rowIndex ] = {
      ...newRows[ rowIndex ],
      paragraphsAfterList: ( newRows[ rowIndex ].paragraphsAfterList || [] ).filter( ( _, i ) => i !== paragraphIndex ),
    };
    setAttributes( { rows: newRows } );
  };

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={ __( 'Rows', 'mbn-theme' ) } initialOpen={ true }>
          <p style={ { marginBottom: '15px', fontSize: '13px', color: '#666' } }>
            { __( 'Drag and drop to reorder rows', 'mbn-theme' ) }
          </p>

          { rows.length > 0 && rows.every( ( row ) => row.id ) && (
            <DndContext
              sensors={ sensors }
              collisionDetection={ closestCenter }
              onDragEnd={ handleDragEnd }
            >
              <SortableContext
                items={ rows.map( ( row ) => row.id ) }
                strategy={ verticalListSortingStrategy }
              >
                { rows.map( ( row, index ) => (
                  <SortableRow
                    key={ row.id }
                    row={ row }
                    index={ index }
                    updateRow={ updateRow }
                    removeRow={ removeRow }
                    duplicateRow={ duplicateRow }
                    updateParagraph={ updateParagraph }
                    addParagraph={ addParagraph }
                    removeParagraph={ removeParagraph }
                    updateListItem={ updateListItem }
                    addListItem={ addListItem }
                    removeListItem={ removeListItem }
                    updateParagraphAfterList={ updateParagraphAfterList }
                    addParagraphAfterList={ addParagraphAfterList }
                    removeParagraphAfterList={ removeParagraphAfterList }
                  />
                ) ) }
              </SortableContext>
            </DndContext>
          ) }

          {/* Add Row Button */}
          <Button isPrimary onClick={ addRow } style={ { marginTop: '15px' } }>
            { __( '+ Add New Row', 'mbn-theme' ) }
          </Button>
        </PanelBody>
      </InspectorControls>

      <section { ...blockProps }>
        <div className="section-loc-text-image__container">
          { rows.length === 0 ? (
            <div
              style={ {
                padding: '40px',
                textAlign: 'center',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                color: '#757575',
              } }
            >
              { __( 'No rows yet. Add a row from the sidebar →', 'mbn-theme' ) }
            </div>
          ) : (
            rows.map( ( row, index ) => {
              const isActive = index === activeRowIndex;
              const rowClass = row.imagePosition === 'left'
                ? 'section-loc-text-image__row section-loc-text-image__row--image-left'
                : 'section-loc-text-image__row section-loc-text-image__row--image-right';

              return (
                <div
                  key={ index }
                  className={ rowClass }
                  onClick={ () => setActiveRowIndex( index ) }
                  style={ {
                    cursor: 'pointer',
                    border: isActive ? '2px solid #007cba' : '2px solid transparent',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: index < rows.length - 1 ? '48px' : '0',
                    transition: 'border-color 0.2s',
                  } }
                >
                  {/* Preview Badge */}
                  <div
                    style={ {
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: isActive ? '#007cba' : '#757575',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                    } }
                  >
                    { __( 'Row', 'mbn-theme' ) } { index + 1 }
                  </div>

                  <div className="section-loc-text-image__text" style={ { flex: 1 } }>
                    { row.heading && (
                      <RichText
                        tagName="h3"
                        value={ row.heading }
                        onChange={ ( value ) => updateRow( index, { heading: value } ) }
                        placeholder={ __( 'Enter heading…', 'mbn-theme' ) }
                        className="section-loc-text-image__heading"
                      />
                    ) }

                    { row.paragraphs && row.paragraphs.length > 0 && (
                      <div style={ { marginTop: '12px' } }>
                        { row.paragraphs.slice( 0, 1 ).map( ( paragraph, pIndex ) => (
                          <p
                            key={ pIndex }
                            className="section-loc-text-image__para"
                            dangerouslySetInnerHTML={ { __html: paragraph || __( 'Paragraph…', 'mbn-theme' ) } }
                          />
                        ) ) }
                        { row.paragraphs.length > 1 && (
                          <p style={ { fontSize: '13px', color: '#757575', fontStyle: 'italic' } }>
                            { `+ ${ row.paragraphs.length - 1 } more paragraph(s)` }
                          </p>
                        ) }
                      </div>
                    ) }

                    { row.listItems && row.listItems.length > 0 && (
                      <p style={ { marginTop: '12px', fontSize: '13px', color: '#757575' } }>
                        { `• ${ row.listItems.length } list item(s)` }
                      </p>
                    ) }

                    { row.paragraphsAfterList && row.paragraphsAfterList.length > 0 && (
                      <p style={ { marginTop: '12px', fontSize: '13px', color: '#757575', fontStyle: 'italic' } }>
                        { `+ ${ row.paragraphsAfterList.length } paragraph(s) after list` }
                      </p>
                    ) }
                  </div>

                  <figure className="section-loc-text-image__image-wrap" style={ { flex: 1, minHeight: '200px' } }>
                    { row.imageUrl ? (
                      <img
                        src={ row.imageUrl }
                        alt=""
                        className="section-loc-text-image__image"
                        style={ { width: '100%', height: 'auto', borderRadius: '8px' } }
                      />
                    ) : (
                      <div
                        style={ {
                          width: '100%',
                          height: '200px',
                          background: '#f0f0f0',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#757575',
                          fontSize: '14px',
                        } }
                      >
                        { __( 'No image selected', 'mbn-theme' ) }
                      </div>
                    ) }
                  </figure>
                </div>
              );
            } )
          ) }
        </div>
      </section>
    </Fragment>
  );
}
