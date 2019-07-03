
//@prepros-append ../node_modules/bootstrap-4/dist/util.js
//@prepros-append ../node_modules/bootstrap-4/dist/alert.js
//@prepros-append ../node_modules/bootstrap-4/dist/button.js
//@prepros-append ../node_modules/bootstrap-4/dist/carousel.js
//@prepros-append ../node_modules/bootstrap-4/dist/collapse.js
//@prepros-append ../node_modules/bootstrap-4/dist/dropdown.js
//@prepros-append ../node_modules/bootstrap-4/dist/modal.js
//@prepros-append ../node_modules/bootstrap-4/dist/tooltip.js
//@prepros-append ../node_modules/bootstrap-4/dist/popover.js
//@prepros-append ../node_modules/bootstrap-4/dist/scrollspy.js
//@prepros-append ../node_modules/bootstrap-4/dist/tab.js
//@prepros-append ../node_modules/bootstrap-4/dist/index.js

//@prepros-append-not ../node_modules/ekko-lightbox/dist/ekko-lightbox.js
//@prepros-append-not ../node_modules/waterfall/waterfall.js 

$(function() {

    // Add slideDown animation to dropdown
    $('.dropdown').on('show.bs.dropdown', function(e){
      $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
    });

    // Add slideUp animation to dropdown
    $('.dropdown').on('hide.bs.dropdown', function(e){
      $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
    });
    
    // esto hace que el dropdown solo se cierre al clickear adentro
    // $('.dropdown.keep-open').on({
    //     "shown.bs.dropdown": function() { this.closable = false; },
    //     "click":             function() { this.closable = false; },
    //     "hide.bs.dropdown":  function() { return this.closable; }
    // });
    
    // esto hace que el dropdown no se cierre al clickear adentro
    // $('.dropdown-menu-cart').click(function(event){
    //     console.log('clickearon adentro');
    //     event.stopPropagation();
    // });​
    
    // $(function() {
    //   $('.dropdown').on({
    //       "click": function(event) {
    //         if ($(event.target).closest('.dropdown-toggle').length) {
    //           $(this).data('closable', true);
    //         } else {
    //           $(this).data('closable', false);
    //         }
    //       },
    //       "hide.bs.dropdown": function(event) {
    //         hide = $(this).data('closable');
    //         $(this).data('closable', true);
    //         return hide;
    //       }
    //   });
    // });

    
    // $('[data-toggle="tooltip"]').tooltip();
    
    
    // $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
    //     event.preventDefault();
    //     return $(this).ekkoLightbox();
    // });


    // waterfall
    // $('#waterfall').pinterest_grid({
    //     no_columns: 3,
    //     padding_x: 0,
    //     padding_y: 0,
    //     margin_bottom: 0,
    //     single_column_breakpoint: 500
    // });
    

    // navbar fixed
    // $(document).scroll(function() {
    //     var y = $(this).scrollTop();
    //     if (y > 80) {
    //         $('.navbar-default').addClass('navbar-smaller');
    //     } else {
    //         $('.navbar-default').removeClass('navbar-smaller');
    //     }
    // });


    // smooth scroll vertical site 
    // $("a[href^='#']").on('click', function(e) {
    //     e.preventDefault();
    //     $('html, body').animate({ 
    //         scrollTop: $(this.hash).offset().top - 100 //fixed navbar height
    //     }, 800);
    // });

    // scroll links
    // $('.navbar-nav a, #goUp').click(function(){
    //     $('html, body').animate({
    //         scrollTop: $( $(this).attr('href') ).offset().top
    //     }, 800);
    //     return false;
    // });


    ///////////////////////////////////////////////////////////////////
    //
    // ANIMACIONES
    // 
    ///////////////////////////////////////////////////////////////////


    //Cache reference to window and animation items
    var $animation_elements = $('.animate');
    var $window = $(window);

    $window.on('scroll', check_if_in_view);
    $window.trigger('scroll');

    function check_if_in_view() {

        var window_height = $window.height();
        var window_top_position = $window.scrollTop();
        var window_bottom_position = (window_top_position + window_height);

        $.each($animation_elements, function() {
            
            var $element = $(this);
            var element_height = $element.outerHeight();
            var element_top_position = $element.offset().top;
            var element_bottom_position = (element_top_position + element_height);

            //check to see if this current container is within viewport
            if ( (element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position) ) {
                $element.addClass('in-view');
            } else {
                $element.removeClass('in-view');
            }

        });
    }


    ///////////////////////////////////////////////////////////////////
    //
    // FORMS
    // 
    ///////////////////////////////////////////////////////////////////

    $("form.ajax").submit(function(e){

        e.preventDefault();

        var self = $(this); /* define $(this) as a variable that is accessible to any function defined after this. */

        var formUrl         = self.attr("action");
        var formMethod      = self.attr("method");
        var formData        = self.serialize();
        var formRedirect    = self.data("redirect") ? self.data("redirect") : false;      /*  data-redirect="/una-url-aqui/"  */
        var formBlockBtn    = self.data("blockbtn") ? true : false;                       /*  data-blockbtn="no"  */
        var formRefresh     = self.data("refresh")  ? true : false;                       /*  data-refresh="true"  */
        
        // console.log(formBlockBtn);

        if ( !formBlockBtn ) {  
            var btnSend        = self.find("button[type='submit']");
            var btnSendOrigVal = btnSend.text();
            btnSend.attr("disabled", "disabled").html("Enviando...");
        }

        $.ajax({

            url : formUrl,
            type : formMethod,
            data : formData,
            dataType: "json",
            success: function (response) {

                if (response.status === "success") {

                    // console.log(response.message);
                    // console.log(response.sessionRedirect);
                    // console.log(response.formRedirect);
                    
                    if ( response.sessionRedirect ) {
                        setTimeout( function() { location.href= response.sessionRedirect }, 0 );
                    }
                    else if ( formRedirect ) {
                        setTimeout( function() { location.href= formRedirect }, 0 );
                    } else {
                        
                        self.find( '.msg' ).show().html( response.message ).show();         // muestro el mensaje
                        if ( !formBlockBtn ) { btnSend.html( "ENVIADO!" ); }                // cambio el texto del botón
                        setTimeout( function() { $('.modal').modal('hide'); }, 1000 );      // oculto todos los modales
                        if ( formRefresh ) {                                                // refresco la pagina donde estoy
                            setTimeout( function() { location.reload(); }, 2000 );
                        }
                    }

                } else if (response.status === "error") {

                    // console.log(response.message);
                    self.find( '.msg' ).show().html( response.message ).show();
                    if ( !formBlockBtn ) { btnSend.attr("disabled", false).html( btnSendOrigVal ); }

                }
            },
            error: function (response) {
                console.log("AJAX error in request: " + JSON.stringify(response, null, 2));
            }

        });

    });



    ///////////////////////////////////////////////////////////////////
    //
    // REGISTRO / USUARIOS
    // 
    ///////////////////////////////////////////////////////////////////

    $("#userZone, #userZone1").change(function(e) { 
        
        // e.preventDefault();

        var selectedValue = this.value;
        // console.log( selectedValue ); 

        if ( selectedValue != 0 ) {

            // Do an AJAX request
            $.ajax({
                url: "/helpers/GetLocalities.php",
                type: "GET",
                data: { zoneId: selectedValue },
                dataType:"json",
                cache: false,
                success: function (response) {
                    if(response.status === "success") {

                        // console.log(response.message);
                        $( '#userLocality, #userLocality1' ).prop('disabled', false);
                        $( '#userLocality, #userLocality1' ).html( response.listLocalities );

                    } else if(response.status === "error") {
                        // console.log(response.message);
                    }
                },
                error: function (err) {
                    console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
                }
            });

        } else {

            $( '#userLocality, #userLocality1' ).prop('disabled', true);
            $( '#userLocality, #userLocality1' ).html( '' );

        }

    });


    /* 
    *
    * user orders > generate popup detail
    * 
    */
    $(".btn-ver-detalles").click(function(e) { 
       
        e.preventDefault();
        
        var self = $(this);

        var orderId    = self.data("order-id") ? self.data("order-id") : false;      /*  data-order-id="1"  */
        
        
        // Do an AJAX request
        $.ajax({
            url: "/helpers/GetOrder.php",
            type: "GET",
            data: { orderId: orderId },
            dataType:"json",
            cache: false,
            success: function (response) {
                if(response.status === "success") {

                    $( '#popupOrder .modal-title span' ).html( response.orderNro );
                    $( '#popupOrder .modal-body' ).html( response.orderDetail );

                } else if(response.status === "error") {
                    console.log(response.message);
                }
            },
            error: function (err) {
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });

    });



    ///////////////////////////////////////////////////////////////////
    //
    // CART
    // 
    ///////////////////////////////////////////////////////////////////

    /* 
    *
    * acciones instantaneas
    * 
    */
    
    $(document).on('click', '[data-item-action]', function(e){

        e.preventDefault();

        // seteo filtros activos
        var self        = $(this); /* define $(this) as a variable that is accessible to any function defined after this. */
        var itemAction  = self.data("item-action")  ? self.data("item-action")  : false; /* add - remove - delete */
        var itemId      = self.data("item-id")      ? self.data("item-id")      : false; 
        var itemTitle   = self.data("item-title")   ? self.data("item-title")   : false; 
        var itemPrice   = self.data("item-price")   ? self.data("item-price")   : false; 
        var itemQty     = self.data("item-qty")     ? self.data("item-qty")     : 1; 
        
        // console.log( itemAction ); console.log( itemId ); console.log( itemTitle ); console.log( itemPrice ); console.log( itemQty );

        //ejecutar AJAX
        $.ajax({ 
            url: "/helpers/CartActions.php",
            type: "GET",
            data: { itemAction : itemAction, itemId : itemId, itemTitle : itemTitle, itemPrice : itemPrice, itemQty : itemQty },
            dataType:"json",
            cache: false,
            success: function (response) {
                if(response.status === "success") {

                    $( '.cart-items-total' ).html( response.newCartItemsTotal );
                    $( '.cart-total' ).html( response.newCartSubTotal );
                    
                    $( '#cost-sub-total' ).html( response.newCartSubTotal );
                    $( '#cost-discount' ).html( response.newCartDiscount );
                    $( '#cost-shipping' ).html( response.newCartShipping );
                    $( '#cost-total' ).html( response.newCartTotal );

                    $( '.dropdown-menu-cart ol' ).html( response.newCartListDropdown );
                    $( '.cart-block-list' ).hide().html( response.newCartList ).fadeIn();

                    // muestro o no el mensaje en popup
                    if ( response.newCartMessage != '' ) {

                        $( '#popupMessage .modal-body' ).html( response.newCartMessage );
                        $( '#popupMessage' ).modal('show');
                        setTimeout(function() { $('#popupMessage').modal('hide'); }, 1000);

                    }
                    //--
                    
                    // muestro u oculto el total en el dropdown
                    if ( response.newCartItemsTotal >= 1 ) {
                        $( '.block-cart-total' ).show();
                        $( '.cart-block-costs' ).show();
                        $( '.cart-block-discount' ).show();
                        $( '.cart-block-actions' ).show();
                    } else {
                        $( '.block-cart-total' ).hide();
                        $( '.cart-block-costs' ).hide();
                        $( '.cart-block-discount' ).hide();
                        $( '.cart-block-actions' ).hide();
                    }
                    // ---

                } else if(response.status === "error") {
                    console.log(response.message);
                }
            },
            error: function (err) {
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });

    });
    

    /* 
    *
    * seleccionando cantidad primero
    * 
    */
   
    $(document).on('click', '[data-qty-action]', function(e){

        e.preventDefault();

        // seteo filtros activos
        var self        = $(this); /* define $(this) as a variable that is accessible to any function defined after this. */
        var itemAction  = self.data("qty-action")  ? self.data("qty-action")  : false; /* add - remove */
        var itemId      = self.data("item-id")     ? self.data("item-id")     : false; 
        
        var qtyTotal    = $( '[data-item-id='+itemId+'].qty-total' );
        var qtyTotalVal = qtyTotal.html();
        
        var btnAdd      = $( '[data-item-id='+itemId+'][data-item-action="add"]' );

        if ( itemAction === "add" )     { var qtyTotalNew = parseInt(qtyTotalVal) + 1;} 
        if ( itemAction === "remove" )  { var qtyTotalNew = parseInt(qtyTotalVal) - 1; }

        if ( qtyTotalNew <= 0 ) qtyTotalNew = 1;

        // cambio cantidades
        var btnAddNewQty = btnAdd.data("item-qty", qtyTotalNew);
        qtyTotal.html( qtyTotalNew );

    });


    /* 
    *
    * descuento
    * 
    */
    
    $( "#form-discount" ).submit(function(e) {

        e.preventDefault();

        var self = $(this); /* define $(this) as a variable that is accessible to any function defined after this. */

        var formUrl         = self.attr("action");
        var formMethod      = self.attr("method");
        var formData        = self.serialize();

        $.ajax({

            url : formUrl,
            type : formMethod,
            data : formData,
            dataType: "json",
            success: function (response) {

                if (response.status === "success") {
                    
                    $( '#cost-sub-total' ).html( response.newCartSubTotal );
                    $( '#cost-discount' ).html( response.newCartDiscount );
                    $( '#cost-shipping' ).html( response.newCartShipping );
                    $( '#cost-total' ).html( response.newCartTotal );

                    $( '#popupMessage .modal-body' ).html( response.newMessage );
                    $( '#popupMessage' ).modal('show');
                    setTimeout(function() { $('#popupMessage').modal('hide'); }, 1000);

                } else if (response.status === "error") {

                    $( '#popupMessage .modal-body' ).html( response.newMessage );
                    $( '#popupMessage' ).modal('show');
                    setTimeout(function() { $('#popupMessage').modal('hide'); }, 1000);

                }
            },
            error: function (response) {
                console.log("AJAX error in request: " + JSON.stringify(response, null, 2));
            }

        });

    });


    /* 
    *
    * chequear monto mínimo para comprar
    * 
    */

    $(document).on('click', 'a [data-checkout]', function(e){
       
        e.preventDefault();
        
        var self        = $(this); /* define $(this) as a variable that is accessible to any function defined after this. */
        var followLink  = self.attr("href");

        // Do an AJAX request
        $.ajax({
            url: "/helpers/ValidateCheckout.php",
            type: "GET",
            data: {},
            dataType:"json",
            cache: false,
            success: function (response) {
                if(response.status === "success") {

                    setTimeout( function() { location.href = followLink }, 0 );

                } else if(response.status === "error") {
                    
                    $( '#popupMessage .modal-body' ).html( response.newMessage );
                    $( '#popupMessage' ).modal('show');
                    setTimeout(function() { $('#popupMessage').modal('hide'); }, 2000);

                }
            },
            error: function (err) {
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });

    });

    /* 
    *
    * validar forma de pago
    * 
    */

    // $(document).on('click', '[data-payment]', function(e){
       
    //     e.preventDefault();
        
    //     var self        = $(this); /* define $(this) as a variable that is accessible to any function defined after this. */
    //     var paymentId   = self.data("payment") ? self.data("payment") : false;

    //     // Do an AJAX request
    //     $.ajax({
    //         url: "/helpers/SetPaymentMethod.php",
    //         type: "GET",
    //         data: { paymentId : paymentId },
    //         dataType:"json",
    //         cache: false,
    //         success: function (response) {
    //             if(response.status === "success") {

    //                 $('.payment-methods .method:not([data-payment="'+paymentId+'"])').removeClass('active'); // inactivo el resto
    //                 self.toggleClass('active'); // activo el actual               

    //             } else if(response.status === "error") {
                    
    //                 $( '#popupMessage .modal-body' ).html( response.newMessage );
    //                 $( '#popupMessage' ).modal('show');
    //                 setTimeout(function() { $('#popupMessage').modal('hide'); }, 2000);

    //             }
    //         },
    //         error: function (err) {
    //             console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
    //         }
    //     });

    // });



    ///////////////////////////////////////////////////////////////////
    //
    // THUMBNAILS
    // thumbnails.carousel.js jQuery plugin
    // 
    ///////////////////////////////////////////////////////////////////

    ;(function(window, $, undefined) {

        var conf = {
            center: true,
            backgroundControl: false
        };

        var cache = {
            $carouselContainer: $('.thumbnails-carousel').parent(),
            $thumbnailsLi: $('.thumbnails-carousel li'),
            $controls: $('.thumbnails-carousel').parent().find('.carousel-control')
        };

        function init() {
            cache.$carouselContainer.find('ol.carousel-indicators').addClass('indicators-fix');
            cache.$thumbnailsLi.first().addClass('active-thumbnail');

            if(!conf.backgroundControl) {
                cache.$carouselContainer.find('.carousel-control').addClass('controls-background-reset');
            }
            else {
                cache.$controls.height(cache.$carouselContainer.find('.carousel-inner').height());
            }

            if(conf.center) {
                cache.$thumbnailsLi.wrapAll("<div class='center clearfix'></div>");
            }
        }

        function refreshOpacities(domEl) {
            cache.$thumbnailsLi.removeClass('active-thumbnail');
            cache.$thumbnailsLi.eq($(domEl).index()).addClass('active-thumbnail');
        }   

        function bindUiActions() {
            cache.$carouselContainer.on('slide.bs.carousel', function(e) {
                refreshOpacities(e.relatedTarget);
            });

            cache.$thumbnailsLi.click(function(){
                cache.$carouselContainer.carousel($(this).index());
            });
        }

        $.fn.thumbnailsCarousel = function(options) {
            conf = $.extend(conf, options);

            init();
            bindUiActions();

            return this;
        }

    })(window, jQuery);

    $('.thumbnails-carousel').thumbnailsCarousel({});

    ///////////////////////////////////////////////////////////////////

});



//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////
/////////////////////////////////               ANIMACIÓN SLIDE NAVBAR
/////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


$(document).ready(function() {

  function toggleSidebar() {
    $(".button").toggleClass("active");
    $("main").toggleClass("move-to-left");
    $(".sidebar-item").toggleClass("active");
  }

  $(".button").on("click tap", function() {
    toggleSidebar();
  });

  $(document).keyup(function(e) {
    if (e.keyCode === 27) {
      toggleSidebar();
    }
  });

});