/* jshint strict: false */
var request = require('request');

module.exports = DraugiemApi;

var DraugiemApi = function(apiKey, code) {
    this.apiKey = apiKey;
    this.code = code;

    if (!code) {
        return false;
    }
};

/**
 * Get the current users profile
 *
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.profile = function(callback) {
    this.getUserKey(function() {
        callback(this.userdata);
    }.bind(this));
};

/**
 * Pieprasījums ļauj iegūt pamatinformāciju par atsevišķiem
 * draugiem.lv lietotājiem, kas autorizējuši šo aplikāciju.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#konkretu-aplikacijas-lietotaju-datu-iegusana-pieprasijums-userdata
 * @param  {Array} userIds User IDs for whom to get the profile info
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.userdata = function(userIds, callback) {
    this.getUserKey(function(apiKey) {
        this.postRequest({
            action: 'userdata',
            apikey: apiKey,
            ids: userIds
        }, callback);
    }.bind(this));
};

/**
 * Pieprasījums ļauj iegūt pamatinformāciju par visiem
 * draugiem.lv lietotājiem, kas autorizējuši šo aplikāciju.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#aplikacijas-lietotaju-datu-iegusana-pieprasijums-app-users
 * @param  {Object}   params
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.appUsers = function() {
    var params = arguments.length > 1 ? arguments[0] : {};

    params.action = 'app_users';

    this.postRequest(params, arguments[arguments.length - 1]);
};

/**
 * Pieprasījums ļauj iegūt aplikācijas lietotāju skaitu.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#aplikacijas-lietotaju-skaita-iegusana-pieprasijums-app-users-count
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.appUsersCount = function(callback) {
    this.postRequest({
        action: 'app_users_count'
    }, callback);
};

/**
 * Pieprasījums ļauj iegūt informāciju par aplikācijas
 * lietotāja draugiem, kas izmanto šo pašu aplikāciju.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#aplikacijas-lietotaju-savstarpejo-draugu-iegusana-pieprasijums-app-friends
 * @param  {Object}   params
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.appFriends = function() {
    this.getUserKey(function(apiKey) {
        var params = arguments.length > 1 ? arguments[0] : {};

        params.action = 'app_friends';
        params.apiKey = apiKey;

        this.postRequest(params, arguments[arguments.length - 1]);
    }.bind(this));
};

/**
 * Pieprasījums ļauj iegūt aplikācijas lietotāja draugu skaitu,
 * kas izmanto šo pašu aplikāciju.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#aplikacijas-lietotaja-draugu-skaita-iegusana-pieprasijums-app-friends-count
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.appFriendsCount = function(callback) {
    this.getUserKey(function(apiKey) {
        this.postRequest({
            action: 'app_friends_count',
            apikey: apiKey
        }, callback);
    }.bind(this));
};

/**
 * Pieprasījums ļauj iegūt informāciju par aplikācijas lietotāja
 * draugiem, kas izmanto šo pašu aplikāciju un šobrīd ir ienākuši
 * draugiem.lv portālā.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#aplikacijas-lietotaju-online-draugu-iegusana-pieprasijums-app-friends-online
 * @param  {Object}   params
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.appFriendsOnline = function() {
    this.getUserKey(function(apiKey) {
        var params = arguments.length > 1 ? arguments[0] : {};

        params.action = 'app_friends_online';
        params.apiKey = apiKey;

        this.postRequest(params, arguments[arguments.length - 1]);
    }.bind(this));
};

/**
 * Pieprasījums ļauj iegūt informāciju par lietotājiem, kuri
 * šobrīd ir ienākuši draugiem.lv portālā.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#visu-online-draugu-iegusana-pieprasijums-app-all-friends-online
 * @param  {Object}   params
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.appAllFriendsOnline = function() {
    this.getUserKey(function(apiKey) {
        var params = arguments.length > 1 ? arguments[0] : {};

        params.action = 'app_all_friends_online';
        params.apiKey = apiKey;

        this.postRequest(params, arguments[arguments.length - 1]);
    }.bind(this));
};

/**
 * Pieprasījums ļauj pārbaudīt, vai divi aplikācijas
 * lietotāji savā starpā ir draugi.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#divu-lietotaju-savstarpejas-draudzibas-parbaude-pieprasijums-check-friendship
 * @param  {Integer}   uid
 * @param  {Integer}   uid2
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.checkFriendship = function(uid, uid2, callback) {
    this.postRequest({
        action: 'check_friendship',
        uid: uid,
        uid2: uid2
    }, callback);
};

/**
 * Pieprasījums ļauj pievienot ierakstu ar saiti uz ārēju
 * resursu draugiem.lv lietotāja profila aktivitāšu sarakstā.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#informacijas-pievienosana-lietotaja-profila-aktivitates-pieprasijums-add-activity
 * @param  {Object} text
 * @param  {Object} params
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.addActivity = function(text) {
    this.getUserKey(function(apiKey) {
        var params = arguments.length > 2 ? arguments[1] : {};

        params.action = 'add_activity';
        params.apiKey = apiKey;
        params.text = text;

        this.postRequest(params, arguments[arguments.length - 1]);
    }.bind(this));
};

/**
 * Pieprasījums ļauj pievienot paziņojumu ar saiti lietotāja
 * profila jaunumu blokā, kas atrodas sākumlapā.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#pazinojuma-attelosana-lietotaja-profila-jaunumos-pieprasijums-add-notification
 * @param  {Object} text
 * @param  {Object} params
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.addNotification = function(text) {
    this.getUserKey(function(apiKey) {
        var params = arguments.length > 2 ? arguments[1] : {};

        params.action = 'add_notification';
        params.apiKey = apiKey;
        params.text = text;

        this.postRequest(params, arguments[arguments.length - 1]);
    }.bind(this));
};

/**
 * Pieprasījums ļauj integrētajām aplikācijām pārliecināties,
 * vai lietotāja draugiem.lv sesija, no kuras ir ieiets
 * aplikācijā,ir joprojām aktīva.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#draugiem-lv-aktivas-lietotaja-sesijas-statusa-parbaude-pieprasijums-session-check
 * @param  {Object} hash
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.sessionCheck = function(hash, callback) {
    this.getUserKey(function(apiKey) {
        this.postRequest({
            action: 'session_check',
            apikey: apiKey,
            hash: hash
        }, callback);
    }.bind(this));
};

/**
 * Pieprasījums ļauj iegūt statistisku informāciju
 * par aplikācijas darbību.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#aplikacijas-statistikas-datu-iegusana-pieprasijums-app-status
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.appStatus = function(callback) {
    this.postRequest({
        action: 'app_status'
    }, callback);
};

/**
 * Pieprasījums ļauj iegūt informāciju par lietotājam
 * nosūtītajiem uzaicinājumiem lietot šo aplikāciju.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#aplikacijas-lietotajam-nosutito-uzaicinajumu-iegusana-pieprasijums-invitations
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.invitations = function(callback) {
    this.getUserKey(function(apiKey) {
        this.postRequest({
            action: 'invitations',
            apikey: apiKey
        }, callback);
    }.bind(this));
};

/**
 * Pieprasījums ļauj iegūt informāciju par lietotāja
 * nosūtītajiem uzaicinājumiem lietot šo aplikāciju.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#aplikacijas-lietotaja-nosutito-uzaicinajumu-iegusana-pieprasijums-sent-invitations
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.sentInvitations = function(callback) {
    this.getUserKey(function(apiKey) {
        this.postRequest({
            action: 'sent_invitations',
            apikey: apiKey
        }, callback);
    }.bind(this));
};

/**
 * Pieprasījums ļauj iegūt informāciju par lietotāja
 * nosūtītajiem uzaicinājumiem lietot šo aplikāciju.
 *
 * @see http://www.draugiem.lv/applications/dev/docs/iframe/#aplikacijas-lietotaja-nosutito-uzaicinajumu-iegusana-pieprasijums-sent-invitations
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.createTransaction = function(serviceId, callback) {
    this.getUserKey(function(apiKey) {
        this.postRequest({
            action: 'transactions/create',
            apikey: apiKey,
            service: serviceId
        }, callback);
    }.bind(this));
};

/**
 * Get users API key.
 *
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.getUserKey = function(callback) {
    if (this.userKey) {
        return callback(this.userKey);
    }

    if (!this.code) {
        return;
    }

    var params = {
        action: 'authorize',
        code: this.code
    };

    this.postRequest(params, function(response) {
        // API key
        this.userKey = response.apikey;

        // Grab the user details
        for (var id in response.users) {
            this.userdata = response.users[id];
            break;
        }

        // Call the callback
        callback(this.userKey);
    }.bind(this));
};

/**
 * Perform a request.
 *
 * @param  {Object}   params
 * @param  {Function} callback
 * @return {Void}
 */
DraugiemApi.prototype.postRequest = function(params, callback) {
    if (params.app === undefined) {
        params.app = this.apiKey;
    }

    var post = {
        form: params,
        json: true
    };

    request.post('http://api.draugiem.lv/json/', post, function(error, response, body) {
        if (body.error !== undefined) {
            console.log('[Error]', body, post);
            return;
        }

        if (!error && response.statusCode === 200) {
            callback(body);
        }
    });
};
