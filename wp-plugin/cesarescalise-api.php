<?php
/**
 * Plugin Name: Cesarescalise REST API
 * Description: Espone le gallerie flagallery via WP REST API per il frontend Astro.
 * Version: 1.0
 * Author: Cesare Scalise
 */

if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'rest_api_init', 'cs_register_routes' );

function cs_register_routes() {

    // GET /wp-json/cesarescalise/v1/galleries
    register_rest_route( 'cesarescalise/v1', '/galleries', [
        'methods'             => 'GET',
        'callback'            => 'cs_get_galleries',
        'permission_callback' => '__return_true',
    ]);

    // GET /wp-json/cesarescalise/v1/galleries/{id}
    register_rest_route( 'cesarescalise/v1', '/galleries/(?P<id>\d+)', [
        'methods'             => 'GET',
        'callback'            => 'cs_get_gallery',
        'permission_callback' => '__return_true',
        'args'                => [
            'id' => [ 'validate_callback' => 'is_numeric' ],
        ],
    ]);

    // GET /wp-json/cesarescalise/v1/galleries/{id}/pics
    register_rest_route( 'cesarescalise/v1', '/galleries/(?P<id>\d+)/pics', [
        'methods'             => 'GET',
        'callback'            => 'cs_get_gallery_pics',
        'permission_callback' => '__return_true',
        'args'                => [
            'id' => [ 'validate_callback' => 'is_numeric' ],
        ],
    ]);
}

/**
 * Restituisce tutte le gallerie.
 */
function cs_get_galleries() {
    global $wpdb;

    $galleries = $wpdb->get_results(
        "SELECT g.GID as id, g.name, g.slug, g.galdesc as description,
                COUNT(p.PID) as pic_count,
                MIN(CASE WHEN p.exclude = 0 THEN p.filename END) as first_pic
         FROM {$wpdb->prefix}flagallery_gallery g
         LEFT JOIN {$wpdb->prefix}flagallery_pics p ON p.galleryid = g.GID
         GROUP BY g.GID
         ORDER BY g.GID DESC",
        ARRAY_A
    );

    if ( is_wp_error( $galleries ) || empty( $galleries ) ) {
        return new WP_REST_Response( [], 200 );
    }

    $wp_upload_dir = wp_upload_dir();
    $flagallery_base = content_url( 'flagallery' );

    foreach ( $galleries as &$g ) {
        $g['id']        = (int) $g['id'];
        $g['pic_count'] = (int) $g['pic_count'];

        // URL copertina: prima foto della galleria
        if ( ! empty( $g['first_pic'] ) ) {
            $g['cover_url'] = "{$flagallery_base}/{$g['slug']}/thumbs/thumbs_{$g['first_pic']}";
        } else {
            $g['cover_url'] = '';
        }
        unset( $g['first_pic'] );
    }

    return new WP_REST_Response( $galleries, 200 );
}

/**
 * Restituisce una singola galleria.
 */
function cs_get_gallery( WP_REST_Request $request ) {
    global $wpdb;
    $id = (int) $request['id'];

    $gallery = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT GID as id, name, slug, galdesc as description
             FROM {$wpdb->prefix}flagallery_gallery
             WHERE GID = %d",
            $id
        ),
        ARRAY_A
    );

    if ( ! $gallery ) {
        return new WP_Error( 'not_found', 'Galleria non trovata', [ 'status' => 404 ] );
    }

    $pic_count = (int) $wpdb->get_var(
        $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}flagallery_pics WHERE galleryid = %d AND exclude = 0",
            $id
        )
    );

    $gallery['id']        = (int) $gallery['id'];
    $gallery['pic_count'] = $pic_count;

    return new WP_REST_Response( $gallery, 200 );
}

/**
 * Restituisce le foto di una galleria.
 */
function cs_get_gallery_pics( WP_REST_Request $request ) {
    global $wpdb;
    $id = (int) $request['id'];

    $gallery = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT slug FROM {$wpdb->prefix}flagallery_gallery WHERE GID = %d",
            $id
        )
    );

    if ( ! $gallery ) {
        return new WP_Error( 'not_found', 'Galleria non trovata', [ 'status' => 404 ] );
    }

    $pics = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT PID as id, filename, alttext, description
             FROM {$wpdb->prefix}flagallery_pics
             WHERE galleryid = %d AND exclude = 0
             ORDER BY sortorder ASC, PID ASC",
            $id
        ),
        ARRAY_A
    );

    $flagallery_base = content_url( 'flagallery' );
    $slug = $gallery->slug;

    foreach ( $pics as &$pic ) {
        $pic['id']        = (int) $pic['id'];
        $pic['url']       = "{$flagallery_base}/{$slug}/{$pic['filename']}";
        $pic['thumb_url'] = "{$flagallery_base}/{$slug}/thumbs/thumbs_{$pic['filename']}";
    }

    return new WP_REST_Response( $pics, 200 );
}
