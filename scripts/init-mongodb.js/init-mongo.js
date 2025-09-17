db = db.getsiblingDB('issue-tracker');
db.createUser({
    user: 'app_user',
    pwd: 'app_password',
    roles: [
        {
            role:'readWrite',
            db: 'issue-tracker'
        }
    ]
});