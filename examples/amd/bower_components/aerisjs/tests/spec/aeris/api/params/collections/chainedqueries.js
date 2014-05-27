define([
  'aeris/util',
  'aeris/api/params/collections/chainedqueries',
  'aeris/api/params/models/query',
  'aeris/api/operator'
], function(_, ChainedQueries, Query, Operator) {


  describe('A ChainedQueries Collection', function() {

    describe('toString', function() {

      it('should prepare a single model for a API request', function() {
        var query = new ChainedQueries([
          {
            property: 'foo',
            value: 'bar',
            operator: Operator.AND
          }
        ]);

        expect(query.toString()).toEqual('foo:bar');
      });

      it('should should prepare multiple models with multiple operator types', function() {
        var query = new ChainedQueries([
          {
            property: 'foo',
            value: 'bar',
            operator: Operator.AND
          },
          {
            property: 'hello',
            value: 'world',
            operator: Operator.AND
          },
          {
            property: 'wazaam',
            value: 'shazbaloo',
            operator: Operator.OR
          },
          {
            property: 'adjibadadji',
            value: 'badadjibadoo',
            operator: Operator.AND
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
