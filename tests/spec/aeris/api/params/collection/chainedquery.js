define([
  'aeris/util',
  'api/params/collection/chainedquery',
  'api/params/model/query',
  'aeris/model'
], function(_, ChainedQuery, Query, Model) {


  describe('A ChainedQuery', function() {

    describe('toString', function() {

      it('should prepare a single model for a API request', function() {
        var query = new ChainedQuery([
          {
            property: 'foo',
            value: 'bar',
            operator: Query.AND
          }
        ]);

        expect(query.toString()).toEqual('foo:bar');
      });

      it('should should prepare multiple models with multiple operator types', function() {
        var query = new ChainedQuery([
          {
            property: 'foo',
            value: 'bar',
            operator: Query.AND
          },
          {
            property: 'hello',
            value: 'world',
            operator: Query.AND
          },
          {
            property: 'wazaam',
            value: 'shazbaloo',
            operator: Query.OR
          },
          {
            property: 'adjibadadji',
            value: 'badadjibadoo',
            operator: Query.AND
          }
        ]);

        expect(query.toString()).toEqual(
          'foo:bar,hello:world;wazaam:shazbaloo,adjibadadji:badadjibadoo'
        );
      });

      it('should return an empty string, if there are no query models', function() {
        var query = new ChainedQuery();

        expect(query.toString()).toEqual('');
      });

    });

  });

});
