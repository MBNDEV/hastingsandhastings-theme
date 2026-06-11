import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import BackgroundColorControl from '../shared/BackgroundColorControl';
import './editor.css';

export default function Edit( { attributes, setAttributes } ) {
  const {
    backgroundColor,
    heading,
    paragraph,
    imageUrl,
    imageId,
    swapColumns,
  } = attributes;

  const isCustomColor = backgroundColor && backgroundColor.startsWith( '#' );
  const bgStyle = isCustomColor ? { backgroundColor } : {};
  const bgClass = isCustomColor ? '' : backgroundColor;

  // Text col: order-2 on mobile (below image), lg:order-1 normally or lg:order-2 when swapped
  // Image col: order-1 on mobile (always on top), lg:order-2 normally or lg:order-1 when swapped
  const textColClass = swapColumns
    ? 'order-2 lg:order-2'
    : 'order-2 lg:order-1';

  const imageColClass = swapColumns
    ? 'order-1 lg:order-1'
    : 'order-1 lg:order-2';

  const gridClass = swapColumns
    ? 'section-text-image-split__grid grid grid-cols-1 lg:grid-cols-[65%_35%] gap-24 items-center'
    : 'section-text-image-split__grid grid grid-cols-1 lg:grid-cols-[35%_65%] gap-24 items-center';

  const blockProps = useBlockProps( {
    className: `section-text-image-split py-12 md:py-16 lg:py-20 ${ bgClass }`,
    style: bgStyle,
  } );

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={ __( 'Background', 'mbn-theme' ) } initialOpen={ true }>
          <BackgroundColorControl
            value={ backgroundColor }
            onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
            defaultValue="bg-white"
            label={ __( 'Section Background', 'mbn-theme' ) }
          />
        </PanelBody>

        <PanelBody title={ __( 'Layout', 'mbn-theme' ) } initialOpen={ true }>
          <ToggleControl
            label={ __( 'Swap columns (image left, text right)', 'mbn-theme' ) }
            help={ __( 'On mobile the image always stacks on top regardless of this setting.', 'mbn-theme' ) }
            checked={ swapColumns }
            onChange={ ( value ) => setAttributes( { swapColumns: value } ) }
          />
        </PanelBody>

        <PanelBody title={ __( 'Image', 'mbn-theme' ) } initialOpen={ false }>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={ ( media ) => setAttributes( { imageUrl: media.url, imageId: media.id } ) }
              allowedTypes={ [ 'image' ] }
              value={ imageId }
              render={ ( { open } ) => (
                <div>
                  <Button onClick={ open } variant="secondary">
                    { imageUrl ? __( 'Replace Image', 'mbn-theme' ) : __( 'Select Image', 'mbn-theme' ) }
                  </Button>
                  { imageUrl && (
                    <img
                      src={ imageUrl }
                      alt=""
                      style={ { marginTop: '10px', maxWidth: '100%', height: 'auto', borderRadius: '4px' } }
                    />
                  ) }
                </div>
              ) }
            />
          </MediaUploadCheck>
        </PanelBody>
      </InspectorControls>

      <section { ...blockProps }>
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-12">
          <div className={ gridClass }>

            {/* Text column — order-2 on mobile, swaps on desktop */}
            <div className={ `${ textColClass } text-center lg:text-left` }>
              <RichText
                tagName="h3"
                value={ heading }
                onChange={ ( value ) => setAttributes( { heading: value } ) }
                placeholder={ __( 'Enter heading…', 'mbn-theme' ) }
                className="section-text-image-split__heading font-heading font-semibold text-h3 leading-[40px] text-text-heading"
              />
              <RichText
                tagName="p"
                value={ paragraph }
                onChange={ ( value ) => setAttributes( { paragraph: value } ) }
                placeholder={ __( 'Enter paragraph…', 'mbn-theme' ) }
                className="section-text-image-split__paragraph font-body font-normal text-lg leading-7 text-text-body mt-4"
              />
            </div>

            {/* Image column — order-1 on mobile (always top) */}
            <div className={ imageColClass }>
              { imageUrl ? (
                <img
                  src={ imageUrl }
                  alt=""
                  className="section-text-image-split__image w-full h-auto rounded-2xl object-cover"
                />
              ) : (
                <div className="flex min-h-[260px] items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-500">
                  { __( 'Select an image in the sidebar →', 'mbn-theme' ) }
                </div>
              ) }
            </div>

          </div>
        </div>
      </section>
    </Fragment>
  );
}
