#!/usr/bin/env node

'use strict';

var pathIsAbsolute = require('path-is-absolute')
  , SteamCommunity = require('steamcommunity')
  , program = require('commander')
  , readline = require('readline')
  , path = require('path')
  , fs = require('fs');

var fatalError = require('./fatal-error')
  , pkg = require('./package');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var community = new SteamCommunity();

program
  .version(pkg.version)
  .option('-a, --account-name <account_name>', 'account name to use')
  .option('-p, --password <password>', 'password for account')
  .option('-o, --out-file <file>', 'output file [default: <account_name>.json]')
  .parse(process.argv);

if (!program.accountName || !program.password) program.help();

(function login(details, isFirst) {
  community.login(details, function logon(err) {
    if (!err) {
      return community.enableTwoFactor(function enable(err, res) {
        if (err || res.status !== 1) {
          fatalError('failed to enable 2FA');
          return rl.close();
        }

        var file = program.outFile;

        if (!file) {
          file = path.join(process.cwd(), details.accountName + '.json');
        } else if (!pathIsAbsolute(file)) {
          file = path.join(process.cwd(), file);
        }

        try {
          fs.writeFileSync(file, JSON.stringify(res, null, '  '));
        } catch (e) {
          fatalError('failed to enable 2FA, could not write output file' );
          return rl.close();
        }

        rl.question('Activation code: ', function sms(code) {
          community.finalizeTwoFactor(res.shared_secret, code, function done(err) {
            if (err) {
              fs.unlinkSync(file);
              fatalError('failed to enable 2FA');
            }
          });
          rl.close();
        });
      });
    }

    var message = err.message;

    //
    // Bail out if the account already has two-factor authentication enabled.
    //
    if (message === 'SteamGuardMobile') return rl.close();

    if (
        !isFirst
      || message !== 'SteamGuard'
      && message !== 'CAPTCHA'
    ) {
      fatalError('failed to log in to steamcommunity');
      return rl.close();
    }

    if (message === 'CAPTCHA') {
      console.log('Solve the CAPTCHA at %s', err.captchaurl);
      return rl.question('CAPTCHA code: ', function captcha(code) {
        login({
          accountName: details.accountName,
          password: details.password,
          captcha: code
        }, false);
      });
    }

    rl.question('Steam Guard code: ', function email(code) {
      login({
        accountName: details.accountName,
        password: details.password,
        authCode: code
      }, false);
    });
  });
})({
  'accountName': program.accountName,
  'password': program.password
}, true);
