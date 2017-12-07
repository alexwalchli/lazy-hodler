import * as ccxt from 'ccxt'

export const buildExchangeClient = (exchangeAuthInfo, useLive: Boolean = false): ccxt.Exchange => {
  // assume GDAX for now
  const gdax = new ccxt.gdax({
    apiKey: exchangeAuthInfo.authInfo.apiKey,
    secret: exchangeAuthInfo.authInfo.secret,
    password: exchangeAuthInfo.authInfo.passphrase
  }) as any // TODO: Exchange class doesn't define urls in type def

  // TODO: GDAX is the only exchange I know of that has a sandbox so this
  // need to be removed or changed when more exchanges are supported
  useLive
    ? gdax.urls['api'] = 'https://api.gdax.com'
    : gdax.urls['api'] = 'https://api-public.sandbox.gdax.com'

    return gdax
}