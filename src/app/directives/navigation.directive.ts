import {Directive, ElementRef, HostListener, Input} from '@angular/core';
declare let $: any;

@Directive({
  selector: '[appNavigation]'
})
export class NavigationDirective {

  private opts = {
    accordion: true, //nav item when one is expanded the other closes
    animate: 'easeOutExpo',
    speed: 500,  //ms
    closedSign : '<em class="fal fa-angle-down"></em>',
    openedSign : '<em class="fal fa-angle-up"></em>',
    initClass: 'js-nav-built', //nav finished class
  };
//DOMContentLoaded
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    let jq = $(this.el.nativeElement);
    let opts = this.opts;

    if (!jq.hasClass(opts.initClass)) {

      /**
       * confirm build to prevent rebuild error
       **/
      jq.addClass(opts.initClass);

      /**
       * add a mark [+] to a multilevel menu
       **/
      jq.find("li").each(function() {
        // @ts-ignore
        if ($(this).find("ul").length !== 0) {

          /**
           * add the multilevel sign next to the link
           **/
          // @ts-ignore
          $(this).find("a:first").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

          /**
           * avoid jumping to the top of the page when the href is an #
           **/

          // @ts-ignore
          if ($(this).find("a:first").attr('href') == "#") {
            // @ts-ignore
            $(this).find("a:first").click(function() {
              return false;
            });
          }
        }
      });

      /**
       * add open sign to all active lists
       **/
      jq.find("li.active").each(function() {
        // @ts-ignore
        $(this).parents("ul")
          .parent("li")
          .find("a:first")
          .attr('aria-expanded', true)
          .find("b:first")
          .html(opts.openedSign);
      });

      /**
       * click events
       **/
      jq.find("li a").on('mousedown', function(e: any) {

        // @ts-ignore
        if ($(this).parent().find("ul").length !== 0) {

          if (opts.accordion) {

            /**
             * do nothing when the list is open
             **/
            // @ts-ignore
            if (!$(this).parent().find("ul").is(':visible')) {

              // @ts-ignore
              let parents = $(this).parent().parents("ul");
              let visible = jq.find("ul:visible");
              // @ts-ignore
              visible.each(function(visibleIndex) {
                var close = true;
                // @ts-ignore
                parents.each(function(parentIndex) {

                  if (parents[parentIndex] == visible[visibleIndex]) {

                    close = false;
                    return false;
                  }
                });
                if (close) {

                  // @ts-ignore
                  if ($(this).parent().find("ul") != visible[visibleIndex]) {

                    $(visible[visibleIndex]).slideUp(opts.speed + 300, opts.animate, function() {
                      // @ts-ignore
                      $(this).parent("li")
                        .removeClass("open")
                        .find("a:first")
                        .attr('aria-expanded', false)
                        .find("b:first")
                        .html(opts.closedSign);
                      //console.log("nav item closed")
                    });
                  }
                }
              });
            }
          }

          /**
           * Add active class to open element
           **/
          // @ts-ignore
          if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {

            // @ts-ignore
            $(this).parent().find("ul:first").slideUp(opts.speed + 100, opts.animate, function() {
              // @ts-ignore
              $(this).parent("li")
                .removeClass("open")
                .find("a:first")
                .attr('aria-expanded', false)
                .find("b:first").delay(opts.speed)
                .html(opts.closedSign);
              //console.log("nav item closed")
            });
          } else {
            // @ts-ignore
            $(this).parent().find("ul:first").slideDown(opts.speed, opts.animate, function() {

              // @ts-ignore
              $(this).parent("li")
                .addClass("open")
                .find("a:first")
                .attr('aria-expanded', true)
                .find("b:first").delay(opts.speed)
                .html(opts.openedSign);
              //console.log("nav item opened");

            });
          }
        }
      });

    } else {
      //console.log(jq.get(0) + " this menu already exists");
    }
  }

}
