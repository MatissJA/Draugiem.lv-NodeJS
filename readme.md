# Draugiem.lv API Client

### Simple usage sample:
```js
var APP_KEY = '';
var DR_AUTH_CODE = queryParams.dr_auth_code; // http://my-url.com/?dr_auth_code=123

var DraugiemApi = require('draugiemapi');
var draugiem = new DraugiemApi(APP_KEY, DR_AUTH_CODE);

if (draugiem) {

	// Grab the profile
	draugiem.profile(function(profile) {

		// Do whatever you want now..
		// For example - get the friends count
		draugiem.appFriendsCount(function(data) {

			console.log(data);

		});

	});

}
```

---

### Advanced usage sample:
```js
var APP_KEY = '';
var DR_AUTH_CODE = queryParams.dr_auth_code; // http://my-url.com/?dr_auth_code=123

var DraugiemApi = require('draugiemapi');
var draugiem = new DraugiemApi(APP_KEY, DR_AUTH_CODE);

var currentUser;

if (draugiem === false) {
	// Unknown user; DR_AUTH_CODE is not set
} else {
	
	// Attempt to get the users API_KEY from the DB
	// This reduces the calls to draugiem.lv servers
	db.getBySessionHash(SESSION_HASH, function Success(user) {

		// User object or UID can be returned here
		currentUser = user;

	}, function Error() {
		// No session found, so we will need to get the
		// users API_KEY from draugiem.lv and then save
		// it for usage later on.

		// Grab the profile for the #1 time
		draugiem.profile(function(profile) {

			// Create a new row in the session table for usage later on
			db.createSession(profile);

			// and this is the user data..
			currentUser = profile;

		});


	});

}
```

### Table structure:
```sql
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dr_auth_code` varchar(20) NOT NULL,
  `session_hash` varchar(32) NOT NULL,
  `domain` varchar(100) NOT NULL,
  `apikey` varchar(100) NOT NULL,
  `uid` int(11) NOT NULL,
  `userData` text NOT NULL,
  `dateCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_hash` (`session_hash`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
```

**Important note:** you will have to build the database calls on your own. They are not included in this module.