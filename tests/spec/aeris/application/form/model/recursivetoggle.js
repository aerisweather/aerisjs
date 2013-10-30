define([
  'aeris/util',
  'application/form/model/recursivetoggle',
  'application/form/collection/togglecollection'
], function(_, RecursiveToggle, ToggleCollection) {

  function getNestedData() {
    return {
      value: 'top level 1',
      nodes: [
        {
          value: '2nd level, item 1',
          nodes: [
            { value: '3rd level, item 1' },
            { value: '3rd level, item 2' },
            { value: '3rd level, item 3' }
          ]
        },
        {
          value: '2nd level, item 2',
          nodes: [
            { value: '3rd level, item 4' },
            {
              value: '3rd level, item 5',
              nodes: [
                { value: '4th level, item 1' },
                { value: '4th level, item 2' },
                { value: '4th level, item 3' }
              ]
            },
            { value: '3rd level, item 6' }
          ]
        }
      ]
    };
  }

  describe('A RecursiveToggle', function() {

    describe('set', function() {

      it('should convert data arrays to nested RecursiveToggle collections', function() {
        var toggle = new RecursiveToggle(undefined, {
          childCollectionAttribute: 'nodes'
        });
        var data = getNestedData();

        toggle.set(data);

        expect(toggle.get('nodes')).toBeInstanceOf(ToggleCollection);
        expect(toggle.get('nodes').length).toEqual(2);

        // 2nd level
        expect(toggle.get('nodes').at(0)).toBeInstanceOf(RecursiveToggle);
        expect(toggle.get('nodes').at(0).get('value')).toEqual('2nd level, item 1');

        // 3rd level
        expect(toggle.get('nodes').at(0).get('nodes')).toBeInstanceOf(ToggleCollection);
        expect(toggle.get('nodes').at(0).get('nodes').length).toEqual(3);
        expect(toggle.get('nodes').at(0).get('nodes').at(0).get('value')).toEqual('3rd level, item 1');

        // 4th level
        expect(toggle.get('nodes').at(1).get('nodes').at(1).get('nodes')).toBeInstanceOf(ToggleCollection);
        expect(toggle.get('nodes').at(1).get('nodes').at(1).get('nodes').length).toEqual(3);
        expect(toggle.get('nodes').at(1).get('nodes').at(1).get('nodes').at(0).get('value')).toEqual('4th level, item 1');
      });

    });

  });

});
