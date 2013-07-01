module.exports = {
  'test sync error 2s': function(test) {
  	test.ok(true,  'This is ok');
  	test.ok(false, 'This is not ok');
  	test.ok(true,  'This is ok too');
  	test.ok(false, 'This is not ok too');
		test.done();
  },

  'one more test 1s' : function(test) {
  	test.ok(true, '1 second test is ok');
		test.done();
  },

  'other test' : function(test) {
  	test.ok(true, 'This is absolutely ok');
  	test.done();
  }
}