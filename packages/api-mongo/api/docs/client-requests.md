# `Client Request` API Endpoints

## `Client Request`

`Client Request` is used to 'aggregate' several item requests and submit/create them in on one POST API call.

The following endpoints are available for the `clientrequests` resource:

-   `POST /api/clientrequests`
-   `GET /api/clientrequests`
-   `GET /api/clientrequests/:id`

### Create a new client request

```
POST /api/clientrequests
```

include a post body of the form

```json
{
    "clientId": "12345678",
    "submittedBy": "someuserId",
    "items": [
        {
            "clientId": "12345678",
            "submittedBy": "someuserId",
            "numberOfItems": 2,
            "urgency": "survival",
            "status": "active",
            "note": "the text of the initial note (which is optional).",
            "itemCategory": "Household",
            "name": "bedding"
        },
        {
            "clientId": "12345678",
            "submittedBy": "someuserId",
            "numberOfItems": 1,
            "urgency": "important",
            "status": "active",
            "itemCategory": "Clothing",
            "name": "coat",
            "size": "L (42-44)",
            "gender": "M",
            "style": "casual"
        }
    ]
}
```

> _Note: the above `items` property can be an array of items, a single item, or no items at all. When a `client request` is created, the `items` will be returned in an array, which may be empty if no `items` were provided with the initial POST._

the JSON response will have the following shape:

```json
{
    "success": true,
    "message": "client request created",
    "payload": {
        "clientRequest": {
            "items": ["item1Id", "item2Id"],
            "_id": "clientRequestId",
            "clientId": "12345678",
            "submittedBy": "someuserId",
            "createdAt": "2018-11-30T17:56:47.210Z",
            "updatedAt": "2018-11-30T17:56:47.210Z",
            "__v": 0
        }
    }
}
```

### Return all the client requests

```
GET /api/clientrequests
```

the JSON response will have the following shape:

```json
{
    "success": true,
    "message": "client requests fetched",
    "payload": {
        "clientRequests": [
            {
                "items": ["item1Id", "item2Id"],
                "_id": "clientRequestId",
                "clientId": "12345678",
                "submittedBy": "someuserId",
                "createdAt": "2018-11-30T17:56:47.210Z",
                "updatedAt": "2018-11-30T17:56:47.210Z",
                "__v": 0
            }
        ]
    }
}
```

### Return a single the client requests

```
GET /api/clientrequests/:id
```

the JSON response will have the following shape:

```json
{
    "success": true,
    "message": "client requests fetched",
    "payload": {
        "clientRequest": {
            "items": ["item1Id", "item2Id"],
            "_id": "clientRequestId",
            "clientId": "12345678",
            "submittedBy": "someuserId",
            "createdAt": "2018-11-30T17:56:47.210Z",
            "updatedAt": "2018-11-30T17:56:47.210Z",
            "__v": 0
        }
    }
}
```
