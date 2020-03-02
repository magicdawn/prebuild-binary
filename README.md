# prebuild-binary

## config

### for prebuild-install

use jsdelivr cdn

```json
{
  "binary": {
    "host": "https://cdn.jsdelivr.net/gh/magicdawn/prebuild-binary@master",
    "remote_path": "{name}/v{version}"
  }
}
```

- `binary.package_name` use default `'{name}-v{version}-{runtime}-v{abi}-{platform}{libc}-{arch}.tar.gz'`

## License

the MIT License http://magicdawn.mit-license.org
