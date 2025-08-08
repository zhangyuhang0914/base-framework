安装依赖:

```bash
npm install
```

启动服务:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

打包:

```bash
npm run build
```

tsconfig.json:

- 顶层的TypeScript配置文件，作为项目的主入口，通过 references 字段引用其他子配置文件（如 app 和 node）。
- 采用“项目引用”模式，可以将不同用途的 TypeScript 配置拆分，提升构建效率和灵活性，便于分别管理前端应用代码和 Node 脚本/配置的类型检查。
- 一般不直接在这里写具体的编译选项，而是通过 references 字段指向其他 tsconfig 文件，如需全局配置可在此补充。

tsconfig.app.json

- 专门为前端应用（src 目录下的 Vue/TS 代码）服务的 TypeScript 配置文件，让前端业务代码（包括 .ts、.vue 文件）拥有独立的类型检查和编译选项。
- 可以根据前端需求定制编译目标、模块解析、路径别名等。
- 需要为前端代码调整的 TypeScript 配置（如 baseUrl 、 paths 、 lib 、 jsx 、 strict 等），都应该写在这里。

tsconfig.node.json

- 专门为 Node.js 相关脚本（如 Vite 配置、测试配置、脚本工具等）服务的 TypeScript 配置文件。
- Node 环境和前端环境的类型需求不同（如全局变量、模块解析方式等），需要单独配置。
- 避免 Node 脚本和前端代码的类型冲突，提高类型检查的准确性。
- 需要为 Node 脚本调整的 TypeScript 配置（如 types 、 moduleResolution 、 include 指向配置文件等），都应该写在这里。
- 如果你要让 Vite、Vitest、Cypress 等配置文件获得 Node 类型提示，或调整 Node 相关的编译选项，就在这个文件里配置。

总结
- 全局/项目结构相关配置 ：放在 tsconfig.json ，主要维护 references。
- 前端业务代码相关配置 ：放在 tsconfig.app.json ，如路径别名、严格模式、前端库等。
- Node 脚本相关配置 ：放在 tsconfig.node.json ，如 Node 类型、配置文件包含等。
