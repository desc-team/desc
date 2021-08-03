# `Users` API Endpoints

## Users

The following endpoints are available for the `users` resource:

-   `POST /api/users`
-   `GET /api/users`
-   `GET /api/users/:id`
-   `PUT /api/users/:id`
-   `DELETE /api/users/:id`

### Create a new user

```
POST /api/users
```

include a post body of the form

```json
{
    "name": {
        "first": "firstName",
        "last": "lastName"
    },
    "email": "user@example.com",
    "password": "password1234",
    "program": "housing"
}
```

The `program` property represents the user's program within DESC and is required to be one of the following values:

1. `housing`
2. `integrated`
3. `survival`
4. `health`
5. `employment`
   6 `research_innovation`

_NOTE: these enum values still need to verified_

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

### Return all the users

```
GET /api/users
```

the JSON response will have the following shape:

```json
{
    "success": "true/false",
    "message": "descriptive message of the status",
    "payload": {
        "users": [
            {
                "_id": "id",
                "name": {
                    "first": "firstName",
                    "last": "lastName"
                },
                "email": "user@example.com",
                "roles": ["role1", "role2"]
            }
        ]
    }
}
```

_NOTE: This endpoint will likely be available for only admins to access_

### Return a single user

```
GET /api/users/:id
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
        }
    }
}
```

### Update a single user

```
PUT /api/users/:id
```

include a post body of the form

```json
{
    "name": {
        "first": "firstName",
        "last": "lastName"
    },
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
        }
    }
}
```

### Delete a single user

```
DELETE /api/users/:id
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
        }
    }
}
```

Note: the returned user will be the one that was just deleted
