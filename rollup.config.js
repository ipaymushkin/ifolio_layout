import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import { babel } from '@rollup/plugin-babel';

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.js",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
            },
        ],
        external: [
            'react',
            'react-dom',
            'styled-components'
          ],
        plugins: [
            peerDepsExternal(),
            babel({
                babelHelpers: "bundled",
                // exclude: 'node_modules/**',
                presets: ['@babel/env', ["@babel/preset-react", { runtime: "classic" }]]
            }),
            commonjs(),
            resolve(),
            terser(),
        ],
    },
];
