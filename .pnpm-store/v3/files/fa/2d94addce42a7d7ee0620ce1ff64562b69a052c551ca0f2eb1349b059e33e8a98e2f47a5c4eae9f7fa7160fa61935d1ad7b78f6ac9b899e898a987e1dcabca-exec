# Installation
> `npm install --save @types/passport-twitter`

# Summary
This package contains type definitions for passport-twitter (https://github.com/jaredhanson/passport-twitter).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/passport-twitter.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/passport-twitter/index.d.ts)
````ts
// Type definitions for passport-twitter 1.0.4
// Project: https://github.com/jaredhanson/passport-twitter
// Definitions by: James Roland Cabresos <https://github.com/staticfunction>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

/// <reference types="passport"/>



import passport = require('passport');
import express = require('express');

interface Profile extends passport.Profile {
    gender: string;
    username: string;

    _raw: string;
    _json: any;
    _accessLevel: string;
}

interface IStrategyOptionBase {
    consumerKey: string;
    consumerSecret: string;
    callbackURL: string;

    includeEmail?: boolean | undefined;
    includeStatus?: boolean | undefined;
    includeEntities?: boolean | undefined;

    requestTokenURL?: string | undefined;
    accessTokenURL?: string | undefined;
    userAuthorizationURL?: string | undefined;
    sessionKey?: string | undefined;

    forceLogin?: boolean | undefined;
    screenName?: string | undefined;

    userProfileURL?: string | undefined;
    skipExtendedUserProfile?: boolean | undefined;
}

interface IStrategyOption extends IStrategyOptionBase {
    passReqToCallback?: false | undefined;
}

interface IStrategyOptionWithRequest  extends IStrategyOptionBase {
    passReqToCallback: true;
}

declare class Strategy extends passport.Strategy {
    constructor(options: IStrategyOption,
        verify: (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => void);
    constructor(options: IStrategyOptionWithRequest,
        verify: (req: express.Request, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => void);

    name: string;
    authenticate(req: express.Request, options?: Object): void;
}

````

### Additional Details
 * Last updated: Thu, 08 Jul 2021 20:19:26 GMT
 * Dependencies: [@types/passport](https://npmjs.com/package/@types/passport), [@types/express](https://npmjs.com/package/@types/express)
 * Global values: none

# Credits
These definitions were written by [James Roland Cabresos](https://github.com/staticfunction).
