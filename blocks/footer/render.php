<?php
/**
 * Site Footer Block - Dynamic Rendering
 *
 * @package CustomTheme
 *
 * @param array    $attributes Block attributes
 * @param string   $content Block content
 * @param WP_Block $block Block instance
 */

$locations_menu_id          = $attributes['locationsMenuId'] ?? 0;
$practice_areas_menu_id     = $attributes['practiceAreasMenuId'] ?? 0;
$main_footer_menu_id        = $attributes['mainFooterMenuId'] ?? 0;
$locations_button_text      = $attributes['locationsButtonText'] ?? 'VIEW ALL LOCATIONS';
$locations_button_url       = $attributes['locationsButtonUrl'] ?? '#';
$practice_areas_button_text = $attributes['practiceAreasButtonText'] ?? 'VIEW ALL PRACTICE AREAS';
$practice_areas_button_url  = $attributes['practiceAreasButtonUrl'] ?? '#';
$footer_logo_url            = $attributes['footerLogoUrl'] ?? '';
$footer_tagline             = $attributes['footerTagline'] ?? '';
$social_media               = $attributes['socialMedia'] ?? array();
$copyright_text             = $attributes['copyrightText'] ?? '';
$mobile_contact_url         = $attributes['mobileContactUrl'] ?? '/contact-us/';
$mobile_phone_number        = $attributes['mobilePhoneNumber'] ?? '(480) 418-2483';
$footer_padding_bottom      = ( ! empty( $mobile_contact_url ) || ! empty( $mobile_phone_number ) ) ? 'pb-24 lg:pb-0' : '';

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'bg-footer-bg text-footer-text ' . esc_attr( $footer_padding_bottom ),
  )
);

if ( ! function_exists( 'build_footer_menu_tree' ) ) {
	/**
	 * Build hierarchical menu tree from flat menu items array
	 *
	 * @param array $menu_items Array of menu item objects.
	 * @return array Hierarchical menu tree.
	 */
  function build_footer_menu_tree( $menu_items ) {
      $menu_tree = array();

      // First pass: collect all parent items
    foreach ( $menu_items as $item ) {
      if ( 0 === (int) $item->menu_item_parent ) {
        $menu_tree[ $item->ID ] = array(
            'item'     => $item,
            'children' => array(),
        );
      }
    }

      // Second pass: attach children to parents
    foreach ( $menu_items as $item ) {
        $parent = (int) $item->menu_item_parent;
      if ( 0 !== $parent && isset( $menu_tree[ $parent ] ) ) {
          $menu_tree[ $parent ]['children'][] = $item;
      }
    }

      return $menu_tree;
  }
}

if ( ! function_exists( 'render_footer_menu_column' ) ) {
	/**
	 * Render a single footer menu column
	 *
	 * @param object $parent_item     Parent menu item.
	 * @param array  $children        Child menu items.
	 * @param string $container_class CSS class for container div.
	 * @param string $links_class     CSS class for links div.
	 */
  function render_footer_menu_column( $parent_item, $children, $container_class, $links_class ) {
    ?>
		<div class="<?php echo esc_attr( $container_class ); ?> flex flex-col flex-[0_1_260px] min-w-[200px] max-w-[300px] self-start">
			<span class="font-body text-base font-semibold text-footer-link-blue no-underline mb-4 block p-0">
              <?php echo esc_html( $parent_item->title ); ?>
			</span>
          <?php if ( ! empty( $children ) ) : ?>
				<div class="<?php echo esc_attr( $links_class ); ?> flex flex-col gap-2">
					<?php
					foreach ( $children as $child ) :
						$item_classes = ! empty( $child->classes ) ? implode( ' ', array_filter( $child->classes ) ) : '';
						$base_classes = 'flex items-center gap-3 py-1 font-body text-[15px] font-normal text-white no-underline transition-all duration-200 cursor-pointer hover:text-secondary';
						$all_classes  = trim( $base_classes . ' ' . $item_classes );
                      ?>
						<a href="<?php echo esc_url( $child->url ); ?>" class="<?php echo esc_attr( $all_classes ); ?>">
							<?php echo esc_html( $child->title ); ?>
						</a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
		<?php
  }
}

if ( ! function_exists( 'render_footer_menu' ) ) {
	/**
	 * Render a WordPress menu with custom walker
	 *
	 * @param int    $menu_id        Menu ID to render.
	 * @param string $container_class CSS class for container div.
	 * @param string $links_class     CSS class for links div.
	 */
  function render_footer_menu( $menu_id, $container_class = 'footer-column', $links_class = 'footer-links' ) {
    if ( ! $menu_id ) {
        return;
    }

      $menu_items = wp_get_nav_menu_items( $menu_id );
    if ( ! $menu_items ) {
        return;
    }

      $menu_tree = build_footer_menu_tree( $menu_items );

    foreach ( $menu_tree as $branch ) {
        render_footer_menu_column(
          $branch['item'],
          $branch['children'],
          $container_class,
          $links_class
        );
    }
  }
}
?>

