<?php

require_once($CFG->libdir . '/portfolio/caller.php');
/**
 * Portfolio caller class for exaport
 *
 * @package   mod_assign
 * @copyright 2012 NetSpot {@link http://www.netspot.com.au}
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

class exaport_portfolio_caller extends portfolio_module_caller_base {

    /** @var int callback arg - the id of artefact we export */
    protected $aid;

    /** @var string component of the submission files we export*/
    protected $component;

    /** @var string callback arg - the area of submission files we export */
    protected $area;

    /** @var int callback arg - the id of file we export */
    protected $fileid;

    /** @var int callback arg - the cmid of the assignment we export */
    protected $cmid;

//    /** @var string callback arg - the plugintype of the editor we export */
//    protected $plugin;

//    /** @var string callback arg - the name of the editor field we export */
//    protected $editor;

    /**
     * Callback arg for a single file export.
     */
    public static function expected_callbackargs() {
        return array(
            'cmid' => false,//'cmid' => true,
            'aid' => false,
            'area' => false,
            'component' => false,
            'fileid' => false,
        );
    }

    /**
     * The constructor.
     *
     * @param array $callbackargs
     */
    public function __construct($callbackargs) {
        parent::__construct($callbackargs);
    }

    /**
     * Load data needed for the portfolio export.
     *
     * If the assignment type implements portfolio_load_data(), the processing is delegated
     * to it. Otherwise, the caller must provide either fileid (to export single file) or
     * submissionid and filearea (to export all data attached to the given submission file area)
     * via callback arguments.
     *
     * @throws     portfolio_caller_exception
     */
    public function load_data() {
        return true;
    }

    /**
     * Prepares the package up before control is passed to the portfolio plugin.
     *
     * @throws portfolio_caller_exception
     * @return mixed
     */
    public function prepare_package() {
        return $this->prepare_package_file();
    }

    /**
     * Calculate a sha1 has of either a single file or a list
     * of files based on the data set by load_data.
     *
     * @return string
     */
    public function get_sha1() {
        $fs = get_file_storage();
        //$singlefile = $fs->get_file(45, 'assignsubmission_file', 'submission_files', 1, '/', 'slide0003_image013.jpg');
        $this->singlefile = $fs->get_file_by_id($this->fileid);
        return $this->get_sha1_file();
    }

    /**
     * Calculate the time to transfer either a single file or a list
     * of files based on the data set by load_data.
     *
     * @return int
     */
    public function expected_time() {
        return $this->expected_time_file();
    }

    public function get_return_url() {
        return 'http://moodle.localhost/blocks/exaport/view_items.php?courseid=1';
    }
       
    /**
     * Checking the permissions.
     *
     * @return bool
     */
    public function check_permissions() {
        //$context = context_module::instance($this->cmid);
        $context = context_system::instance();
        //return has_capability('mod/assign:exportownsubmission', $context);
        return true;
    }

    /**
     * Display a module name.
     *
     * @return string
     */
    public static function display_name() {
        return get_string('pluginname', 'block_exaport');
    }

    /**
     * Return array of formats supported by this portfolio call back.
     *
     * @return array
     */
    public static function base_supported_formats() {
        return array(PORTFOLIO_FORMAT_FILE, PORTFOLIO_FORMAT_LEAP2A);
    }
}