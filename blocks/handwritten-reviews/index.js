import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import metadata from './block.json';
import './style.css';

const MONTHS = [
{ label: 'January',   value: 'January' },
{ label: 'February',  value: 'February' },
{ label: 'March',     value: 'March' },
{ label: 'April',     value: 'April' },
{ label: 'May',       value: 'May' },
{ label: 'June',      value: 'June' },
{ label: 'July',      value: 'July' },
{ label: 'August',    value: 'August' },
{ label: 'September', value: 'September' },
{ label: 'October',   value: 'October' },
{ label: 'November',  value: 'November' },
{ label: 'December',  value: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from( { length: currentYear - 2018 }, ( _, i ) => {
const y = String( currentYear - i );
return { label: y, value: y };
} );

registerBlockType( metadata.name, {
edit: function Edit( { attributes, setAttributes } ) {
const { accordionItems } = attributes;

const updateItem = ( index, updates ) => {
const next = [ ...accordionItems ];
next[ index ] = { ...next[ index ], ...updates };
setAttributes( { accordionItems: next } );
};

const addItem = () => {
setAttributes( {
accordionItems: [
...accordionItems,
{
id:      Date.now().toString( 36 ) + Math.random().toString( 36 ).slice( 2 ),
heading: 'January ' + currentYear,
month:   'January',
year:    String( currentYear ),
images:  [],
},
],
} );
};

const removeItem = ( index ) => {
setAttributes( { accordionItems: accordionItems.filter( ( _, i ) => i !== index ) } );
};

const duplicateItem = ( index ) => {
const copy = {
...accordionItems[ index ],
id: Date.now().toString( 36 ) + Math.random().toString( 36 ).slice( 2 ),
};
const next = [
...accordionItems.slice( 0, index + 1 ),
copy,
...accordionItems.slice( index + 1 ),
];
setAttributes( { accordionItems: next } );
};

const setMonthYear = ( index, month, year ) => {
updateItem( index, { month, year, heading: month + ' ' + year } );
};

return (
<Fragment>
<InspectorControls>
<PanelBody title={ __( 'Accordion Items', 'mbn-theme' ) } initialOpen={ true }>
{ accordionItems.length === 0 && (
<p style={ { marginBottom: '15px', fontSize: '13px', color: '#666' } }>
{ __( 'No items yet. Click "+ Add Accordion Item" to begin.', 'mbn-theme' ) }
</p>
) }

{ accordionItems.map( ( item, index ) => {
const month = item.month || 'January';
const year  = item.year  || String( currentYear );

return (
<div
key={ item.id }
style={ {
marginBottom: '20px',
padding: '15px',
border: '1px solid #ddd',
borderRadius: '4px',
backgroundColor: '#fff',
} }
>
<div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' } }>
<strong>{ month } { year }</strong>
<div style={ { display: 'flex', gap: '6px' } }>
<Button
icon="admin-page"
label={ __( 'Duplicate', 'mbn-theme' ) }
onClick={ () => duplicateItem( index ) }
/>
<Button
icon="trash"
label={ __( 'Remove', 'mbn-theme' ) }
onClick={ () => removeItem( index ) }
/>
</div>
</div>

<SelectControl
label={ __( 'Month', 'mbn-theme' ) }
value={ month }
options={ MONTHS }
onChange={ ( val ) => setMonthYear( index, val, year ) }
/>

<SelectControl
label={ __( 'Year', 'mbn-theme' ) }
value={ year }
options={ YEARS }
onChange={ ( val ) => setMonthYear( index, month, val ) }
/>

<p style={ { margin: '8px 0 0', fontSize: '12px', color: '#888' } }>
{ __( 'Images are managed via Review Months in wp-admin.', 'mbn-theme' ) }
</p>
</div>
);
} ) }

<Button variant="primary" onClick={ addItem } style={ { marginTop: '10px' } }>
{ __( '+ Add Accordion Item', 'mbn-theme' ) }
</Button>
</PanelBody>
</InspectorControls>

<div { ...useBlockProps() }>
<div className="handwritten-reviews">
<div className="handwritten-reviews__container">
<div
style={ {
padding: '20px',
background: '#f0f0f0',
borderRadius: '4px',
textAlign: 'center',
} }
>
<p style={ { margin: 0, color: '#555' } }>
<strong>{ __( 'Handwritten Reviews Block', 'mbn-theme' ) }</strong>
</p>
{ accordionItems.length > 0 ? (
<ul style={ { margin: '10px 0 0', padding: 0, listStyle: 'none', fontSize: '13px', color: '#666' } }>
{ accordionItems.map( ( item ) => (
<li key={ item.id }>{ item.heading }</li>
) ) }
</ul>
) : (
<p style={ { margin: '8px 0 0', fontSize: '13px', color: '#999' } }>
{ __( 'Content is pulled from Review Months in wp-admin. Add items in the sidebar to label each month.', 'mbn-theme' ) }
</p>
) }
</div>
</div>
</div>
</div>
</Fragment>
);
},

save: () => null,
} );
