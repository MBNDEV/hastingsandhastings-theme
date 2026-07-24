import { useBlockProps, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, TextareaControl, ToggleControl, Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Generate a unique ID (compatible with all browsers)
function generateUniqueId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice (2, 11);
}

// Sortable Social Media Item
function SortableSocialItem({ item, index, updateItem, removeItem, duplicateItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '5px' }}>
            <Icon icon="menu" />
          </div>
          <strong>{item.label || `Social ${index + 1}`}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            icon="admin-page"
            label={__('Duplicate', 'mbn-theme')}
            onClick={() => duplicateItem(index)}
          />
          <Button 
            icon="trash"
            label={__('Remove', 'mbn-theme')}
            onClick={() => removeItem(index)}
          />
        </div>
      </div>

      <TextControl
        label={__('Label', 'mbn-theme')}
        value={item.label}
        onChange={(value) => updateItem(index, { label: value })}
        placeholder="e.g., LinkedIn"
      />

      <TextControl
        label={__('URL', 'mbn-theme')}
        value={item.url}
        onChange={(value) => updateItem(index, { url: value })}
        placeholder="https://"
      />

      <MediaUpload
        onSelect={(media) => updateItem(index, { iconUrl: media.url, iconId: media.id })}
        allowedTypes={['image']}
        value={item.iconId}
        render={({ open }) => (
          <div>
            <Button onClick={open} variant="secondary" style={{ marginTop: '10px' }}>
              {item.iconUrl ? __('Replace Icon', 'mbn-theme') : __('Select Icon', 'mbn-theme')}
            </Button>
            {item.iconUrl && (
              <img src={item.iconUrl} alt="" style={{ marginTop: '10px', maxWidth: '50px', height: 'auto' }} />
            )}
          </div>
        )}
      />
    </div>
  );
}

// Sortable Footer Bottom Link Item
function SortableLinkItem({ item, index, updateItem, removeItem, duplicateItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '5px' }}>
            <Icon icon="menu" />
          </div>
          <strong>{item.text || `Link ${index + 1}`}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            icon="admin-page"
            label={__('Duplicate', 'mbn-theme')}
            onClick={() => duplicateItem(index)}
          />
          <Button
            icon="trash"
            label={__('Remove', 'mbn-theme')}
            onClick={() => removeItem(index)}
          />
        </div>
      </div>

      <TextControl
        label={__('Link Text', 'mbn-theme')}
        value={item.text}
        onChange={(value) => updateItem(index, { text: value })}
        placeholder="e.g., Privacy Policy"
      />

      <TextControl
        label={__('URL', 'mbn-theme')}
        value={item.url}
        onChange={(value) => updateItem(index, { url: value })}
        placeholder="/privacy-policy/"
        type="url"
      />

      <ToggleControl
        label={__('Open in new tab', 'mbn-theme')}
        checked={!!item.openInNewTab}
        onChange={(value) => updateItem(index, { openInNewTab: value })}
      />
    </div>
  );
}