<footer <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  
  <!-- Locations & Practice Areas Section -->
  <div class="border-b border-white border-opacity-10">
    <div class="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-12 lg:py-16">
      
      <!-- Locations Section -->
      <?php if ( $locations_menu_id ) : ?>
        <div class="mb-12 lg:mb-16">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h3 class="text-2xl font-bold text-white font-heading"><?php echo esc_html__( 'Locations', 'mbn-theme' ); ?></h3>
            <a href="<?php echo esc_url( $locations_button_url ); ?>" class="hidden sm:inline-flex items-center justify-center py-3 px-6 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-all duration-300 cursor-pointer no-underline text-white rounded-full border border-white/30 bg-transparent hover:bg-white/10 hover:border-white/50">
              <?php echo esc_html( $locations_button_text ); ?>
            </a>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <?php render_footer_menu( $locations_menu_id ); ?>
          </div>
          
          <div class="flex sm:hidden flex-row items-center justify-center mt-8 mb-8 gap-4">
            <a href="<?php echo esc_url( $locations_button_url ); ?>" class="inline-flex items-center justify-center py-3 px-6 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-all duration-300 cursor-pointer no-underline text-white rounded-full border border-white/30 bg-transparent hover:bg-white/10 hover:border-white/50 w-full">
              <?php echo esc_html( $locations_button_text ); ?>
            </a>
          </div>
        </div>
      <?php endif; ?>

      <!-- Practice Areas Section -->
      <?php if ( $practice_areas_menu_id ) : ?>
        <div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h3 class="text-2xl font-bold text-white font-heading"><?php echo esc_html__( 'Practice Areas', 'mbn-theme' ); ?></h3>
            <a href="<?php echo esc_url( $practice_areas_button_url ); ?>" class="hidden sm:inline-flex items-center justify-center py-3 px-6 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-all duration-300 cursor-pointer no-underline text-white rounded-full border border-white/30 bg-transparent hover:bg-white/10 hover:border-white/50">
              <?php echo esc_html( $practice_areas_button_text ); ?>
            </a>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <?php render_footer_menu( $practice_areas_menu_id ); ?>
          </div>
          
          <div class="flex sm:hidden flex-row items-center justify-center mt-8 gap-4">
            <a href="<?php echo esc_url( $practice_areas_button_url ); ?>" class="inline-flex items-center justify-center py-3 px-6 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-all duration-300 cursor-pointer no-underline text-white rounded-full border border-white/30 bg-transparent hover:bg-white/10 hover:border-white/50 w-full">
              <?php echo esc_html( $practice_areas_button_text ); ?>
            </a>
          </div>
        </div>
      <?php endif; ?>

    </div>
  </div>

  <!-- Bottom Footer Section -->
  <div class="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-12">
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
      
      <!-- Logo & Tagline (50% width) -->
      <div class="w-full">
        <div class="max-w-[430px]">
          <?php if ( $footer_logo_url ) : ?>
            <div class="mb-6">
              <img 
                src="<?php echo esc_url( $footer_logo_url ); ?>" 
                alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>"
                class="w-full h-auto"
              />
            </div>
          <?php endif; ?>
          
          <?php if ( $footer_tagline ) : ?>
            <p class="text-sm text-white opacity-80 leading-relaxed">
              <?php echo esc_html( $footer_tagline ); ?>
            </p>
          <?php endif; ?>
        </div>
      </div>

      <!-- Main Footer Menu (50% width) -->
      <?php if ( $main_footer_menu_id ) : ?>
        <div class="w-full">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <?php render_footer_menu( $main_footer_menu_id, 'footer-column', 'footer-links footer-links-small' ); ?>
          </div>
          
          <!-- Social Media Icons -->
          <?php if ( ! empty( $social_media ) ) : ?>
            <div class="flex items-center justify-start sm:justify-center lg:justify-end mt-6 gap-4">
              <?php foreach ( $social_media as $social ) : ?>
                <?php if ( ! empty( $social['url'] ) && ! empty( $social['iconUrl'] ) ) : ?>
                  <a href="<?php echo esc_url( $social['url'] ); ?>" class="w-6 h-6 flex items-center justify-center bg-transparent rounded transition-all duration-300 text-white hover:bg-white/10" aria-label="<?php echo esc_attr( $social['label'] ); ?>" target="_blank" rel="noopener noreferrer">
                    <img src="<?php echo esc_url( $social['iconUrl'] ); ?>" alt="<?php echo esc_attr( $social['label'] ); ?>" class="w-full h-full" />
                  </a>
                <?php endif; ?>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>
        </div>
      <?php endif; ?>

    </div>

    <div class="border-t border-white border-opacity-10 pt-8">
      

      <?php if ( $copyright_text ) : ?>
        <p class="text-sm text-white opacity-60 text-center">
          <?php echo esc_html( $copyright_text ); ?>
        </p>
      <?php endif; ?>
    </div>

  </div>

  <!-- Mobile Sticky Banner -->
  <?php if ( ! empty( $mobile_contact_url ) || ! empty( $mobile_phone_number ) ) : ?>
  <div class="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
    <div class="flex items-center justify-center gap-5 py-4 px-4">
      <!-- Contact Icon Button -->
      <?php if ( ! empty( $mobile_contact_url ) ) : ?>
        <a 
          href="<?php echo esc_url( $mobile_contact_url ); ?>" 
          class="flex items-center justify-center w-14 h-14 rounded-full border-2 border-primary bg-text-heading text-white hover:bg-white hover:text-footer-bg transition-all duration-300"
          aria-label="<?php esc_attr_e( 'Contact Us', 'mbn-theme' ); ?>"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </a>
      <?php endif; ?>
      <!-- Phone Number Button -->
      <?php if ( ! empty( $mobile_phone_number ) ) : ?>
        <a 
          href="tel:<?php echo esc_attr( preg_replace( '/[^0-9]/', '', $mobile_phone_number ) ); ?>" 
          class="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-secondary text-white font-bold text-base rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-lg"
          aria-label="<?php esc_attr_e( 'Call us', 'mbn-theme' ); ?>"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          <span><?php echo esc_html( $mobile_phone_number ); ?></span>
        </a>
      <?php endif; ?>
    </div>
  </div>
  <?php endif; ?>
</footer>
