# `Items` API Endpoints

## Items

`Items` in this context refers to any item requested for one of DESC's clients. The client is anonomyous and referenced only by their client identification (clientId) number.

An `item` is required to be in one of five categories:

1.  Clothing
2.  Household
3.  Personal Hygiene
4.  Engagement
5.  Ticket
6.  Pet

Depending on the category of the item, there may be additional required information needed to be provided. For example, a `clothing` item will require a `size`, `gender`, and possibly a `style`, attributes.

The following endpoints are available for the `items` resource:

-   `POST /api/items`
-   `GET /api/items`
-   `GET /api/items/:id`
-   `PUT /api/items/:id`
-   `DELETE /api/items/:id`
-   `POST /api/items/:id/notes`

### Create a new item

```
POST /api/items
```

#### To create a new `Household`, `Personal Hygiene`, `Engagement`, `Ticket` or `Pet` item

include a post body of the form

```json
{
    "clientId": "12345678",
    "submittedBy": "someuserId",
    "location": "Rainier House",
    "numberOfItems": 2,
    "urgency": "survival",
    "status": "active",
    "note": "the text of the initial note (which is optional).",
    "itemCategory": "Household",
    "name": "bedding"
}
```

The **required** properties are:

-   `clientId`
-   `submittedBy`
-   `location`
    -   Available values are: -
        `Aurora House`,
        `N 96th Street`,
        `Interbay Place`,
        `Kerner-Scott House`,
        `Canaday House`,
        `Eastlake Building`,
        `Lyon Building`,
        `Morrison Building`,
        `Evans House`,
        `Union Hotel`,
        `Estelle`,
        `Rainier House`,
        `Cottage Grove Commons`
-   `itemCategory` - Available values are `Clothing`, `Household`, `PersonalHygiene`, `Engagement`, `Ticket`, or `Pet`

The **optional** properties are:

-   `numberOfItems` (defaults to 1)
-   `urgency` (defaults to `important`)
    -   Available values are `survivial`, `life-changing`, or `important`
-   `status` (defaults to `active`)
    -   Available values are `active`, `approved`, `wishlist`, `archive`, or `denied`

the JSON response will have the following shape:

```json
{
    "success": "true/false",
    "message": "descriptive message of the status",
    "payload": {
        "item": {
            "_id": "idOfTheItem",
            "clientId": "12345678",
            "submittedBy": {
                "_id": "idOfTheUser",
                "name": {
                    "first": "firstName",
                    "last": "lastName"
                },
                "email": "user@example.com"
            },
            "location": "Rainier House",
            "numberOfItems": 2,
            "urgency": "survival",
            "status": "active",
            "notes": [
                {
                    "_id": "idOfTheNote",
                    "submittedBy": {
                        "name": {
                            "first": "firstName",
                            "last": "lastName"
                        }
                    },
                    "body": "the text of the note"
                }
            ],
            "itemCategory": "Household",
            "name": "bedding"
        }
    }
}
```

_NOTE: The `submittedBy` and `notes` properties will be populated when the newly created item is returned_

#### To create a new `Clothing` item

include a post body of the form

```json
{
    "clientId": "12345678",
    "submittedBy": "someuserId",
    "location": "Rainier House",
    "numberOfItems": 1,
    "urgency": "important",
    "status": "active",
    "itemCategory": "Clothing",
    "name": "coat",
    "size": "L (42-44)",
    "gender": "M",
    "style": "casual"
}
```

The **required** properties are:

-   `clientId`
-   `submittedBy`
-   `location`
    -   Available values are: -
        `Aurora House`,
        `N 96th Street`,
        `Interbay Place`,
        `Kerner-Scott House`,
        `Canaday House`,
        `Eastlake Building`,
        `Lyon Building`,
        `Morrison Building`,
        `Evans House`,
        `Union Hotel`,
        `Estelle`,
        `Rainier House`,
        `Cottage Grove Commons`
-   `itemCategory` (need to specify `Clothing` in this case)
-   `size`
    -   Available values depend on `gender`
-   `gender` (not required for a `hat` or `scarf`, but is recommended)
    -   Available values are `M` or `F`

The **optional** properties are:

-   `numberOfItems` (defaults to 1)
-   `urgency` (defaults to `important`)
    -   Available values are `survivial`, `life-changing`, or `important`
-   `status` (defaults to `active`)
    -   Available values are `active`, `approved`, `wishlist`, `archive`, or `denied`
-   `style` (defaults to `casual`)

the JSON response will have the following shape:

