define([
  'aeris/util',
  'application/controller/layoutcontroller',
  'vendor/jquery'
], function (_, LayoutController, $) {


  describe('A LayoutController', function () {

    describe('hideAllRegions', function () {
      var tmpl = '' +
        '<div>' +
        ' <div class="regionA"></div>' +
        ' <div class="regionB"></div>' +
        '</div>';


      it('should do nothing if the layout hasn\'t been rendered', function() {
        var layout = new LayoutController({
          template: tmpl,
          regions: {
            regionA: '.regionA',
            regionB: '.regionB'
          }
        });

        // Shouldn't throw any errors
        layout.hideAllRegions();
      });

      it('should hide all regions', function () {
        var layout = new LayoutController({
          template: tmpl,
          regions: {
            regionA: '.regionA',
            regionB: '.regionB'
          }
        });

        layout.render();

        layout.hideAllRegions();

        expect(layout.$el.find('.regionA').is(':visible')).toEqual(false);
        expect(layout.$el.find('.regionB').is(':visible')).toEqual(false);
      });

      it('should do nothing with unresolved regions', function () {
        var layout = new LayoutController({
          template: tmpl,
          regions: {
            regionA: '.regionA',
            regionB: '.regionB'
          }
        });

        layout.render();

        // Shouldn't throw any errors
        layout.hideAllRegions();
      });

    });

  });
});
