import typescript from "rollup-plugin-typescript2";
import clear from "rollup-plugin-clear";
import pkg from "./package.json" assert {type: 'json'};

export default {
  input: "src/index.ts",
  plugins: [
    clear({
      targets: ["dist"]
    }),
    typescript({
      typescript: require("typescript"),
      tsconfig: "./tsconfig.dist.json"
    })],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es"
    }
  ]
}; 
