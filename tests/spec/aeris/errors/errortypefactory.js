define([
  'aeris/util',
  'aeris/errors/errortypefactory'
], function(_, ErrorTypeFactory) {

  describe('An ErrorTypeFactory', function() {

    describe('constructor', function() {

      describe('should create an Error, which...', function() {

        it('should be a type of Error', function() {
          var MyErrorType = new ErrorTypeFactory({
            name: 'MyErrorType'
          });
          var myError = new MyErrorType();

          expect(myError).toBeInstanceOf(Error);
        });

        it('should optionally inherit from a specified type', function() {
          var MyParentType = jasmine.createSpy('MyParentType');

          var MyErrorType = new ErrorTypeFactory({
            name: 'MyErrorType',
            type: MyParentType
          });
          var myError = new MyErrorType();

          expect(myError).toBeInstanceOf(MyParentType);
          expect(MyParentType).toHaveBeenCalledInTheContextOf(myError);
        });

        it('should have a specified name', function() {
          var MyErrorType = new ErrorTypeFactory({
            name: 'MyErrorType'
          });
          var myError = new MyErrorType();

          expect(myError.name).toEqual('MyErrorType');
        });

        it('should have a specified message, defined by a callback', function() {
          var MyErrorType = new ErrorTypeFactory({
            name: 'MyErrorType',
            message: function(msg) {
              return 'Something bad happened: ' + msg;
            }
          });
          var myError = new MyErrorType('some kind of error');

          expect(myError.message).toEqual('Something bad happened: some kind of error');
        });

        it('should accept multiple message arguments', function() {
          var MyErrorType = new ErrorTypeFactory({
            name: 'MyErrorType',
            message: function(msgA, msgB) {
              return 'Something bad happened: ' + msgA + ' and ' + msgB;
            }
          });
          var myError = new MyErrorType('msgA', 'msgB');

          expect(myError.message).toEqual('Something bad happened: msgA and msgB');
        });

      });

    });

  });

});
