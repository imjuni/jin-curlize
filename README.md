# jin-curlize
curl command create from FastifyRequest(v3).

# Usage
```
# Fastify start
import fastify from 'fastify';
import { createByfastify3 } from 'jin-curlize';

server = fastify(option);

server.addHook('onResponse', (req, res) => {
  console.log(createByfastify3(req, { pretty: false }));
});

server.listen(port);
```

# Options
| Name | Requirement | Description | 
|-|-|-|
| prettify | require | Apply prettifing. Add newline and backslash add on line-ending |
| indent | optional | Only work on prettify set true, make space size |
| headerFilterKeywords | optional | filtered keyword on header object. connection, accept, content-length, user-agent keyword default filtered. But you set this option manually, remove every keyword of default option |
| disableFollowRedirect| optional | If set true, remove `--location` option from command |
| uuid | optional | Add uuid from querystring |

# r2curl
If you want that curl command generate from AxiosRequest, use [r2curl](https://www.npmjs.com/package/r2curl) package.