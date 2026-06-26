import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Link Component
function SortableLink({ link, columnIndex, linkIndex, updateLink, removeLink, duplicateLink }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '12px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '4px' }}>
            <Icon icon="menu" />
          </div>
          <strong>{__('Link', 'mbn-theme')} {linkIndex + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button
            icon="admin-page"
            label={__('Duplicate', 'mbn-theme')}
            onClick={() => duplicateLink(columnIndex, linkIndex)}
          />
          <Button
            icon="trash"
            label={__('Remove', 'mbn-theme')}
            onClick={() => removeLink(columnIndex, linkIndex)}
          />
        </div>
      </div>

      <TextControl
        label={__('Label', 'mbn-theme')}
        value={link.label}
        onChange={(value) => updateLink(columnIndex, linkIndex, { label: value })}
      />

      <TextControl
        label={__('URL', 'mbn-theme')}
        value={link.url}
        onChange={(value) => updateLink(columnIndex, linkIndex, { url: value })}
      />
    </div>
  );
}

// Sortable Column Component
function SortableColumn({ column, columnIndex, updateColumn, removeColumn, duplicateColumn, updateLink, removeLink, duplicateLink, addLink, reorderLinks }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '20px',
    padding: '16px',
    border: '2px solid #0073aa',
    borderRadius: '4px',
    backgroundColor: '#fff',
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleLinkDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = column.links.findIndex(link => link.id === active.id);
      const newIndex = column.links.findIndex(link => link.id === over.id);
      
      reorderLinks(columnIndex, oldIndex, newIndex);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '5px' }}>
            <Icon icon="menu" />
          </div>
          <strong>{__('Column', 'mbn-theme')} {columnIndex + 1}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            icon="admin-page"
            label={__('Duplicate', 'mbn-theme')}
            onClick={() => duplicateColumn(columnIndex)}
          />
          <Button
            icon="trash"
            label={__('Remove', 'mbn-theme')}
            onClick={() => removeColumn(columnIndex)}
          />
        </div>
      </div>

      <TextControl
        label={__('Column Title', 'mbn-theme')}
        value={column.title}
        onChange={(value) => updateColumn(columnIndex, { title: value })}
        style={{ marginBottom: '16px' }}
      />

      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <strong>{__('Links', 'mbn-theme')}</strong>
          <Button variant="secondary" onClick={() => addLink(columnIndex)} style={{ fontSize: '12px' }}>
            {__('+ Add Link', 'mbn-theme')}
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleLinkDragEnd}
        >
          <SortableContext
            items={column.links.map((link) => link.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.links.map((link, linkIndex) => (
              <SortableLink
                key={link.id}
                link={link}
                columnIndex={columnIndex}
                linkIndex={linkIndex}
                updateLink={updateLink}
                removeLink={removeLink}
                duplicateLink={duplicateLink}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default function Edit({ attributes, setAttributes }) {
  const { servingTitle, servingColumns } = attributes;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateColumn = (columnIndex, updates) => {
    const updatedColumns = [...servingColumns];
    updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], ...updates };
    setAttributes({ servingColumns: updatedColumns });
  };

  const addColumn = () => {
    setAttributes({
      servingColumns: [...servingColumns, {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        title: '',
        links: []
      }]
    });
  };

  const removeColumn = (columnIndex) => {
    const updatedColumns = servingColumns.filter((_, i) => i !== columnIndex);
    setAttributes({ servingColumns: updatedColumns });
  };

  const duplicateColumn = (columnIndex) => {
    const columnToDuplicate = {
      ...servingColumns[columnIndex],
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      links: servingColumns[columnIndex].links.map(link => ({
        ...link,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2)
      }))
    };
    const updatedColumns = [
      ...servingColumns.slice(0, columnIndex + 1),
      columnToDuplicate,
      ...servingColumns.slice(columnIndex + 1)
    ];
    setAttributes({ servingColumns: updatedColumns });
  };

  const updateLink = (columnIndex, linkIndex, updates) => {
    const updatedColumns = [...servingColumns];
    updatedColumns[columnIndex].links[linkIndex] = {
      ...updatedColumns[columnIndex].links[linkIndex],
      ...updates
    };
    setAttributes({ servingColumns: updatedColumns });
  };

  const addLink = (columnIndex) => {
    const updatedColumns = [...servingColumns];
    updatedColumns[columnIndex].links.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      label: '',
      url: '#'
    });
    setAttributes({ servingColumns: updatedColumns });
  };

  const removeLink = (columnIndex, linkIndex) => {
    const updatedColumns = [...servingColumns];
    updatedColumns[columnIndex].links = updatedColumns[columnIndex].links.filter((_, i) => i !== linkIndex);
    setAttributes({ servingColumns: updatedColumns });
  };

  const duplicateLink = (columnIndex, linkIndex) => {
    const updatedColumns = [...servingColumns];
    const linkToDuplicate = {
      ...updatedColumns[columnIndex].links[linkIndex],
      id: Date.now().toString(36) + Math.random().toString(36).slice(2)
    };
    updatedColumns[columnIndex].links.splice(linkIndex + 1, 0, linkToDuplicate);
    setAttributes({ servingColumns: updatedColumns });
  };

  const reorderLinks = (columnIndex, oldIndex, newIndex) => {
    const updatedColumns = [...servingColumns];
    updatedColumns[columnIndex].links = arrayMove(updatedColumns[columnIndex].links, oldIndex, newIndex);
    setAttributes({ servingColumns: updatedColumns });
  };

  const handleColumnDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = servingColumns.findIndex(col => col.id === active.id);
      const newIndex = servingColumns.findIndex(col => col.id === over.id);
      
      setAttributes({
        servingColumns: arrayMove(servingColumns, oldIndex, newIndex),
      });
    }
  };

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Settings', 'mbn-theme')} initialOpen={true}>
          <TextControl
            label={__('Section Title', 'mbn-theme')}
            value={servingTitle}
            onChange={(value) => setAttributes({ servingTitle: value })}
          />
        </PanelBody>

        <PanelBody title={__('Service Area Columns', 'mbn-theme')} initialOpen={true}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder columns', 'mbn-theme')}
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleColumnDragEnd}
          >
            <SortableContext
              items={servingColumns.map((col) => col.id)}
              strategy={verticalListSortingStrategy}
            >
              {servingColumns.map((column, columnIndex) => (
                <SortableColumn
                  key={column.id}
                  column={column}
                  columnIndex={columnIndex}
                  updateColumn={updateColumn}
                  removeColumn={removeColumn}
                  duplicateColumn={duplicateColumn}
                  updateLink={updateLink}
                  removeLink={removeLink}
                  duplicateLink={duplicateLink}
                  addLink={addLink}
                  reorderLinks={reorderLinks}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addColumn} style={{ marginTop: '15px' }}>
            {__('+ Add Column', 'mbn-theme')}
          </Button>
        </PanelBody>
      </InspectorControls>

      <div {...useBlockProps({ className: 'ldp-serving' })}>
        <div className="ldp-container">
          <div className="ldp-serving__header">
            <h2 className="ldp-serving__title">{servingTitle || __('Section Title', 'mbn-theme')}</h2>
          </div>
          <nav className="ldp-serving__columns" aria-label={servingTitle}>
            {servingColumns.map((column, colIndex) => (
              <div key={column.id} className="ldp-serving__col">
                <h4 className="ldp-serving__col-title">{column.title || `Column ${colIndex + 1}`}</h4>
                <ul className="ldp-serving__links">
                  {column.links.map((link, linkIndex) => (
                    <li key={link.id}>
                      <a href={link.url} onClick={(e) => e.preventDefault()}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {link.label || `Link ${linkIndex + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </Fragment>
  );
}
