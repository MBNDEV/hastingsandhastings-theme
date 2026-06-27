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
  TextControl,
  Icon,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Generate unique ID for rows and list items
const generateUniqueId = () => {
  return Date.now().toString( 36 ) + Math.random().toString( 36 ).slice( 2 );
};

// Sortable List Item Component
function SortableListItem( { rowIndex, item, index, listStyle, updateListItem, removeListItem, duplicateListItem } ) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable( { id: item.id } );

  const style = {
    transform: CSS.Transform.toString( transform ),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
  };

  return (
    <div
      ref={ setNodeRef }
      style={ style }
    >
      <div
        style={ {
          border: '1px solid #ddd',
          padding: '12px',
          marginTop: '8px',
          borderRadius: '4px',
          position: 'relative',
        } }
      >
        {/* Action Buttons - Top Right Corner */}
        <div style={ {
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          gap: '4px',
          zIndex: 10,
        } }>
          <div { ...attributes } { ...listeners } style={ { cursor: 'grab', padding: '4px', display: 'flex', alignItems: 'center' } }>
            <Icon icon="menu" size={ 16 } />
          </div>
          <Button
            icon="admin-page"
            label={ __( 'Duplicate', 'mbn-theme' ) }
            onClick={ () => duplicateListItem( rowIndex, index ) }
            isSmall
            style={ { minWidth: 'auto', padding: '4px' } }
          />
          <Button
            icon="trash"
            label={ __( 'Remove', 'mbn-theme' ) }
            onClick={ () => removeListItem( rowIndex, index ) }
            isDestructive
            isSmall
            style={ { minWidth: 'auto', padding: '4px' } }
          />
        </div>

        <strong style={ { display: 'block', marginBottom: '8px', paddingRight: '80px' } }>
          { __( 'Item', 'mbn-theme' ) } { index + 1 }
        </strong>

        { listStyle === 'two-column' ? (
          <Fragment>
            <TextControl
              label={ __( 'Label', 'mbn-theme' ) }
              value={ item.label || '' }
              onChange={ ( value ) => updateListItem( rowIndex, index, { label: value } ) }
            />
            <TextControl
              label={ __( 'URL (Optional)', 'mbn-theme' ) }
              value={ item.url || '' }
              onChange={ ( value ) => updateListItem( rowIndex, index, { url: value } ) }
              help={ __( 'Leave empty for plain text', 'mbn-theme' ) }
            />
          </Fragment>
        ) : (
          <Fragment>
            <TextControl
              label={ __( 'Title', 'mbn-theme' ) }
              value={ item.title || '' }
              onChange={ ( value ) => updateListItem( rowIndex, index, { title: value } ) }
            />
            <TextareaControl
              label={ __( 'Description (Optional)', 'mbn-theme' ) }
              value={ item.description || '' }
              onChange={ ( value ) => updateListItem( rowIndex, index, { description: value } ) }
              rows={ 2 }
            />
          </Fragment>
        ) }
      </div>
    </div>
  );
}

