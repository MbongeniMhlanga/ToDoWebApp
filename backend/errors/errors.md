
# 📄 To-Do API: Error Reference

This document outlines possible error responses returned by the `/todos` API endpoints and what they mean.

---
### 500: Internal Server Error

- **Cause**: Unhandled exception in the server.
- **Response**:
  ```json
  {
    "message": "Internal server error"
  }
  ```
- **Where**: `GET /todos`

---

## 📘 Endpoint-Specific Errors

### `GET /todos`

- **Error: Database fetch fails**
  ```json
  {
    "message": "Internal server error"
  }
  ```
  - **Console log**: `'Fetch error:'`, followed by error stack

---

### `POST /todos`

- **Error: Missing fields in request body**
  - **Possible Cause**: Any of `monday`, `tuesday`, `wednesday`, `thursday`, or `friday` is `undefined`
  -  *Currently not validated; use frontend validation.*

- **Error: Insert fails (e.g., DB connection lost)**
  ```json
  {
    "message": "Insert error"
  }
  ```
  - **Console log**: `'Insert error:'`, followed by error stack

---

### `PUT /todos/:id`

- **Error: Invalid or missing ID**
  - **Cause**: ID not found in the database or malformed
  - **Response**:
    ```json
    {
      "message": "Update error"
    }
    ```

- **Error: SQL fails**
  - **Response**:
    ```json
    {
      "message": "Update error"
    }
    ```

---

### `DELETE /todos/:id`

- **Error: Invalid or missing ID**
  - **Response**:
    ```json
    {
      "message": "Delete error"
    }
    ```

- **Error: SQL fails**
  - **Response**:
    ```json
    {
      "message": "Delete error"
    }
    ```

---



# HTTP Status Codes (200–500)

## ✅ 2xx – Success
| Code | Meaning           | Description                                                      |
|------|-------------------|------------------------------------------------------------------|
| 200  | OK                | Standard response for successful HTTP requests.                 |
| 201  | Created           | The request was successful and a resource was created.          |
| 202  | Accepted          | Request has been received but not yet acted upon.               |
| 204  | No Content        | Request successful, but no content is returned.                 |

## 🔁 3xx – Redirection
| Code | Meaning             | Description                                                      |
|------|---------------------|------------------------------------------------------------------|
| 301  | Moved Permanently   | Resource has permanently moved to a new URL.                   |
| 302  | Found               | Resource temporarily resides under a different URL.            |
| 304  | Not Modified        | Resource has not changed since the last request.               |
| 307  | Temporary Redirect  | Same as 302 but method and body must not change.               |

## ⚠️ 4xx – Client Errors
| Code | Meaning              | Description                                                      |
|------|----------------------|------------------------------------------------------------------|
| 400  | Bad Request          | Server cannot process the request due to client error.          |
| 401  | Unauthorized         | Authentication is required and has failed or not been provided.|
| 403  | Forbidden            | Server understood the request but refuses to authorize it.     |
| 404  | Not Found            | Requested resource could not be found.                         |
| 405  | Method Not Allowed   | Method is not allowed for the requested URL.                   |
| 409  | Conflict             | Request conflicts with current state of the resource.          |
| 422  | Unprocessable Entity | Request is syntactically correct but semantically invalid.     |

## 💥 5xx – Server Errors
| Code | Meaning               | Description                                                      |
|------|-----------------------|------------------------------------------------------------------|
| 500  | Internal Server Error | Generic error; something went wrong on the server.              |
| 501  | Not Implemented       | Server doesn't support the requested functionality.             |
| 502  | Bad Gateway           | Server received an invalid response from the upstream server.   |
| 503  | Service Unavailable   | Server is not ready to handle the request (maintenance/etc.).   |
| 504  | Gateway Timeout       | Server didn't get a response in time from another server.       |
