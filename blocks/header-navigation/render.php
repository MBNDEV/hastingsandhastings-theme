<?php
/**
 * Header Navigation Block - Complete UI with Mobile Menu
 *
 * @package Hastings_And_Hastings_Theme
 * @param array $attributes Block attributes
 * @param string $content Block content
 * @param WP_Block $block Block instance
 *
 * phpcs:disable WordPress.Files.FileName
 * phpcs:disable Generic.Files.OneObjectStructurePerFile
 */

$button_text     = $attributes['buttonText'] ?? 'REQUEST A FREE CONSULTATION';
$button_url      = $attributes['buttonUrl'] ?? '#';
$main_menu_id    = $attributes['mainMenuId'] ?? 0;
$contact_menu_id = $attributes['contactMenuId'] ?? 0;
$logo_full_url   = $attributes['logoFullUrl'] ?? '';
$logo_mark_url   = $attributes['logoMarkUrl'] ?? '';

// Fallback to theme logos if not set
if ( empty( $logo_full_url ) ) {
  $logo_full_url = get_template_directory_uri() . '/assets/images/logo-header.svg';
}
if ( empty( $logo_mark_url ) ) {
  $logo_mark_url = get_template_directory_uri() . '/assets/images/logo-mark.svg';
}

// Custom Walker for div-based structure matching HTML demo
if ( ! class_exists( 'Header_Nav_Walker' ) ) {
  /**
   * Custom Nav Walker for Desktop Menu
   *
   * Generates div-based structure for mega menus and simple dropdowns.
   */
  class Header_Nav_Walker extends Walker_Nav_Menu {
    /**
     * Starts the list before the elements are added.
     *
     * @param string $output Used to append additional content.
     * @param int    $depth  Depth of menu item.
     * @param array  $args   Menu arguments.
     */
    public function start_lvl( &$output, $depth = 0, $args = null ) {
      if ( 0 === $depth ) {
        // First level submenu - could be mega menu or simple dropdown
        // We'll use mega-menu-wrapper for both, CSS will handle styling
        $output .= '<div class="mega-menu-wrapper"><div class="mega-menu">';
      } elseif ( 1 === $depth ) {
        // Second level - links container (for mega menu columns)
        $output .= '<div class="mega-links">';
      }
    }

    /**
     * Ends the list of after the elements are added.
     *
     * @param string $output Used to append additional content.
     * @param int    $depth  Depth of menu item.
     * @param array  $args   Menu arguments.
     */
    public function end_lvl( &$output, $depth = 0, $args = null ) {
      if ( 0 === $depth ) {
        $output .= '</div></div>'; // Close mega-menu and mega-menu-wrapper
      } elseif ( 1 === $depth ) {
        $output .= '</div>'; // Close mega-links
      }
    }

    /**
     * Starts the element output.
     *
     * @param string   $output Used to append additional content.
     * @param WP_Post  $item   Menu item data object.
     * @param int      $depth  Depth of menu item.
     * @param stdClass $args   Menu arguments.
     * @param int      $id     Current item ID.
     */
    public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
      $classes      = empty( $item->classes ) ? array() : (array) $item->classes;
      $has_children = in_array( 'menu-item-has-children', $classes, true );

      if ( 0 === $depth ) {
        // Top level menu item
        $output .= '<div class="menu-item' . ( $has_children ? '' : ' relative' ) . '">';
        $output .= '<a href="' . esc_url( $item->url ) . '" class="text-text-body hover:text-secondary font-medium text-base flex items-center gap-2' . ( $has_children ? ' has-dropdown' : '' ) . '">';
        $output .= esc_html( $item->title );
        $output .= '</a>';
      } elseif ( 1 === $depth ) {
        // Second level - check if this item has children
        if ( $has_children ) {
          // Has children = mega menu column with header
          $output .= '<div class="mega-column">';
          $output .= '<span class="mega-column-header">' . esc_html( $item->title ) . '</span>';
        } else {
          // No children = simple dropdown link (like Contact menu)
          $output .= '<a href="' . esc_url( $item->url ) . '" class="dropdown-link">' . esc_html( $item->title ) . '</a>';
        }
      } elseif ( 2 === $depth ) {
        // Third level - actual links inside mega menu columns
        $output .= '<a href="' . esc_url( $item->url ) . '">' . esc_html( $item->title ) . '</a>';
      }
    }

    /**
     * Ends the element output, if needed.
     *
     * @param string   $output Used to append additional content.
     * @param WP_Post  $item   Menu item data object.
     * @param int      $depth  Depth of menu item.
     * @param stdClass $args   Menu arguments.
     */
    public function end_el( &$output, $item, $depth = 0, $args = null ) {
      $classes      = empty( $item->classes ) ? array() : (array) $item->classes;
      $has_children = in_array( 'menu-item-has-children', $classes, true );

      if ( 0 === $depth ) {
        $output .= '</div>'; // Close menu-item div
      } elseif ( 1 === $depth && $has_children ) {
        $output .= '</div>'; // Close mega-column div (only for items with children)
      }
      // For depth 1 without children, we just closed the <a> tag, no div to close
    }
  }
}

