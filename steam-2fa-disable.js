#!/usr/bin/env node

'use strict';

var SteamCommunity = require('steamcommunity')
  , steamTotp = require('steam-totp')
  , program = require('commander');

var fatalError = require('./fatal-error')
  , pkg = require('./package');

var community = new SteamCommunity();

program
  .version(pkg.version)
  .option('-a, --account-name <account_name>', 'account name to use')
  .option('-p, --password <password>', 'password for account')
  .option('-s, --shared-secret <shared_secret>', 'two-factor shared secret')
  .option('-c, --revocation-code <revocation_code>', 'two-factor revocation code')
  .parse(process.argv);

if (
    !program.revocationCode
  || !program.sharedSecret
  || !program.accountName
  || !program.password
) {
  program.help();
}

community.login({
  'accountName': program.accountName,
  'password': program.password
}, function login(err) {
  //
  // Bail out if the account doesn't have two-factor authentication enabled.
  //
  if (!err || err.message !== 'SteamGuardMobile') return;

  community.login({
    'twoFactorCode': steamTotp.getAuthCode(program.sharedSecret),
    'accountName': program.accountName,
    'password': program.password
  }, function logon(err) {
    if (err) return fatalError('failed to log in to steamcommunity');

    community.disableTwoFactor(program.revocationCode, function disable(err) {
      if (err) fatalError('failed to disable 2FA');
    });
  });
});
