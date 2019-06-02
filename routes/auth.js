var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const userModel = require('../models/user.js');
var moment = require('moment');

router.get('/', function(req, res, next) {
    res.status(403).send('Forbidden');
});

router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    
    userModel.login(username,password)
    .then((response) => {
        if(!response.result){
            res.status(401).json(response);
        } else {
            res.status(200).json(response);
        }
    })
    .catch((error) => {
        res.status(500).json(error);
    });
});

router.post('/register', [
    [
        check('username').isEmail(),
        check('password').isLength({ min: 6 })
    ]
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    }

    const userInfo = {
        username: req.body.username,
        password: req.body.password,
        displayName: req.body.displayName,
        token: req.body.token
    };

    userModel.createUser(userInfo)
    .then((response) => {
        if(!response.result){
            res.status(500).json(error);
        } else {
            res.status(200).json(response);
        }
    })
    .catch((error) => {
        res.status(500).json(error);
    });
});

router.get('/loginSmartsheet',function(req, res, next) {
    var code = req.query.code;
    //Cuando el usuario selecciona allow env´´ia el código
    if(code){
        var crypto = require('crypto');
        // Create hash
        var hash =
        crypto.createHash('sha256')
        .update('tija82kjdxfh2igx9vv' + '|' + code)
            // ('Your App Secret' + '|' + 'Received Authorization Code')
        .digest('hex');

        // Set options
        var options = {
            queryParameters: {
                client_id: '87i5ybsz6r19h3dhvre',   // Your App Client ID
                code: code,            // Received Authorization Code
                hash: hash
            },
            contentType: 'application/x-www-form-urlencoded'
        };
        /*
        var req = http.request(optionsRequest, callback);
        //This is the data we are posting, it needs to be a string or a buffer
        var data = 'grant_type=authorization_code&code='+code+'&client_id=1samp48lel5for68you&hash='+hash;
        req.write(data);
        req.end();
        */
        // Get access token
        
        ssclient = require('smartsheet');
        // instantiating the Smartsheet client
        const smartsheet = ssclient.createClient({
            // a blank token provides access to Smartsheet token endpoints
            accessToken: ''
        });

        // Get access token
        smartsheet.tokens.getAccessToken(options)
        .then(function(token) {
            console.log(token);

            
            var ss = ssclient.createClient({
                accessToken: token.access_token,
                logLevel: 'info'
            });
            ss.users.getCurrentUser()
            .then(function(userProfile) {
                console.log(userProfile);
                //Con los datos del usuario debo identificar si ya existe
                userModel.loginSmartsheet(userProfile.email)
                .then((response) => {
                    if(!response.result){
                        res.redirect('http://localhost:4200/login?msg=user_not_found');
                    } else {
                        const date = moment();
                        const dateString = date.format('YYYY-MM-DDTHH:MM:SS');
                        var hash =
                        crypto.createHash('sha256')
                        .update(process.env.APP_SECRET + dateString)
                        .digest('hex');
                        userModel.createAccess(response.data.user_id,hash);
                        res.redirect('http://localhost:4200/login?access=' + hash);
                    }
                })
                .catch((error) => {
                    res.redirect('http://localhost:4200/login??msg=bad_credentials');
                });
            })
            .catch(function(error) {
                console.log(error);
            });
            
        })
        .catch(function(error) {
        console.log(error);
        });
    } else { //Código que se ejecuta si seleccionan Deny
        var error = req.query.error;
        res.redirect('/login?msg=deny');
    }
    
    
});

router.post('/verifyAccess', [
    [
        check('access').isLength({min: 1})
    ]
]
,function(req, res, next) {

    const errors = validationResult(req);
    console.log(errors.isEmpty());
    if (!errors.isEmpty()) {
        console.log(errors.array());
        res.status(422).json({ errors: errors.array() });
    } else {
        const access = req.body.access;
    
        userModel.verifyAccess(access)
        .then((response) => {
            if(!response.result){
                res.status(401).json(response);
            } else {
                res.status(200).json(response);
            }
        })
        .catch((error) => {
            res.status(500).json(error);
        });
    }
});

callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
}

function authorizeURL(params) {
    const authUrl = 'https://app.smartsheet.com/b/authorize';
    return `${authUrl}?${qs.stringify(params)}`;
}

module.exports = router;