// Custom Walker for Mobile Menu (two-level accordion structure)
if ( ! class_exists( 'Mobile_Nav_Walker' ) ) {
  /**
   * Custom Nav Walker for Mobile Menu
   *
   * Generates accordion structure for mobile navigation.
   */
  class Mobile_Nav_Walker extends Walker_Nav_Menu {
    /**
     * Whether current item has children.
     *
     * @var bool
     */
    private $current_item_has_children = false;

    /**
     * Submenu counter for unique IDs.
     *
     * @var int
     */
    private $submenu_counter = 0;

    /**
     * Starts the list before the elements are added.
     *
     * @param string $output Used to append additional content.
     * @param int    $depth  Depth of menu item.
     * @param array  $args   Menu arguments.
     */
    public function start_lvl( &$output, $depth = 0, $args = null ) {
      if ( 0 === $depth ) {
        // First level submenu wrapper
        ++$this->submenu_counter;
        $output .= '<div class="mobile-submenu" id="submenu-' . $this->submenu_counter . '">';
      } elseif ( 1 === $depth ) {
        // Second level - content wrapper for category links
        $output .= '<div class="mobile-submenu-content">';
      }
    }

    /**
     * Ends the list of after the elements are added.
     *
     * @param string $output Used to append additional content.
     * @param int    $depth  Depth of menu item.
     * @param array  $args   Menu arguments.
     */
    public function end_lvl( &$output, $depth = 0, $args = null ) {
      if ( 0 === $depth ) {
        $output .= '</div>'; // Close mobile-submenu
      } elseif ( 1 === $depth ) {
        $output .= '</div>'; // Close mobile-submenu-content
      }
    }

    /**
     * Starts the element output.
     *
     * @param string   $output Used to append additional content.
     * @param WP_Post  $item   Menu item data object.
     * @param int      $depth  Depth of menu item.
     * @param stdClass $args   Menu arguments.
     * @param int      $id     Current item ID.
     */
    public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
      $classes      = empty( $item->classes ) ? array() : (array) $item->classes;
      $has_children = in_array( 'menu-item-has-children', $classes, true );

      if ( 0 === $depth ) {
        // Top level - Practice Areas, Locations, etc.
        $output .= '<div class="mobile-menu-item">';
        $output .= '<a href="' . esc_url( $item->url ) . '" class="mobile-menu-link"' . ( $has_children ? ' data-submenu="' . $this->submenu_counter . '"' : '' ) . '>';
        $output .= esc_html( $item->title );
        if ( $has_children ) {
          $output .= '<span class="mobile-chevron"></span>';
        }
        $output .= '</a>';

        $this->current_item_has_children = $has_children;
      } elseif ( 1 === $depth ) {
        // Second level - Category headers (Vehicle Accidents, Phoenix Area, etc.)
        if ( $has_children ) {
          // This is a category header with links underneath
          $category_id = sanitize_title( $item->title );
          $output     .= '<div class="mobile-submenu-header" data-category="' . $category_id . '">';
          $output     .= esc_html( $item->title );
          $output     .= '<span class="mobile-chevron-small"></span>';
          $output     .= '</div>';
          // The content wrapper will be opened in start_lvl
        } else {
          // Simple link without children (for simple dropdowns like About, Contact)
          $output .= '<a href="' . esc_url( $item->url ) . '">' . esc_html( $item->title ) . '</a>';
        }
      } elseif ( 2 === $depth ) {
        // Third level - Actual links (Car Accidents, Phoenix, etc.)
        $output .= '<a href="' . esc_url( $item->url ) . '">' . esc_html( $item->title ) . '</a>';
      }
    }

    /**
     * Ends the element output, if needed.
     *
     * @param string   $output Used to append additional content.
     * @param WP_Post  $item   Menu item data object.
     * @param int      $depth  Depth of menu item.
     * @param stdClass $args   Menu arguments.
     */
    public function end_el( &$output, $item, $depth = 0, $args = null ) {
      if ( 0 === $depth ) {
        $output .= '</div>'; // Close mobile-menu-item
      }
      // For depth 1 and 2, we only close the <a> or header tags, no divs needed here
    }
  }
}

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class' => 'header-navigation-wrapper header-nav',
	  'id'    => 'site-header',
  )
);
?>

