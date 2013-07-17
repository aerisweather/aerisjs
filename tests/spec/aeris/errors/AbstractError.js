define(['aeris', 'aeris/errors/AbstractError'], function(aeris) {
  describe('An Error', function() {
    var MyError = function() {
      aeris.errors.AbstractError.apply(this, arguments);
    };
    aeris.inherits(
      MyError,
      aeris.errors.AbstractError
    );

    MyError.prototype.setName = function() {
      return 'MyError';
    };

    MyError.prototype.setMessage = function(message) {
      return 'Error: ' + message;
    };


    it('must implement a setName method', function() {
      var BadErrorClass = function() {
        aeris.errors.AbstractError.apply(this, arguments);
      };
      aeris.inherits(
        BadErrorClass,
        aeris.errors.AbstractError
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
