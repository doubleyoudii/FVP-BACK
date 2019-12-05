## Create your Own config.json file in /config/ folder.

## config.json format

{
"test": {
"PORT": 3000,
"MONGODB_URI": "Put your **TEST**database here",
"JWT_SALT": "Put your **TEST** secret key heare"
},
"development": {
"PORT": 3000,
"MONGODB_URI": "Put your **PROD** database here",
"JWT_SALT": "Put your **PROD** secret key heare"
}
}
