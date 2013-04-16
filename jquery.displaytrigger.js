/*
 * 
 * displaytrigger
 * 
 * ---
 * @Copyright(c) 2012, falsandtru
 * @license MIT  http://opensource.org/licenses/mit-license.php  http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license
 * @version 1.1.8
 * @updated 2013/04/16
 * @author falsandtru  http://fat.main.jp/  http://sa-kusaku.sakura.ne.jp/
 * @CodingConventions Google JavaScript Style Guide
 * ---
 * Note: 
 * 
 * ---
 * Example:
 * @jquery 1.7.2
 * 
 * $.displaytrigger(
 * {
 *   trigger : 'img[data-origin]' ,
 *   callback : function(){ $( this ).attr( 'src' , $( this ).attr( 'data-origin' ) ) } ,
 *   ahead : 300 ,
 *   beforehand : 1
 * } ).trigger( 'displaytrigger' ) ;
 * 
 */

( function() {
  
  if ( typeof window[ 'jQuery' ] === 'undefined' ) { return ; } ;
  
  var $ = jQuery = window[ 'jQuery' ] , undefined = void( 0 ) , win = window , doc = document , plugin_data = [ 'settings' ] ;
  
  jQuery.fn.displaytrigger = displaytrigger ;
  jQuery.displaytrigger = displaytrigger ;
  displaytrigger = null ;
  
  function displaytrigger( options ) {
    if ( typeof this === 'function' ) { return arguments.callee.apply( jQuery( win ) , arguments ) ; } ;
    
    var
      defaults = {
        id : 0 ,
        gns : 'displaytrigger' ,
        ns : undefined ,
        trigger : undefined ,
        callback : function() {} ,
        parameter : [] ,
        ahead : 0 ,
        beforehand: 0 ,
        index : 0 ,
        step : 1 ,
        once : true ,
        skip : false ,
        expand : true ,
        delay : 300 ,
        terminate : true ,
        reset : true
      } ,
      settings = jQuery.extend( true , {} , defaults , options ) ;
    
    if ( settings.reset ) {
      jQuery.extend
      (
        true ,
        settings , {
          nss : {
            scroll : [ 'scroll' , settings.gns + ( settings.ns ? ':' + settings.ns : '' ) ].join( '.' ) ,
            displaytrigger : [ settings.gns + ( settings.ns ? '.' + settings.ns : '' ) ].join( '.' ) ,
            resize : [ 'resize' , settings.gns + ( settings.ns ? ':' + settings.ns : '' ) ].join( '.' ) ,
            data : settings.gns + ( settings.ns ? ':' + settings.ns : '' )
          } ,
          context: this ,
          scope : this[ 0 ] === win ? jQuery( doc ) : jQuery( this ) ,
          index : 0 ,
          count : 0 ,
          height : {} ,
          direction : 1 ,
          distance : 0 ,
          turn : false ,
          end : false ,
          reset : false ,
          queue : []
        }
      ) ;
    } ;
    
    
    if ( !settings.scope.length || !settings.scope.find( settings.trigger ).length || !arguments.length ) { return this ; } ;
    
    
    register( settings ) ;
    
    return this ;
    
    
    /* function */
    
    function register( settings ) {
      
      for ( var i = 0 , element ; element = settings.context[ i ] ; i++ ) {
        
        settings.id = plugin_data.length ;
        settings.height.window = 0 ;
        settings.height.element = 0 ;
        plugin_data.push( jQuery.extend( true , {} , settings ) ) ;
        
        // custom event
        jQuery( element )
        .unbind( settings.nss.displaytrigger )
        .bind( settings.nss.displaytrigger , settings.id , function( event , context ) {
          var
            settings = plugin_data[ event.data ] ,
            id ,
            scrollcontext = context ,
            displaytriggercontext = this ;
          
          if ( !settings.delay ) {
            drive( event , displaytriggercontext , scrollcontext || win ) ;
          } else {
            while ( id = plugin_data[ settings.id ].queue.shift() ) { clearTimeout( id ) ; } ;
            id = setTimeout( function() {
              if ( !plugin_data[ settings.id ] ) { return ; } ;
              while ( id = plugin_data[ settings.id ].queue.shift() ) { clearTimeout( id ) ; } ;
              plugin_data[ settings.id ] = settings ;
              drive( event , displaytriggercontext , scrollcontext || win ) ;
            } , settings.delay ) ;
            
            plugin_data[ settings.id ].queue.push( id ) ;
          } ;
        } ) ;
        
        // node original event
        jQuery.data( element , settings.nss.data , true ) ;
        
        jQuery( element )
        .unbind( settings.nss.scroll )
        .bind( settings.nss.scroll , settings.id , function( event ) {
          jQuery( this ).trigger( plugin_data[ event.data ].nss.displaytrigger , [ this ] ) ;
        } ) ;
      
        // root original event
        if ( i !== 0 ) { continue ; } ;
        
        jQuery( win )
        .filter( function() { return settings.context[ 0 ] === win || settings.expand ; } )
        .unbind( settings.nss.resize )
        .bind( settings.nss.resize , settings.id , function( event ) {
          settings.context.trigger( plugin_data[ event.data ].nss.displaytrigger , [ this ] ) ;
        } )
        .filter( function() { return settings.context[ 0 ] !== win ; } )
        .unbind( settings.nss.scroll )
        .bind( settings.nss.scroll , settings.id , function( event ) {
          settings.context.trigger( plugin_data[ event.data ].nss.displaytrigger , [ this ] ) ;
        } ) ;
      } ;
    }
    
    function drive( event , displaytriggercontext , scrollcontext ) {
      var
        win = window ,
        doc = document ,
        area = displaytriggercontext === win ? doc : displaytriggercontext ,
        fire = false ,
        targets ,
        target ,
        settings = plugin_data[ event.data ] ;
      
      if ( !settings ) { return ; } ;
      
      targets = jQuery( settings.trigger , area ) ;
      target = targets.eq( settings.index ) ;
      
      switch ( true ) {
        case !targets.length :
          break ;
          
        case settings.step === 0 && !target[ 0 ] :
          settings.index += -1 ;
          plugin_data[ settings.id ] = settings ;
          return ;
          
        case settings.index < 0 :
          settings.index = 0 ;
          settings.end = true ;
          plugin_data[ settings.id ] = settings ;
          return arguments.callee.apply( displaytriggercontext , arguments ) ;
          
        case settings.index >= targets.length :
          settings.index = targets.length - 1 ;
          settings.end = true ;
          plugin_data[ settings.id ] = settings ;
          return arguments.callee.apply( displaytriggercontext , arguments ) ;
          
        case settings.beforehand > settings.index && !jQuery.data( target[ 0 ] , settings.nss.data + '-fired' )  :
          fire = true ;
          break ;
          
        default :
          var
            cs = jQuery( scrollcontext ).scrollTop() ,
            ch = settings.height[ scrollcontext === win ? 'window' : 'element' ] ,
            direction = cs === ch ? settings.direction
                                  : cs < ch ? -1
                                            : 1 ,
            distance = direction === -1 ? ch - cs : cs - ch ;
          
          TURN : {
            if ( settings.direction === direction ) { break TURN ; } ;
            
            settings.turn = true ;
            settings.end = false ;
            settings.direction = direction ;
            target = targets.eq( settings.index ) ;
          } ;
          settings.distance = distance === 0 ? settings.distance : distance ;
          settings.height[ scrollcontext === win ? 'window' : 'element' ] = cs ;
          
          if ( settings.end ) { break ; } ;
          
          var
            st = jQuery( win ).scrollTop() ,
            ot = target.offset().top ,
            wh = jQuery( win ).height() ,
            th = target.height() ,
            ahead = -1 < settings.ahead && settings.ahead < 1 ? th * settings.ahead : settings.ahead ,
            topin = st >= ot - wh - ahead ,
            //topout = st < ot - wh - ahead ,
            bottomin = st <= ot + th + ahead ;
            //bottomout = st > ot + th + ahead ;
          
          FIRE : {
            if ( settings.once && jQuery.data( target[ 0 ] , settings.nss.data + '-fired' ) ) { break FIRE ; } ;
            
            fire = settings.turn && !settings.once &&
                   ( direction === -1 ? st + settings.distance <= ot + th + ahead
                                      : st - settings.distance >= ot - wh - ahead ) ? false
                                                                                    : ( settings.skip ? topin && bottomin
                                                                                                      : direction === -1 ? bottomin
                                                                                                                         : topin ) ;
          } ;
　　　　　
          END : {
            if ( fire || ( settings.direction === -1 ? bottomin : topin ) ) {
              break END ;
            } ;
            
            settings.turn = false ;
            plugin_data[ settings.id ] = settings ;
            return ; 
          } ;
          break ;
      } ;
      
      if ( fire && target[ 0 ] !== undefined ) {
        jQuery.data( target[ 0 ] , settings.nss.data + '-fired' , true ) ;
        settings.count += 1 ;
        settings.callback.apply( target[ 0 ] , [ event , settings.parameter , { index : settings.index , direction : settings.direction } ] ) ;
      } ;
      
      if ( !targets.length ||
           ( settings.terminate && settings.once && settings.step !== 0 && settings.count >= targets.length ) ) {
        
        var remainder = 0 ;
        
        jQuery( displaytriggercontext ).unbind( settings.nss.displaytrigger ) ;
        jQuery( scrollcontext ).unbind( settings.nss.scroll ).unbind( settings.nss.resize ) ;
        jQuery.removeData( area , settings.nss.data ) ;
        
        for ( var i = 0 , element ; element = settings.context[ i ] ; i++ ) { remainder += jQuery.data( element , settings.nss.data ) ? 1 : 0 ; } ;
        remainder || settings.context[ 0 ] === win ? null : jQuery( win ).unbind( settings.nss.scroll ).unbind( settings.nss.resize ) ;
        
        plugin_data[ settings.id ] = undefined ;
        return ;
      } ;
      
      settings.index += settings.step === 0 && !fire ? settings.direction
                                                     : settings.step === 0 && settings.direction === -1 ? settings.direction
                                                                                                        : settings.step * settings.direction ;
      plugin_data[ settings.id ] = settings ;
      
      
      return settings.end ? undefined : arguments.callee.apply( displaytriggercontext , arguments ) ;
    }
  }
} )() ;
