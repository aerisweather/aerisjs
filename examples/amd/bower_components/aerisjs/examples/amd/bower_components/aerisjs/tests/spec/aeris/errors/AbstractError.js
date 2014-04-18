define(['aeris/util', 'aeris/errors/abstracterror'], function(_, AbstractError) {
  describe('An Error', function() {
    var MyError = function() {
      AbstractError.apply(this, arguments);
    };
    _.inherits(
      MyError,
      AbstractError
    );

    MyError.prototype.setName = function() {
      return 'MyError';
    };

    MyError.prototype.setMessage = function(message) {
      return 'Error: ' + message;
    };


    it('must implement a setName method', function() {
      var BadErrorClass = function() {
        AbstractError.apply(this, arguments);
      };
      _.inherits(
        BadErrorClass,
        AbstractError
      );

      expect(function() { throw new BadErrorClass('msg'); }).toThrow();
      new MyError('msg'); // shouldn't throw error
    });



    it('should construct with a name and message', function() {
      var msg = 'something awful happened';
      var myError = new MyError(msg);

      expect(myError.name).toEqual('MyError');
      expect(myError.message).toEqual('Error: ' + msg);
    });

    it('should throw a message', function() {
      var msg = 'something awful happened';
      expect(function() {
        throw new MyError(msg);
      }).toThrow('Error: ' + msg);
    });
  });
});
