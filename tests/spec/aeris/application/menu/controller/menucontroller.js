define([
  'aeris/util',
  'application/menu/controller/menucontroller',
  'application/form/collection/togglecollection',
  'application/form/model/recursivetoggle'
], function(_, MenuController, ToggleCollection, RecursiveToggle) {
  /**
   * This is an integration test of the
   * MenuController, and it's MenuItemController CompositeView
   */
  
  function getMenuData() {
    return [
      // Menu 1
      {
        value: 'top level 1',
        subMenu: [

          // Menu 1-1
          {
            value: '2nd level, item 1',
            subMenu: [
              { value: '3rd level, item 1' },
              { value: '3rd level, item 2' },
              { value: '3rd level, item 3' }
            ]
          },

          // Menu 1-2
          {
            value: '2nd level, item 2',
            subMenu: [
              { value: '3rd level, item 4' },
              {
                value: '3rd level, item 5',
                subMenu: [
                  { value: '4th level, item 1' },
                  { value: '4th level, item 2' },
                  { value: '4th level, item 3' }
                ]
              },
              { value: '3rd level, item 6' }
            ]
          }
        ]
      },

      // Menu2
      {
        value: 'top level 2',
        subMenu: [
          {
            value: '2nd level, item 3',
            subMenu: [
              { value: '3rd level, item 7' },
              { value: '3rd level, item 8' },
              { value: '3rd level, item 9' }
            ]
          },
          {
            value: '2nd level, item 4',
            subMenu: [
              { value: '3rd level, item 10' },
              { value: '3rd level, item 11' },
              { value: '3rd level, item 12' }
            ]
          }
        ]
      }
    ];
  }
  
  var TestModel = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      childCollectionAttribute: 'subMenu'
    });
    RecursiveToggle.call(this, opt_attrs, options);
  };
  _.inherits(TestModel, RecursiveToggle);

  describe('A MenuController', function() {

    it('should create a menu UI structure', function() {
      var menuData = new ToggleCollection(getMenuData(), {
        model: TestModel
      });

      var menu = new MenuController({ collection: menuData });
      var $menu1, $menu2;

      menu.render();

      $menu1 = menu.$el.children('.aeris-menuItem').eq(0);
      $menu2 = menu.$el.children('.aeris-menuItem').eq(1);
      $menu1_1 = $menu1.find('.aeris-subMenu').eq(0).find('.aeris-menuItem').eq(0);

      expect($menu1.find('input').first().val()).toEqual('top level 1');
      expect($menu2.find('input').first().val()).toEqual('top level 2');

      expect($menu1_1.children('.aeris-subMenu').length).toEqual(1);
      expect($menu1_1.children('.aeris-subMenu').children('.aeris-menuItem').length).toEqual(3);
    });

  });

});