<header <?php echo wp_kses_post( $wrapper_attributes ); ?>>
  <!-- Desktop Header Container -->
  <div class="header-container">
    
    <!-- Logo -->
    <div class="header-logo">
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo-link">
        <!-- Full Logo (Default State) -->
        <img 
          src="<?php echo esc_url( $logo_full_url ); ?>" 
          alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>"
          class="logo-full"
        />
        <!-- Compact Logo (Sticky State) -->
        <img 
          src="<?php echo esc_url( $logo_mark_url ); ?>" 
          alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>"
          class="logo-mark"
        />
      </a>
    </div>

    <!-- Mobile Menu Toggle -->
    <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="<?php esc_attr_e( 'Toggle Menu', 'mbn-theme' ); ?>">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Navigation Container (Desktop) -->
    <div class="desktop-nav-container">
      
      <!-- Main Menu -->
      <?php if ( $main_menu_id > 0 ) : ?>
        <nav class="flex items-center" aria-label="<?php esc_attr_e( 'Main Navigation', 'mbn-theme' ); ?>">
          <?php
          wp_nav_menu(
            array(
				'menu'        => $main_menu_id,
				'container'   => false,
				'items_wrap'  => '%3$s',
				'fallback_cb' => false,
				'walker'      => new Header_Nav_Walker(),
            )
          );
          ?>
        </nav>
      <?php endif; ?>

      <div class="contact-cta-wrapper">
        <!-- Contact Menu -->
        <?php if ( $contact_menu_id > 0 ) : ?>
          <div class="flex flex-row items-center gap-8">
            <?php
            wp_nav_menu(
              array(
				  'menu'        => $contact_menu_id,
				  'container'   => false,
				  'items_wrap'  => '%3$s',
				  'fallback_cb' => false,
				  'walker'      => new Header_Nav_Walker(),
				  'depth'       => 2,
              )
            );
            ?>
          </div>
        <?php endif; ?>

        <!-- CTA Button -->
        <a href="<?php echo esc_url( $button_url ); ?>" class="btn-cta">
          <?php echo esc_html( $button_text ); ?>
        </a>
      </div>
    </div>
  </div>
</header>

<!-- Mobile Menu Overlay -->
<div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>

<!-- Mobile Menu Drawer -->
<div class="mobile-menu-drawer" id="mobile-menu-drawer">
  <!-- Close Button -->
  <button class="mobile-menu-close" id="mobile-menu-close" aria-label="<?php esc_attr_e( 'Close Menu', 'mbn-theme' ); ?>">
    <span></span>
    <span></span>
  </button>

  <!-- Mobile Menu Content -->
  <?php
  // Mobile menu uses the same main menu with custom walker for accordion structure
  if ( $main_menu_id > 0 ) {
    wp_nav_menu(
      array(
		  'menu'        => $main_menu_id,
		  'container'   => false,
		  'items_wrap'  => '%3$s',
		  'fallback_cb' => false,
		  'walker'      => new Mobile_Nav_Walker(),
      )
    );
  } elseif ( current_user_can( 'edit_theme_options' ) ) {
    // Fallback message for admins
    echo '<div style="padding: 20px; text-align: center; color: #666;">';
    echo '<p>' . esc_html__( '⚠️ Main menu not set up.', 'mbn-theme' ) . '</p>';
    echo '<p style="font-size: 14px;">' . esc_html__( 'Please select a Main Menu in the block settings.', 'mbn-theme' ) . '</p>';
    echo '</div>';
  }
  ?>

  <!-- Mobile CTA Button -->
  <div class="mobile-cta">
    <a href="<?php echo esc_url( $button_url ); ?>" class="btn-cta">
      <?php echo esc_html( $button_text ); ?>
    </a>
  </div>
</div>

<!-- Header Spacer -->
<!-- <div class="header-spacer"></div> -->