export default function Edit({ attributes, setAttributes }) {
  const { locationsMenuId, practiceAreasMenuId, mainFooterMenuId, locationsButtonText, locationsButtonUrl, practiceAreasButtonText, practiceAreasButtonUrl, footerLogoUrl, footerLogoId, footerLogoLinkUrl, footerTagline, socialMedia, copyrightText, footerBottomLinks, mobileContactUrl, mobilePhoneNumber } = attributes;
  
  const [menus, setMenus] = useState([]);

  // Fetch available menus
  useEffect(() => {
    wp.apiFetch({ path: '/wp/v2/menus' }).then((data) => {
      setMenus(data || []);
    }).catch(() => {
      setMenus([]);
    });
  }, []);

  const menuOptions = [
    { label: __('Select a menu...', 'mbn-theme'), value: 0 },
    ...menus.map((menu) => ({ label: menu.name, value: menu.id })),
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateSocialItem = (index, updates) => {
    const updatedItems = [...socialMedia];
    updatedItems[index] = { ...updatedItems[index], ...updates };
    setAttributes({ socialMedia: updatedItems });
  };

  const addSocialItem = () => {
    setAttributes({
      socialMedia: [...socialMedia, { 
        id: generateUniqueId(), 
        label: '', 
        url: '', 
        iconUrl: '', 
        iconId: 0 
      }]
    });
  };

  const removeSocialItem = (index) => {
    const updatedItems = socialMedia.filter((_, i) => i !== index);
    setAttributes({ socialMedia: updatedItems });
  };

  const duplicateSocialItem = (index) => {
    const itemToDuplicate = { ...socialMedia[index], id: generateUniqueId() };
    const updatedItems = [
      ...socialMedia.slice(0, index + 1),
      itemToDuplicate,
      ...socialMedia.slice(index + 1)
    ];
    setAttributes({ socialMedia: updatedItems });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = socialMedia.findIndex(item => item.id === active.id);
      const newIndex = socialMedia.findIndex(item => item.id === over.id);

      setAttributes({
        socialMedia: arrayMove(socialMedia, oldIndex, newIndex),
      });
    }
  };

  const updateBottomLink = (index, updates) => {
    const updatedItems = [...footerBottomLinks];
    updatedItems[index] = { ...updatedItems[index], ...updates };
    setAttributes({ footerBottomLinks: updatedItems });
  };

  const addBottomLink = () => {
    setAttributes({
      footerBottomLinks: [...footerBottomLinks, {
        id: generateUniqueId(),
        text: '',
        url: '',
        openInNewTab: false,
      }]
    });
  };

  const removeBottomLink = (index) => {
    const updatedItems = footerBottomLinks.filter((_, i) => i !== index);
    setAttributes({ footerBottomLinks: updatedItems });
  };

  const duplicateBottomLink = (index) => {
    const itemToDuplicate = { ...footerBottomLinks[index], id: generateUniqueId() };
    const updatedItems = [
      ...footerBottomLinks.slice(0, index + 1),
      itemToDuplicate,
      ...footerBottomLinks.slice(index + 1)
    ];
    setAttributes({ footerBottomLinks: updatedItems });
  };

  const handleBottomLinkDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = footerBottomLinks.findIndex(item => item.id === active.id);
      const newIndex = footerBottomLinks.findIndex(item => item.id === over.id);

      setAttributes({
        footerBottomLinks: arrayMove(footerBottomLinks, oldIndex, newIndex),
      });
    }
  };

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Menu Settings', 'mbn-theme')} initialOpen={true}>
          <SelectControl
            label={__('Locations Menu', 'mbn-theme')}
            value={locationsMenuId}
            options={menuOptions}
            onChange={(value) => setAttributes({ locationsMenuId: parseInt(value) })}
            help={__('Select the menu for locations section', 'mbn-theme')}
          />
          
          <SelectControl
            label={__('Practice Areas Menu', 'mbn-theme')}
            value={practiceAreasMenuId}
            options={menuOptions}
            onChange={(value) => setAttributes({ practiceAreasMenuId: parseInt(value) })}
            help={__('Select the menu for practice areas section', 'mbn-theme')}
          />
          
          <SelectControl
            label={__('Main Footer Menu', 'mbn-theme')}
            value={mainFooterMenuId}
            options={menuOptions}
            onChange={(value) => setAttributes({ mainFooterMenuId: parseInt(value) })}
            help={__('Select the menu for footer navigation (About Us, Stay Informed, etc.)', 'mbn-theme')}
          />
        </PanelBody>

        <PanelBody title={__('View All Buttons', 'mbn-theme')}>
          <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '14px', fontWeight: '600' }}>
            {__('Locations Button', 'mbn-theme')}
          </h4>
          <TextControl
            label={__('Button Text', 'mbn-theme')}
            value={locationsButtonText}
            onChange={(value) => setAttributes({ locationsButtonText: value })}
            placeholder="VIEW ALL LOCATIONS"
          />
          <TextControl
            label={__('Button URL', 'mbn-theme')}
            value={locationsButtonUrl}
            onChange={(value) => setAttributes({ locationsButtonUrl: value })}
            placeholder="https://"
            type="url"
          />

          <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid #ddd' }} />

          <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '14px', fontWeight: '600' }}>
            {__('Practice Areas Button', 'mbn-theme')}
          </h4>
          <TextControl
            label={__('Button Text', 'mbn-theme')}
            value={practiceAreasButtonText}
            onChange={(value) => setAttributes({ practiceAreasButtonText: value })}
            placeholder="VIEW ALL PRACTICE AREAS"
          />
          <TextControl
            label={__('Button URL', 'mbn-theme')}
            value={practiceAreasButtonUrl}
            onChange={(value) => setAttributes({ practiceAreasButtonUrl: value })}
            placeholder="https://"
            type="url"
          />
        </PanelBody>

        <PanelBody title={__('Footer Logo & Tagline', 'mbn-theme')}>
          <MediaUpload
            onSelect={(media) => setAttributes({ footerLogoUrl: media.url, footerLogoId: media.id })}
            allowedTypes={['image']}
            value={footerLogoId}
            render={({ open }) => (
              <div>
                <Button onClick={open} variant="primary">
                  {footerLogoUrl ? __('Replace Logo', 'mbn-theme') : __('Select Logo', 'mbn-theme')}
                </Button>
                {footerLogoUrl && (
                  <img src={footerLogoUrl} alt="" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }} />
                )}
              </div>
            )}
          />

          <TextControl
            label={__('Logo Link URL', 'mbn-theme')}
            value={footerLogoLinkUrl}
            onChange={(value) => setAttributes({ footerLogoLinkUrl: value })}
            placeholder="/"
            type="url"
            style={{ marginTop: '15px' }}
          />

          <TextareaControl
            label={__('Footer Tagline', 'mbn-theme')}
            value={footerTagline}
            onChange={(value) => setAttributes({ footerTagline: value })}
            rows={3}
            style={{ marginTop: '15px' }}
          />
        </PanelBody>

        <PanelBody title={__('Social Media Links', 'mbn-theme')}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Drag and drop to reorder social media icons', 'mbn-theme')}
          </p>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={socialMedia.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {socialMedia.map((item, index) => (
                <SortableSocialItem
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={updateSocialItem}
                  removeItem={removeSocialItem}
                  duplicateItem={duplicateSocialItem}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addSocialItem} style={{ marginTop: '15px' }}>
            {__('+ Add Social Media', 'mbn-theme')}
          </Button>
        </PanelBody>

        <PanelBody title={__('Copyright', 'mbn-theme')}>
          <TextControl
            label={__('Copyright Text', 'mbn-theme')}
            value={copyrightText}
            onChange={(value) => setAttributes({ copyrightText: value })}
          />
        </PanelBody>

        <PanelBody title={__('Footer Bottom Links', 'mbn-theme')}>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            {__('Links shown inline with the copyright text, separated by "|". Drag and drop to reorder.', 'mbn-theme')}
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleBottomLinkDragEnd}
          >
            <SortableContext
              items={footerBottomLinks.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {footerBottomLinks.map((item, index) => (
                <SortableLinkItem
                  key={item.id}
                  item={item}
                  index={index}
                  updateItem={updateBottomLink}
                  removeItem={removeBottomLink}
                  duplicateItem={duplicateBottomLink}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button variant="primary" onClick={addBottomLink} style={{ marginTop: '15px' }}>
            {__('+ Add Link', 'mbn-theme')}
          </Button>
        </PanelBody>

        <PanelBody title={__('Mobile Sticky Banner', 'mbn-theme')} initialOpen={false}>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
            {__('Configure the sticky banner displayed at the bottom on mobile devices only.', 'mbn-theme')}
          </p>
          <TextControl
            label={__('Contact Page URL', 'mbn-theme')}
            value={mobileContactUrl}
            onChange={(value) => setAttributes({ mobileContactUrl: value })}
            help={__('URL for the contact icon button (default: /contact-us/)', 'mbn-theme')}
          />
          <TextControl
            label={__('Phone Number', 'mbn-theme')}
            value={mobilePhoneNumber}
            onChange={(value) => setAttributes({ mobilePhoneNumber: value })}
            help={__('Phone number displayed on the call button', 'mbn-theme')}
          />
        </PanelBody>
      </InspectorControls>

      <div {...useBlockProps()}>
        <div style={{ padding: '20px', backgroundColor: '#13263E', color: '#fff', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{__('Site Footer Block', 'mbn-theme')}</h3>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
            {__('Configure footer menus, logo, social media, and copyright in the sidebar settings →', 'mbn-theme')}
          </p>
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
            <strong>{__('Configured:', 'mbn-theme')}</strong>
            <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '13px' }}>
              <li>{locationsMenuId ? `✓ Locations Menu` : '○ Locations Menu'}</li>
              <li>{practiceAreasMenuId ? `✓ Practice Areas Menu` : '○ Practice Areas Menu'}</li>
              <li>{mainFooterMenuId ? `✓ Main Footer Menu` : '○ Main Footer Menu'}</li>
              <li>{footerLogoUrl ? `✓ Footer Logo` : '○ Footer Logo'}</li>
              <li>{socialMedia.length > 0 ? `✓ ${socialMedia.length} Social Media Links` : '○ Social Media Links'}</li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
