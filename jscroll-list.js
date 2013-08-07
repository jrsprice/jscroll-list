/**
 * jscroll-list.js
 *
 * @author  Jesse Price
 */
!function ($) {

    "use strict"; // jshint ;_;

    /* SCROLLLIST CLASS DEFINITION
     * ====================== */

    var ScrollList = function (element, options) {
        this.init(element, options);
    };

    /**
     * ScrollList inheritance, prototype object.
     */
    ScrollList.prototype = {

        /**
         * Constructor
         */
        constructor: ScrollList,

        /**
         * Initialize the plugin
         *
         * @param   {Object} element
         * @param   {Object} options
         * @return  {void}
         */
        init: function (element, options) {
            // Set option
            this.options = options;

            // Set selected element
            this.$element = $(element);

            // Wrap the dom
            this._wrap();

            // Scroll event
            this._scroll();
        },

        /**
         * Scroll event listener
         * 
         * @return {Void}
         */
        _scroll: function() {
            var that = this;

            that.$scrollList
            .off('scroll.scrollList')
            .on('scroll.scrollList', function(e){
                that.updateFauxHeading();
            });
        },
        
        /**
         * Wrap the selected list
         * 
         * @return {Void}
         */
        _wrap: function() {
            this.$element.wrap('<div class="scroll-list">');
            this.$headings      = this.$element.find('.' + this.options.headingClass);
            this.$scrollList    = this.$element.closest('.scroll-list');
            this.$scrollList.prepend('<div class="' +
                    this.options.fauxHeadingClass + '"></div>');
            this.$fauxHeading = this.$scrollList.find('.' +
                    this.options.fauxHeadingClass);
            this.showFauxHeading();
        },

        /**
         * Update the heading that is closest to the top of the view and or
         * is scrolled past
         *
         * @return {Void}
         */
        updateFauxHeading: function() {
            var that    = this,
                $this   = that.$scrollList,
                st      = $this.scrollTop(),
                pt      = 0;

            // Iterate each to find the active one
            that.$headings.each(function(i){
                var $heading    = $(this),
                    ht          = $heading.position().top;

                if (ht <= 0 && pt >= -st) {
                    that.$fauxHeading.html($heading.html());
                    that.showFauxHeading();
                    return;
                }
                
                pt = ht;                
            });
        },

        /**
         * Recalculates the faux heading
         * 
         * @return {Void}
         */
        recalcFauxHeading: function() {
            var that    = this,
                $li     = that.$element.find('li:first');
            if ($li && $li.length > 0) {
                this.$fauxHeading.css({
                    width   : $li.width(),
                    height  : $li.height()
                }).html($li.html());
            }
        },

        /**
         * Scroll to a specific section... coming soon
         * 
         * @return {Void}
         */
        scrollTo: function() {

        },

        /**
         * Show the faux heading
         * 
         * @return {Void}
         */
        showFauxHeading: function () {
            this.recalcFauxHeading();
            this.$fauxHeading.show();
        },

        /**
         * Hide the faux heading
         * 
         * @return {Void}
         */
        hideFuaxHeading: function () {
            this.$fauxHeading.hide();
        }
    };


    /* SCROLLLIST PLUGIN DEFINITION
     * ======================= */

    $.fn.scrollList = function (option, params) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('scroll-list'),
                options = $.extend({}, $.fn.scrollList.defaults, $this.data(),
                    typeof option === 'object' && option);

            if (!data) {
                $this.data('scroll-list', (data = new ScrollList(this, options)));
            }

            if (typeof option === 'string') {
                data[option](params);
            } else if (options.show) {
                data.show();
            }
        });
    };

    $.fn.scrollList.defaults = {
        fauxHeadingClass    : 'scroll-list-faux-heading',
        headingClass        : 'scroll-list-heading'
    };

    $.fn.scrollList.Constructor = ScrollList;


    /* SCROLLLIST DATA-API
     * ============== */

    $(function(){
        $('.scroll-list-selector').scrollList();
    });

}(window.jQuery);
