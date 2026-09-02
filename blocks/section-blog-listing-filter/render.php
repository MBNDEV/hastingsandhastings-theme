<?php
/**
 * Blog Listing with Filter Block - Server-side rendering
 *
 * @param array $attributes Block attributes
 * @package MBN_Theme
 */

$posts_per_page     = $attributes['postsPerPage'] ?? 12;
$selected_post_type = $attributes['postType'] ?? 'post';
$current_page       = get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1;

// custom_theme_is_spanish_context() is the theme's single source of truth for
// the Spanish posts page (see inc/includes-spanish-post-cpt.php) — reused here
// so this block's own copy matches the lang attribute/SEO overrides already
// applied elsewhere for that page.
$is_spanish_context = function_exists( 'custom_theme_is_spanish_context' ) && custom_theme_is_spanish_context();

$ui_strings = $is_spanish_context
    ? array(
        'filter_label'   => 'Filtrar Artículos:',
        'all_topics'     => 'Todos los Temas',
        'filter_heading' => 'Selecciona temas para filtrar artículos',
        'filter_subtext' => 'Elige uno o más temas a continuación y luego aplica tu selección.',
        'clear_filters'  => 'Borrar Filtros',
        'apply_filters'  => 'Aplicar Filtros',
        'read_more'      => 'Leer Más',
        'previous'       => 'Anterior',
        'next'           => 'Siguiente',
        'no_posts'       => 'No se encontraron publicaciones que coincidan con tu criterio.',
    )
    : array(
        'filter_label'   => 'Filter Articles:',
        'all_topics'     => 'All Topics',
        'filter_heading' => 'Select topics to filter articles',
        'filter_subtext' => 'Choose one or more topics below, then apply your selection.',
        'clear_filters'  => 'Clear Filters',
        'apply_filters'  => 'Apply Filters',
        'read_more'      => 'Read More',
        'previous'       => 'Previous',
        'next'           => 'Next',
        'no_posts'       => 'No posts found matching your criteria.',
    );

// Each post type keeps its own category taxonomy (e.g. 'category' for posts,
// a dedicated taxonomy for other post types), so resolve it from the post
// type itself rather than assuming 'category'.
$category_taxonomy = 'category';
foreach ( get_object_taxonomies( $selected_post_type, 'objects' ) as $tax_object ) {
  if ( $tax_object->hierarchical ) {
      $category_taxonomy = $tax_object->name;
      break;
  }
}

// Get category filter from URL
$category_slugs = array();
// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only frontend filter from query string.
if ( isset( $_GET['blog_categories'] ) ) {
    // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only frontend filter from query string.
    $category_slugs = explode( ',', sanitize_text_field( wp_unslash( $_GET['blog_categories'] ) ) );
}

// Build query args
$args = array(
    'post_type'      => $selected_post_type,
    'post_status'    => 'publish',
    'posts_per_page' => $posts_per_page,
    'paged'          => $current_page,
);

// Add category filter if categories are selected
if ( ! empty( $category_slugs ) ) {
    $args['tax_query'] = array(
        array(
            'taxonomy' => $category_taxonomy,
            'field'    => 'slug',
            'terms'    => $category_slugs,
        ),
    );
}

$query = new WP_Query( $args );

// Get all categories for the current post type's taxonomy.
// IDs 1 and 11 are excluded only for the built-in 'category' taxonomy;
// other post types' taxonomies have their own distinct term IDs.
$category_args = array(
    'taxonomy'   => $category_taxonomy,
    'hide_empty' => false,
    'orderby'    => 'id',
    'order'      => 'ASC',
);

if ( 'category' === $category_taxonomy ) {
    $category_args['exclude'] = array( 1, 11 );
}

$all_categories = get_categories( $category_args );

// Organize categories into parent/child structure
$category_tree = array();
foreach ( $all_categories as $category_item ) {
  if ( 0 === (int) $category_item->parent ) {
      // Parent category
      $category_tree[ $category_item->term_id ] = array(
          'category' => $category_item,
          'children' => array(),
      );
  }
}

