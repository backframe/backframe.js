# esbuild-ts-paths
Transform TS path alias to absolute paths for esbuild

### Example
```javascript
// tsconfig.json

"compilerOptions": {
  "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
    "@common/*": ["../common/*"], // asterisks are important
    "@shared/*": ["./src/shared/*"]
  }
}

```

```javascript
// esbuild
const tsPaths = require("esbuild-ts-paths") 
esbuild.build({
    //...
    plugins:[
        tsPaths(
            "./path/to/tsconfig.json" // optional, defaults to ./tsconfig.json
        )
    ]
})
```

