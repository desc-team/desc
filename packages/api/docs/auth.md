# `Authentication` API Endpoints

## Authentication

The following endpoints are available for the `authentication` resource

-   `POST /api/auth/login`
-   `GET /api/auth/logout`

### User login

```
POST /api/auth/login
```

include a post body of the form

```json
{
    "email": "user@example.com",
    "password": "password1234"
}
```

the JSON response will have the following shape:

```json
{
    "success": "true/false",
    "message": "descriptive message of the status",
    "payload": {
        "user": {
            "_id": "id",
            "name": {
                "first": "firstName",
                "last": "lastName"
            },
            "email": "user@example.com",
            "roles": ["role1", "role2"]
        },
        "token": "jsonwebtoken"
    }
}
```

### User logout

```
GET /api/auth/logout
```

the JSON response will have the following shape:

```json
{
    "success": "true/false",
    "message": "descriptive message of the status",
    "payload": null
}
```