// Sortable Row Component
function SortableRow( { row, index, updateRow, removeRow, duplicateRow, updateParagraph, addParagraph, removeParagraph, updateListItem, addListItem, removeListItem, duplicateListItem, updateParagraphAfterList, addParagraphAfterList, removeParagraphAfterList, sensors } ) {
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
          
          <SelectControl
            label={ __( 'List Style', 'mbn-theme' ) }
            value={ row.listStyle || 'single' }
            options={ [
              { label: __( 'Single Column (Title + Description)', 'mbn-theme' ), value: 'single' },
              { label: __( 'Two Column (Label/Link)', 'mbn-theme' ), value: 'two-column' },
            ] }
            onChange={ ( value ) => updateRow( index, { listStyle: value } ) }
            help={ __( 'Single column shows title + description. Two column shows label + optional link.', 'mbn-theme' ) }
            style={ { marginTop: '8px' } }
          />

          <p style={ { marginTop: '8px', marginBottom: '10px', fontSize: '13px', color: '#666' } }>
            { __( 'Drag and drop to reorder items', 'mbn-theme' ) }
          </p>

          { row.listItems && row.listItems.length > 0 && row.listItems.every( ( item ) => typeof item === 'object' && item.id ) && (
            <DndContext
              sensors={ sensors }
              collisionDetection={ closestCenter }
              onDragEnd={ ( event ) => {
                const { active, over } = event;
                if ( over && active.id !== over.id ) {
                  const oldIndex = row.listItems.findIndex( ( item ) => item.id === active.id );
                  const newIndex = row.listItems.findIndex( ( item ) => item.id === over.id );
                  const newRows = [ ...( row.listItems || [] ) ];
                  const reorderedItems = arrayMove( newRows, oldIndex, newIndex );
                  updateRow( index, { listItems: reorderedItems } );
                }
              } }
            >
              <SortableContext
                items={ row.listItems.map( ( item ) => item.id ) }
                strategy={ verticalListSortingStrategy }
              >
                { row.listItems.map( ( item, lIndex ) => (
                  <SortableListItem
                    key={ item.id }
                    rowIndex={ index }
                    item={ item }
                    index={ lIndex }
                    listStyle={ row.listStyle || 'single' }
                    updateListItem={ updateListItem }
                    removeListItem={ removeListItem }
                    duplicateListItem={ duplicateListItem }
                  />
                ) ) }
              </SortableContext>
            </DndContext>
          ) }

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

  // Ensure all list items have unique IDs and migrate old string format
  const ensureListItemIds = ( items, listStyle ) => {
    return items.map( ( item ) => {
      // If item is a string (old format), convert to object
      if ( typeof item === 'string' ) {
        return {
          id: generateUniqueId(),
          title: item,
          description: '',
          label: '',
          url: '',
        };
      }
      // If item is object but missing id, add it
      if ( ! item.id ) {
        return { ...item, id: generateUniqueId() };
      }
      return item;
    } );
  };

  // Initialize rows with IDs and migrate list items
  useEffect( () => {
    let needsUpdate = false;
    const updatedRows = rows.map( ( row ) => {
      const updates = {};
      
      // Ensure row has ID
      if ( ! row.id ) {
        updates.id = generateUniqueId();
        needsUpdate = true;
      }
      
      // Ensure listStyle exists (default to 'single')
      if ( ! row.listStyle ) {
        updates.listStyle = 'single';
        needsUpdate = true;
      }
      
      // Migrate and ensure list items have IDs
      if ( row.listItems && row.listItems.length > 0 ) {
        const hasStringItems = row.listItems.some( ( item ) => typeof item === 'string' );
        const hasMissingIds = row.listItems.some( ( item ) => typeof item === 'object' && ! item.id );
        
        if ( hasStringItems || hasMissingIds ) {
          updates.listItems = ensureListItemIds( row.listItems, row.listStyle || 'single' );
          needsUpdate = true;
        }
      }
      
      return Object.keys( updates ).length > 0 ? { ...row, ...updates } : row;
    } );
    
    if ( needsUpdate ) {
      setAttributes( { rows: updatedRows } );
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
      listStyle: 'single',
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
  const updateListItem = ( rowIndex, itemIndex, updates ) => {
    const newRows = [ ...rows ];
    const newListItems = [ ...newRows[ rowIndex ].listItems ];
    newListItems[ itemIndex ] = { ...newListItems[ itemIndex ], ...updates };
    newRows[ rowIndex ] = { ...newRows[ rowIndex ], listItems: newListItems };
    setAttributes( { rows: newRows } );
  };

  // Add a list item to a row
  const addListItem = ( rowIndex ) => {
    const newRows = [ ...rows ];
    const listStyle = newRows[ rowIndex ].listStyle || 'single';
    const newItem = listStyle === 'two-column'
      ? { id: generateUniqueId(), title: '', description: '', label: 'New Item', url: '' }
      : { id: generateUniqueId(), title: 'New Item', description: '', label: '', url: '' };
    newRows[ rowIndex ] = {
      ...newRows[ rowIndex ],
      listItems: [ ...newRows[ rowIndex ].listItems, newItem ],
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

  // Duplicate a list item
  const duplicateListItem = ( rowIndex, itemIndex ) => {
    const newRows = [ ...rows ];
    const itemToDuplicate = { ...newRows[ rowIndex ].listItems[ itemIndex ], id: generateUniqueId() };
    const newListItems = [
      ...newRows[ rowIndex ].listItems.slice( 0, itemIndex + 1 ),
      itemToDuplicate,
      ...newRows[ rowIndex ].listItems.slice( itemIndex + 1 ),
    ];
    newRows[ rowIndex ] = { ...newRows[ rowIndex ], listItems: newListItems };
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
                    duplicateListItem={ duplicateListItem }
                    updateParagraphAfterList={ updateParagraphAfterList }
                    addParagraphAfterList={ addParagraphAfterList }
                    removeParagraphAfterList={ removeParagraphAfterList }
                    sensors={ sensors }
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