// Add children to parents
foreach ( $all_categories as $category_item ) {
  if ( 0 !== (int) $category_item->parent && isset( $category_tree[ $category_item->parent ] ) ) {
      $category_tree[ $category_item->parent ]['children'][] = $category_item;
  }
}

// Split categories into 3 columns for display
$cat_tree_array = array_values( $category_tree );

$wrapper_attributes = get_block_wrapper_attributes(
  array(
	  'class'               => 'blog-listing-filter-block bg-white flex justify-center',
	  'data-posts-per-page' => $posts_per_page,
  )
);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
  <div class="self-stretch w-full max-w-screen-2xl px-6 md:px-12 lg:px-20 xl:px-44 py-20 bg-white inline-flex flex-col min-h-svh mx-auto items-start gap-11 overflow-hidden">
      <!-- Filter Toggle -->
      <div class="relative size- inline-flex justify-start items-center gap-1.5">
          <div class="justify-start text-text-body text-sm font-normal font-body leading-5"><?php echo esc_html( $ui_strings['filter_label'] ); ?></div>
          <button type="button" class="filter-toggle w-60 h-8 pl-3 pr-1 py-2 rounded-[40px] outline outline-1 outline-gray-300 flex justify-start items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
              <div class="flex-1 justify-start text-text-muted text-base font-normal font-body leading-6"><?php echo esc_html( $ui_strings['all_topics'] ); ?></div>
              <div class="size-6 relative">
                  <div class="w-2.5 h-[4.96px] left-[7.35px] top-[9.92px] absolute">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
                          <path d="M4.1955 4.7675L0.142 0.739C0.101166 0.698167 0.0672496 0.652 0.0402496 0.600501C0.0134163 0.549001 0 0.494417 0 0.436751C0 0.315584 0.0396661 0.212501 0.118999 0.127501C0.198333 0.0425009 0.301583 0 0.42875 0H8.86775C8.99492 0 9.09817 0.0436664 9.1775 0.131C9.25683 0.218166 9.2965 0.32125 9.2965 0.44025C9.2965 0.470083 0.24892 0.569917 9.15375 0.739751L5.10075 4.7675C5.04358 4.82483 4.976 4.87108 4.898 4.90625C4.82 4.94158 4.73658 4.95925 4.64775 4.95925C4.55892 4.95925 4.47567 4.94158 4.398 4.90625C4.32033 4.87108 4.25283 4.82483 4.1955 4.7675Z" fill="black"/>
                      </svg>
                  </div>
              </div>
          </button>
          
          <!-- Dropdown Filter -->
          <div class="dropdown-filter hidden absolute top-full left-0 mt-2 z-50 w-full md:w-[700px] lg:w-[1100px] px-6 pt-4 pb-6 bg-gradient-to-b from-white to-light-blue rounded-2xl shadow-xl backdrop-blur-[10px] flex flex-col justify-start items-start gap-6 max-h-[70vh] md:max-h-[560px] lg:max-h-[620px] overflow-y-auto">
              <div class="self-stretch relative flex flex-col md:flex-row justify-between items-center">
                  <div class="flex flex-col justify-start items-start gap-1">
                    <div class="self-stretch justify-start text-gray-900 text-lg font-bold font-heading leading-7"><?php echo esc_html( $ui_strings['filter_heading'] ); ?></div>
                    <div class="self-stretch justify-start text-gray-600 text-xs font-normal font-body"><?php echo esc_html( $ui_strings['filter_subtext'] ); ?></div>
                  </div>
                  <div class="flex justify-end items-center gap-2">
                      <button type="button" class="clear-filters text-gray-700 text-sm font-normal font-body leading-5 hover:text-gray-900 transition-colors"><?php echo esc_html( $ui_strings['clear_filters'] ); ?></button>
                      <button type="button" class="apply-filters h-11 px-6 py-3 bg-gradient-to-bl from-accent-blue via-text-heading to-text-heading rounded-full shadow-lg hover:shadow-xl transition-all flex justify-center items-center">
                          <span class="text-white text-sm font-bold font-body uppercase tracking-wide"><?php echo esc_html( $ui_strings['apply_filters'] ); ?></span>
                      </button>
                  </div>
              </div>
              
              <form class="category-filter-form self-stretch columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-10">
                  <?php foreach ( $cat_tree_array as $parent_data ) : ?>
                      <?php $parent = $parent_data['category']; ?>
                      <?php $children = $parent_data['children']; ?>
                      <div class="break-inside-avoid mb-6 flex flex-col justify-start items-start gap-4">
                          <div class="self-stretch justify-start text-gray-900 text-base font-semibold font-body leading-6">
                              <?php echo esc_html( $parent->name ); ?>
                          </div>

                          <?php if ( ! empty( $children ) ) : ?>
                          <div class="self-stretch flex flex-col justify-start items-start gap-2">
                              <?php foreach ( $children as $child ) : ?>
                                  <label class="flex items-center gap-2 pr-2 pb-2 cursor-pointer rounded">
                                      <input type="checkbox" 
                                            name="category_filter[]" 
                                            value="<?php echo esc_attr( $child->slug ); ?>"
                                            <?php echo in_array( $child->slug, $category_slugs, true ) ? 'checked' : ''; ?>
                                            class="category-checkbox shrink-0 w-[20px] h-[20px] rounded border-2 border-gray-400 text-secondary focus:ring-2 focus:ring-secondary cursor-pointer">
                                      <span class="text-gray-800 text-sm font-normal font-body leading-5"><?php echo esc_html( $child->name ); ?></span>
                                  </label>
                              <?php endforeach; ?>
                          </div>
                          <?php endif; ?>
                      </div>
                  <?php endforeach; ?>
              </form>
          </div>
      </div>
      
      <!-- Blog Posts Grid -->
      <div id="blogPostsContainer" class="w-full max-w-[1440px] flex flex-col justify-start items-start gap-20">
          <?php if ( $query->have_posts() ) : ?>
              <div class="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
                  <?php
                  while ( $query->have_posts() ) :
                      $query->the_post();

                      // Try to get featured image first
                      $thumbnail_url = get_the_post_thumbnail_url( get_the_ID(), 'medium' );

                      // If no featured image, try to get first image from content
                    if ( ! $thumbnail_url ) {
                        $content = get_the_content();
                        preg_match( '/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i', $content, $matches );
                      if ( ! empty( $matches[1] ) ) {
                          $thumbnail_url = $matches[1];
                      }
                    }

                      // Fallback image if still no image found
                      $fallback_image = esc_url( get_theme_file_uri( 'assets/images/bg-placeholder.jpg' ) );
                    ?>
                      <article class="bg-gray-50 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-start items-start overflow-hidden hover:shadow-md transition-shadow">
                          <div class="w-full h-40 sm:h-72 md:h-56 relative overflow-hidden">
                              <a href="<?php echo esc_url( get_permalink() ); ?>" tabindex="-1" aria-hidden="true"><img class="w-full h-full object-cover" 
                                  src="<?php echo esc_url( $thumbnail_url ? $thumbnail_url : $fallback_image ); ?>" 
                                  alt="" /></a>
                          </div>
                          <div class="w-full px-4 pt-5 pb-4 flex flex-col justify-start items-start gap-6">
                              <div class="w-full flex flex-col justify-start items-start gap-4">
                                  <div class="w-full flex flex-col justify-start items-start gap-2">
                                      <h3 class="w-full justify-start text-text-heading text-xl font-bold font-heading leading-7">
                                          <a href="<?php echo esc_url( get_permalink() ); ?>" ><?php echo esc_html( get_the_title() ); ?></a>
                                      </h3>
                                      <div class="w-full justify-start text-gray-600 text-sm font-normal font-body leading-5 line-clamp-3">
                                          <?php echo wp_kses_post( wp_trim_words( get_the_excerpt(), 30 ) ); ?>
                                      </div>
                                  </div>
                              </div>
                              <a href="<?php echo esc_url( get_permalink() ); ?>" 
                                class="py-0.5 inline-flex justify-start items-center gap-1 hover:gap-2 transition-all">
                                  <span class="justify-start text-text-heading text-sm font-normal font-body leading-5"><?php echo esc_html( $ui_strings['read_more'] ); ?></span>
                                  <div class="flex items-center justify-center">
                                      <img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/icon-chevron-right-blue.svg' ) ); ?>" 
                                          alt="" class="w-4 h-4" />
                                  </div>
                              </a>
                          </div>
                      </article>
                    <?php
                  endwhile;
                  wp_reset_postdata();
                  ?>
              </div>
              
              <!-- Pagination -->
              <?php if ( $query->max_num_pages > 1 ) : ?>
                  <div class="self-stretch h-9 relative">
                      <div class="w-full h-px left-0 top-0 absolute bg-gray-200"></div>
                      <div class="w-full left-0 top-0 static flex md:absolute gap-5 md:gap-0 flex-row flex-wrap md:flex-nowrap md:flex-row md:inline-flex justify-between items-center md:items-start">
                          <!-- Previous -->
                          <?php if ( $current_page > 1 ) : ?>
                              <a href="<?php echo esc_url( get_pagenum_link( $current_page - 1 ) ); ?>"
                                class="inline-flex flex-col justify-start items-start group order-1 sm:order-1">
                                  <div class="self-stretch h-0.5"></div>
                                  <div class="self-stretch pr-1 pt-4 inline-flex justify-start items-center gap-3">
                                      <div class="size-5 relative overflow-hidden">
                                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                      </div>
                                      <div class="justify-start text-gray-500 text-sm font-normal font-body leading-5 group-hover:text-gray-900"><?php echo esc_html( $ui_strings['previous'] ); ?></div>
                                  </div>
                              </a>
                          <?php else : ?>
                              <div class="inline-flex flex-col justify-start items-start opacity-50 order-1 sm:order-1">
                                  <div class="self-stretch h-0.5"></div>
                                  <div class="self-stretch pr-1 pt-4 inline-flex justify-start items-center gap-3">
                                      <div class="size-5 relative overflow-hidden">
                                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                      </div>
                                      <div class="justify-start text-gray-500 text-sm font-normal font-body leading-5"><?php echo esc_html( $ui_strings['previous'] ); ?></div>
                                  </div>
                              </div>
                          <?php endif; ?>
                          
                          <!-- Page Numbers -->
                          <div class="flex justify-center md:justify-start items-start order-3 sm:order-2 flex-1 sm:flex-none">
                              <?php
                              $total_pages = $query->max_num_pages;

                              // Calculate current group of 3 pages (1-3, 4-6, 7-9, etc.)
                              $group_start = floor( ( $current_page - 1 ) / 3 ) * 3 + 1;
                              $group_end   = min( $group_start + 2, $total_pages );

                              // Show current group of 3 pages
                              for ( $i = $group_start; $i <= $group_end; $i++ ) :
                                ?>
                                  <a href="<?php echo esc_url( get_pagenum_link( $i ) ); ?>"
                                    class="inline-flex flex-col justify-start items-start group">
                                      <div class="self-stretch h-0.5 <?php echo ( (int) $i === (int) $current_page ) ? 'bg-secondary' : ''; ?>"></div>
                                      <div class="self-stretch px-4 pt-4 inline-flex justify-center items-start">
                                          <div class="text-center justify-start text-sm font-normal font-body leading-5 <?php echo ( (int) $i === (int) $current_page ) ? 'text-secondary' : 'text-gray-500 group-hover:text-gray-900'; ?>">
                                              <?php echo esc_html( (string) absint( $i ) ); ?>
                                          </div>
                                      </div>
                                  </a>
                              <?php endfor; ?>
                              
                              <?php
                              // Show ellipsis and last 3 pages if there are more pages after current group
                              if ( $group_end < $total_pages - 3 ) :
                                ?>
                                  <div class="inline-flex flex-col justify-start items-start">
                                      <div class="self-stretch h-0.5"></div>
                                      <div class="self-stretch px-4 pt-4 inline-flex justify-center items-start">
                                          <div class="text-center justify-start text-gray-500 text-sm font-normal font-body leading-5">...</div>
                                      </div>
                                  </div>
                                  
                                  <?php for ( $i = $total_pages - 2; $i <= $total_pages; $i++ ) : ?>
                                      <a href="<?php echo esc_url( get_pagenum_link( $i ) ); ?>"
                                        class="inline-flex flex-col justify-start items-start group">
                                          <div class="self-stretch h-0.5 <?php echo ( (int) $i === (int) $current_page ) ? 'bg-secondary' : ''; ?>"></div>
                                          <div class="self-stretch px-4 pt-4 inline-flex justify-center items-start">
                                              <div class="text-center justify-start text-sm font-normal font-body leading-5 <?php echo ( (int) $i === (int) $current_page ) ? 'text-secondary' : 'text-gray-500 group-hover:text-gray-900'; ?>">
                                                  <?php echo esc_html( (string) absint( $i ) ); ?>
                                              </div>
                                          </div>
                                      </a>
                                  <?php endfor; ?>
                              <?php elseif ( $group_end < $total_pages ) : ?>
                                  <?php
                                  // Show remaining pages if within 3 pages of the end
                                  for ( $i = $group_end + 1; $i <= $total_pages; $i++ ) :
                                    ?>
                                      <a href="<?php echo esc_url( get_pagenum_link( $i ) ); ?>"
                                        class="inline-flex flex-col justify-start items-start group">
                                          <div class="self-stretch h-0.5 <?php echo ( (int) $i === (int) $current_page ) ? 'bg-secondary' : ''; ?>"></div>
                                          <div class="self-stretch px-4 pt-4 inline-flex justify-center items-start">
                                              <div class="text-center justify-start text-sm font-normal font-body leading-5 <?php echo ( (int) $i === (int) $current_page ) ? 'text-secondary' : 'text-gray-500 group-hover:text-gray-900'; ?>">
                                                  <?php echo esc_html( (string) absint( $i ) ); ?>
                                              </div>
                                          </div>
                                      </a>
                                  <?php endfor; ?>
                              <?php endif; ?>
                          </div>
                          
                          <!-- Next -->
                          <?php if ( $current_page < $query->max_num_pages ) : ?>
                              <a href="<?php echo esc_url( get_pagenum_link( $current_page + 1 ) ); ?>"
                                class="inline-flex flex-col justify-start items-start group order-2 sm:order-3">
                                  <div class="self-stretch h-0.5"></div>
                                  <div class="self-stretch pl-1 pt-4 inline-flex justify-start items-center gap-3">
                                      <div class="justify-start text-gray-500 text-sm font-normal font-body leading-5 group-hover:text-gray-900"><?php echo esc_html( $ui_strings['next'] ); ?></div>
                                      <div class="size-5 relative overflow-hidden">
                                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                          </svg>
                                      </div>
                                  </div>
                              </a>
                          <?php else : ?>
                              <div class="inline-flex flex-col justify-start items-start opacity-50 order-2 sm:order-3">
                                  <div class="self-stretch h-0.5"></div>
                                  <div class="self-stretch pl-1 pt-4 inline-flex justify-start items-center gap-3">
                                      <div class="justify-start text-gray-500 text-sm font-normal font-body leading-5"><?php echo esc_html( $ui_strings['next'] ); ?></div>
                                      <div class="size-5 relative overflow-hidden">
                                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                          </svg>
                                      </div>
                                  </div>
                              </div>
                          <?php endif; ?>
                      </div>
                  </div>
              <?php endif; ?>
              
          <?php else : ?>
              <div class="self-stretch text-center py-12">
                  <p class="text-gray-600 text-lg"><?php echo esc_html( $ui_strings['no_posts'] ); ?></p>
              </div>
          <?php endif; ?>
      </div>
  </div>
</section>

<?php wp_reset_postdata(); ?>
