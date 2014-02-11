define([
  'ai/util',
  'ai/api/params/collections/chainedqueries',
  'ai/api/params/models/query',
  'ai/model'
], function(_, ChainedQueries, Query, Model) {


  describe('A ChainedQueries Collection', function() {

    describe('toString', function() {

      it('should prepare a single model for a API request', function() {
        var query = new ChainedQueries([
          {
            property: 'foo',
            value: 'bar',
            operator: Query.AND
          }
        ]);

        expect(query.toString()).toEqual('foo:bar');
      });

      it('should should prepare multiple models with multiple operator types', function() {
        var query = new ChainedQueries([
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
        var query = new ChainedQueries();

        expect(query.toString()).toEqual('');
      });

    });

  });

});
