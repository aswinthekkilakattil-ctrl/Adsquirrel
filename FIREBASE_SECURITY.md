# Firebase production security

The `/cpanel` login now uses Firebase Authentication in the browser. That is only half of the security model: the Realtime Database must also reject unauthenticated writes.

Use Firebase Console or Firebase CLI to configure an authenticated admin user, then apply rules similar to:

```json
{
  "rules": {
    "siteContent": {
      ".read": true,
      ".write": "auth != null && auth.token.email_verified == true"
    }
  }
}
```

For stricter production control, replace the write expression with a custom admin claim or a specific UID allow-list.

Vite environment variables are public in the built JavaScript. They keep deployment configuration out of source code, but they are not secrets.
