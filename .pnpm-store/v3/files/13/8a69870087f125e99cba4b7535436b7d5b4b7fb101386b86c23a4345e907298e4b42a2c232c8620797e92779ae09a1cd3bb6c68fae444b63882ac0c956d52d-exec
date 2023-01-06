# Installation
> `npm install --save @types/gradient-string`

# Summary
This package contains type definitions for gradient-string (https://github.com/bokub/gradient-string).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/gradient-string.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/gradient-string/index.d.ts)
````ts
// Type definitions for gradient-string 1.1
// Project: https://github.com/bokub/gradient-string
// Definitions by: Junyoung Clare Jang <https://github.com/Ailrun>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.1

import tinycolor = require('tinycolor2');

declare namespace gradient {
    interface PositionedColorInput {
        color: tinycolor.ColorInput;
        pos: number;
    }

    interface Gradient {
        (message?: string, opt?: Options): string;
        multiline(message?: string, opt?: Options): string;
    }

    interface Options {
        interpolation?: string | undefined;
        hsvSpin?: string | undefined;
    }

    const atlas: Gradient;
    const cristal: Gradient;
    const teen: Gradient;
    const mind: Gradient;
    const morning: Gradient;
    const vice: Gradient;
    const passion: Gradient;
    const fruit: Gradient;
    const instagram: Gradient;
    const retro: Gradient;
    const summer: Gradient;
    const rainbow: Gradient;
    const pastel: Gradient;
}

declare function gradient(colors: tinycolor.ColorInput[] | gradient.PositionedColorInput[]): gradient.Gradient;
declare function gradient(...colors: tinycolor.ColorInput[]): gradient.Gradient;
declare function gradient(...colors: gradient.PositionedColorInput[]): gradient.Gradient;
export = gradient;

````

### Additional Details
 * Last updated: Thu, 08 Jul 2021 12:02:28 GMT
 * Dependencies: [@types/tinycolor2](https://npmjs.com/package/@types/tinycolor2)
 * Global values: none

# Credits
These definitions were written by [Junyoung Clare Jang](https://github.com/Ailrun).