```json
{
    "success": "true/false",
    "message": "descriptive message of the status",
    "payload": {
        "item": {
            "_id": "idOfTheItem",
            "clientId": "12345678",
            "submittedBy": {
                "_id": "idOfTheUser",
                "name": {
                    "first": "firstName",
                    "last": "lastName"
                },
                "email": "user@example.com"
            },
            "location": "Rainier House",
            "numberOfItems": 1,
            "urgency": "important",
            "status": "active",
            "notes": [],
            "itemCategory": "Clothing",
            "name": "coat",
            "size": "L (42-44)",
            "gender": "M",
            "style": "casual"
        }
    }
}
```

### Return all the items

```
GET /api/items
```

the JSON response will have the following shape:

```json
{
    "success": "true/false",
    "message": "descriptive message of the status",
    "payload": {
        "items": [
            {
                "_id": "idOfTheItem",
                "clientId": "12345678",
                "submittedBy": {
                    "_id": "idOfTheUser",
                    "name": {
                        "first": "firstName",
                        "last": "lastName"
                    },
                    "email": "user@example.com"
                },
                "location": "Rainier House",
                "numberOfItems": 2,
                "urgency": "survival",
                "status": "active",
                "notes": [],
                "itemCategory": "Household",
                "name": "bedding"
            }
        ]
    }
}
```

_NOTE: the payload will be an array of `items`_

### Return a single item

```
GET /api/items/:id
```

the JSON response will have the following shape:

```json
{
    "success": "true/false",
    "message": "descriptive message of the status",
    "payload": {
        "item": {
            "_id": "idOfTheItem",
            "clientId": "12345678",
            "submittedBy": {
                "_id": "idOfTheUser",
                "name": {
                    "first": "firstName",
                    "last": "lastName"
                },
                "email": "user@example.com"
            },
            "location": "Rainier House",
            "numberOfItems": 2,
            "urgency": "survival",
            "status": "active",
            "notes": [],
            "itemCategory": "Household",
            "name": "bedding"
        }
    }
}
```

### Update a single item

```
PUT /api/items/:id
```

include a post body of the form that is consistent with the category of item that is to be updated. For example, to update the actual `Household` item to 'cutlery' (assuming it was created as a `Household` item):

```json
{
    "name": "cutlery"
}
```

the JSON response will have the following shape:

```json
{
    "success": "true/false",
    "message": "descriptive message of the status",
    "payload": {
        "item": {
            "_id": "idOfTheItem",
            "clientId": "12345678",
            "submittedBy": {
                "_id": "idOfTheUser",
                "name": {
                    "first": "firstName",
                    "last": "lastName"
                },
                "email": "user@example.com"
            },
            "location": "Rainier House",
            "numberOfItems": 2,
            "urgency": "survival",
            "status": "active",
            "notes": [],
            "itemCategory": "Household",
            "name": "cutlery" // updated value here
        }
    }
}
```

### Delete a single item

```
DELETE /api/items/:id
```

the JSON response will have the following shape and include the item that was just deleted (if the operation was successful):

```json
{
    "success": "true/false",
    "message": "descriptive message of the status",
    "payload": {
        "item": {
            "_id": "idOfTheItem",
            "clientId": "12345678",
            "submittedBy": {
                "_id": "idOfTheUser",
                "name": {
                    "first": "firstName",
                    "last": "lastName"
                },
                "email": "user@example.com"
            },
            "location": "Rainier House",
            "numberOfItems": 2,
            "urgency": "survival",
            "status": "active",
            "notes": [],
            "itemCategory": "Household",
            "name": "cutlery"
        }
    }
}
```

### Add a note to an item

```
POST /api/items/:id/notes
```

include a post body of the form

```json
{
    "submittedBy": "someuserId",
    "body": "new note added to the item"
}
```

the JSON response will have the following shape:

```json
{
    "success": "true/false",
    "message": "descriptive message of the status",
    "payload": {
        "item": {
            "_id": "idOfTheItem",
            "clientId": "12345678",
            "submittedBy": {
                "_id": "idOfTheUser",
                "name": {
                    "first": "firstName",
                    "last": "lastName"
                },
                "email": "user@example.com"
            },
            "location": "Rainier House",
            "numberOfItems": 2,
            "urgency": "survival",
            "status": "active",
            "notes": [
                {
                    "_id": "idOfTheNote",
                    "submittedBy": {
                        "name": {
                            "first": "firstName",
                            "last": "lastName"
                        }
                    },
                    "body": "the text of the note"
                },
                {
                    "_id": "idOfTheNewNote",
                    "submittedBy": {
                        "name": {
                            "first": "firstName",
                            "last": "lastName"
                        }
                    },
                    "body": "new note added to the item"
                }
            ],
            "itemCategory": "Household",
            "name": "bedding"
        }
    }
}
```
