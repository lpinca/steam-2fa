# steam-2fa

[![Version npm][npm-steam-2fa-badge]][npm-steam-2fa]

CLI utility to enable and disable two-factor authentication on a Steam account.

## Install

```
npm install -g steam-2fa
```

## Usage

```
Usage: steam-2fa [options] [command]


Commands:

  enable [options]   enable two factor authentication
  disable [options]  disable two factor authentication
  help [cmd]         display help for [cmd]

Options:

  -h, --help     output usage information
  -V, --version  output the version number
```

### Enable two-factor authentication

You can enable two-factor authentication using the `enable` subcommand.

```
Usage: steam-2fa-enable [options]

Options:

  -h, --help                         output usage information
  -V, --version                      output the version number
  -a, --account-name <account_name>  account name to use
  -p, --password <password>          password for account
  -o, --out-file <file>              output file [default: <account_name>.json]
```

#### Examples

```
$ steam-2fa enable -a foo -p bar -o data.json
$ steam-2fa enable -a foo -p bar
```

### Disable two-factor authentication

You can disable two-factor authentication using the `disable` subcommand.

```
Usage: steam-2fa-disable [options]

Options:

  -h, --help                               output usage information
  -V, --version                            output the version number
  -a, --account-name <account_name>        account name to use
  -p, --password <password>                password for account
  -s, --shared-secret <shared_secret>      two-factor shared secret
  -c, --revocation-code <revocation_code>  two-factor revocation code
```

#### Examples

```
$ steam-2fa disable -a foo -p bar -s cnOgv/KdpLoP6Nbh0GMkXkPXALQ= -c R74902
```

## License

[MIT](LICENSE)

[npm-steam-2fa-badge]: https://img.shields.io/npm/v/steam-2fa.svg
[npm-steam-2fa]: https://www.npmjs.com/package/steam-2fa
